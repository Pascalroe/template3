// NOIR//SYSTEM - Static JavaScript (no animations)
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality only
    initMobileMenu();
    
    // Hide header on scroll (Mobile)
    initHeaderScroll();
});

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

function initHeaderScroll() {
    const mainNav = document.querySelector('.main-nav');
    if (!mainNav) return;
    
    let lastScroll = 0;
    const scrollThreshold = 10;
    
    window.addEventListener('scroll', () => {
        // Only on mobile (screen width < 768px)
        if (window.innerWidth > 768) return;
        
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            mainNav.classList.remove('nav-hidden');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scrolling down - hide
            mainNav.classList.add('nav-hidden');
        } else if (currentScroll < lastScroll) {
            // Scrolling up - show
            mainNav.classList.remove('nav-hidden');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}