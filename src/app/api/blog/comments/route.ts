import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
    }
  );

  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to comment' },
        { status: 401 }
      );
    }

    const { blogId, content } = await request.json();

    if (!blogId || !content) {
      return NextResponse.json(
        { error: 'Blog ID and content are required' },
        { status: 400 }
      );
    }

    // Insert the comment
    const { data: comment, error: insertError } = await supabase
      .from('blog_comments')
      .insert({
        blog_id: blogId,
        content,
        author: user.email, // or user.user_metadata.full_name if available
        user_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      throw insertError;
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error in comment operation:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}