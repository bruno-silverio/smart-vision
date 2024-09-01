'use client';

import React from 'react';
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import { registerFormSchema } from '@/app/lib/validations/RegisterValidation';

import { auth, db } from '@/app/lib/firebase/firebase';  
import { AuthForm } from '@/app/components/AuthForm';

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Create an object with the form data to validate with zod
    const formValues = { name, email, password, confirmPassword };

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      registerFormSchema.parse(formValues);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add a name for the new user
      if (user) {
        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          uid: user.uid,
        });
      }

      console.log('User registered and data saved to Firestore: ', user);

      // Email validation
      alert('Email Address Verification: ' + email);

      router.push('/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => err.message).join('\n');
        alert(errors);
      } else {
        console.error('Error registering user: ', error);
        alert('Failed to register! Try again!');
      }
    }
  };

  return <AuthForm formType='register' onSubmit={handleSubmit} />;
}