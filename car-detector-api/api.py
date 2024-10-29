import os
import re
import cv2
import json
import easyocr  # Removed pytesseract, using easyOCR now
import requests  # To make HTTP requests to the external API
import subprocess  # Para chamar o ffmpeg - converter o video mp4v para H.264
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO

# Initialize the easyOCR reader for English
reader = easyocr.Reader(['en'], gpu=False)  # Create a reader object for English

app = Flask(__name__)
CORS(app)

# Load YOLOv8 models for car model detection and license plate detection
car_model_detector = YOLO('car_model_detector.pt')
license_plate_detector = YOLO('license_plate_detector.pt')

# Define class labels for car models
car_labels = {
    0: "Onix",
    1: "Palio"
}

# Helper function to convert frame number to timestamp (without milliseconds)
def frame_to_timecode(frame_number, fps):
    total_seconds = int(frame_number / fps)
    return str(timedelta(seconds=total_seconds))

# Helper function to validate license plate format
def is_valid_license_plate(plate_text):
    pattern = re.compile(r'^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$|^[A-Z]{3}[0-9]{4}$') # "ABC1D23" or "XYZ1234" formats
    return bool(pattern.match(plate_text))

# Helper function to draw bounding boxes with labels
def draw_labelled_box(frame, label, confidence, box_coords, color):
    x1, y1, x2, y2 = map(int, box_coords)
    text = f"{label} {confidence:.2f}"
    
    # Set the font and calculate the width and height of the text box
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.6
    thickness = 2
    text_size, _ = cv2.getTextSize(text, font, font_scale, thickness)
    text_width, text_height = text_size
    
    # Draw the rectangle around the object
    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
    
    # Draw the filled rectangle for the text background
    cv2.rectangle(frame, (x1, y1 - text_height - 5), (x1 + text_width + 2, y1), color, -1)
    
    # Put the label text on the frame
    cv2.putText(frame, text, (x1, y1 - 5), font, font_scale, (255, 255, 255), thickness)

# Function to read the license plate using easyOCR
def read_license_plate(license_plate_crop):
    detections = reader.readtext(license_plate_crop)
    for detection in detections:
        _, plate_text, _ = detection
        plate_text = plate_text.upper().replace(' ', '')  # Clean up the text
        if is_valid_license_plate(plate_text):
            return plate_text
    return None

# Function to validate the plate and model with the db.json API
def validate_plate_and_model(plate_text, car_model):
    try:
        response = requests.get('http://localhost:3333/vehicles')
        if response.status_code == 200:
            vehicles = response.json()
            for vehicle in vehicles:
                if vehicle['Placa'] == plate_text and car_model.lower() in vehicle['Modelo'].lower():
                    # Retorna as informações com adicionais: Cor e Situation
                    return True, vehicle['Cor'], vehicle.get('Situation', 'Indefinida')
        return False, None, None
    except Exception as e:
        print(f"Error accessing db.json API: {e}")
        return False

# Function to run ffmpeg command to convert to H.264
def convert_to_h264(input_path, output_path):
    try:
        command = [
            'ffmpeg', '-i', input_path, '-c:v', 'libx264', '-crf', '23',
            '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k', output_path
        ]
        subprocess.run(command, check=True)
        print(f"Video successfully converted to H.264: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error during video conversion: {e}")
        raise

# Serve the processed video files from the correct subdirectory
@app.route('/processed_videos_folder/<subdir>/<filename>')
def serve_processed_video(subdir, filename):
    directory = os.path.join('processed_videos_folder', subdir)
    return send_from_directory(directory, filename)

