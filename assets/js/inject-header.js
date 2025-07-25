// assets/js/inject-header.js
// 모든 페이지에 공통 header를 동적으로 삽입

document.addEventListener('DOMContentLoaded', async function() {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    // 현재 경로에 따라 상대 경로 및 active 메뉴 설정
    let root = '', about = 'pages/about.html', aboutActive = '';
    const path = window.location.pathname;
    if (path.includes('/posts/')) {
        root = '../';
        about = '../pages/about.html';
    } else if (path.includes('/pages/')) {
        root = '../';
        about = 'about.html';
        aboutActive = ' active';
    }

    // header.html 불러오기
    const resp = await fetch(root + 'assets/partials/header.html');
    let html = await resp.text();

    // 변수 치환
    html = html.replace(/{{root}}/g, root)
               .replace(/{{about}}/g, about)
               .replace(/{{aboutActive}}/g, aboutActive);

    placeholder.outerHTML = html;

    // 헤더 삽입 후 이벤트 바인딩 (다크모드, 모바일 메뉴)
    if (typeof window.initHeaderEvents === 'function') {
        window.initHeaderEvents();
    }

    // 검색 기능 비활성화 (메인 페이지가 아닌 경우)
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const isMainPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const isPostPage = window.location.pathname.includes('post.html');

    if (!isMainPage || isPostPage) {
        if (searchInput) {
            searchInput.disabled = true;
            searchInput.style.opacity = '0.5';
            searchInput.style.cursor = 'not-allowed';
        }
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.style.opacity = '0.5';
            searchBtn.style.cursor = 'not-allowed';
        }
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // 헤더 삽입 후 블로그 목록 렌더링
    if (typeof fetchAndRenderBlogPosts === 'function') {
        fetchAndRenderBlogPosts();
    }
});
