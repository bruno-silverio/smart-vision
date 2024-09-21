'use client'

import Image from "next/image";
import React, { useState, useRef, useEffect } from 'react';
import { CloudArrowUpIcon, EyeIcon } from "@heroicons/react/24/outline";

import { DocumentData } from "../lib/types";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../lib/firebase/firebase";
import { addDocument, getDocuments, updateDocument, deleteDocument } from "../lib/firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import Header from "./../components/Header";
import Footer from "./../components/Footer"

export default function Detection() {
  //video
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      const src = URL.createObjectURL(new Blob([file], { type: 'video/mp4' }));
      setVideoSrc(src);
      return () => URL.revokeObjectURL(src); // Clean up the object URL
    }
  }, [file]);

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

    if (!file || !title || !description || !user) {
      alert("All fields are required.");
      return;
    }

    try {
      // Upload the file to Firebase Storage
      const fileRef = ref(storage, `videos/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(snapshot.ref);

      // Save the file metadata in Firestore
      await addDoc(collection(db, "investigations"), {
        title,
        description,
        fileURL,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Reset the form
      setFile(null);
      setTitle("");
      setDescription("");
      setVideoSrc(null);
      setIsModalOpen(false);

      alert("Investigation added successfully.");
    } catch (error) {
      console.error("Error uploading file and saving data:", error);
      alert("Failed to add investigation. Please try again.");
    }
  };

  // Simulacao de como a api retorna as placas encontradas
  const [vehiclePlates, setVehiclePlates] = useState([
    { plate: "ABC1234", model: "Palio", color: "Preta", restriction: "Roubado", timestamp: "00:01:15" },
    { plate: "ABC1D23", model: "Onix", color: "Amarelo", restriction: "", timestamp: "00:02:10" }
  ]);

  return (
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
              
              <div className="mb-8 ">
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
                    ref={videoRef}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-center items-center h-full">
                <div className="w-4/5 h-4/5 border border-gray-200 dark:border-gray-700 bg-slate-400 mb-4 flex justify-center items-center">
                  <div className="relative w-full h-full aspect-w-16 aspect-h-9">
                    {videoSrc && (
                      <video
                        id="video-summary"
                        controls
                        src={videoSrc}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>


              <div className="flex justify-center items-center h-full">
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white flex cursor-pointer items-center gap-x-2 rounded px-5 py-2 text-sm font-bold transition md:px-4"
                  /*onClick={() => { 
                    console.log('Submit file for processing');
                    file && submitFileProcessing(file);
                  }}*/
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
                              </tr>
                            </thead>
                            <tbody>
                              {vehiclePlates.map((plate, index) => (
                                <tr key={index} className="border-b bg-gray-800 border-gray-700">
                                  <td className="px-6 py-4">{plate.model}</td>
                                  <td className="px-6 py-4">{plate.plate}</td>
                                  <td className="px-6 py-4">{plate.color}</td>
                                  <td className="px-6 py-4">{plate.restriction}</td>
                                  <td className="px-6 py-4">{plate.timestamp}</td>
                                </tr>
                              ))}
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
  );
}
