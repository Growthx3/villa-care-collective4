/* ========================================
   Villa Care Collective - JavaScript
   GSAP Animations & Scroll Triggers
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // Language & Geolocation Logic
    // ========================================
    (function initLanguage() {
        // Show body content (specifically for index-hr.html which starts hidden)
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';

        const savedLang = sessionStorage.getItem('vcc_lang');
        const path = window.location.pathname;
        const isCroatianPage = path.includes('index-hr.html');

        // 1. Handle Manual Preference
        if (savedLang) {
            if (savedLang === 'hr' && !isCroatianPage) {
                window.location.href = 'index-hr.html';
                return;
            } else if (savedLang === 'en' && isCroatianPage) {
                window.location.href = 'index.html';
                return;
            }
        }

        // 2. Handle Geolocation (only if no preference set and on English page)
        if (!savedLang && !isCroatianPage) {
            // Check IP location
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    const country = data.country_code; // e.g. "HR"
                    const targetCountries = ['HR', 'BA', 'RS', 'ME']; // Croatia, Bosnia, Serbia, Montenegro

                    if (targetCountries.includes(country)) {
                        // Redirect to Croatian version
                        window.location.href = 'index-hr.html';
                    }
                })
                .catch(err => {
                    console.log('Geo-IP check failed:', err);
                    // Fail silently, stay on English
                });
        }
    })();

    // Language Switcher Click Handlers
    const langLinks = document.querySelectorAll('.lang-switch a');
    langLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // If link is # (current), do nothing
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }

            const lang = this.innerText.trim().toLowerCase(); // 'en' or 'hr'
            sessionStorage.setItem('vcc_lang', lang);
        });
    });

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ========================================
    // Hero Banner Fade-In Animation
    // ========================================
    const bannerBlock = document.querySelector('.banner-block');

    // Trigger hero fade-in after a short delay
    setTimeout(() => {
        if (bannerBlock) {
            bannerBlock.classList.add('vis');
        }
    }, 300);

    // ========================================
    // Banner Floating Image Parallax
    // ========================================
    const bannerFloats = document.querySelectorAll('.banner-float img');

    bannerFloats.forEach(img => {
        gsap.to(img, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
                trigger: ".banner",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // ========================================
    // Text Reveal Animations
    // ========================================
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(reveal => {
        ScrollTrigger.create({
            trigger: reveal,
            start: "top 80%",
            onEnter: () => reveal.classList.add('animate'),
            once: true
        });
    });

    // ========================================
    // Image Float Parallax
    // ========================================
    const imgFloats = document.querySelectorAll('.img-float:not(.banner-float) img');

    imgFloats.forEach(img => {
        gsap.fromTo(img,
            { yPercent: -10 },
            {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });

    // ========================================
    // Slogan Text Reveal
    // ========================================
    const sloganText = document.querySelector('.slogan-text');

    if (sloganText) {
        ScrollTrigger.create({
            trigger: sloganText,
            start: "top 70%",
            onEnter: () => sloganText.classList.add('active'),
            once: true
        });
    }

    // ========================================
    // Line Dash Animation
    // ========================================
    const lineDashes = document.querySelectorAll('.line-dash');

    lineDashes.forEach(line => {
        ScrollTrigger.create({
            trigger: line.parentElement,
            start: "top 80%",
            onEnter: () => line.classList.add('animate'),
            once: true
        });
    });

    // ========================================
    // Service Cards Stagger Animation
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');

    if (serviceCards.length > 0) {
        gsap.fromTo(serviceCards,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".services-grid",
                    start: "top 75%",
                    once: true
                }
            }
        );
    }

    // ========================================
    // Invest Info Block Animation
    // ========================================
    const investBlocks = document.querySelectorAll('.invest-info-block');

    investBlocks.forEach(block => {
        gsap.fromTo(block,
            {
                opacity: 0,
                y: 60
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: block,
                    start: "top 75%",
                    once: true
                }
            }
        );
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = 'rgba(19, 38, 32, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.webkitBackdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.webkitBackdropFilter = 'none';
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    const mobNavIcon = document.querySelector('.mob-nav-icon');
    const headerNav = document.querySelector('.header-nav');

    if (mobNavIcon && headerNav) {
        mobNavIcon.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.toggle('active');
            headerNav.classList.toggle('active');
        });
    }

    // ========================================
    // Form Submission Handler
    // ========================================
    const form = document.getElementById('inquiryForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const button = form.querySelector('.button');
            const originalText = button.textContent;

            // Visual feedback - processing
            button.textContent = 'Sending...';

            const formData = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Success feedback
                    button.textContent = 'Request Received';
                    button.style.backgroundColor = 'var(--c2)';
                    button.style.color = 'var(--c4)';
                    form.reset();
                } else {
                    // Error feedback
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            button.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            button.textContent = 'Error sending msg';
                        }
                    });
                }
            }).catch(error => {
                button.textContent = 'Network Error';
            }).finally(() => {
                // Reset button after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                    button.style.color = '';
                }, 3000);
            });
        });
    }

    // ========================================
    // Join Section Reveal
    // ========================================
    const joinSection = document.querySelector('.join .reveal');

    if (joinSection) {
        ScrollTrigger.create({
            trigger: joinSection,
            start: "top 80%",
            onEnter: () => joinSection.classList.add('animate'),
            once: true
        });
    }
});
