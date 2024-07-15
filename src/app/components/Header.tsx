'use client';

import React, { useEffect, useState } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`
    ${isScrolled && 'bg-black'}
    fixed top-0 z-50 flex w-full items-center justify-between  px-4 py-4 transition-all lg:px-10 lg:py-6 `}
    >
      <div className='flex items-center space-x-2 md:space-x-8'>
        <img
          src='https://www.puc-campinas.edu.br/wp-content/uploads/2016/01/logo-puc-brasao-1-300x89.png'
          alt='smart-vision'
          width={150}
          height={150}
        />
        <ul className='hidden md:flex md:space-x-5'>
          <li>Home</li>
          <li>History</li>
          <li>About</li>
        </ul>
      </div>
      <div className='flex items-center space-x-4'>
        <p className='hidden cursor-not-allowed lg:inline'>Cop</p>
        <img
          src='https://rb.gy/g1pwyx'
          alt=''
          className='cursor-pointer rounded'
        />
      </div>
    </header>
  );
}