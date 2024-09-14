'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import ButtonEdit from './ButtonEdit'; // arrumar component futuro
import { DocumentData } from "../lib/types";
import { deleteDocument, updateDocument } from '../lib/firebase/firestore';
import { deleteFile } from '../lib/firebase/storage';

type RelatedArticlesProps = {
  investigation: DocumentData[];
};

export default function RelatedArticles({ investigation }: RelatedArticlesProps) {
  const [authorName, setAuthorName] = useState<{ [key: string]: string }>({});
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUserId(user.uid);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const fetchAuthorName = async () => {
      const name: { [key: string]: string } = {};
      await Promise.all(
        investigation.map(async (inv) => {
          if (inv.userId && !name[inv.userId]) {
            try {
              const userDoc = await getDoc(doc(db, 'users', inv.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData && userData.name) {
                  name[inv.userId] = userData.name;
                } else {
                  console.warn(`Name not found for userId: ${inv.userId}`);
                }
              } else {
                console.warn(`No user found with userId: ${inv.userId}`);
              }
            } catch (error) {
              console.error(`Error fetching user with userId: ${inv.userId}`, error);
            }
          }
        })
      );
      setAuthorName(name);
    };

    fetchAuthorName();
  }, [investigation]);

  const handleDelete = async (id: string, investigationUserId: string, fileURL: string) => {
    console.log('loggedInUserId: ',loggedInUserId);
    console.log('investigationUserId: ',investigationUserId);
    
    if (loggedInUserId !== investigationUserId) {  
      alert("You are not authorized to delete this investigation.");
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this investigation?');
    if (confirmed) {
      try {
        await deleteFile(fileURL);
        await deleteDocument('investigations', id);
        alert('Investigation deleted successfully.');
        window.location.reload();
      } catch (error) {
        console.error("Error deleting investigation:", error);
        alert('Failed to delete the investigation. Please try again.');
      }
    }
  };

  // ARRUMAR
  const handleEdit = async (id: string, investigationUserId: string) => {
    console.log('loggedInUserId: ',loggedInUserId);
    console.log('investigationUserId: ',investigationUserId);
    
    if (loggedInUserId !== investigationUserId) {  
      alert("You are not authorized to edit this investigation.");
      return;
    }

    const confirmed = confirm('Are you sure you want to edit this investigation?');
    if (confirmed) {
      try {
        //await updateDocument('investigations', id);
        alert('Investigation edited successfully.');
        window.location.reload();
      } catch (error) {
        console.error("Error deleting investigation:", error);
        alert('Failed to edit the investigation. Please try again.');
      }
    }
  };

  return (
    <div className="bg-gray-900 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {investigation.map((investigation) => (
          <div key={investigation.investigationId} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Link href={`/investigation/${investigation.investigationId}`} className="text-blue-600 hover:underline">
                <Image src={investigation.image} alt={investigation.title} width={400} height={250} className="w-full object-cover"/>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{investigation.title}</h3>
                  <p className="text-gray-700 mb-4 truncate">{investigation.description}</p>
                  Created: {investigation.date}
                  <br/>
                  Autor: {authorName[investigation.userId] || 'Unknown'}
                </div>
              </Link>
              <div className="flex items-center justify-between md:p-2 dark:border-gray-600">
                <button 
                  data-modal-target="crud-modal" 
                  data-modal-toggle="crud-modal" 
                  className="bg-blue-500 hover:bg-blue-700 text-white flex cursor-pointer items-center gap-x-2 rounded px-5 py-1.5 text-sm font-bold transition md:px-4" 
                  type="button"
                  onClick={() => handleEdit(investigation.investigationId, investigation.userId)}
                >
                  <PencilIcon className="size-6"/>
                  Edit
                </button>
                
                <button 
                  data-modal-target="crud-modal" 
                  data-modal-toggle="crud-modal" 
                  className="bg-blue-500 hover:bg-blue-700 text-white flex cursor-pointer items-center gap-x-2 rounded px-5 py-1.5 text-sm font-bold transition md:px-4" 
                  type="button"
                  onClick={() => handleDelete(investigation.investigationId, investigation.userId, investigation.fileURL)}
                >
                  <TrashIcon className="size-6"/>
                  Delete
                </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
