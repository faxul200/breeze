// Supabase 클라이언트 초기화
const supabaseUrl = 'https://daeqwvmuhupwdgtltwad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXF3dm11aHVwd2RndGx0d2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODA1MTksImV4cCI6MjA2NjI1NjUxOX0.6rBbmiFZqIBhhyRcXnk7y2wiKPZQPLeCjNYBMV72Y34';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// URL에서 포스트 ID 가져오기
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// 포스트 데이터 가져오기
async function fetchPost(postId) {
    if (!postId) {
        document.getElementById('post-title').textContent = '잘못된 접근';
        document.getElementById('post-content').textContent = '게시글 ID가 없습니다.';
        return;
    }
    try {
        const { data, error } = await supabase
            .from('tb_blog_posts')
            .select('*')
            .eq('id', postId)
            .single();
        
        if (error) throw error;
        
        if (data) {
            // 이미지 표시
            const imageElement = document.getElementById('post-image');
            if (data.image_url) {
                imageElement.src = data.image_url;
                imageElement.style.display = 'block';
            }
            
            // 내용 표시
            document.getElementById('post-title').textContent = data.title;
            
            // SEO 메타데이터 업데이트
            const metaElements = {
                title: document.querySelector('title[data-post-title]'),
                description: document.querySelector('meta[data-post-summary]'),
                keywords: document.querySelector('meta[data-post-tags]'),
                ogTitle: document.querySelector('meta[property="og:title"]'),
                ogDescription: document.querySelector('meta[property="og:description"]'),
                publishedTime: document.querySelector('meta[data-post-published]'),
                url: document.querySelector('meta[property="og:url"]')
            };

            if (data.title) {
                if (metaElements.title) metaElements.title.textContent = data.title;
                if (metaElements.ogTitle) metaElements.ogTitle.setAttribute('content', data.title);
            }
            
            if (data.summary) {
                if (metaElements.description) metaElements.description.setAttribute('content', data.summary);
                if (metaElements.ogDescription) metaElements.ogDescription.setAttribute('content', data.summary);
            }
            
            if (data.tags) {
                if (metaElements.keywords) metaElements.keywords.setAttribute('content', data.tags);
            }
            
            if (data.created_at) {
                const publishedTime = new Date(data.created_at).toISOString();
                if (metaElements.publishedTime) metaElements.publishedTime.setAttribute('content', publishedTime);
            }
            
            // URL 업데이트
            if (metaElements.url) {
                const currentUrl = metaElements.url.getAttribute('content');
                const postId = getPostIdFromUrl();
                if (postId) {
                    metaElements.url.setAttribute('content', `${currentUrl}${postId}`);
                }
            }
            
            // 타이틀 업데이트
            document.title = `${data.title} - faxul 골프공 리뷰 블로그`;
            const titleElement = document.querySelector('title[data-post-title]');
            if (titleElement) {
                titleElement.textContent = document.title;
            }
            
            // 기타 내용 표시
            document.getElementById('post-date').textContent = new Date(data.created_at).toLocaleDateString('ko-KR');
            document.getElementById('post-author').textContent = data.author || '작성자 미지정';
            document.getElementById('post-content').innerHTML = data.content;
            
            // 태그 표시
            const tagsContainer = document.getElementById('post-tags');
            if (data.tags) {
                const tagsHtml = data.tags.split(',').map(tag => `
                    <span class="post-tag">${tag.trim()}</span>
                `).join('');
                tagsContainer.innerHTML = tagsHtml;
                tagsContainer.style.display = '';
            } else {
                tagsContainer.innerHTML = '';
                tagsContainer.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('포스트 데이터 로딩 중 오류:', error);
        document.getElementById('post-title').textContent = '오류 발생';
        document.getElementById('post-content').textContent = error.message;
    }
}

// 페이지 로드 시 포스트 데이터 가져오기
document.addEventListener('DOMContentLoaded', () => {
    const postId = getPostIdFromUrl();
    if (postId) {
        fetchPost(postId);
    }
});
