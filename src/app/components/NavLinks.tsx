'use client';

import Link from 'next/link';
import React from 'react';

export const NavLinks = () => (
  <nav>
    <ul className='hidden md:flex md:space-x-4'>
      <Link href='/'>Home</Link>
      <Link href='/detection'>Detection</Link>
      <Link href='/history'>History</Link>
      <Link href='/about'>About</Link>
    </ul>
  </nav>
);