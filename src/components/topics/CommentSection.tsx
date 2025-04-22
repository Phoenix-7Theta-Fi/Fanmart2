'use client';

import { useState, useEffect } from 'react';
import type { Comment } from '@/types/topics';
import { createClient } from '@/lib/supabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface CommentSectionProps {
  topicId: number;
  initialComments?: Comment[];
}

export default function CommentSection({ topicId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Set initial comments
    setComments(initialComments);

    // Subscribe to new comments
    const channel = supabase
      .channel(`topic-${topicId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `topic_id=eq.${topicId}`
        },
        (payload: RealtimePostgresChangesPayload<{
          [key: string]: any;
        }>) => {
          const newComment = payload.new as Comment;
          setComments(prev => [newComment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topicId, initialComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/topics?id=${topicId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          author: 'Current User', // This will be replaced with actual user data later
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      // Clear the form and update comments
      setNewComment('');
      
      // Update comments list with the new comment
      const newComment = await response.json();
      setComments(prev => [newComment, ...prev]);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-4 border-2 border-black rounded-lg mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-500 text-white px-6 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">{comment.author}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button className="text-gray-500 hover:text-cyan-600">
                  ♥ {comment.likes}
                </button>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
