// ============================================
// 전역 변수 및 초기화
// ============================================
let cursorDot, cursorOutline;
let isDesktop = window.innerWidth > 768;
let mouseX = 0, mouseY = 0;
let isScrolling = false;
let lenis; // (★★ 신규 ★★) Lenis 인스턴스 변수

// ============================================
// (★★ 신규 ★★) Lenis 부드러운 스크롤 초기화
// ============================================
function initLenisScroll() {
    // Lenis 라이브러리가 로드되었는지 확인
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis 스크롤 라이브러리를 찾을 수 없습니다.');
        return;
    }

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing 함수
        smoothTouch: false, // 모바일에서는 기본 스크롤 사용
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 앵커 링크 클릭 시 Lenis로 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // href가 '#'이거나 존재하지 않으면 맨 위로
            if (!href || href === '#') {
                e.preventDefault();
                lenis.scrollTo(0, { duration: 2 });
                return;
            }
            
            // href가 '#'으로 시작하는 ID 링크일 때
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, { offset: -80, duration: 2 }); // 헤더 높이만큼 오프셋
                }
            }
        });
    });
}


// ============================================
// 프리미엄 커스텀 커서 (★★ 수정됨 ★★)
// ============================================
function initCustomCursor() {
    // (★★ 수정 ★★)
    // 화면 크기가 768px 이하(isDesktop=false)일 때,
    // CSS에서 cursor:none으로 설정되어 커서가 사라지는 버그 수정.
    if (!isDesktop) {
        document.body.style.cursor = 'default'; // 기본 커서 강제 표시
        return;
    }
    
    // 데스크톱 환경(isDesktop=true)일 때만 커스텀 커서 생성
    document.body.style.cursor = 'none'; // CSS와 동일하게 none으로 설정

    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(cursorDot);

    cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    cursorOutline.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(cursorOutline);

    let outlineX = 0, outlineY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;

        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        outlineX += (mouseX - outlineX) * 0.12;
        outlineY += (mouseY - outlineY) * 0.12;

        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .quick-icon, .video-card, .gallery-card, .archive-item, .notice-item, .logo, .icon-button, .info-image, .history-image, .simple-slider-card, .cta-card, .cta-nav-btn');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2.5)';
            cursorDot.style.background = 'rgba(212, 165, 116, 0.8)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.8)';
            cursorOutline.style.borderWidth = '3px';
        });

        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.background = '';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderWidth = '2px';
        });

        el.addEventListener('mousedown', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });

        el.addEventListener('mouseup', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.8)';
        });
    });
}

// ============================================
// 프리미엄 로딩 애니메이션
// ============================================
function initLoadingAnimation() {
    const loadingHTML = `
        <div class="loading-overlay">
            <div class="loader-container">
                <svg class="light-path-loader" viewBox="0 0 200 100">
                    <path class="path-line" d="M 10 50 Q 50 80 100 50 T 190 50" 
                          stroke="rgba(212, 165, 116, 0.2)" stroke-width="2" fill="none" stroke-dasharray="2 6" />
                    <circle class="path-light" r="4" fill="var(--primary-gold)" />
                </svg>
                <div class="loading-text">정동야행</div>
                <div class="loading-subtext">밤에 만나는 역사</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);

    const style = document.createElement('style');
    style.textContent = `
        .light-path-loader {
            width: 200px;
            height: 100px;
            margin: 0 auto 10px;
            overflow: visible;
        }
        .path-light {
            offset-path: path("M 10 50 Q 50 80 100 50 T 190 50");
            animation: follow-path 3.5s ease-in-out infinite;
            filter: drop-shadow(0 0 8px var(--primary-gold))
                    drop-shadow(0 0 15px var(--primary-gold));
        }
        .path-line {
            animation: dash-pulse 3.5s ease-in-out infinite;
        }
        .loading-text {
            color: var(--primary-gold);
            font-size: 1.1em;
            font-weight: 500;
            letter-spacing: 2px;
            animation: fadeInOut 2s ease-in-out infinite;
        }
        .loading-subtext {
            color: rgba(212, 165, 116, 0.6);
            font-size: 0.85em;
            letter-spacing: 3px;
            margin-top: 10px;
            animation: flicker 3s ease-in-out infinite;
        }
        @keyframes follow-path {
            0% { offset-distance: 0%; opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes dash-pulse {
            0%, 100% { stroke: rgba(212, 165, 116, 0.2); }
            50% { stroke: rgba(212, 165, 116, 0.4); }
        }
        @keyframes flicker {
            0%, 100% { opacity: 0.6; }
            20% { opacity: 1; }
            30% { opacity: 0.7; }
            50% { opacity: 1; }
            70% { opacity: 0.5; }
            90% { opacity: 0.9; }
        }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('load', () => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => loadingOverlay.remove(), 800);
        }, 1500);
    });
}

