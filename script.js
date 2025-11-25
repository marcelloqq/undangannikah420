const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');

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

function initNavigation() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        try { navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false'); } catch (e) { }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

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

    document.addEventListener('click', (e) => {
        if (!navMenu.classList.contains('active')) return;

        const clickInsideMenu = navMenu.contains(e.target) || navToggle.contains(e.target);
        if (!clickInsideMenu) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            try { navToggle.setAttribute('aria-expanded', 'false'); } catch (err) { }
        }
    });
}

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
}

function showLightboxImage() {
    const currentItem = galleryItems[currentImageIndex];
    const imgSrc = currentItem.querySelector('img').src;

    lightboxImage.src = imgSrc;
    if (lightboxCaption) {
        lightboxCaption.style.display = 'none';
    }
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

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.couple-card, .gallery-item');

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

function applyGalleryRotation() {
    if (!galleryItems || galleryItems.length === 0) return;

    const itemsArray = Array.from(galleryItems);
    const usedAngles = new Set();

    itemsArray.forEach((item) => {
        const card = item.querySelector('.photo-card');
        if (!card) return;

        let rotate;
        do {
            rotate = Math.round((Math.random() * 16 - 8) * 10) / 10;
        } while (usedAngles.has(rotate) && usedAngles.size < 160);
        usedAngles.add(rotate);

        card.style.transform = `rotate(${rotate}deg)`;
        card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
}

function initGalleryRotation() {
    applyGalleryRotation();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            applyGalleryRotation();
        }, 500);
    });
}

function toggleGiftCards() {
    const modal = document.getElementById('giftModal');
    if (!modal) return;

    const isActive = modal.classList.toggle('active');

    if (isActive) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
        return;
    }

    const modal = document.getElementById('giftModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        toggleGiftCards();
    }
});

function copyToClipboard(accountNumber, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(accountNumber)
            .then(() => {
                showToast();
                animateCopyButton(button);
            })
            .catch(() => {
                fallbackCopyToClipboard(accountNumber, button);
            });
    } else {
        fallbackCopyToClipboard(accountNumber, button);
    }
}

function fallbackCopyToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-999999px';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showToast();
        animateCopyButton(button);
    } catch (err) {
        console.error('Failed to copy:', err);
    }

    document.body.removeChild(textArea);
}

function showToast() {
    const toast = document.getElementById('copyToast');
    if (!toast) return;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function animateCopyButton(button) {
    button.style.background = '#4CAF50';

    const originalHTML = button.innerHTML;
    button.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;

    setTimeout(() => {
        button.style.background = '';
        button.innerHTML = originalHTML;
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initNavigation();
    initGallery();
    initGalleryRotation();
    initScrollAnimations();
    initActiveNavHighlight();
});

window.addEventListener("load", () => {
    const env = document.querySelector(".intro-envelope");
    const flash = document.querySelector(".white-flash");

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let alreadyOpened = false;

    function openEnvelope() {
        if (alreadyOpened) return;
        alreadyOpened = true;

        env.style.pointerEvents = "none";

        env.classList.add("open");
        flash.classList.add("fade-out");

        setTimeout(() => {
            env.remove();
            flash.remove();

            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }, 2500);
    }

    env.style.pointerEvents = "auto";
    env.addEventListener("click", openEnvelope);

    setTimeout(() => {
        openEnvelope();
    }, 3000);
});

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");

    preloader.style.opacity = "0";

    setTimeout(() => {
        preloader.remove();
    }, 500);
});

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});
