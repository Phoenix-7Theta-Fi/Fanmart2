'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

// Define a type for the profile data
interface Profile {
  id: string;
  name: string | null;
  bio: string | null;
  profile_picture: string | null;
  interests: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [profilePictureInput, setProfilePictureInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // 1. Get the current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session Error:', sessionError);
        setError('Session error. Please try logging in again.');
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!sessionData.session?.user) {
        setError('No active session. Please log in.');
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const currentUser = sessionData.session.user;
      console.log('Current User:', {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role
      });
      setUser(currentUser);

      // 2. Get the user's profile
      let profileData;
      let profileError;
      
      const initialFetch = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();
      
      profileData = initialFetch.data;
      profileError = initialFetch.error;

      if (profileError || !profileData) {
        console.error('Profile fetch result:', {
          error: profileError,
          data: profileData
        });
        
        try {
          // Try to create a new profile
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: currentUser.id,
              name: '',
              bio: '',
              profile_picture: '',
              interests: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })
            .select('*')
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            setError('Could not create profile. Please try logging out and back in.');
            setProfile(null);
          } else if (newProfile) {
            console.log('Created new profile:', newProfile);
            setProfile(newProfile);
            setNameInput('');
            setBioInput('');
            setProfilePictureInput('');
            setInterestsInput('');
            setEditing(true);
            setError(null);
          }
        } catch (e) {
          console.error('Unexpected error during profile creation:', e);
          setError('An unexpected error occurred. Please try again.');
          setProfile(null);
        }
      } else {
        setProfile(profileData);
        if (!editing) {
          setNameInput(profileData.name || '');
          setBioInput(profileData.bio || '');
          setProfilePictureInput(profileData.profile_picture || '');
          setInterestsInput(profileData.interests?.join(', ') || '');
        }
      }

      setLoading(false);
    };

    fetchData();

    // Auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id !== user?.id) {
        fetchData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, user?.id, editing]);

  // Profile polling effect
  useEffect(() => {
    if (!user || editing || loading) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data: updatedProfile, error: pollError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!pollError && updatedProfile && JSON.stringify(updatedProfile) !== JSON.stringify(profile)) {
          console.log('Profile update detected:', updatedProfile);
          setProfile(updatedProfile);
        }
      } catch (e) {
        console.error('Error polling for profile updates:', e);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [user, editing, loading, supabase, profile]);

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    const interestsArray = interestsInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    const updates = {
      id: user.id,
      name: nameInput,
      bio: bioInput,
      profile_picture: profilePictureInput,
      interests: interestsArray,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .upsert(updates)
        .select('*')
        .single();

      if (updateError) {
        console.error('Error updating profile:', {
          error: updateError,
          message: updateError.message,
          code: updateError.code,
          details: updateError.details
        });
        setError('Failed to update profile. Please try again.');
      } else if (updatedProfile) {
        console.log('Profile updated successfully:', updatedProfile);
        setProfile(updatedProfile);
        setEditing(false);
        setError(null);
      }
    } catch (e) {
      console.error('Unexpected error during update:', e);
      setError('An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    if (profile) {
      setNameInput(profile.name || '');
      setBioInput(profile.bio || '');
      setProfilePictureInput(profile.profile_picture || '');
      setInterestsInput(profile.interests?.join(', ') || '');
    }
    setError(null);
  };

  if (loading && !user) {
    return <div className="container mx-auto p-6 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-6 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-4xl mb-8 text-center comic-title text-amber-500">Your Profile</h1>

      {loading && (
        <div className="text-center mb-4 text-lg font-bold text-cyan-600">
          Loading...
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 border-2 border-black rounded-lg comic-shadow">
          <p className="font-bold">{error}</p>
        </div>
      )}

      {editing ? (
        <form onSubmit={handleUpdateProfile} className="space-y-6 p-8 bg-white border-4 border-black rounded-xl comic-shadow">
          <div>
            <label htmlFor="name" className="block text-lg font-bold mb-2 comic-title">Name:</label>
            <input
              type="text"
              id="name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 comic-shadow"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-lg font-bold mb-2 comic-title">Bio:</label>
            <textarea
              id="bio"
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 comic-shadow"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-lg font-bold mb-2 comic-title">Profile Picture URL:</label>
            <input
              type="url"
              id="profilePicture"
              value={profilePictureInput}
              onChange={(e) => setProfilePictureInput(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 comic-shadow"
              placeholder="https://example.com/profile.jpg"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="interests" className="block text-lg font-bold mb-2 comic-title">Interests (comma-separated):</label>
            <input
              type="text"
              id="interests"
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 comic-shadow"
              placeholder="e.g., comics, gaming, art"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              className="bg-gray-200 text-black font-bold py-3 px-6 rounded-lg border-2 border-black hover:bg-gray-300 transition comic-shadow disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !profile}
              className="bg-gradient-to-br from-amber-400 to-amber-500 text-black font-bold py-3 px-6 rounded-lg border-2 border-black hover:from-amber-500 hover:to-amber-600 transition comic-shadow disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 p-8 bg-white border-4 border-black rounded-xl comic-shadow">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-black"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-black flex items-center justify-center">
                  <span className="text-gray-500">No Photo</span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <div>
                <h2 className="text-xl font-bold comic-title">Name</h2>
                <p className="text-xl font-bold mt-1">{profile?.name || <span className="italic text-gray-500">Not set</span>}</p>
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-bold comic-title">Bio</h2>
                <p className="text-lg whitespace-pre-wrap mt-1">{profile?.bio || <span className="italic text-gray-500">Not set</span>}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold comic-title">Interests</h2>
            {profile?.interests && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-amber-100 text-amber-800 text-base font-bold px-4 py-1 rounded-full border-2 border-black comic-shadow"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-500">No interests listed</p>
            )}
          </div>
          <div className="text-right pt-4">
            <button
              onClick={() => setEditing(true)}
              disabled={!profile || loading}
              className="bg-gradient-to-br from-cyan-400 to-cyan-500 text-black font-bold py-3 px-6 rounded-lg border-2 border-black hover:from-cyan-500 hover:to-cyan-600 transition comic-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
