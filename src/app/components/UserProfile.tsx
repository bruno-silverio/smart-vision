'use client';
import React from 'react';
import Image from "next/image";

export const UserProfile = () => (
  <div className='flex items-center space-x-4'>
    <p className='hidden cursor-not-allowed lg:inline'>Cop</p>
    <Image 
      src='/userprofile.png'
      alt='profile'
      width={40}
      height={40}
      className='rounded-full cursor-pointer'
    />
  </div>
);