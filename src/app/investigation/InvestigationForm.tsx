'use client'

import React, { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';

import { DetectedPlate, DetectedVehicle } from "../lib/types";

import { AuthGuard } from "./../components/AuthGuard";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface InvestigationFormProps {
  isEditable: boolean;
}

export default function InvestigationForm({ isEditable }: InvestigationFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<DetectedPlate[]>([]);
  const router = useRouter();
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement | null>(null); // Ref para controlar o player de vídeo


  useEffect(() => {
    const fetchInvestigation = async () => {
      if (id) {
        const docRef = doc(db, 'investigations', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDescription(data.description);
          setVideoURL(data.fileURL);
          setVehicle(data.vehicle || []);
        } else {
          console.error("No investigation found");
        }
        setLoading(false);
      }
    };

    fetchInvestigation();
  }, [id]);

  const submitInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditable) return; // Don't allow submission if not editable

    try {
      const docRef = doc(db, 'investigations', id as string);
      await updateDoc(docRef, {
        title,
        description,
      });
      alert("Investigation updated successfully!");
      //router.push("/history");
    } catch (error) {
      console.error("Error updating investigation: ", error);
      alert("Failed to update investigation. Please try again.");
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

  return (
    <AuthGuard>
      <div className='relative h-screen overflow-hidden bg-gradient-to-b lg:h-[180vh]'>
        <Header />
        <main className='relative pb-24 pl-4 lg:pl-16'>
          <div className='flex-col space-y-2 py-16 md:space-y-4 lg:h-[5vh] lg:justify-end lg:pb-12'>
            
            <div className='absolute left-0 top-0 -z-10 h-[95vh] w-screen flex-col bg-gray-900'>
              <Image
                src='/cop-wallpaper.jpg'
                alt='Background image'
                fill={true}
                className='h-[65vh] object-cover object-top lg:h-[95vh] opacity-10'
              />
            </div>

            <div className="mx-44 max-w-7x1">

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
                      disabled={!isEditable}
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
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="col-span-2 flex justify-center items-center h-full">
                    {videoURL ? (
                      <video width="70%" controls ref={videoRef}>
                        <source src={videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <p>No video available</p>
                    )}
                  </div>
                </div>
                {/* Tabela de dados */}
                <div className="col-span-2 items-center">
                  <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Detected Vehicles</h2>
                  {vehicle.length > 0 ? (
                    <table className="min-w-full text-left text-sm text-white">
                      <thead className="bg-sky-700 text-xs uppercase font-medium text-white">
                        <tr>
                          <th className="px-6 py-3">Car Model</th>
                          <th className="px-6 py-3">License Plate</th>
                          <th className="px-6 py-3">Color</th>
                          <th className="px-6 py-3">Situation</th>
                          <th className="px-6 py-3">Video Moment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicle.map((vehicle, index) => (
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No vehicles detected</p>
                  )}
                </div>
                {isEditable && (
                  <div className="flex h-full md:py-5">
                    <button 
                      type="submit" 
                      className="bg-blue-500 hover:bg-blue-700 text-white flex cursor-pointer items-center gap-x-2 rounded px-5 py-1.5 text-sm font-bold transition md:px-4"
                      onClick={submitInvestigation}
                    >
                      <CloudArrowUpIcon className="size-6"/>
                      Update investigation
                    </button>
                  </div>
                )}
              </form>

            </div>

          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
