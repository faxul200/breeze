// 파비콘 설정
const faviconConfig = {
    path: 'assets/favicon/faxul_favicon.png'
};

// 파비콘 설정 적용 함수
function applyFavicon() {
    // 상대 경로 조정 (현재 페이지의 위치에 따라 경로 조정)
    let basePath = '';
    const path = window.location.pathname;
    
    if (path.includes('/pages/')) {
        basePath = '../';
    } else if (path.includes('/posts/')) {
        basePath = '../';
    }
    
    // 파비콘 링크 요소 생성
    const faviconLinks = [
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: basePath + faviconConfig.path },
        { rel: 'shortcut icon', type: 'image/png', href: basePath + faviconConfig.path },
        { rel: 'apple-touch-icon', href: basePath + faviconConfig.path }
    ];

    // 기존 파비콘 링크 제거
    document.querySelectorAll('link[rel*="icon"], link[rel*="apple-touch-icon"]').forEach(link => {
        link.remove();
    });

    // 새로운 파비콘 링크 추가
    const head = document.getElementsByTagName('head')[0];
    faviconLinks.forEach(linkData => {
        const link = document.createElement('link');
        Object.keys(linkData).forEach(key => {
            link.setAttribute(key, linkData[key]);
        });
        head.appendChild(link);
    });
}

// DOM이 로드된 후 파비콘 적용
document.addEventListener('DOMContentLoaded', applyFavicon);
