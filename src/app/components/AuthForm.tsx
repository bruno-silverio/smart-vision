'use client';

import { useState } from 'react';
import { InputField } from './InputField';

type AuthFormProps = {
  formType: 'login' | 'register';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const AuthForm: React.FC<AuthFormProps> = ({ formType, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <form
      role='form'
      onSubmit={onSubmit}
      className='flex w-full max-w-md flex-col space-y-4 rounded bg-[#141414] bg-opacity-90 px-4 py-8 shadow-lg'
    >
      <div className='flex flex-col items-center space-y-4'>
        <h1 className='text-3xl font-bold'>
          {formType === 'login' ? 'Login' : 'Register'}
        </h1>
        <p className='text-sm text-gray-50'>
          {formType === 'login'
            ? 'New to the app?'
            : 'Already have an account?'}{' '}
          <a
            href={formType === 'login' ? '/auth/register' : '/auth/login'}
            className='text-red-500 hover:underline'
          >
            {formType === 'login' ? 'Register' : 'Login'}
          </a>
        </p>
        <p className='text-sm text-gray-50'>
          <a
            href='/auth/forgot-password'
            className='text-red-500 hover:underline'
          >
            Forgot your password?
          </a>
        </p>
      </div>
      <div className='mt-8 flex flex-col space-y-4'>
        {formType === 'register' && (
          <InputField
            id='name'
            name='name'
            type='text'
            label='Name'
            placeholder='Enter your name'
            value={name}
            onChange={(e) => setName(e.target.value)} // Handle onChange
          />
        )}
        <InputField
          id='email'
          name='email'
          type='email'
          label='Email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Handle onChange
        />
        {formType === 'register' && (
          <>
            <h2 className="mb-2 text-lg text-gray-900 dark:text-gray-50">Password requirements</h2>
            <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                <li>
                    At least 5 characters
                </li>
                <li>
                    At least one lowercase character
                </li>
            </ul>
          </>
        )}
        <InputField
          id='password'
          name='password'
          type='password'
          label='Password'
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Handle onChange
        />

        {formType === 'register' && (
          <InputField
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            label='Confirm Password'
            placeholder='Confirm your password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Handle onChange
          />
        )}
      </div>
      <div className='flex flex-col space-y-2 pt-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center items-center'>
        <button
          className='flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold sm:w-auto sm:px-8 bg-blue-500 hover:bg-blue-700 text-white'
          type='submit'
        >
          {formType === 'login' ? 'Login' : 'Register'}
        </button>
      </div>
    </form>
  );
};
