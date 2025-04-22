'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { TopicDetail, Comment } from '@/types/topics';
import TopicDetails from '@/components/topics/TopicDetails';
import CommentSection from '@/components/topics/CommentSection';

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopic() {
      try {
        const response = await fetch(`/api/topics?id=${params.id}`);
        if (!response.ok) {
          const errorData = await response.json() as { error: string };
          throw new Error(errorData.error || 'Failed to fetch topic');
        }
        const data = await response.json() as TopicDetail;
        setTopic(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch topic';
        console.error('Error fetching topic:', error);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopic();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!topic || error) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
          {error || 'Topic not found'}
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
      
      <TopicDetails topic={topic} />
      <CommentSection 
        topicId={topic.id} 
        initialComments={topic.comments} 
      />
    </div>
  );
}
