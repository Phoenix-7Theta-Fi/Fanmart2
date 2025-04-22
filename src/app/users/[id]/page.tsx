'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import UserProfileView from '@/components/users/UserProfileView';

interface Profile {
  id: string;
  name: string | null;
  bio: string | null;
  profile_picture: string | null;
  interests: string[] | null;
  created_at?: string;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (e: any) {
        console.error('Error fetching profile:', e);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-semibold text-[var(--foreground)]">
            Loading hero profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-semibold text-red-500">
            {error || 'Hero not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <UserProfileView profile={profile} />
      </div>
    </div>
  );
}
