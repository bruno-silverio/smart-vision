'use client'

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';

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
  const router = useRouter();
  const { id } = useParams();

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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='relative h-screen overflow-hidden bg-gradient-to-b lg:h-[140vh]'>
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
                <div className="col-span-2">
                  <label htmlFor="video" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Video</label>
                  {videoURL ? (
                    <video width="100%" controls>
                      <source src={videoURL} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p>No video available</p>
                  )}
                </div>
              </div>
              {isEditable && (
                <button 
                  type="submit" 
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Update investigation
                </button>
              )}
            </form>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
