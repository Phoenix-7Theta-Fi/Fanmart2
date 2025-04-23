import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { BlogDetail } from '@/types/blog';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        }
      }
    }
  );

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  try {
    // If ID is provided, fetch single blog
    if (id) {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return NextResponse.json(
          { error: 'Invalid blog ID format' },
          { status: 400 }
        );
      }

      const { data: blog, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', numericId)
        .single();

      if (blogError) throw blogError;

      const { data: comments, error: commentsError } = await supabase
        .from('blog_comments')
        .select(`
          id,
          blog_id,
          content,
          author,
          created_at,
          likes
        `)
        .eq('blog_id', numericId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      return NextResponse.json({
        ...blog,
        comments: comments || []
      });
    }

    // If no ID provided, fetch all blogs with pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const { data: blogs, error: blogsError, count } = await supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (blogsError) throw blogsError;

    return NextResponse.json({
      blogs,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Error fetching blog(s):', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch blog(s)',
        details: error
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        }
      }
    }
  );

  try {
    const { blogId } = await request.json();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add comment logic will be implemented here later
    // Like/Unlike logic will be implemented here later

    return NextResponse.json({ message: 'Operation successful' });

  } catch (error) {
    console.error('Error in blog operation:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
