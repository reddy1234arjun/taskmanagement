'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { List } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  
  useEffect(() => {
    if (registered === 'true') {
      setShowRegistrationSuccess(true);
      
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowRegistrationSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [registered]);
  
  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4">
      {showRegistrationSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50 animate-fade-in">
          <p>Registration successful! Please log in.</p>
        </div>
      )}
      <LoginForm />
    </main>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <List className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">TaskMaster</span>
          </Link>
        </div>
      </header>

      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      }>
        <LoginContent />
      </Suspense>
      
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TaskMaster Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