// ============================================
// 향상된 헤더 스크롤 효과
// ============================================
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                if (currentScroll > lastScroll && currentScroll > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// 프리미엄 Hero 배경 슬라이더
// ============================================
function initHeroSlider() {
    const slideTexts = [
        {
            line0: "밤에 만나는 역사",
            line1: '<span class="highlight">夜行</span>, 시간여행',
            line2: "정동의 역사 속으로 떠나는 특별한 야행 투어"
        },
        {
            line0: "두 번째 슬라이드",
            line1: '<span class="highlight">빛</span>의 축제',
            line2: "정동의 밤을 밝히는 아름다운 조명"
        },
        {
            line0: "세 번째 슬라이드",
            line1: '<span class="highlight">역사</span>의 숨결',
            line2: "대한제국의 이야기를 따라 걷습니다"
        },
        {
            line0: "네 번째 슬라이드",
            line1: '<span class="highlight">함께</span>하는 밤',
            line2: "잊을 수 없는 추억을 만들어보세요"
        }
    ];

    const hero = document.querySelector('.hero');
    const slides = document.querySelectorAll('.hero-bg-slide');
    const paginationContainer = document.querySelector('.hero-pagination');
    const heroTextOriginal = document.querySelector('.hero-text'); 
    
    if (!hero || slides.length === 0 || !paginationContainer || !heroTextOriginal) {
        console.warn('Hero 슬라이더 초기화 실패. (필수 요소 없음)');
        return;
    }

    let heroTextCurrent = heroTextOriginal; 
    let currentSlide = 0;
    let dots = [];
    let slideInterval;

    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.className = 'hero-pagination-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        
        dot.addEventListener('click', () => {
            if (index !== currentSlide) {
                showSlide(index);
                resetInterval();
            }
        });
        
        paginationContainer.appendChild(dot);
        dots.push(dot);
    });

    function showSlide(index) {
        currentSlide = index;

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                void slide.offsetWidth;
                slide.classList.add('active');
            }
        });
        
        const newText = slideTexts[index % slideTexts.length];
        const newHeroText = heroTextOriginal.cloneNode(true);
        
        const line0 = newHeroText.querySelector('.hero-line-0');
        const line1 = newHeroText.querySelector('.hero-line-1');
        const line2 = newHeroText.querySelector('.hero-line-2');

        if (line0) line0.innerHTML = newText.line0;
        if (line1) line1.innerHTML = newText.line1;
        if (line2) line2.innerHTML = newText.line2;

        hero.replaceChild(newHeroText, heroTextCurrent);
        heroTextCurrent = newHeroText;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 10000); 
    }

    showSlide(0); 
    resetInterval();
}

// ============================================
// 모바일 메뉴 기능
// ============================================
function initMobileMenu() {
    const trigger = document.querySelector('.mobile-menu-trigger');
    const menu = document.querySelector('nav');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('mobile-menu-open');
        trigger.setAttribute('aria-expanded', isOpen);
        const icon = trigger.querySelector('i');
        if (isOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            trigger.setAttribute('aria-label', '메뉴 닫기');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            trigger.setAttribute('aria-label', '메뉴 열기');
        }
    });

    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('mobile-menu-open');
            trigger.setAttribute('aria-expanded', false);
            const icon = trigger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            trigger.setAttribute('aria-label', '메뉴 열기');
        });
    });
}