@app.route('/analyze', methods=['POST'])
def analyze_video():
    video = request.files.get('video')
    if not video:
        return jsonify({'error': 'No video provided'}), 400

    # Generate timestamp for the new folder name
    timestamp = datetime.now().strftime("%d%m%Y_%H%M")
    folder_name = f'processed_videos_folder/processed_video_{timestamp}'

    # If the folder doesn't exist, create it
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

    video_path = os.path.join(folder_name, "temp_video.mp4")
    processed_video_path = os.path.join(folder_name, "processed_video.mp4")
    txt_output_path = os.path.join(folder_name, "log_frame_detections.txt")
    json_output_path = os.path.join(folder_name, "log_detections.json")  # New JSON log file
    h264_video_path = os.path.join(folder_name, "processed_video_h264.mp4")  # Output path for H.264 video

    try:
        # Save the uploaded video
        video.save(video_path)
        print(f"Video saved to {video_path}")

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return jsonify({'error': 'Failed to open video file'}), 500
        
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)

        # Initialize the video writer for the processed video
        out = cv2.VideoWriter(processed_video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (frame_width, frame_height))

        # Initialize the dictionary to store detections and frame details
        detection_log = {"vehicles": []}
        json_log = []  # JSON log
        
        frame_count = 0
        last_detected_model = None
        last_detected_plate = None
        last_second_logged = -1  # Para garantir que logamos uma vez por segundo

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # YOLO inference on each frame (car models)
            results = car_model_detector(frame)

            # Process results for each frame
            for result in results:
                boxes = result.boxes.xyxy.cpu().numpy()  # Bounding boxes for vehicles
                labels = result.boxes.cls.cpu().numpy()  # Class labels
                confidences = result.boxes.conf.cpu().numpy()  # Confidence scores

                for box, label, conf in zip(boxes, labels, confidences):
                    class_name = car_labels.get(int(label), "Unknown")
                    confidence = round(float(conf) * 100, 2)  # Convert confidence to percentage

                    # Always log vehicle detection, even if no plate is found
                    detection_entry = {
                        "Model": class_name,
                        "Confidence": f"{confidence}%",
                        "Plate": "",  # Leave plate empty for now
                        "videoFrame": frame_to_timecode(frame_count, fps)
                    }

                    # Only process vehicle detections with confidence > 70%
                    if confidence > 70:
                        # Draw bounding box and label for vehicle (blue color)
                        draw_labelled_box(frame, class_name, confidence, box, (255, 0, 0))

                        # Crop the bounding box region of the car for license plate detection
                        x1, y1, x2, y2 = map(int, box)
                        car_crop = frame[y1:y2, x1:x2]

                        # Run license plate detection on the cropped car bounding box
                        lp_results = license_plate_detector(car_crop)

                        # Process license plate detection results
                        for lp_result in lp_results:
                            lp_boxes = lp_result.boxes.xyxy.cpu().numpy()  # Bounding boxes for plates
                            lp_confidences = lp_result.boxes.conf.cpu().numpy()  # Confidence scores for plates

                            for lp_box, lp_conf in zip(lp_boxes, lp_confidences):
                                lp_confidence = round(float(lp_conf) * 100, 2)  # Convert confidence to percentage

                                if lp_confidence > 70:
                                    # Draw bounding box for the license plate (blue color)
                                    lp_x1, lp_y1, lp_x2, lp_y2 = map(int, lp_box)
                                    license_plate_crop = car_crop[lp_y1:lp_y2, lp_x1:lp_x2]

                                    # Use easyOCR to extract the license plate number
                                    plate_text = read_license_plate(license_plate_crop)

                                    # Check if the plate text is valid according to the defined formats
                                    if plate_text:
                                        # Valida a placa e o modelo com a API db.json
                                        valid, car_color, car_situation = validate_plate_and_model(plate_text, class_name)
                                        if valid:
                                            # Se a placa e o modelo forem válidos, adiciona "Cor" e "Situation"
                                            # Draw bounding box and label for license plate
                                            draw_labelled_box(car_crop, plate_text, lp_confidence, [lp_x1, lp_y1, lp_x2, lp_y2], (255, 0, 0))
                                            # Update the log with the detected license plate
                                            detection_entry["Plate"] = plate_text
                                            detection_entry["Cor"] = car_color
                                            detection_entry["Situation"] = car_situation

                    # Add the detection entry to the log
                    detection_log["vehicles"].append(detection_entry)

                    current_second = int(frame_count / fps)

                    # Verifica se já foi registrado no JSON para este segundo
                    if current_second > last_second_logged:
                        # Add to JSON log if there is a change in car model or plate
                        if class_name != last_detected_model or detection_entry["Plate"] != last_detected_plate:
                            json_log.append({
                                "Model": class_name,
                                "Plate": detection_entry["Plate"],
                                "Cor": detection_entry.get("Cor", ""),
                                "Situation": detection_entry.get("Situation", ""),
                                "videoFrame": frame_to_timecode(frame_count, fps),
                                "Confidence": confidence
                            })
                            last_detected_model = class_name
                            last_detected_plate = detection_entry["Plate"]
                            last_second_logged = current_second

            out.write(frame)  # Write the processed frame to the output video
            frame_count += 1

        cap.release()
        out.release()

        # Convert the processed video to H.264
        convert_to_h264(processed_video_path, h264_video_path)

        # Save detection log to a .txt file
        with open(txt_output_path, 'w') as f:
            for vehicle in detection_log["vehicles"]:
                f.write(f"Model: {vehicle['Model']}, Confidence: {vehicle['Confidence']}, Plate: {vehicle['Plate']}, videoFrame: {vehicle['videoFrame']}\n")

        # Save the JSON log
        with open(json_output_path, 'w') as json_file:
            json.dump(json_log, json_file, indent=4)

        # Clean up the temporary uploaded video?
        if os.path.exists(video_path):
            os.remove(video_path)

        # Get the subdirectory name (e.g., "processed_video_07102024_1103")
        subdir = os.path.basename(folder_name)

        # Return the processed video URL and log file URL
        return jsonify({
            "message": "Video processed successfully",
            "processed_video_path": f"processed_videos_folder/{subdir}/processed_video_h264.mp4",  # Correct URL for processed video
            "detection_log": f"/processed_videos_folder/{subdir}/log_detections.txt",  # Return log path as well
            "json_log": f"/processed_videos_folder/{subdir}/log_detections.json"
        })

    except Exception as e:
        print(f"Error processing video: {e}")
        return jsonify({'error': f'Error processing video: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
