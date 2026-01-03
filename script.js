// AOS (Animate On Scroll) 초기화
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,         // 애니메이션 지속 시간 (밀리초)
        once: true             // 한 번만 애니메이션 실행 (스크롤 다시 올려도 재실행 안 함)
    });
});

// 부드러운 스크롤 (네비게이션 링크용 - 필요시 사용)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 헤더 섹션 스크롤 효과 (선택사항)
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header-section');
    if (header) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        header.style.transform = `translateY(${parallax}px)`;
    }
});

// 프로젝트 카드 호버 효과 강화 (선택사항)
document.querySelectorAll('.project-card, .project-card-clickable').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// 프로젝트 카드 클릭 시 상세 영역으로 스크롤
document.querySelectorAll('.project-card-clickable').forEach(card => {
    card.addEventListener('click', function(e) {
        // 버튼 클릭이 아닌 경우에만 스크롤
        if (!e.target.closest('.project-links')) {
            const projectDetailId = this.getAttribute('data-project-detail');
            if (projectDetailId) {
                const targetSection = document.getElementById(projectDetailId);
                if (targetSection) {
                    const offset = 80; // 헤더 높이 고려
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
});

// 연락 버튼 클릭 이벤트 (선택사항 - 분석이나 추적을 위해)
document.querySelectorAll('#contact .btn').forEach(button => {
    button.addEventListener('click', function() {
        // 여기에 Google Analytics나 다른 추적 코드를 추가할 수 있습니다
        console.log('Contact button clicked:', this.textContent.trim());
    });
});

// 사이드바 네비게이션 기능
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // 감지할 섹션들 (순서대로)
    const sections = [
        { id: 'header', element: document.getElementById('header') },
        { id: 'about', element: document.getElementById('about') },
        { id: 'featured-projects-header', element: document.getElementById('featured-projects-header') },
        { id: 'company-ninedigits-project-1', element: document.getElementById('company-ninedigits-project-1') },
        { id: 'company-ninedigits-project-2', element: document.getElementById('company-ninedigits-project-2') },
        { id: 'company-ninedigits-project-3', element: document.getElementById('company-ninedigits-project-3') },
        { id: 'ninedigits-minor-projects', element: document.getElementById('ninedigits-minor-projects') },
        { id: 'company-cookapps-project-1', element: document.getElementById('company-cookapps-project-1') },
        { id: 'company-cookapps-project-2', element: document.getElementById('company-cookapps-project-2') },
        { id: 'company-preflow-project-1', element: document.getElementById('company-preflow-project-1') },
        { id: 'contact', element: document.getElementById('contact') }
    ].filter(section => section.element !== null);
    
    // 링크 클릭 시 해당 섹션으로 스크롤
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // # 제거
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 정확한 위치 계산
                const rect = targetSection.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = rect.top + scrollTop - 100; // 상단 여백 100px
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // 클릭한 링크 활성화
                updateActiveLink(this);
            }
        });
    });
    
    // 현재 보이는 섹션에 따라 활성 링크 업데이트
    function updateActiveLink(activeLink) {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // 스크롤 시 현재 보이는 섹션 감지
    function handleScroll() {
        const viewportTop = window.scrollY - 1500; // 뷰포트 상단에서 150px 지점
        
        let currentSection = null;
        
        // 섹션들을 역순으로 확인 (아래쪽 섹션부터)
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const sectionTop = section.element.offsetTop;
            const sectionHeight = section.element.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // 헤더 섹션은 특별 처리
            if (section.id === 'header') {
                if (viewportTop < sections[1].element.offsetTop) {
                    currentSection = section;
                    break;
                }
            }
            // Featured Projects 섹션 - 높이가 크므로 넓은 범위로 감지
            else if (section.id === 'projects') {
                // 프로젝트 섹션 전체를 감지 (카드 영역까지 포함)
                if (viewportTop >= sectionTop && viewportTop < sectionBottom) {
                    currentSection = section;
                    break;
                }
            }
            // Contact 섹션 - 높이가 작으므로 더 정확한 감지 필요
            else if (section.id === 'contact') {
                // Contact 섹션의 상단 200px 지점부터 감지 시작
                const contactThreshold = sectionTop - 200;
                if (viewportTop >= contactThreshold && viewportTop < sectionBottom) {
                    currentSection = section;
                    break;
                }
            }
            // 다른 섹션들 - 뷰포트 상단이 섹션의 상단 1/3 지점 이상에 있으면 해당 섹션으로 인식
            else {
                const sectionThreshold = sectionTop + (sectionHeight * 0.3); // 섹션 상단 30% 지점
                if (viewportTop >= sectionTop && viewportTop < sectionThreshold) {
                    // 정확히 해당 섹션
                    currentSection = section;
                    break;
                } else if (viewportTop >= sectionThreshold && viewportTop < sectionBottom) {
                    // 섹션 내부에 있지만, 다음 섹션이 더 가까운지 확인
                    if (i < sections.length - 1) {
                        const nextSection = sections[i + 1];
                        const nextSectionTop = nextSection.element.offsetTop;
                        const distanceToCurrent = viewportTop - sectionTop;
                        const distanceToNext = nextSectionTop - viewportTop;
                        
                        // 현재 섹션의 하단 50% 이상에 있고, 다음 섹션이 더 가까우면 다음 섹션 선택
                        if (viewportTop > sectionTop + (sectionHeight * 0.5) && distanceToNext < distanceToCurrent) {
                            continue; // 다음 섹션 확인
                        }
                    }
                    currentSection = section;
                    break;
                }
            }
        }
        
        if (currentSection) {
            const correspondingLink = document.querySelector(`.sidebar-link[href="#${currentSection.id}"]`);
            if (correspondingLink) {
                updateActiveLink(correspondingLink);
            }
        }
    }
    
    // 스크롤 이벤트 리스너 (throttle 적용)
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
    
    // 초기 활성 링크 설정
    handleScroll();
});

