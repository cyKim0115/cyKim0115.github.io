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

