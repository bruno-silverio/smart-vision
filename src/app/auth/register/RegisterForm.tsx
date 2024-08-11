'use client';

import React from 'react';
import { useRouter } from 'next/navigation'

import { AuthForm } from '@/app/components/AuthForm';
import { auth } from '@/app/lib/firebase/firebase';  
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    alert('Submit from register');
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      alert('Passwords dont match!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User registered: ', user);
      
      router.push('/');
    } catch (error) {
      console.error('Error registering user: ', error);
      alert('Failed to register! Try again!');
    }
  };

  return <AuthForm formType='register' onSubmit={handleSubmit} />;
}