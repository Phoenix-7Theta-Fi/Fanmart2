'use client';

import { useState } from 'react';
import UserGrid from '@/components/users/UserGrid';
import UserSearch from '@/components/users/UserSearch';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-yellow-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
      <h1 className="comic-title text-4xl text-center mb-8">
        Community Members
      </h1>
      
      <div className="max-w-lg mx-auto mb-8">
        <UserSearch 
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
      </div>

      <UserGrid searchQuery={searchQuery} />
      </div>
    </main>
  );
}
