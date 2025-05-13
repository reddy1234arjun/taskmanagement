'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Simple auth check
    const token = localStorage.getItem('taskmaster_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1 pl-64">
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
