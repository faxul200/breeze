const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 설정
const supabaseUrl = 'https://daeqwvmuhupwdgtltwad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXF3dm11aHVwd2RndGx0d2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODA1MTksImV4cCI6MjA2NjI1NjUxOX0.6rBbmiFZqIBhhyRcXnk7y2wiKPZQPLeCjNYBMV72Y34';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
    try {
        // 모든 포스트 가져오기
        const { data: posts, error: postsError } = await supabase
            .from('tb_blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        // 기본 페이지들
        const basePages = [
            { loc: 'https://faxul.co.kr', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0' },
            { loc: 'https://faxul.co.kr/pages/about.html', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.8' },
            { loc: 'https://faxul.co.kr/pages/privacy-policy.html', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5' },
            { loc: 'https://faxul.co.kr/pages/terms-of-service.html', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5' }
        ];

        // 포스트 URL 생성
        const postUrls = posts.map(post => ({
            loc: `https://faxul.co.kr/posts/post.html?id=${post.id}`,
            lastmod: new Date(post.created_at).toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.7'
        }));

        // 모든 URL 합치기
        const allUrls = [...basePages, ...postUrls];

        // XML 생성
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `
    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>
`).join('')}
</urlset>`;

        // 파일 저장
        fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');
        console.log('Sitemap generated successfully!');

    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

// 스크립트 실행
generateSitemap();
