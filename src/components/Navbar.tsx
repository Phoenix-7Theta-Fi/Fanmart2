'use client'; // Required for useState, useEffect, and client-side auth logic

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient, type User } from '@/lib/supabase'; // Import Supabase client and User type
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'; // Re-add import for types
import { useRouter } from 'next/navigation'; // To redirect after sign out

export default function Navbar() {
  const supabase = createClient(); // Create client instance
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    fetchUser(); // Fetch initial user state

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => { // Re-add explicit types
        setUser(session?.user ?? null);
        setIsLoading(false); // Update loading state on change too
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]); // Add dependency

  const handleSignOut = async () => {
    setIsLoading(true); // Show loading state during sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      // Handle error appropriately, maybe show a message
    } else {
      setUser(null); // Clear user state immediately
      router.push('/'); // Redirect to home page after sign out
    }
    setIsLoading(false);
  };

  return (
    <nav className="bg-yellow-100 p-4 border-b-4 border-black">
      <div className="container mx-auto flex justify-between items-center">
        {/* Changed textShadow for outline effect, ensured text is white (implicitly via no text color class) */}
        <Link 
          href="/" 
          className="comic-title text-2xl font-bold text-white" // Explicitly set text-white
          style={{ 
            textShadow: `
              -1px -1px 0 #000,  
               1px -1px 0 #000,
              -1px  1px 0 #000,
               1px  1px 0 #000,
               -2px 0 0 #000, 
                2px 0 0 #000, 
                0 -2px 0 #000, 
                0 2px 0 #000` // Multiple shadows for outline
          }}
        >
          Fan-Mart
        </Link>
        {/* Navigation Links and Auth Buttons */}
        <div className="flex items-center space-x-6"> {/* Increased spacing */}
          {/* Standard Links */}
          <Link href="/" className="text-lg font-bold text-black hover:text-cyan-600 transition-colors"> {/* Added text-black */}
            Home
          </Link>
          {user && ( // Only show Dashboard if logged in
            <Link href="/dashboard" className="text-lg font-bold text-black hover:text-cyan-600 transition-colors"> {/* Added text-black */}
              Dashboard
            </Link>
          )}
          {user && ( // Only show Profile if logged in
            <Link href="/profile" className="text-lg font-bold text-black hover:text-cyan-600 transition-colors"> {/* Added text-black */}
              Profile
            </Link>
          )}
          {/* Add other links as needed */}

          {/* Auth Buttons Area */}
          <div className="flex items-center space-x-4">
            {isLoading ? ( // Show loading indicator OR auth buttons
              <div className="text-sm font-bold animate-pulse">Loading...</div>
            ) : user ? ( // If logged in, show Sign Out
              <button
                onClick={handleSignOut}
                className="bg-gradient-to-br from-red-400 to-red-500 text-white font-bold py-1.5 px-3 rounded-md border-2 border-black hover:from-red-500 hover:to-red-600 transform transition hover:-translate-y-0.5 comic-shadow" // Use comic-shadow, adjusted padding
              >
                Sign Out
              </button>
            ) : ( // If logged out, show Sign In
              <Link href="/" // Assuming login is on the home page
                className="bg-gradient-to-br from-cyan-400 to-cyan-500 text-white font-bold py-1.5 px-3 rounded-md border-2 border-black hover:from-cyan-500 hover:to-cyan-600 transform transition hover:-translate-y-0.5 comic-shadow" // Use comic-shadow, adjusted padding
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
