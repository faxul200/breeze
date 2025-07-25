const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 설정
const supabaseUrl = process.env.SUPABASE_URL || 'https://daeqwvmuhupwdgtltwad.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXF3dm11aHVwd2RndGx0d2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODA1MTksImV4cCI6MjA2NjI1NjUxOX0.6rBbmiFZqIBhhyRcXnk7y2wiKPZQPLeCjNYBMV72Y34';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function onRequest({ request }) {
    try {
    try {
        // URL에서 포스트 ID 가져오기
        const url = new URL(request.url);
        const postId = url.searchParams.get('id');
        
        if (!postId) {
            return new Response('Post ID is required', { status: 400 });
        }

        // 포스트 데이터 가져오기
        const { data: post, error: postError } = await supabase
            .from('tb_blog_posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (postError) {
            return new Response('Error fetching post', { status: 500 });
        }

        if (!post) {
            return new Response('Post not found', { status: 404 });
        }

        // 포스트 HTML 읽기
        const postHtml = await fetch('https://faxul.co.kr/posts/post.html');
        const postContent = await postHtml.text();

        // 타이틀 업데이트
        const title = `${post.title} - faxul 골프공 리뷰 블로그`;
        const updatedHtml = postContent
            .replace('<title data-post-title>포스트 제목 - faxul 골프공 리뷰 블로그</title>',
                      `<title data-post-title>${title}</title>`)
            .replace('<meta name="description" content="" data-post-summary>',
                     `<meta name="description" content="${post.summary}" data-post-summary>`)
            .replace('<meta name="keywords" content="" data-post-tags>',
                     `<meta name="keywords" content="${post.tags}" data-post-tags>`)
            .replace('<meta property="og:title" content="" data-post-title>',
                     `<meta property="og:title" content="${title}" data-post-title>`)
            .replace('<meta property="og:description" content="" data-post-summary>',
                     `<meta property="og:description" content="${post.summary}" data-post-summary>`)
            .replace('<meta property="article:published_time" content="" data-post-published>',
                     `<meta property="article:published_time" content="${new Date(post.created_at).toISOString()}" data-post-published>`);

        return new Response(updatedHtml, {
            headers: {
                'Content-Type': 'text/html; charset=UTF-8',
                'Cache-Control': 'public, max-age=3600', // 1시간 캐시
            },
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
