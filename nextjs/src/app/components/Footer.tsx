'use client';

import React from 'react';

import { useScroll } from '../hooks/useScroll';

export default function Footer() {
  const isScrolled = useScroll();

  return (
    <footer className={`${isScrolled && 'bg-black'} 
      fixed bottom-0 z-50 flex w-full items-center justify-between bg-gradient-to-t from-transparent  p-4 transition-all lg:px-16 lg:py-1`}>
        <div className="w-full max-w-screen-xl mx-auto  md:py-1">
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://www.linkedin.com/in/bruno-silverio/" className="hover:underline">Smart Vision™</a>. All Rights Reserved.</span>
        </div>
    </footer>
  );
}