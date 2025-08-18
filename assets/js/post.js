// Supabase 클라이언트 초기화
const supabaseUrl = 'https://daeqwvmuhupwdgtltwad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXF3dm11aHVwd2RndGx0d2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODA1MTksImV4cCI6MjA2NjI1NjUxOX0.6rBbmiFZqIBhhyRcXnk7y2wiKPZQPLeCjNYBMV72Y34';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 글로벌 변수로 포스트 로딩 상태 관리
let isPostLoaded = false;

// URL에서 포스트 ID 가져오기
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// "글 없음" 안내 표시 함수
function showNotFoundMessage() {
    // 기존 포스트 내용 숨기기
    document.getElementById('post-title').style.display = 'none';
    document.getElementById('post-content').innerHTML = '';
    document.getElementById('post-date').textContent = '';
    document.getElementById('post-author').textContent = '';
    document.getElementById('post-image').style.display = 'none';
    document.getElementById('post-tags').style.display = 'none';
    
    // 안내 메시지 표시
    document.getElementById('no-post-message').style.display = 'block';
    
    // 광고 컨테이너 숨기기
    document.getElementById('ads-container').style.display = 'none';
    
    isPostLoaded = false;
}

// 포스트 성공적으로 로드됨을 표시하는 함수
function showPostContent() {
    document.getElementById('post-title').style.display = 'block';
    document.getElementById('no-post-message').style.display = 'none';
    
    isPostLoaded = true;
    
    // 광고 삽입
    insertAdvertisement();
}

// 광고 삽입 함수
function insertAdvertisement() {
    const adsContainer = document.getElementById("ads-container");
    
    // 이미 광고가 삽입되어 있으면 중복 삽입 방지
    if (adsContainer.querySelector('.adsbygoogle')) {
        return;
    }
    
    const ads = document.createElement("ins");
    ads.className = "adsbygoogle";
    ads.style.display = "block";
    ads.setAttribute("data-ad-client", "ca-pub-2930039630594930");
    ads.setAttribute("data-ad-slot", "8210388194");
    ads.setAttribute("data-ad-format", "auto");
    ads.setAttribute("data-full-width-responsive", "true");

    adsContainer.appendChild(ads);
    
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.warn('AdSense 광고 로드 중 오류:', e);
    }
}

// 포스트 데이터 가져오기
async function fetchPost(postId) {
    if (!postId) {
        showNotFoundMessage();
        return;
    }

    try {
        const { data, error } = await supabase
            .from('tb_blog_posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error || !data) {
            console.warn('포스트 없음 또는 DB 오류:', error?.message);
            showNotFoundMessage();
            return;
        }

        // 이미지 표시
        const imageElement = document.getElementById('post-image');
        if (data.image_url) {
            imageElement.src = data.image_url;
            imageElement.style.display = 'block';
        }

        // 제목
        document.getElementById('post-title').textContent = data.title || '제목 없음';

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

        if (metaElements.url) {
            const postId = getPostIdFromUrl();
            if (postId) {
                metaElements.url.setAttribute('content', `${window.location.origin}/posts/post.html?id=${postId}`);
            }
        }

        // 문서 타이틀 업데이트
        document.title = `${data.title} - faxul 골프공 리뷰 블로그`;
        const titleElement = document.querySelector('title[data-post-title]');
        if (titleElement) {
            titleElement.textContent = document.title;
        }

        // 기타 내용 표시
        document.getElementById('post-date').textContent = new Date(data.created_at).toLocaleDateString('ko-KR');
        document.getElementById('post-author').textContent = data.author || '작성자 미지정';
        document.getElementById('post-content').innerHTML = data.content || '';

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

        // 포스트 로드 완료 표시
        showPostContent();

    } catch (err) {
        console.error('포스트 데이터 로딩 중 예외 발생:', err);
        showNotFoundMessage();
    }
}

// 페이지 로드 시 포스트 데이터 가져오기
document.addEventListener('DOMContentLoaded', () => {
    const postId = getPostIdFromUrl();
    fetchPost(postId);
});