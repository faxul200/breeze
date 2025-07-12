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
            document.title = data.title; // 브라우저 탭 제목도 업데이트
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
