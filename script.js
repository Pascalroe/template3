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
    
    // Add to Cart Button Animation (Shop - nur Show)
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const originalText = this.textContent;
            this.textContent = 'ADDED ✓';
            this.classList.add('added');
            
            // Cart Badge Animation
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                cartBadge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 200);
            }
            
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('added');
            }, 1500);
        });
    });
    
    // Shop Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.shop-product');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});