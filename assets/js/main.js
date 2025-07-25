// 검색 기능 초기화 함수
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const postGrid = document.querySelector('.posts-grid');

    if (!searchInput || !searchBtn || !postGrid) return;

    // 검색 버튼 클릭 이벤트
    searchBtn.addEventListener('click', handleSearch);

    // 엔터 키 이벤트
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // 검색 처리 함수
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        // 모든 포스트 숨김
        const allPosts = document.querySelectorAll('.post-card, .featured-post');
        allPosts.forEach(post => {
            post.style.display = 'none';
        });

        // 각 포스트에 대해 검색
        allPosts.forEach(post => {
            const title = post.querySelector('.post-title, .featured-title').textContent.toLowerCase();
            if (title.includes(query)) {
                // 검색 결과에 포함된 포스트 표시
                post.style.display = 'block';
                
                // featured-post일 경우, 기존 스타일 유지
                if (post.classList.contains('featured-post')) {
                    // 기존 스타일 복원
                    post.style.gridColumn = 'span 3';
                    post.style.marginBottom = '2.5rem';
                    post.style.display = 'flex';
                    post.style.flexDirection = 'row';
                    post.style.gap = '2rem';
                    post.style.alignItems = 'stretch';
                    post.style.width = '100%';
                    post.style.maxWidth = '100%';
                    post.style.background = 'linear-gradient(90deg, #f8fafc 60%, #eaf0fa 100%)';
                    post.style.borderRadius = '8px';
                    post.style.overflow = 'hidden';
                    post.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                    post.style.transition = 'box-shadow 0.2s, transform 0.2s';

                    // 이미지 스타일 복원
                    const image = post.querySelector('.post-image');
                    if (image) {
                        image.style.flex = '1 1 0';
                        image.style.width = '50%';
                        image.style.minWidth = '0';
                        image.style.maxWidth = '100%';
                        image.style.aspectRatio = '4/3';
                        image.style.background = '#f4f6fa';
                        image.style.display = 'flex';
                        image.style.justifyContent = 'center';
                        image.style.alignItems = 'center';
                        image.style.overflow = 'hidden';
                        image.style.maxHeight = '340px';
                        image.style.borderRadius = '16px 0 0 16px';
                    }

                    // 컨텐츠 스타일 복원
                    const content = post.querySelector('.post-content');
                    if (content) {
                        content.style.flex = '1 1 0';
                        content.style.width = '50%';
                        content.style.minWidth = '0';
                        content.style.display = 'flex';
                        content.style.flexDirection = 'column';
                        content.style.justifyContent = 'center';
                        content.style.gap = '0.7rem';
                        content.style.padding = '1.5rem 2rem 1.5rem 2rem';
                    }
                }
                post.classList.add('search-result');
            }
        });
    }
}

// 다크 모드 및 헤더 이벤트 바인딩 함수
window.initHeaderEvents = function() {
    // 다크 모드 토글 버튼
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    if (!themeToggle || !moonIcon || !sunIcon) return;

    // 검색 기능 초기화
    initSearchFunctionality();

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
    // 블로그 게시물 로딩
    fetchAndRenderBlogPosts();
});

// Supabase 연동
const supabaseUrl = 'https://daeqwvmuhupwdgtltwad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXF3dm11aHVwd2RndGx0d2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODA1MTksImV4cCI6MjA2NjI1NjUxOX0.6rBbmiFZqIBhhyRcXnk7y2wiKPZQPLeCjNYBMV72Y34';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 카테고리 텍스트 매핑
const categoryTextMap = {
    'distance': '비거리',
    'feel': '타구감',
    'design': '디자인'
};

// URL에서 현재 카테고리 가져오기
function getCurrentCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    return category && ['distance', 'feel', 'design'].includes(category) ? category : null;
}

// 블로그 게시물 동적 로딩
async function fetchAndRenderBlogPosts() {
    const postsGrid = document.querySelector('.posts-grid');
    const featuredPostContainer = document.querySelector('.featured-post-container');
    
    if (!postsGrid || !featuredPostContainer) return;
    
    // 현재 선택된 카테고리
    const currentCategory = getCurrentCategory();
    
    // 카테고리 제목 업데이트
    const categoryTitle = document.querySelector('.category-title');
    if (categoryTitle) {
        categoryTitle.textContent = currentCategory ? categoryTextMap[currentCategory] : '전체';
    }
    
    // 데이터 가져오기
    let query = supabase
        .from('tb_blog_posts')
        .select('*')
        .eq('display_yn', 'Y')
        .order('created_at', { ascending: false });
    
    // 카테고리 필터 적용
    if (currentCategory) {
        query = query.eq('category', currentCategory);
    }
    
    const { data: blogPosts, error } = await query;
    
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

