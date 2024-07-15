'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const useScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isScrolled;
};

const Logo = () => (
  <Image 
    src='/logo.png'
    alt='logo'
    width={150}
    height={150}
    className='cursor-pointer'
  />
);

const NavLinks = () => (
  <nav>
    <ul className='hidden md:flex md:space-x-4'>
      <li>Home</li>
      <li>History</li>
      <li>About</li>
    </ul>
  </nav>
);

const UserProfile = () => (
  <div className='flex items-center space-x-4'>
    <p className='hidden cursor-not-allowed lg:inline'>Kids</p>
    <Image 
      src='/userprofile.png'
      alt='profile'
      width={40}
      height={40}
      className='rounded-full cursor-pointer'
    />
  </div>
);

export default function Header() {
  const isScrolled = useScroll();

  return (
    <header
      className={`${
        isScrolled && 'bg-black'
      } fixed top-0 z-50 flex w-full items-center justify-between p-2 transition-all lg:px-10 lg:py-4`}
    >
      <div className='flex items-center space-x-2 md:space-x-8'>
        <Logo />
        <NavLinks />
      </div>
      <UserProfile />
    </header>
  );
}