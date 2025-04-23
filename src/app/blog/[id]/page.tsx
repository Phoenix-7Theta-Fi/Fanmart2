'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { BlogDetail } from '@/types/blog';
import BlogPost from '@/components/blog/BlogPost';
import BlogComments from '@/components/blog/BlogComments';

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blog?id=${params.id}`);
        if (!response.ok) {
          const errorData = await response.json() as { error: string };
          throw new Error(errorData.error || 'Failed to fetch blog post');
        }
        const data = await response.json() as BlogDetail;
        setBlog(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch blog post';
        console.error('Error fetching blog:', error);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlog();
  }, [params.id]);

  if (isLoading) {
    return null; // Will be replaced by loading.tsx
  }

  if (!blog || error) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
          {error || 'Blog post not found'}
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-cyan-600 hover:text-cyan-800 font-bold flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 text-cyan-600 hover:text-cyan-800 font-bold flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
      
      <BlogPost blog={blog} />
      <BlogComments blogId={blog.id} initialComments={blog.comments} />
    </div>
  );
}