// ============================================
// 고급 스크롤 리빌 애니메이션
// ============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.intro, .stats-section, .info-section, .youtube-section, .tour-gallery-section, .history-section, .cta-section, .archive-section, .notice-section');
    if (!revealElements.length) return;

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, 100);
                 // observer.unobserve(entry.target); // 계속 활성화되도록 주석 처리
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    const cards = document.querySelectorAll('.quick-icon, .video-card, .archive-item');
    if (!cards.length) return;
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                 setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, (index % 5) * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        cardObserver.observe(card);
    });
}

// ============================================
// 통계 카운터 애니메이션
// ============================================
function initStatsCounter() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const animateCount = (el, duration = 2500) => {
        const targetText = el.textContent;
        const target = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.replace(/[0-9,]/g, '');

        if (isNaN(target)) return;

        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            let currentNum = Math.floor(easedProgress * target);

            if (target >= 1000) {
                el.textContent = currentNum.toLocaleString() + suffix;
            } else {
                el.textContent = currentNum + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        };

        el.textContent = "0" + suffix;
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stats-number');
                counters.forEach(counter => {
                     if (!counter.dataset.animated) {
                        animateCount(counter);
                        counter.dataset.animated = 'true';
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(statsSection);
}

// ============================================
// 프리미엄 비디오 카드 인터랙션 (★★ 수정됨 ★★)
// ============================================
function initVideoCards() {
    const videoWrappers = document.querySelectorAll('.video-iframe-wrapper');

    videoWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            let videoUrl = wrapper.getAttribute('data-src'); // (1) URL 가져오기
            if (!videoUrl) {
                console.error('Video data-src not found.');
                return;
            }

            // (★★ 여기부터 수정됨 ★★)
            // 유튜브 오류 153 (구성 오류)은 대부분 'origin' 문제 때문입니다.
            // JavaScript로 iframe을 생성할 때, 현재 도메인(origin) 정보를 명시적으로 추가해줍니다.
            try {
                const currentOrigin = window.location.origin;
                
                // 'null' (file://)이 아닌 유효한 origin일 경우에만 추가합니다.
                if (currentOrigin && currentOrigin !== 'null') {
                    // URL에 이미 파라미터가 있으므로 '&'를 사용합니다.
                    videoUrl += `&origin=${encodeURIComponent(currentOrigin)}`;
                }
            } catch (e) {
                console.warn('Could not append origin to video URL:', e);
            }
            // (★★ 여기까지 수정됨 ★★)

            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', videoUrl); // (2) 수정된 URL 설정
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', 'true');
            
            wrapper.appendChild(iframe);

            // (★★ 신규 ★★) :has() CSS를 지원하지 않는 브라우저를 위해
            // JS가 직접 재생 아이콘을 숨깁니다.
            const playIcon = wrapper.querySelector('.video-play-icon');
            if (playIcon) {
                playIcon.style.display = 'none';
            }

        }, { once: true });
    });
}


