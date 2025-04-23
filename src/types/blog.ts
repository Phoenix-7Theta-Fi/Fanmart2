// Base blog interface with common properties
export interface BlogBase {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  color: 'amber' | 'cyan'; // Keeping consistent with existing color scheme
  created_at: string;
  updated_at: string;
  likes_count: number;
  read_time: number; // Estimated reading time in minutes
}

// Blog in list view (for dashboard cards)
export interface BlogList extends BlogBase {
  excerpt: string; // Short preview of content
  comments_count: number;
}

// Blog comment interface
export interface BlogComment {
  id: number;
  blog_id: number;
  content: string;
  author: string;
  user_id: string;
  created_at: string;
  likes: number;
}

// Blog in detail view (with comments array)
export interface BlogDetail {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  category: string;
  color: string;
  read_time: number;
  likes_count: number;
  comments: BlogComment[];
}

// Union type for both cases
export type Blog = BlogList | BlogDetail;
