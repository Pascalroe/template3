document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    let lastScroll = 0;
    let ticking = false;

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                navToggle.textContent = 'CLOSE';
            } else {
                navToggle.textContent = 'MENU';
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.textContent = 'MENU';
            });
        });
    }

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            if (currentScroll > lastScroll && currentScroll > 200) {
                nav.classList.add('nav-hidden');
            } else {
                nav.classList.remove('nav-hidden');
            }
        } else {
            nav.classList.remove('nav-hidden');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.offsetHeight;
            this.style.animation = 'glitch 0.3s infinite';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
            this.offsetHeight;
            this.style.animation = 'glitch 3s infinite';
        });
    });
});