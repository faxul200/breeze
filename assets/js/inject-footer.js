// assets/js/inject-footer.js
// 모든 페이지에 공통 footer를 동적으로 삽입

document.addEventListener('DOMContentLoaded', async function() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    // 현재 경로에 따라 상대 경로 및 about 링크 설정
    let root = '', about = 'pages/about.html';
    const path = window.location.pathname;
    if (path.includes('/posts/')) {
        root = '../';
        about = '../pages/about.html';
    } else if (path.includes('/pages/')) {
        root = '../';
        about = 'about.html';
    }

    // footer.html 불러오기
    const resp = await fetch(root + 'assets/partials/footer.html');
    let html = await resp.text();

    // 변수 치환
    html = html.replace(/{{about}}/g, about);

    placeholder.outerHTML = html;
});
