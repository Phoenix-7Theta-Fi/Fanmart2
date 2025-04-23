'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import type { BlogComment } from '@/types/blog';

interface BlogCommentsProps {
  blogId: number;
  initialComments: BlogComment[];
}

export default function BlogComments({ blogId, initialComments }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`blog-${blogId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'blog_comments',
          filter: `blog_id=eq.${blogId}`
        },
        (payload) => {
          const newComment = payload.new as BlogComment;
          setComments(prev => [newComment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [blogId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      setNewComment('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to post comment');
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-4 border-2 border-[var(--neutral-dark)] rounded-lg shadow-[2px_2px_0px_var(--neutral-dark)] resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
          />
          {error && (
            <p className="text-red-500 mt-2 text-sm">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className={`mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg font-bold shadow-[2px_2px_0px_var(--neutral-dark)] 
            ${isSubmitting || !newComment.trim() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-cyan-600 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none'
            }`}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div 
            key={comment.id}
            className="p-6 bg-white rounded-lg border-2 border-[var(--neutral-dark)] shadow-[2px_2px_0px_var(--neutral-dark)]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="font-bold text-cyan-600">{comment.author}</div>
              <div className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <button className="hover:text-cyan-600 flex items-center gap-1">
                <span>♥</span> {comment.likes || 0}
              </button>
              <button className="hover:text-cyan-600">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}