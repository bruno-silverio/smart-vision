'use client'

import Image from "next/image";
import React, { useState, useRef, useEffect } from 'react';
import { EyeIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../lib/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { DetectedPlate, DetectedVehicle } from "../lib/types";

import { AuthGuard } from "./../components/AuthGuard";
import Header from "./../components/Header";
import Footer from "./../components/Footer";

export default function Detection() {
  //video
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [processedVideoSrc, setProcessedVideoSrc] = useState<string | null>(null); // New state for processed video

  const inputRef = useRef<HTMLInputElement | null>(null); // Ref para o input file
  const videoRef = useRef<HTMLVideoElement | null>(null); // Ref para controlar o player de vídeo

  // Find license plate from log json
  const [detectedPlates, setDetectedPlates] = useState<
    { model: string; plate: string; color: string; situation: string; videoMoment: string }[]
  >([]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setProcessedVideoSrc(null);  // Clear processed video when a new file is selected
    }
  };

  useEffect(() => {
    if (file) {
      const src = URL.createObjectURL(new Blob([file], { type: 'video/mp4' }));
      setVideoSrc(src);
      return () => URL.revokeObjectURL(src); // Clean up the object URL
    }
  }, [file]);

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please upload a video first');
      return;
    }
  
    const formData = new FormData();
    formData.append('video', file);
  
    try {
      alert('Processing...');
  
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Video analysis failed');
      }
  
      const data = await response.json();
      const videoUrl = `http://localhost:5000/${data.processed_video_path}`;
      const logUrl = data.json_log;
  
      console.log("Processed video path: ", videoUrl);
      console.log("Log JSON path: ", logUrl);
  
      // Set processed video URL
      setProcessedVideoSrc(videoUrl);
  
      // Fetch and parse the JSON log
      const logResponse = await fetch(`http://localhost:5000${logUrl}`);
      const logData: DetectedVehicle[] = await logResponse.json();  // Definimos o tipo logData como DetectedVehicle[]
  
      console.log("Detection log JSON: ", logData);
  
      // Atualiza o estado com os dados do log JSON diretamente
      const detectedVehicles = logData.map((detected: DetectedVehicle) => ({
        model: detected.Model,
        plate: detected.Plate,
        color: detected.Cor,
        situation: detected.Situation,
        videoMoment: detected.videoFrame,
      }));
  
      // Atualiza o estado da tabela com os veículos detectados
      setDetectedPlates(detectedVehicles);
  
      alert('Video processed successfully!');
      //Processed video: ${videoUrl} 
      //Detection log: ${logUrl}
  
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Error processing video');
    }
  };

  // Função para converter o "videoMoment" (formato HH:MM:SS) em segundos
  const convertTimeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Função para iniciar o vídeo no momento selecionado
  const handleVideoMomentClick = (videoMoment: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Previne o comportamento padrão de submissão do formulário

    const seconds = convertTimeToSeconds(videoMoment);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds; // Definir o tempo atual do vídeo
    }
  }; 

  // Função delete linha
  const handleDelete = (index: number) => {
    setDetectedPlates((prevPlates) => prevPlates.filter((_, i) => i !== index));
  };
  

  useEffect(() => {
    console.log("Updated detected plates: ", detectedPlates);  // Log detected plates when state updates
  }, [detectedPlates]);

  //control blur screen
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  //firebase
  const [user, loading, error] = useAuthState(auth); // Get the current logged-in user
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const submitInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!processedVideoSrc || !title || !description || !user) {
      alert("All fields are required.");
      return;
    }

    console.log('Wait...');
    try {
      // Extrai o nome da pasta do caminho retornado pela API
      const videoPath = processedVideoSrc.split("/").slice(-2, -1)[0]; // Exemplo: "processed_video_14102024_1422"

      // Upload the processed (converted) video to Firebase Storage
      const convertedFileName = `videos/${user.uid}/${videoPath}.mp4`;
      const videoRef = ref(storage, convertedFileName);

      const response = await fetch(processedVideoSrc!); // fetch the video converted URL
      const blob = await response.blob(); // Convert to blob

      const snapshot = await uploadBytes(videoRef, blob); // Upload the converted video blob
      const fileURL = await getDownloadURL(snapshot.ref); // Get the video URL from Firebase Storage

      // Prepare the data from the table (detectedPlates)
      const vehicle = detectedPlates.map((plate) => ({
        model: plate.model,
        plate: plate.plate,
        color: plate.color,
        situation: plate.situation,
        videoMoment: plate.videoMoment,
      }));

      // Save the file metadata in Firestore
      await addDoc(collection(db, "investigations"), {
        title,
        description,
        fileURL,
        vehicle,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Reset the form
      setFile(null);
      setTitle("");
      setDescription("");
      setVideoSrc(null);
      setIsModalOpen(false);
      setProcessedVideoSrc(null);
      setDetectedPlates([]); // Clear detected plates after submission

      alert("Investigation added successfully.");
    } catch (error) {
      console.error("Error uploading file and saving data:", error);
      alert("Failed to add investigation. Please try again.");
    }
  };

  return (
    <AuthGuard>
      <div className='relative overflow-hidden bg-gradient-to-b lg:h-[170vh]'>
        <Header />
        <main className='relative pb-24 pl-4 lg:pl-16'>
          <div className='flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12'>
            
            <div className='absolute left-0 top-0 -z-10 h-[95vh] w-screen flex-col bg-gray-900'>
              <Image
                src='/cop-wallpaper.jpg'
                alt='Background image'
                fill={true}
                className='h-[65vh] object-cover object-top lg:h-[95vh] opacity-10'
              />
            </div>
          
            <div className="mx-44 max-w-7xl">

              <div className="mb-4">
                
                <div className="mb-8">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <input
                      type="file"
                      id="input"
                      accept="video/*"
                      className="block w-80 text-sm text-white
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-500 file:text-white
                      hover:file:bg-blue-700"
                      ref={inputRef}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center h-full">
                  <div className="w-4/5 h-4/5 border border-gray-200 dark:border-gray-700 bg-slate-400 mb-4 flex justify-center items-center">
                    <div className="relative w-full h-full aspect-w-16 aspect-h-9">
                      {processedVideoSrc ? (
                          <video
                            id="processed-video"
                            key={processedVideoSrc}
                            controls
                            src={processedVideoSrc} // Show processed video if available
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            ref={videoRef} // Referência para controlar o vídeo
                          />
                        ) : (
                          videoSrc && (
                            <video
                              id="video-summary"
                              key={file ? file.name : videoSrc}
                              controls
                              src={videoSrc}
                              className="absolute top-0 left-0 w-full h-full object-cover"
                              ref={videoRef} // Referência para controlar o víde
                            />
                          )
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center h-full">
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white flex cursor-pointer items-center gap-x-2 rounded px-5 py-2 text-sm font-bold transition md:px-4"
                    onClick={handleAnalyze} // Use the handleAnalyze function
                  >
                    <EyeIcon className="size-6"/>
                    Send for processing
                  </button>
                </div>

              </div>

              <hr className="border-t border-gray-300 my-8" />
              <h1 className="text-2xl font-bold">Create New Investigation</h1>
              <div className="grid grid-cols-1 gap-x-1 gap-y-5 mt-4">
                <div className="bg-slate-900">
                  
                  <form onSubmit={submitInvestigation} className="p-4 md:p-5">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                        <input 
                          type="text" 
                          name="title" 
                          id="title" 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                          required 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea 
                          id="description" 
                          rows={4} 
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          ></textarea>                    
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-white dark:text-white">Vehicle registrations</label>
                        <div className="overflow-x-auto relative">
                          <table className="min-w-full text-left text-sm text-white">
                            <thead className="bg-sky-700 text-xs uppercase font-medium text-white">
                              <tr>
                                <th scope="col" className="px-6 py-3">Car model</th>
                                <th scope="col" className="px-6 py-3">License plate</th>
                                <th scope="col" className="px-6 py-3">Color</th>
                                <th scope="col" className="px-6 py-3">Situation</th>
                                <th scope="col" className="px-6 py-3">Video moment</th>
                                <th scope="col" className="px-6 py-3"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {detectedPlates.length > 0 ? (
                                detectedPlates.map((vehicle, index) => (
                                  <tr key={index} className="border-b bg-gray-800 border-gray-700">
                                    <td className="px-6 py-4">{vehicle.model}</td>
                                    <td className="px-6 py-4">{vehicle.plate}</td>
                                    <td className="px-6 py-4">{vehicle.color}</td>
                                    <td className="px-6 py-4">{vehicle.situation}</td>
                                    <td className="px-6 py-4">
                                      <button 
                                        className="text-blue-500 underline"
                                        onClick={(event) => handleVideoMomentClick(vehicle.videoMoment, event)}
                                      >
                                        {vehicle.videoMoment}
                                      </button>
                                    </td>
                                    <td className="px-6 py-4">
                                      <button 
                                        className="text-blue-500 underline"
                                        onClick={() => handleDelete(index)}
                                      >
                                        <TrashIcon className="size-6"/>
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="text-center text-gray-500">No plates detected</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                    <button 
                      type="submit" 
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={submitInvestigation}
                      >
                      <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                      Add new investigation
                    </button>
                  </form>
                
                </div>
              </div>

            </div>

          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