// ============================================
// 향상된 갤러리 슬라이더
// ============================================
function initGallerySlider() {
    const wrapper = document.querySelector('.gallery-wrapper');
    const track = wrapper?.querySelector('.gallery-track');
    const prevBtn = wrapper?.querySelector('.gallery-btn.prev');
    const nextBtn = wrapper?.querySelector('.gallery-btn.next');
    const cards = track ? Array.from(track.querySelectorAll('.gallery-card')) : [];

    if (!wrapper || !track || cards.length === 0 || !prevBtn || !nextBtn) {
        return;
    }

    let idx = 0;
    let perView = isDesktop ? 4 : 2;
    let gap = 25;
    let max = Math.max(0, cards.length - perView);

    function updateSlider() {
        if (cards.length === 0) return;
        const cardWidth = cards[0].offsetWidth;
        const moveDistance = (cardWidth + gap) * idx;

        track.style.transform = `translateX(-${moveDistance}px)`;
        prevBtn.classList.toggle('disabled', idx <= 0);
        nextBtn.classList.toggle('disabled', idx >= max);
    }

    prevBtn.addEventListener('click', () => {
        if (idx > 0) {
            idx--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (idx < max) {
            idx++;
            updateSlider();
        }
    });

    let startX = 0, endX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', () => {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && idx < max) idx++;
            if (diff < 0 && idx > 0) idx--;
            updateSlider();
        }
        startX = 0;
        endX = 0;
    });

    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth > 768;
        perView = isDesktop ? 4 : 2;
        gap = 25;
        max = Math.max(0, cards.length - perView);
        if (idx > max) idx = max;
        updateSlider();
    }, { passive: true });

    updateSlider();
}

