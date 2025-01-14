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
    let isAnimating = false;
    let isSwiping = false;
    
    function showSlide(index, direction) {
        if (isAnimating) return;
        isAnimating = true;

        const currentCard = cards[currentSlide];
        const nextCard = cards[index];
        
        // Remove previous animation classes
        cards.forEach(card => {
            card.classList.remove('slide-left', 'slide-right', 'slide-in-left', 'slide-in-right');
        });

        // Add appropriate animation classes
        if (direction === 'left') {
            currentCard.classList.add('slide-left');
            nextCard.classList.add('slide-in-left');
        } else {
            currentCard.classList.add('slide-right');
            nextCard.classList.add('slide-in-right');
        }

        // Update active states
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        nextCard.classList.add('active');
        dots[index].classList.add('active');
        
        // Reset animation state after animation completes
        setTimeout(() => {
            isAnimating = false;
        }, 500);

        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % cards.length;
        showSlide(nextIndex, 'left');
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + cards.length) % cards.length;
        showSlide(prevIndex, 'right');
    }

    // Initialize first slide
    cards[0].classList.add('active');
    dots[0].classList.add('active');

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index === currentSlide) return;
            const direction = index > currentSlide ? 'left' : 'right';
            showSlide(index, direction);
        });
    });

    // Enhanced swipe functionality
    const showcase = document.querySelector('.carousel-container');
    
    showcase.addEventListener('touchstart', e => {
        if (isAnimating) return;
        touchStartX = e.touches[0].clientX;
        startTime = Date.now();
        isDragging = true;
        isSwiping = false;
    }, { passive: true });

    showcase.addEventListener('touchmove', e => {
        if (!isDragging || isAnimating) return;
        touchEndX = e.touches[0].clientX;
        // If the user has moved their finger more than 10px, consider it a swipe
        if (Math.abs(touchEndX - touchStartX) > 10) {
            isSwiping = true;
            e.preventDefault();
        }
    }, { passive: false });

    showcase.addEventListener('touchend', e => {
        if (!isDragging || isAnimating) return;
        
        const swipeLength = touchEndX - touchStartX;
        const swipeTime = Date.now() - startTime;
        const swipeVelocity = Math.abs(swipeLength) / swipeTime;
        
        // Only handle swipe if it was actually a swipe motion
        if (isSwiping) {
            const minSwipeLength = 50;
            const minSwipeVelocity = 0.2;

            if (Math.abs(swipeLength) > minSwipeLength || swipeVelocity > minSwipeVelocity) {
                if (swipeLength > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }

        isDragging = false;
    });

    // Handle tap to show info on mobile
    showcase.addEventListener('click', e => {
        if (window.innerWidth <= 768 && !isSwiping) {
            const card = e.target.closest('.phone-card');
            const cardInfo = e.target.closest('.card-info');
            
            // If clicking on the info panel itself, don't do anything
            if (cardInfo) return;

            // If clicking outside any card, hide all info panels
            if (!card) {
                document.querySelectorAll('.phone-card').forEach(c => {
                    c.classList.remove('show-info');
                });
                return;
            }

            // If clicking on a card
            const wasShowingInfo = card.classList.contains('show-info');
            
            // Hide all info panels first
            document.querySelectorAll('.phone-card').forEach(c => {
                c.classList.remove('show-info');
            });

            // If the clicked card wasn't showing info, show it
            if (!wasShowingInfo) {
                card.classList.add('show-info');
            }
        }
    });

    // Hide info when starting to swipe
    showcase.addEventListener('touchstart', () => {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.phone-card').forEach(card => {
                card.classList.remove('show-info');
            });
        }
        clearInterval(slideInterval);
    });

    // Auto-advance slides
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on touch
    showcase.addEventListener('touchstart', () => {
        clearInterval(slideInterval);
    });

    showcase.addEventListener('touchend', () => {
        if (!isAnimating) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    });
}

// Initialize carousel on mobile devices
function handleCarousel() {
    const isMobile = window.innerWidth <= 768;
    const cards = document.querySelectorAll('.phone-card');
    const container = document.querySelector('.carousel-container');
    
    if (isMobile) {
        container.style.display = 'block';
        cards.forEach((card, index) => {
            if (index === 0) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
            card.style.display = '';
        });
        initCarousel();
    } else {
        container.style.display = 'flex';
        cards.forEach(card => {
            card.classList.remove('active', 'slide-left', 'slide-right', 'slide-in-left', 'slide-in-right');
            card.style.display = 'block';
        });
    }
}

// Initial setup
handleCarousel();

// Handle resize
window.addEventListener('resize', handleCarousel);
