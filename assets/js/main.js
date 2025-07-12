// 다크 모드 및 헤더 이벤트 바인딩 함수
window.initHeaderEvents = function() {
    // 다크 모드 토글 버튼
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    if (!themeToggle || !moonIcon || !sunIcon) return;

    // 저장된 테마 확인
    const savedTheme = localStorage.getItem('theme');
    // 저장된 테마가 있으면 적용
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline';
    } else {
        moonIcon.style.display = 'inline';
        sunIcon.style.display = 'none';
    }

    // 테마 토글 이벤트 (중복 방지)
    themeToggle.onclick = function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline';
        } else {
            localStorage.setItem('theme', 'light');
            moonIcon.style.display = 'inline';
            sunIcon.style.display = 'none';
        }
    };

    // 모바일 메뉴 토글
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.onclick = function() {
            navMenu.classList.toggle('active');
        };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.initHeaderEvents === 'function') {
        window.initHeaderEvents();
    }
    // 동적 게시물 로딩 함수
    // fetchAndRenderBlogPosts();
});

// Supabase 연동
const supabaseUrl = 'https://daeqwvmuhupwdgtltwad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXF3dm11aHVwd2RndGx0d2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODA1MTksImV4cCI6MjA2NjI1NjUxOX0.6rBbmiFZqIBhhyRcXnk7y2wiKPZQPLeCjNYBMV72Y34';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 블로그 게시물 동적 로딩
async function fetchAndRenderBlogPosts() {
    const postsGrid = document.querySelector('.posts-grid');
    const featuredPostContainer = document.querySelector('.featured-post-container');
    
    if (!postsGrid || !featuredPostContainer) return;
    
        // 데이터 가져오기
    const { data: blogPosts, error } = await supabase
        .from('tb_blog_posts')
        .select('*')
        .eq('display_yn', 'Y')
        .order('created_at', { ascending: false });
    if (error) {
        postsGrid.innerHTML = '<p>블로그 글을 불러오는 중 오류가 발생했습니다.</p>';
        return;
    }
    // featured-post: featured=true인 글이 있으면 그 글, 없으면 최신글
    let featuredPost = blogPosts.find(post => post.featured);
    if (!featuredPost && blogPosts.length > 0) {
        featuredPost = blogPosts[0];
    }
    if (featuredPost) {
        // 모바일에서 최신글도 일반 블로그카드와 동일하게 렌더링, 특별 게시물 태그는 모바일에서 제외
        const isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (isMobile) {
            featuredPostContainer.innerHTML = `
                <div class="post-card">
                    <a href="posts/post.html?id=${featuredPost.id}" class="post-card-link">
                        <div class="post-image">
                            <img src="${featuredPost.image_url || 'assets/images/default.jpg'}" alt="${featuredPost.title}">
                        </div>
                        <div class="post-content">
                            <p class="post-date">${new Date(featuredPost.created_at).toLocaleDateString('ko-KR')}</p>
                            <h3 class="post-title">${featuredPost.title}</h3>
                            <p class="post-excerpt">${featuredPost.excerpt || ''}</p>
                            ${featuredPost.summary ? `<div class="post-summary">${featuredPost.summary}</div>` : ''}
                        </div>
                    </a>
                </div>
            `;
        } else {
            featuredPostContainer.innerHTML = `
                <a href="posts/post.html?id=${featuredPost.id}" class="featured-post-link">
                    <div class="featured-post">
                        <div class="post-image">
                            <img src="${featuredPost.image_url || 'assets/images/default.jpg'}" alt="${featuredPost.title}">
                        </div>
                        <div class="post-content">
                            <span class="featured-tag">최신 게시물</span>
                            <h2 class="post-title">${featuredPost.title}</h2>
                            <p class="post-excerpt">${featuredPost.excerpt || ''}</p>
                            ${featuredPost.summary ? `<div class="post-summary">${featuredPost.summary}</div>` : ''}
                            <p class="post-date">${new Date(featuredPost.created_at).toLocaleDateString('ko-KR')}</p>
                        </div>
                    </div>
                </a>
            `;
        }
    } else {
        featuredPostContainer.innerHTML = '';
    }
    
    // posts-grid: featured-post로 쓴 글을 제외한 나머지만 표시
    postsGrid.innerHTML = '';
    blogPosts.filter(post => post.id !== (featuredPost && featuredPost.id)).forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <a href="posts/post.html?id=${post.id}" class="post-card-link">
                <div class="post-image">
                    <img src="${post.image_url || 'assets/images/default.jpg'}" alt="${post.title}">
                </div>
                <div class="post-content">
                    <p class="post-date">${new Date(post.created_at).toLocaleDateString('ko-KR')}</p>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt || ''}</p>
${post.summary ? `<div class="post-summary">${post.summary}</div>` : ''}
                </div>
            </a>
        `;
        postsGrid.appendChild(postElement);
    });
}

