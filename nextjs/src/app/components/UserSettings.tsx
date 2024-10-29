'use client';

import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';

interface UserSettingsProps {
  closeModal: () => void;
}

export default function UserSettings({ closeModal }: UserSettingsProps) {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setLoggedInUserId(user.uid);
      fetchUserData(user.uid);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserName(userData.name || '');
        setUserEmail(userData.email || '');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const updateUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !userEmail) {
      alert('All fields are required.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', loggedInUserId as string);
      await updateDoc(userDocRef, {
        name: userName,
        email: userEmail,
      });

      alert('User information updated successfully!');
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('Failed to update user information. Please try again.');
    }
  };

  return (
   <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div
       id="crud-modal"
        tabIndex={-1}
        className={` flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center`}
        >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit user information
              </h3>
              <button 
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                data-modal-toggle="crud-modal" 
                onClick={closeModal}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form onSubmit={updateUserProfile} className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="userEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input
                    type="email"
                    name="userEmail"
                    id="userEmail"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white flex cursor-pointer items-center gap-x-2 rounded px-5 py-1.5 text-sm font-bold transition md:px-4"
                >
                  <ClipboardDocumentCheckIcon className="size-6"/>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
