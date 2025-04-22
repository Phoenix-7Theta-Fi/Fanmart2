'use client';

import { useEffect, useState } from 'react';
import UserCard from './UserCard';

interface Profile {
  id: string;
  name: string | null;
  bio: string | null;
  profile_picture: string | null;
  interests: string[] | null;
  created_at: string;
}

interface UserGridProps {
  searchQuery: string;
}

export default function UserGrid({ searchQuery }: UserGridProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '9',
          ...(searchQuery && { query: searchQuery }),
        });

        const response = await fetch(`/api/users?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch profiles');

        const data = await response.json();
        setProfiles(data.profiles);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search queries
    const timeoutId = setTimeout(() => {
      fetchProfiles();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, page]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid of user cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton cards
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--neutral-light)] animate-pulse h-48 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)]"
            />
          ))
        ) : profiles.length > 0 ? (
          profiles.map((profile) => (
            <UserCard key={profile.id} user={profile} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-[var(--foreground)] opacity-70">No heroes found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[var(--neutral-light)] border-2 border-[var(--neutral-dark)] rounded-lg shadow-[3px_3px_0px_var(--neutral-dark)] hover:shadow-[4px_4px_0px_var(--neutral-dark)] transition-all duration-150 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-[3px_3px_0px_var(--neutral-dark)]"
          >
            Previous
          </button>
          <span className="px-4 py-2 font-bold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-[var(--neutral-light)] border-2 border-[var(--neutral-dark)] rounded-lg shadow-[3px_3px_0px_var(--neutral-dark)] hover:shadow-[4px_4px_0px_var(--neutral-dark)] transition-all duration-150 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-[3px_3px_0px_var(--neutral-dark)]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
