'use client'

import React from "react";
import Image from "next/image";

export const Logo = () => (
  <Image 
    src='/logo.png'
    alt='logo'
    width={150}
    height={150}
    className='cursor-pointer'
  />
);