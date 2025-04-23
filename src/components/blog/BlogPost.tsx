import { useState } from 'react';
import type { BlogDetail } from '@/types/blog';

interface BlogPostProps {
  blog: BlogDetail;
}

export default function BlogPost({ blog }: BlogPostProps) {
  const [likes, setLikes] = useState(blog.likes_count);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId: blog.id,
          action: 'like',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      setLikes(prev => prev + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="bg-[var(--neutral-light)] p-8 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)]">
      <div className="flex justify-between items-start mb-6">
        <span className={`inline-block bg-${blog.color}-100 text-${blog.color}-800 border-${blog.color}-300 font-semibold px-3 py-1 rounded-full text-sm border`}>
          {blog.category}
        </span>
        <div className="flex items-center gap-2">
          <button 
            className="text-gray-500 hover:text-cyan-600"
            onClick={() => {
              navigator.share?.({
                title: blog.title,
                text: blog.content.substring(0, 100) + '...',
                url: window.location.href,
              }).catch(console.error);
            }}
          >
            Share
          </button>
          <button 
            className={`flex items-center gap-1 ${
              isLiking ? 'text-cyan-600' : 'text-gray-500 hover:text-cyan-600'
            }`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <span>♥</span>
            <span>{likes}</span>
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)]">
        {blog.title}
      </h1>
      
      <div className="text-sm text-gray-600 mb-6 flex items-center gap-4">
        <span>By {blog.author}</span>
        <span>•</span>
        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        <span>•</span>
        <span>{blog.read_time} min read</span>
      </div>

      <div className="prose max-w-none">
        {blog.content}
      </div>

      <div className="flex items-center gap-4 border-t border-gray-200 mt-8 pt-4">
        <button 
          className={`flex items-center gap-2 ${
            isLiking ? 'text-cyan-600' : 'text-gray-500 hover:text-cyan-600'
          }`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <span>♥</span> {likes} Likes
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-cyan-600">
          <span>💬</span> {blog.comments.length} Comments
        </button>
      </div>
    </article>
  );
}