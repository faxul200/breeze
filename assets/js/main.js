// 다크 모드 토글 기능
document.addEventListener('DOMContentLoaded', function() {
    // 다크 모드 토글 버튼
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
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
    
    // 테마 토글 이벤트
    themeToggle.addEventListener('click', function() {
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
    });
    
    // 모바일 메뉴 토글
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // 동적 게시물 로딩 함수
    loadBlogPosts();
});

// 블로그 게시물 데이터 (실제로는 서버에서 가져오거나 JSON 파일로 관리)
const blogPosts = [
    {
        id: 1,
        title: '첫 번째 블로그 게시물',
        date: '2025년 3월 13일',
        excerpt: '이것은 첫 번째 블로그 게시물의 요약입니다. 여기에는 게시물의 간략한 내용이 들어갑니다.',
        image: 'assets/images/placeholder-1.jpg',
        url: 'posts/post1.html',
        featured: true,
        tag: '특별 게시물'
    },
    {
        id: 2,
        title: '두 번째 블로그 게시물',
        date: '2025년 3월 12일',
        excerpt: '이것은 두 번째 블로그 게시물의 요약입니다. 여기에는 게시물의 간략한 내용이 들어갑니다.',
        image: 'assets/images/placeholder-2.jpg',
        url: 'posts/post2.html'
    },
    {
        id: 3,
        title: '세 번째 블로그 게시물',
        date: '2025년 3월 11일',
        excerpt: '이것은 세 번째 블로그 게시물의 요약입니다. 여기에는 게시물의 간략한 내용이 들어갑니다.',
        image: 'assets/images/placeholder-3.jpg',
        url: 'posts/post3.html'
    }
];

// 블로그 게시물 로딩 함수
function loadBlogPosts() {
    const postsGrid = document.querySelector('.posts-grid');
    const featuredPostContainer = document.querySelector('.featured-post-container');
    
    if (!postsGrid || !featuredPostContainer) return;
    
    // 특별 게시물 찾기
    const featuredPost = blogPosts.find(post => post.featured);
    
    // 특별 게시물이 있으면 표시
    if (featuredPost) {
        featuredPostContainer.innerHTML = `
            <div class="featured-post">
                <div class="featured-image">
                    <img src="${featuredPost.image}" alt="${featuredPost.title}">
                </div>
                <div class="featured-content">
                    <span class="featured-tag">${featuredPost.tag || '특별 게시물'}</span>
                    <h2 class="featured-title">${featuredPost.title}</h2>
                    <p class="featured-excerpt">${featuredPost.excerpt}</p>
                    <p class="post-date">${featuredPost.date}</p>
                    <a href="${featuredPost.url}" class="read-more">더 읽기</a>
                </div>
            </div>
        `;
    }
    
    // 일반 게시물 표시 (특별 게시물 제외)
    const regularPosts = blogPosts.filter(post => !post.featured);
    
    regularPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="post-content">
                <p class="post-date">${post.date}</p>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="${post.url}" class="read-more">더 읽기</a>
            </div>
        `;
        postsGrid.appendChild(postElement);
    });
}

// 새 게시물 추가 함수
function addNewPost(post) {
    blogPosts.unshift(post); // 배열 맨 앞에 추가
    
    // 로컬 스토리지에 저장 (실제로는 서버에 저장)
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    
    // 화면 갱신
    const postsGrid = document.querySelector('.posts-grid');
    if (postsGrid) {
        postsGrid.innerHTML = ''; // 기존 게시물 지우기
        loadBlogPosts(); // 게시물 다시 로드
    }
}
