'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AuthForm } from '@/app/components/AuthForm';
import { auth } from '@/app/lib/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);

  console.log(errors);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Firebase Authentication - sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);

      // Redirect to home page upon successful login
      router.push('/');
    } catch (error: any) {
      alert('Login error: ' +error);
      console.error('Login error:', error);
      setErrors([error.message || 'An unknown error occurred.']);
    }
  };

  return <AuthForm formType='login' onSubmit={handleSubmit} />;
}
