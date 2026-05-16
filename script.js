// NOIR//SYSTEM - Static JavaScript (no animations)
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality only
    initMobileMenu();
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