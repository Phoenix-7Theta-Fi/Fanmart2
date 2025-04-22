import type { Topic, TopicList, TopicDetail } from '@/types/topics';

interface TopicDetailsProps {
  topic: Topic;
}

export default function TopicDetails({ topic }: TopicDetailsProps) {
  const commentsCount = Array.isArray(topic.comments) 
    ? topic.comments.length 
    : topic.comments;
  return (
    <article className="bg-[var(--neutral-light)] p-8 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)]">
      <div className="flex justify-between items-start mb-6">
        <span className={`inline-block bg-${topic.color}-100 text-${topic.color}-800 border-${topic.color}-300 font-semibold px-3 py-1 rounded-full text-sm border`}>
          {topic.category}
        </span>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-cyan-600">
            Share
          </button>
          <button className="text-gray-500 hover:text-cyan-600">
            Save
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)]">
        {topic.title}
      </h1>
      
      <div className="text-sm text-gray-600 mb-6">
        <span>By {topic.author} • </span>
        <span>{new Date(topic.created_at).toLocaleDateString()}</span>
      </div>

      <div className="prose max-w-none mb-8">
        <p>{topic.content}</p>
      </div>

      <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
        <button className="flex items-center gap-2 text-gray-500 hover:text-cyan-600">
          <span>👍</span> Like
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-cyan-600">
          <span>💬</span> {commentsCount} Comments
        </button>
      </div>
    </article>
  );
}
