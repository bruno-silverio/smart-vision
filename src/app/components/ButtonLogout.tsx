import React from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/lib/firebase/firebase';

export default function ButtonLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('http://localhost:3000/auth/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}
