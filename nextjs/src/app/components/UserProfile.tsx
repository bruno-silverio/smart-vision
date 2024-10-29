'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';

import ButtonLogout from './ButtonLogout';
import UserSettings from './UserSettings';

export const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
    setIsDropdownOpen(false);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserName(userData.name || 'Unknown User');
          } else {
            console.log('No user!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className='flex items-center space-x-4 relative'>
      <button
        id="avatarButton"
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full cursor-pointer"
        type="button"
      >
        <Image
          width={40}
          height={40}
          className="rounded-full"
          src="/userprofile.png"
          alt="User dropdown"
        />
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div
          id="userDropdown"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute top-12 right-0 "
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white flex items-center justify-center">
            <div>{userName}</div>
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
            <li className="flex items-center justify-center py-1">
              <button 
                onClick={openSettings} 
                className="px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </button>
            </li>
            <div className="py-2 flex items-center justify-center">
              <ButtonLogout />
            </div>
          </ul>
        </div>
      )}

      {/* User Settings Modal */}
      {isSettingsOpen && <UserSettings closeModal={closeSettings} />}
    </div>
  );
};
