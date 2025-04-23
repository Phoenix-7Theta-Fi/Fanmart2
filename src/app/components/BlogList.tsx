'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Blog } from '@/types/blog';

interface BlogListProps {
  getCategoryClasses: (color: string) => string;
}

export default function BlogList({ getCategoryClasses }: BlogListProps) {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {blogs.map((post) => (
        <div 
          key={post.id} 
          onClick={() => router.push(`/blog/${post.id}`)}
          className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1"
        >
          <span className={`inline-block ${getCategoryClasses(post.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>{post.category}</span>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150">{post.title}</h3>
          <p className="text-gray-600 text-sm font-medium">By {post.author} - {new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