// ============================================
// 고급 패럴랙스 효과
// ============================================
function initParallaxEffects() {
    if (!isDesktop) return; // 데스크톱에서만 실행

    const infoImage = document.querySelector('.info-image');
    const historyImages = document.querySelectorAll('.history-image');

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (infoImage) {
                    const rect = infoImage.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const progress = (window.innerHeight - rect.top) / window.innerHeight;
                        infoImage.style.backgroundPositionY = `${progress * 30}%`;
                    }
                }

                historyImages.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        // 스크롤에 따라 살짝 위로 움직이는 효과
                        img.style.transform = `translateY(${ (rect.top - window.innerHeight) * 0.1 }px)`;
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// 향상된 공지사항 인터랙션
// ============================================
function initNoticeInteraction() {
    const noticeItems = document.querySelectorAll('.notice-item');
    if (!noticeItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, (index % 4) * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    noticeItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(item);

        item.addEventListener('click', function(event) {
            // 리플 효과
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute; border-radius: 50%;
                background: rgba(212, 165, 116, 0.4);
                width: 20px; height: 20px;
                animation: ripple-effect 0.6s ease-out;
                pointer-events: none; transform: scale(0);
            `;
            const rect = this.getBoundingClientRect();
            ripple.style.left = (event.clientX - rect.left - 10) + 'px';
            ripple.style.top = (event.clientY - rect.top - 10) + 'px';

            this.style.position = 'relative';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    const style = document.createElement('style');
    if (!document.querySelector('#ripple-style')) {
        style.id = 'ripple-style';
        style.textContent = `@keyframes ripple-effect { to { transform: scale(10); opacity: 0; } }`;
        document.head.appendChild(style);
    }
}

// ============================================
// 프리미엄 Scroll to Top
// ============================================
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', '맨 위로');
    document.body.appendChild(scrollBtn);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.pageYOffset > 400) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    scrollBtn.addEventListener('click', () => {
        // (★★ 수정 ★★) Lenis가 있으면 Lenis로 스크롤
        if (lenis) {
            lenis.scrollTo(0, { duration: 2 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        scrollBtn.style.transform = 'translateY(-5px) scale(0.95)';
        setTimeout(() => {
             if (scrollBtn.classList.contains('visible')) {
                 scrollBtn.style.transform = 'translateY(0) scale(1)';
             } else {
                 scrollBtn.style.transform = 'translateY(30px) scale(0.8)';
             }
        }, 200);
    });
}

// ============================================
// 부드러운 앵커 스크롤 (★★ 수정됨 ★★)
// ============================================
function initSmoothScroll() {
    // (★★ 수정 ★★)
    // Lenis를 사용할 것이므로, 이 함수는 Lenis가 없는 경우의
    // 대체(fallback) 스크롤 로직만 담당합니다.
    // Lenis가 있다면 initLenisScroll() 함수가 앵커 스크롤을 처리합니다.
    
    // Lenis가 *없을* 때만 이 함수가 실행되도록 합니다.
    if (typeof Lenis !== 'undefined') {
        return;
    }

    console.log("Lenis not found, using fallback smooth scroll.");

    const links = document.querySelectorAll('nav a[href^="#"], .logo a, .quick-icon');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (!href || href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPos = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });
                } else {
                     console.warn(`Smooth scroll target not found: ${href}`);
                }
            }
        });
    });
}

// ============================================
// 향상된 퀵 메뉴
// ============================================
function initQuickMenu() {
    const quickIcons = document.querySelectorAll('.quick-icon');

    quickIcons.forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(50px)';

        setTimeout(() => {
            icon.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            icon.style.opacity = '1';
            icon.style.transform = 'translateY(0)';
        }, 100 * index + 1600); // 로딩 후 1.6초 뒤부터 순차적 등장

        icon.addEventListener('click', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                 if (this.matches(':hover')) {
                    this.style.transform = 'translateY(-8px)';
                 } else {
                    this.style.transform = '';
                 }
            }, 150);
        });
    });
}

// ============================================
// 프리미엄 히스토리 애니메이션
// ============================================
function initHistoryAnimation() {
    const historyItems = document.querySelectorAll('.history-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    historyItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(80px) scale(0.95)';
        item.style.transition = `all 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`;
        observer.observe(item);
    });
}

// ============================================
// 마우스 자석 효과
// ============================================
function initMagneticEffect() {
    if (!isDesktop) return;

    const magneticElements = document.querySelectorAll('.scroll-top, .icon-button, .cta-nav-btn');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const isBtn = this.classList.contains('icon-button') || this.classList.contains('cta-nav-btn');
            const intensity = isBtn ? 0.3 : 0.2;
            const moveX = Math.max(-10, Math.min(10, deltaX * intensity));
            const moveY = Math.max(-10, Math.min(10, deltaY * intensity));
            
            this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
            this.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mouseleave', function() {
             if (this.classList.contains('scroll-top')) {
                if (this.classList.contains('visible')) {
                    this.style.transform = 'translateY(0) scale(1)';
                } else {
                    this.style.transform = 'translateY(30px) scale(0.8)';
                }
            } else {
                this.style.transform = '';
            }
            this.style.transition = '';
        });
    });
}

// ============================================
// 스크롤 진행 표시
// ============================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 3px;
        background: linear-gradient(90deg, var(--primary-gold), var(--dark-gold));
        z-index: 10001; transform-origin: left; transform: scaleX(0);
        transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const docHeight = document.documentElement.scrollHeight;
                const winHeight = window.innerHeight;
                const scrollableHeight = docHeight > winHeight ? docHeight - winHeight : 0;
                const progress = scrollableHeight > 0 ? window.pageYOffset / scrollableHeight : 0;
                progressBar.style.transform = `scaleX(${progress})`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// CTA 섹션 슬라이더 (Cover Flow)
// ============================================
function initCtaSlider() {
    const track = document.querySelector('.cta-slider-track');
    if (!track) return;

    const cards = track.querySelectorAll('.cta-card');
    const prevBtn = document.querySelector('.cta-nav-btn.prev');
    const nextBtn = document.querySelector('.cta-nav-btn.next');
    const currentNumEl = document.querySelector('.cta-nav-number.current');
    const totalNumEl = document.querySelector('.cta-nav-number.total');
    const sliderWrapper = track.closest('.cta-slider-wrapper');

    if (cards.length === 0 || !prevBtn || !nextBtn || !currentNumEl || !totalNumEl || !sliderWrapper) {
        console.warn('CTA 슬라이더 초기화 실패. 필수 요소가 없습니다.');
        return;
    }

    let totalCards = cards.length;
    let currentIndex = 0;
    let autoRotateInterval = null;

    totalNumEl.textContent = totalCards.toString().padStart(2, '0');

    function showSlide(index) {
        currentIndex = (index + totalCards) % totalCards;
        currentNumEl.textContent = (currentIndex + 1).toString().padStart(2, '0');

        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev', 'next');
            if (i === currentIndex) {
                card.classList.add('active');
            } else if (i === (currentIndex - 1 + totalCards) % totalCards) {
                card.classList.add('prev');
            } else if (i === (currentIndex + 1) % totalCards) {
                card.classList.add('next');
            }
        });
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    function startAutoRotate() {
        stopAutoRotate();
        autoRotateInterval = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 4000);
    }

    prevBtn.addEventListener('click', () => { 
        stopAutoRotate();
        showSlide(currentIndex - 1); 
    });
    nextBtn.addEventListener('click', () => { 
        stopAutoRotate();
        showSlide(currentIndex + 1); 
    });

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (card.classList.contains('prev')) {
                stopAutoRotate();
                showSlide(currentIndex - 1);
            } else if (card.classList.contains('next')) {
                stopAutoRotate();
                showSlide(currentIndex + 1);
            }
        });
    });

    sliderWrapper.addEventListener('mouseenter', stopAutoRotate);
    sliderWrapper.addEventListener('mouseleave', startAutoRotate);

    const ctaSection = track.closest('.cta-section');
    if (!ctaSection) {
        showSlide(0);
        startAutoRotate();
        return;
    }

    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                showSlide(0);
                startAutoRotate();
                ctaObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    ctaObserver.observe(ctaSection);
}

// ============================================
// 아카이브 슬라이더
// ============================================
function initArchiveSlider() {
    const wrapper = document.querySelector('.archive-slider-wrapper');
    const track = wrapper?.querySelector('.archive-slider-track');
    const prevBtn = wrapper?.querySelector('.archive-btn.prev');
    const nextBtn = wrapper?.querySelector('.archive-btn.next');
    const cards = track ? Array.from(track.querySelectorAll('.archive-item')) : [];

    if (!wrapper || !track || cards.length === 0 || !prevBtn || !nextBtn) {
        console.warn('Archive slider not initialized. Missing elements.');
        return;
    }

    let idx = 0;
    let perView = isDesktop ? 4 : 2;
    let gap = isDesktop ? 25 : 15;
    let max = Math.max(0, cards.length - perView);

    function updateSlider() {
        if (cards.length === 0) return;
        const cardWidth = cards[0].offsetWidth;
        const moveDistance = (cardWidth + gap) * idx;

        track.style.transform = `translateX(-${moveDistance}px)`;
        prevBtn.classList.toggle('disabled', idx <= 0);
        nextBtn.classList.toggle('disabled', idx >= max);
    }

    prevBtn.addEventListener('click', () => {
        if (idx > 0) {
            idx--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (idx < max) {
            idx++;
            updateSlider();
        }
    });

    let startX = 0, endX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', () => {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && idx < max) idx++;
            if (diff < 0 && idx > 0) idx--;
            updateSlider();
        }
        startX = 0;
        endX = 0;
    });

    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth > 768;
        perView = isDesktop ? 4 : 2;
        gap = isDesktop ? 25 : 15;
        max = Math.max(0, cards.length - perView);
        if (idx > max) idx = max;
        updateSlider();
    }, { passive: true });

    updateSlider();
}


// ============================================
// 검색 오버레이 기능
// ============================================
function initSearchOverlay() {
    const trigger = document.getElementById('search-trigger');
    const overlay = document.getElementById('search-overlay');
    const close = document.getElementById('search-close');
    const input = overlay?.querySelector('.search-input');

    if (!trigger || !overlay || !close || !input) {
        console.warn('Search overlay elements not found.');
        return;
    }

    trigger.addEventListener('click', () => {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        setTimeout(() => input.focus(), 400);
    });

    const closeSearch = () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
    };

    close.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSearch();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeSearch();
    });
}

// ============================================
// 공지사항 모달 기능
// ============================================
function initNoticeModal() {
    const triggers = document.querySelectorAll('.notice-item');
    const modal = document.getElementById('notice-modal');
    if (!modal || !triggers.length) return;

    const modalOverlay = modal.querySelector('.notice-modal-overlay');
    const modalClose = modal.querySelector('.notice-modal-close');
    const modalTitle = document.getElementById('notice-modal-title');
    const modalDate = document.getElementById('notice-modal-date');
    const modalText = document.getElementById('notice-modal-text');

    if (!modalOverlay || !modalClose || !modalTitle || !modalDate || !modalText) {
        console.warn('Notice modal elements not found.');
        return;
    }

    const openModal = (title, date) => {
        modalTitle.textContent = title;
        modalDate.textContent = date;
        modalText.innerHTML = `<p>${title}에 대한 상세 내용입니다. 여기에 공지사항 본문이 들어갑니다.</p><p>현재는 테스트용 텍스트입니다. 실제 내용은 CMS 등에서 불러와야 합니다.</p>`;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const title = trigger.querySelector('.notice-text p:first-child').textContent;
            const date = trigger.querySelector('.notice-text p:last-child').textContent;
            openModal(title, date);
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

// ============================================
// 갤러리/아카이브 모달 기능
// ============================================
function initGalleryModal() {
    const galleryTriggers = document.querySelectorAll('.gallery-card');
    const archiveTriggers = document.querySelectorAll('.archive-item');
    const modal = document.getElementById('gallery-modal');
    if (!modal) return;

    const modalOverlay = modal.querySelector('.gallery-modal-overlay');
    const modalClose = modal.querySelector('.gallery-modal-close');
    const modalImage = document.getElementById('gallery-modal-image');

    if ((galleryTriggers.length === 0 && archiveTriggers.length === 0) || !modalOverlay || !modalClose || !modalImage) {
        console.warn('Gallery modal elements not found.');
        return;
    }

    const openModal = (imageUrl) => {
        if (!imageUrl) return;
        modalImage.src = imageUrl;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => modalImage.src = '', 400);
    };

    galleryTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const imgUrl = trigger.style.backgroundImage.slice(4, -1).replace(/"/g, "");
            openModal(imgUrl);
        });
    });

    archiveTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const imgUrl = trigger.querySelector('img')?.src;
            if (imgUrl) openModal(imgUrl);
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}


// ============================================
// 반응형 처리 (★★ 수정됨 ★★)
// ============================================
function handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const wasDesktop = isDesktop;
            isDesktop = window.innerWidth > 768;

            // (★★ 수정 ★★) 커서 로직 수정
            if (!isDesktop && wasDesktop) { // 데스크톱 -> 모바일로 변경 시
                if (cursorDot) cursorDot.remove();
                if (cursorOutline) cursorOutline.remove();
                cursorDot = null;
                cursorOutline = null;
                document.body.style.cursor = 'default'; // 기본 커서 보이기
            }
            else if (isDesktop && !wasDesktop) { // 모바일 -> 데스크톱으로 변경 시
                document.body.style.cursor = 'none'; // CSS 기본값으로 복원
                initCustomCursor(); // 커스텀 커서 생성
            }

        }, 250);
    });
}

// ============================================
// 초기화
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initLoadingAnimation();
    initHeaderScroll();
    initMobileMenu();
    
    // (★★ 수정 ★★) Lenis 초기화가 먼저 실행되도록 순서 변경
    initLenisScroll();
    initSmoothScroll(); // Lenis가 없을 경우를 대비한 대체(fallback) 함수
    
    initCustomCursor();
    initHeroSlider();
    initScrollReveal();
    initStatsCounter();
    initVideoCards(); // (★★ 수정 ★★) "origin" 문제가 해결된 함수
    initGallerySlider();
    initCtaSlider();
    initArchiveSlider();
    initParallaxEffects();
    initNoticeInteraction();
    initScrollToTop();
    initQuickMenu();
    initHistoryAnimation();
    initMagneticEffect();
    initScrollProgress();
    handleResize();

    initSearchOverlay();
    initNoticeModal();
    initGalleryModal();

    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.8s ease';
            document.body.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            console.log('정동야행 웹사이트 로드 완료 및 레이아웃 조정');
        }, 1700);
    });
});