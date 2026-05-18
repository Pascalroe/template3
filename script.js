document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    // Theme toggle functionality
    initThemeToggle();
    
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
    
    // ====== CART FUNCTIONALITY ======
    
    let cart = JSON.parse(localStorage.getItem('vantaCart')) || [];
    
    function saveCart() {
        localStorage.setItem('vantaCart', JSON.stringify(cart));
    }
    
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                variant: product.variant,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartBadge();
        renderCart();
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartBadge();
        renderCart();
    }
    
    function updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
            
            badge.style.transform = 'scale(1.3)';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    function getCartTotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    function renderCart() {
        const cartPanel = document.getElementById('cart-panel');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        
        if (!cartPanel) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartMessage.style.display = 'block';
            clearCartBtn.style.display = 'none';
            cartTotalElement.textContent = '€0.00';
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        clearCartBtn.style.display = 'block';
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-variant">${item.variant}</div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">✕</button>
            </div>
        `).join('');
        
        cartTotalElement.textContent = '€' + getCartTotal().toFixed(2);
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFromCart(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = cart.find(i => i.id === this.dataset.id);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    removeFromCart(this.dataset.id);
                    return;
                }
                saveCart();
                updateCartBadge();
                renderCart();
            });
        });
        
        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = cart.find(i => i.id === this.dataset.id);
                if (item) {
                    item.quantity += 1;
                    saveCart();
                    updateCartBadge();
                    renderCart();
                }
            });
        });
    }
    
    function openCartPanel() {
        const cartPanel = document.getElementById('cart-panel');
        const overlay = document.getElementById('cart-overlay');
        if (cartPanel) {
            cartPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        if (overlay) {
            overlay.classList.add('active');
        }
    }
    
    function closeCartPanel() {
        const cartPanel = document.getElementById('cart-panel');
        const overlay = document.getElementById('cart-overlay');
        if (cartPanel) {
            cartPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
    
    function clearCart() {
        cart = [];
        saveCart();
        updateCartBadge();
        renderCart();
    }
    
    // Initialize cart badge and panel
    updateCartBadge();
    
    // Cart icon click handler
    const navCart = document.querySelector('.nav-cart');
    if (navCart) {
        navCart.addEventListener('click', openCartPanel);
    }
    
    // Close button handler
    const closeCartBtn = document.getElementById('close-cart-btn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartPanel);
    }
    
    // Overlay click handler
    const overlay = document.getElementById('cart-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeCartPanel);
    }
    
    // Clear cart button handler
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Shop - Add to Cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const productCard = this.closest('.shop-product-card');
            const product = {
                id: productCard.dataset.category + '-' + productCard.querySelector('.shop-product-variant').textContent,
                name: productCard.querySelector('.shop-product-name').textContent,
                price: parseFloat(productCard.querySelector('.shop-product-price').textContent.replace('€', '')),
                image: productCard.querySelector('.shop-product-image img').src,
                variant: productCard.querySelector('.shop-product-variant').textContent
            };
            
            addToCart(product);
            
            const originalText = this.textContent;
            this.textContent = 'ADDED ✓';
            this.classList.add('added');
            
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('added');
            }, 1500);
        });
    });
    
    // Shop Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.shop-product-card');
    
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

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    updateToggleIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function updateToggleIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '☀' : '🌙';
    }
}