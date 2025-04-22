export interface Comment {
  id: number;
  topic_id: number;
  content: string;
  author: string;
  created_at: string;
  likes: number;
}

// Base topic interface with common properties
export interface TopicBase {
  id: number;
  title: string;
  category: string;
  color: 'amber' | 'cyan';
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

// Topic in list view (with comment count)
export interface TopicList extends TopicBase {
  comments: number;
}

// Topic in detail view (with comment array)
export interface TopicDetail extends TopicBase {
  comments: Comment[];
}

// Union type for both cases
export type Topic = TopicList | TopicDetail;
