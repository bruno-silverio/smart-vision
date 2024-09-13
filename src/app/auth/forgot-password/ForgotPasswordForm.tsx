'use client';

import Link from 'next/link';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';

import { auth } from '@/app/lib/firebase/firebase';
import { InputField } from '@/app/components/InputField';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent! Please check your email.');
      } catch (error) {
        console.error('Error sending password reset email: ', error);
        alert('Failed to send password reset email. Please try again.');
      }
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className='flex w-full max-w-md flex-col space-y-4 rounded bg-[#141414] bg-opacity-90 px-4 py-8 shadow-lg'
    >
      <div className='flex flex-col items-center space-y-4'>
        <h1 className='text-3xl font-bold'>Forgot Password</h1>
        <p className='text-sm text-gray-50'>
          Enter your email to reset your password
        </p>
      </div>

      <InputField
        id='email'
        name='email'
        type='email'
        label='Email'
        placeholder='Enter your email'
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />

      <div className='flex flex-col space-y-2 pt-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center items-center'>
        <button
          className='flex w-full items-center justify-start rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 sm:w-auto sm:px-8'
          type='submit'
        >
          Reset Password
        </button>

        <Link href="/auth/login" passHref legacyBehavior>
          <button
            className='flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-slate-500 hover:bg-slate-600 text-white sm:w-auto sm:px-8'
          >
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
}
