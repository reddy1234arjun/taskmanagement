'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<null | { name: string; email: string }>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('taskmaster_token');
      const storedUser = localStorage.getItem('user');
      
      if (!token) {
        router.push('/login');
        setLoading(false);
        return;
      }
      
      try {
        // In a real app, you would validate the token with your backend
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('taskmaster_token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    }
    
    setLoading(false);
  }, [router]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('taskmaster_token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  return { user, loading, logout };
}
