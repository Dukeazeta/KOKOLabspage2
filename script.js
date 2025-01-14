// Mobile menu functionality
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

function toggleMenu() {
    menuOpen = !menuOpen;
    navLinks.classList.toggle('active');
    mobileMenu.textContent = menuOpen ? '×' : '☰';
    document.body.style.overflow = menuOpen ? 'hidden' : '';
}

mobileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (menuOpen) toggleMenu();
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuOpen && !navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
        toggleMenu();
    }
});

// Close menu when pressing escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
        toggleMenu();
    }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation for showcase cards
const cards = document.querySelectorAll('.phone-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'rotateY(0deg)';
        }
    });
}, {
    threshold: 0.1
});

cards.forEach(card => observer.observe(card));

// Carousel functionality
function initCarousel() {
    const cards = document.querySelectorAll('.phone-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startTime = 0;
    
    function showSlide(index) {
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        cards[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % cards.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + cards.length) % cards.length;
        showSlide(currentSlide);
    }

    // Initialize first slide
    showSlide(0);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Enhanced swipe functionality
    const showcase = document.querySelector('.carousel-container');
    
    showcase.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        startTime = Date.now();
        isDragging = true;
    }, { passive: true });

    showcase.addEventListener('touchmove', e => {
        if (!isDragging) return;
        e.preventDefault();
        touchEndX = e.touches[0].clientX;
    }, { passive: false });

    showcase.addEventListener('touchend', e => {
        if (!isDragging) return;
        
        const swipeLength = touchEndX - touchStartX;
        const swipeTime = Date.now() - startTime;
        const swipeVelocity = Math.abs(swipeLength) / swipeTime;
        
        // Adjust these values to make swiping more or less sensitive
        const minSwipeLength = 50;
        const minSwipeVelocity = 0.2;

        if (Math.abs(swipeLength) > minSwipeLength || swipeVelocity > minSwipeVelocity) {
            if (swipeLength > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }

        isDragging = false;
    });

    // Auto-advance slides
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on touch
    showcase.addEventListener('touchstart', () => {
        clearInterval(slideInterval);
    });

    showcase.addEventListener('touchend', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// Initialize carousel on mobile devices
function handleCarousel() {
    const isMobile = window.innerWidth <= 768;
    const cards = document.querySelectorAll('.phone-card');
    
    if (isMobile) {
        cards.forEach((card, index) => {
            if (index === 0) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        initCarousel();
    } else {
        cards.forEach(card => {
            card.classList.remove('active');
            card.style.display = 'block';
        });
    }
}

// Initial setup
handleCarousel();

// Handle resize
window.addEventListener('resize', handleCarousel);
