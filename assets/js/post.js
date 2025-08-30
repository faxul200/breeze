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

// 구조화된 데이터 업데이트 함수
function updateStructuredData(postData) {
    const structuredDataScript = document.getElementById('structured-data');
    if (!structuredDataScript) return;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postData.title || "골프공 리뷰",
        "description": postData.summary || "다양한 브랜드의 골프공을 리뷰하고 비교하는 블로그 글입니다.",
        "author": {
            "@type": "Person",
            "name": postData.author || "faxul"
        },
        "publisher": {
            "@type": "Organization",
            "name": "faxul 블로그",
            "url": "https://faxul.co.kr",
            "logo": {
                "@type": "ImageObject",
                "url": "https://faxul.co.kr/favicon-32x32.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://faxul.co.kr/posts/post.html?id=${getPostIdFromUrl()}`
        },
        "datePublished": postData.created_at ? new Date(postData.created_at).toISOString() : "",
        "dateModified": postData.updated_at ? new Date(postData.updated_at).toISOString() : new Date(postData.created_at).toISOString()
    };

    // 이미지가 있는 경우 추가
    if (postData.image_url) {
        structuredData.image = {
            "@type": "ImageObject",
            "url": postData.image_url
        };
    }

    // 태그가 있는 경우 키워드로 추가
    if (postData.tags) {
        structuredData.keywords = postData.tags;
    }

    structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
}

// 메타 태그 업데이트 함수 개선
function updateMetaTags(postData) {
    const postId = getPostIdFromUrl();
    const postUrl = `https://faxul.co.kr/posts/post.html?id=${postId}`;
    
    // 제목 업데이트
    if (postData.title) {
        document.title = `${postData.title} - faxul 골프공 리뷰 블로그`;
        
        // Open Graph 제목
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', postData.title);
        
        // Twitter 제목
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', postData.title);
    }
    
    // 설명 업데이트
    if (postData.summary) {
        const description = document.querySelector('meta[name="description"]');
        if (description) description.setAttribute('content', postData.summary);
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', postData.summary);
        
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) twitterDescription.setAttribute('content', postData.summary);
    }
    
    // 키워드 업데이트
    if (postData.tags) {
        const keywords = document.querySelector('meta[name="keywords"]');
        if (keywords) keywords.setAttribute('content', postData.tags);
    }
    
    // URL 업데이트
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', postUrl);
    
    // Canonical URL 업데이트
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', postUrl);
    
    // 발행 시간 업데이트
    if (postData.created_at) {
        const publishedTime = new Date(postData.created_at).toISOString();
        const articlePublished = document.querySelector('meta[property="article:published_time"]');
        if (articlePublished) articlePublished.setAttribute('content', publishedTime);
    }
    
    // 이미지 메타 태그 추가
    if (postData.image_url) {
        // Open Graph 이미지
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
            ogImage = document.createElement('meta');
            ogImage.setAttribute('property', 'og:image');
            document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', postData.image_url);
        
        // Twitter 이미지
        let twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (!twitterImage) {
            twitterImage = document.createElement('meta');
            twitterImage.setAttribute('name', 'twitter:image');
            document.head.appendChild(twitterImage);
        }
        twitterImage.setAttribute('content', postData.image_url);
    }
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
    
    // 404 상태 표시 (SEO용)
    document.title = "페이지를 찾을 수 없습니다 - faxul 블로그";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', "요청하신 페이지를 찾을 수 없습니다.");
    
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
            .eq('display_yn', 'Y')
            .single();

        if (error || !data) {
            console.warn('포스트 없음 또는 DB 오류:', error?.message);
            showNotFoundMessage();
            return;
        }

        // 메타 태그 업데이트
        updateMetaTags(data);
        
        // 구조화된 데이터 업데이트
        updateStructuredData(data);

        // 이미지 표시
        const imageElement = document.getElementById('post-image');
        if (data.image_url) {
            imageElement.src = data.image_url;
            imageElement.style.display = 'block';
        }

        // 제목
        document.getElementById('post-title').textContent = data.title || '제목 없음';

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