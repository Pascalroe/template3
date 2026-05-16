document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHoverEffects();
    initSmoothScroll();
    initGlitchEffect();
    initParallax();
    initFilterButtons();
    initCursor();
    initMobileMenu();
});

function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.1)) {
                displayScrollElement(el);
            }
        });
    };
    
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation, { passive: true });
}

function initHoverEffects() {
    const workItems = document.querySelectorAll('.work-item, .project-item, .team-member');
    
    workItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const randomRotate = (Math.random() - 0.5) * 10;
            const randomScale = 1 + Math.random() * 0.1;
            item.style.transform = `translate(-5px, -5px) rotate(${randomRotate}deg) scale(${randomScale})`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
    
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 5;
            e.target.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
        
        link.addEventListener('mouseleave', () => {
            e.target.style.transform = '';
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    document.querySelectorAll('a').forEach(link => {
        if (!link.href.startsWith('#') && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
            link.addEventListener('click', function(e) {
                if (this.hostname === window.location.hostname && this.pathname !== '/') {
                    e.preventDefault();
                    const targetPage = this.href;
                    
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.3s ease';
                    
                    setTimeout(() => {
                        window.location.href = targetPage;
                    }, 300);
                }
            });
        }
    });
}

function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(el => {
        const text = el.getAttribute('data-text');
        
        el.addEventListener('mouseenter', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                el.textContent = text
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) {
                            return text[index];
                        }
                        return String.fromCharCode(33 + Math.floor(Math.random() * 94));
                    })
                    .join('');
                
                if (iterations >= text.length) {
                    clearInterval(interval);
                }
                
                iterations += 1 / 3;
            }, 30);
        });
        
        el.addEventListener('mouseleave', () => {
            el.textContent = text;
        });
    });
}

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed'));
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            
            if (scrollY + window.innerHeight > elementTop) {
                const yPos = (scrollY - elementTop) * speed;
                el.style.transform = `translateY(${yPos}px)`;
            }
        });
    }, { passive: true });
}

function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #B6FF2E;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, background-color 0.3s;
        mix-blend-mode: difference;
    `;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    const interactiveElements = document.querySelectorAll('a, button, .work-item, .project-item, .team-member');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(182, 255, 46, 0.3)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        
        navToggle.textContent = navLinks.classList.contains('active') ? 'CLOSE ×' : 'MENU +';
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            navToggle.textContent = 'MENU +';
        });
    });
}

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

const style = document.createElement('style');
style.textContent = `
    .custom-cursor {
        display: none;
    }
    
    @media (pointer: fine) {
        .custom-cursor {
            display: block;
        }
        
        body {
            cursor: none;
        }
        
        a, button, .work-item, .project-item, .team-member {
            cursor: none;
        }
    }
`;
document.head.appendChild(style);