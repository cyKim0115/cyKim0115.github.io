// AOS (Animate On Scroll) 초기화
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true
    });
});

// 테마(다크/라이트) 전환 - 초기 상태는 <head> 인라인 스크립트에서 설정
document.addEventListener('DOMContentLoaded', function () {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (toggleBtn) {
            const isDark = theme === 'dark';
            toggleBtn.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
            toggleBtn.setAttribute('title', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
            toggleBtn.setAttribute('aria-pressed', String(isDark));
        }
    }

    applyTheme(root.getAttribute('data-theme') || 'light');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try {
                localStorage.setItem('theme', next);
            } catch (e) { /* 저장 실패는 무시 */ }
        });
    }

    // 사용자가 직접 선택한 적이 없으면 OS 테마 변경을 따라감
    if (window.matchMedia) {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = function (e) {
            let saved = null;
            try { saved = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
            if (saved) return;
            applyTheme(e.matches ? 'dark' : 'light');
        };
        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', handleSystemThemeChange);
        } else if (typeof mql.addListener === 'function') {
            mql.addListener(handleSystemThemeChange);
        }
    }
});

// 스크롤 시 활성 섹션 판정에 사용할 상단 오프셋 (헤더 여백 등 고려)
const SCROLL_OFFSET = 100;

// 페이지 내 절대 좌표 계산 (offsetTop은 positioned 부모 기준이라 부정확하므로 사용 금지)
function getAbsoluteTop(element) {
    return element.getBoundingClientRect().top + window.pageYOffset;
}

// 공통 스크롤 함수 - 모든 in-page 네비게이션은 이 함수를 거치도록 통일
function scrollToSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return false;

    const targetPosition = getAbsoluteTop(targetSection) - SCROLL_OFFSET;
    window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
    });
    return true;
}

// 헤더 섹션 패럴럭스 효과
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header-section');
    if (header) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        header.style.transform = `translateY(${parallax}px)`;
    }
});

// 프로젝트 카드 호버 전환 효과
document.querySelectorAll('.project-card, .project-card-clickable').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// 프로젝트 카드 클릭 시 상세 영역으로 스크롤
document.querySelectorAll('.project-card-clickable').forEach(card => {
    card.addEventListener('click', function(e) {
        // 내부 버튼(스토어 링크 등) 클릭은 무시
        if (e.target.closest('.project-links')) return;

        const projectDetailId = this.getAttribute('data-project-detail');
        if (projectDetailId) {
            scrollToSection(projectDetailId);
        }
    });
});

// Contact 버튼 클릭 로그 (분석/추적용 훅)
document.querySelectorAll('#contact .btn').forEach(button => {
    button.addEventListener('click', function() {
        console.log('Contact button clicked:', this.textContent.trim());
    });
});

// 사이드바 네비게이션
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // 사이드바 링크 순서와 일치해야 함 (HTML 등장 순)
    const sectionIds = [
        'header',
        'about',
        'featured-projects-header',
        'company-maximizer-project-1',
        'company-ninedigits-project-1',
        'company-ninedigits-project-2',
        'company-ninedigits-project-3',
        'ninedigits-minor-projects',
        'company-cookapps-project-1',
        'company-cookapps-project-2',
        'company-preflow-project-1',
        'contact'
    ];

    const sections = sectionIds
        .map(id => ({ id, element: document.getElementById(id) }))
        .filter(section => section.element !== null);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (scrollToSection(targetId)) {
                updateActiveLink(this);
            }
        });
    });

    function updateActiveLink(activeLink) {
        sidebarLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function handleScroll() {
        // 화면 상단에서 SCROLL_OFFSET 만큼 아래 지점이 어느 섹션에 속하는지 판정
        const viewportTop = window.scrollY + SCROLL_OFFSET + 50;

        let currentSection = sections[0];
        for (const section of sections) {
            const sectionTop = getAbsoluteTop(section.element);
            if (viewportTop >= sectionTop) {
                currentSection = section;
            } else {
                break;
            }
        }

        // 페이지 최하단 도달 시 마지막 섹션(Contact) 활성화 보장
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        if (window.scrollY + winHeight >= docHeight - 2) {
            currentSection = sections[sections.length - 1];
        }

        if (currentSection) {
            const correspondingLink = document.querySelector(
                `.sidebar-link[href="#${currentSection.id}"]`
            );
            if (correspondingLink) {
                updateActiveLink(correspondingLink);
            }
        }
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    handleScroll();
});
