<div align="center">
  
  ## Final Project - 🕵 Smart Vision
  
</div>

### Project: Car Detection System using Artificial Intelligence.

- Investigation management / detection processing
- Next.js (Web Application)
- Firebase (Authentication, Cloud Firestore, Storage)
- Flask API (AI detection)
- JSON Server (Car database)

<div align="center">
  <img src="https://github.com/user-attachments/assets/2d1a7181-acf2-4661-9bfc-cbed3af3dc90" >
</div>
    
<div align="center">
  
  ## 📋 Use Cases, System Flow, Architecture

  ### System Flow
  
  <img src="https://github.com/user-attachments/assets/04e023b9-de14-4442-a57b-f9703262f4c2" />
  
  ### General System Architecture
  
  <img src="https://github.com/user-attachments/assets/545b3e04-224c-49b5-ac3a-0536063a96bb" />

</div>

## 🚦 How to use the project (instructions)

How to run (Open 3 terminals for better viewing)

#### 1. Next.js
./smart-vision/nextjs >
```bash 
npm run dev
```
> http://localhost:3000

#### 2. Flask API
./smart-vision/car-detector-api >
```bash 
python3 api.py
```
> http://localhost:5000

#### 3. JSON Server
./smart-vision/nextjs >
```bash 
npx json-server --watch db.json -p 3333
```
> http://localhost:3333/vehicles

<br>

After starting the frontend and backend applications, simply access 'localhost' on port [3000](http://localhost:3000/) to be directed to the Next.js application and perform the necessary tests.

## Development Order
- [x] Obtain images to train the model - Roboflow
- [x] Train Detection Model - YOLOv8 + OpenCV
- [x] Web Application with Firebase Services - Next.js + Firebase
- [x] Flask API - Python
- [x] Obtain vehicle data - JSON Server

## Academic advisor

- [@matiasfilho](https://www.linkedin.com/in/jmlf1981/)

## 🔗 Links
🔍 [Roboflow - Car Models](https://universe.roboflow.com/cardetection-lwoni/car-models-lir65)  
🔍 [License Plate Detection using YOLOv8](https://github.com/Muhammad-Zeerak-Khan/Automatic-License-Plate-Recognition-using-YOLOv8)  
🔍 [JSON Server](https://github.com/typicode/json-server/tree/v0)

##
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=next,typescript,tailwind,firebase,python,flask,opencv,pytorch" >
  </a>
</p>
