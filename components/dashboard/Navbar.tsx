'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  List, 
  Bell, 
  User, 
  LogOut, 
  Search, 
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for theme preference in localStorage
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
      
      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user from localStorage');
        }
      }
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (typeof window !== 'undefined') {
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('taskmaster_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <List className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl hidden md:inline-block">TaskMaster</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks..."
                className={cn(
                  "w-full pl-9 pr-4 py-2 rounded-md border border-border",
                  "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                )}
              />
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button 
              className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <div className="relative">
              <button 
                className="flex items-center gap-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                  {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                </div>
                <span className="hidden md:inline-block">{user?.name || 'User'}</span>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm font-medium border-b border-border">
                      <div>{user?.name || 'User'}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{user?.email || 'user@example.com'}</div>
                    </div>

                    <div className="py-1 mt-1">
                      <Link 
                        href="/dashboard" 
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link 
                        href="/dashboard/tasks" 
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>My Tasks</span>
                      </Link>
                    </div>

                    <div className="py-1 mt-1 border-t border-border">
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent rounded-md"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
