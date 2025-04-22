import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface Profile {
  id: string;
  name: string | null;
  bio: string | null;
  profile_picture: string | null;
  interests: string[] | null;
  created_at?: string;
}

interface UserProfileViewProps {
  profile: Profile;
}

export default function UserProfileView({ profile }: UserProfileViewProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkFollowStatus();
  }, [profile.id]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/follow?userId=${profile.id}`);
      if (!response.ok) throw new Error('Failed to check follow status');
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: profile.id }),
      });

      if (!response.ok) throw new Error('Failed to process follow action');
      
      const data = await response.json();
      setIsFollowing(data.action === 'followed');
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6 p-8 bg-white border-4 border-black rounded-xl comic-shadow">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={profile.name || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-2 border-black"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-black flex items-center justify-center">
                <span className="text-4xl">🦸‍♂️</span>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div>
              <h2 className="text-xl font-bold comic-title">Name</h2>
              <p className="text-xl font-bold mt-1">
                {profile?.name || <span className="italic text-gray-500">Anonymous Hero</span>}
              </p>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold comic-title">Bio</h2>
              <p className="text-lg whitespace-pre-wrap mt-1">
                {profile?.bio || <span className="italic text-gray-500">This hero is yet to share their story...</span>}
              </p>
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

        {/* Member Since */}
        <div className="mt-6 text-sm text-gray-600">
          <p>
            Member since:{' '}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : 'Unknown'}
          </p>
        </div>

        {/* Social Links or Additional Actions could go here */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            className={`
              font-bold py-2 px-4 rounded-lg border-2 border-black 
              transition comic-shadow
              ${isFollowing 
                ? 'bg-gray-200 hover:bg-gray-300' 
                : 'bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600'
              }
            `}
            onClick={handleFollowClick}
            disabled={isLoading}
          >
            {isLoading 
              ? '...' 
              : isFollowing 
                ? 'Unfollow' 
                : 'Follow'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
