import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Topic, Comment } from '@/types/topics';

export async function GET(request: NextRequest) {
  console.log('Creating Supabase client...');
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
      db: {
        schema: 'public'
      },
      auth: {
        persistSession: false
      }
    }
  );

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  console.log('Fetching topic with ID:', id);

  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Topic ID is required' },
        { status: 400 }
      );
    }

    // Convert ID to number and validate
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid topic ID format' },
        { status: 400 }
      );
    }

    console.log('Querying topics table...');
    // Get single topic with comments
    const { data: topic, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .eq('id', numericId)
      .single();

    if (topicError) {
      console.error('Topic query error:', topicError);
      throw topicError;
    }

    console.log('Topic found:', topic);
    console.log('Querying comments...');

    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select(`
        id,
        topic_id,
        content,
        author,
        created_at,
        likes
      `)
      .eq('topic_id', numericId)
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.error('Comments query error:', commentsError);
      throw commentsError;
    }

    console.log('Comments found:', comments);
    const response = {
      ...topic,
      comments: Array.isArray(comments) ? comments : []
    };
    console.log('Sending response:', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching topic:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      raw: error
    });

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal Server Error',
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
        },
      },
      db: {
        schema: 'public'
      },
      auth: {
        persistSession: false
      }
    }
  );
  
  const searchParams = request.nextUrl.searchParams;
  const topicId = searchParams.get('id');

  if (!topicId) {
    return NextResponse.json(
      { error: 'Topic ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { content, author } = body;

    if (!content || !author) {
      return NextResponse.json(
        { error: 'Content and author are required' },
        { status: 400 }
      );
    }

    // Convert ID to number and validate
    const numericId = parseInt(topicId, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid topic ID format' },
        { status: 400 }
      );
    }

    console.log('Inserting comment:', { topic_id: numericId, content, author });
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          topic_id: numericId,
          content,
          author
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Comment insertion error:', error);
      throw error;
    }

    console.log('Comment inserted:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error posting comment:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      raw: error
    });

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal Server Error',
        details: error
      },
      { status: 500 }
    );
  }
}
