// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');

// ===== Countdown Timer =====
function initCountdown() {
    const weddingDate = new Date('December 17, 2025 12:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(3, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Navigation =====
function initNavigation() {
    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        // update aria state for accessibility
        try { navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false'); } catch (e) {}
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        // only care if menu is open
        if (!navMenu.classList.contains('active')) return;

        const clickInsideMenu = navMenu.contains(e.target) || navToggle.contains(e.target);
        if (!clickInsideMenu) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            try { navToggle.setAttribute('aria-expanded', 'false'); } catch (err) {}
        }
    });
}

// ===== Enhanced Gallery Lightbox =====
let currentImageIndex = 0;
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

function initGallery() {
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            showLightboxImage();
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPreviousImage);
    lightboxNext.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
}

function showLightboxImage() {
    const currentItem = galleryItems[currentImageIndex];
    const imgSrc = currentItem.querySelector('img').src;
    const caption = currentItem.querySelector('.polaroid-caption').textContent;

    lightboxImage.src = imgSrc;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    lightboxImage.style.animation = 'none';
    setTimeout(() => {
        lightboxImage.style.animation = '';
        showLightboxImage();
    }, 10);
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
    lightboxImage.style.animation = 'none';
    setTimeout(() => {
        lightboxImage.style.animation = '';
        showLightboxImage();
    }, 10);
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.timeline-item, .couple-card, .gallery-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== Active Navigation Highlight =====
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Initialize All =====
// Add a small gallery shuffler to apply random rotations/translations to polaroid frames.
// This was missing and caused a ReferenceError (breaking initialization), preventing the
// countdown and other features from running.
function shuffleGallery() {
    if (!galleryItems || galleryItems.length === 0) return;

    galleryItems.forEach(item => {
        const frame = item.querySelector('.polaroid-frame');
        if (!frame) return;

        // small random rotation between -8 and 8 degrees
        const rotate = (Math.random() * 16) - 8;
        // tiny random translation for a scattered look
        const translateX = (Math.random() * 20) - 10;
        const translateY = (Math.random() * 12) - 6;

        frame.style.transform = `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`;
        frame.style.transition = 'transform 0.6s ease';

        // random z-index so they overlap naturally
        item.style.zIndex = String(Math.floor(Math.random() * 10) + 1);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    shuffleGallery();
    initCountdown();
    initNavigation();
    initGallery();
    initScrollAnimations();
    initActiveNavHighlight();
});

