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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ========================================
    // Hero Banner Fade-In & Scroll Animations
    // ========================================
    const bannerBlock = document.querySelector('.banner-block');
    const reveals = document.querySelectorAll('.reveal');
    const sloganText = document.querySelector('.slogan-text');
    const lineDashes = document.querySelectorAll('.line-dash');

    if (prefersReducedMotion || typeof gsap === 'undefined') {
        if (bannerBlock) bannerBlock.classList.add('vis');
        reveals.forEach(reveal => reveal.classList.add('animate'));
        if (sloganText) sloganText.classList.add('active');
        lineDashes.forEach(line => line.classList.add('animate'));
    } else {
        // Trigger hero fade-in after a short delay
        setTimeout(() => {
            if (bannerBlock) {
                bannerBlock.classList.add('vis');
            }
        }, 300);

        // Banner Floating Image Parallax
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

        // Text Reveal Animations
        reveals.forEach(reveal => {
            ScrollTrigger.create({
                trigger: reveal,
                start: "top 80%",
                onEnter: () => reveal.classList.add('animate'),
                once: true
            });
        });

        // Image Float Parallax
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

        // Slogan Text Reveal
        if (sloganText) {
            ScrollTrigger.create({
                trigger: sloganText,
                start: "top 70%",
                onEnter: () => sloganText.classList.add('active'),
                once: true
            });
        }

        // Line Dash Animation
        lineDashes.forEach(line => {
            ScrollTrigger.create({
                trigger: line.parentElement,
                start: "top 80%",
                onEnter: () => line.classList.add('animate'),
                once: true
            });
        });

        // Service Cards Stagger Animation
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

        // Invest Info Block Animation
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
    }

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
    // Smooth Scroll for Anchor Links & Mobile Nav
    // ========================================
    const mobNavIcon = document.querySelector('.mob-nav-icon');
    const headerNav = document.querySelector('.header-nav');
    const mainContent = document.getElementById('main-content');
    const footerEl = document.querySelector('.footer');

    const setMobileNavOpen = (isOpen) => {
        if (!mobNavIcon || !headerNav) return;
        mobNavIcon.classList.toggle('active', isOpen);
        headerNav.classList.toggle('active', isOpen);
        mobNavIcon.setAttribute('aria-expanded', String(isOpen));
        if (mainContent) mainContent.inert = isOpen;
        if (footerEl) footerEl.inert = isOpen;
    };

    if (mobNavIcon && headerNav) {
        mobNavIcon.addEventListener('click', function (e) {
            e.preventDefault();
            const isOpen = !headerNav.classList.contains('active');
            setMobileNavOpen(isOpen);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && headerNav.classList.contains('active')) {
                setMobileNavOpen(false);
                mobNavIcon.focus();
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Skip mobile menu toggle & language switcher (handled separately)
            if (this.classList.contains('mob-nav-icon') || this.closest('.lang-switch')) {
                return;
            }

            const href = this.getAttribute('href');

            // Allow native skip-link behavior while moving focus to <main>
            if (this.classList.contains('skip-link')) {
                return;
            }

            e.preventDefault();

            // Close mobile menu if open when clicking a navigation link
            if (headerNav && headerNav.classList.contains('active')) {
                setMobileNavOpen(false);
            }

            // Placeholder legal links in footer
            if (this.closest('.privacy') && href === '#') {
                return;
            }

            const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

            // Scroll to top for "#" (Logo / Home link)
            if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: scrollBehavior
                });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: scrollBehavior
                });
            }
        });
    });

    // ========================================
    // Select Dropdown Color State
    // ========================================
    const selectFields = document.querySelectorAll('.input-item select');
    selectFields.forEach(select => {
        const updateSelectState = () => {
            if (select.value) {
                select.classList.add('has-value');
            } else {
                select.classList.remove('has-value');
            }
        };
        select.addEventListener('change', updateSelectState);
        updateSelectState();
    });

    // ========================================
    // Form Validation & Submission Handler
    // ========================================
    const form = document.getElementById('inquiryForm');
    const formStatus = document.getElementById('form-status');
    const isHR = document.documentElement.lang === 'hr';

    if (form) {
        // Sync ARIA validation state after user interaction (:user-invalid pattern)
        const syncFieldAria = (field) => {
            if (!('willValidate' in field) || !field.dataset.error) return;
            const invalid = !field.validity.valid;
            field.classList.toggle('user-invalid-fallback', invalid);
            field.setAttribute('aria-invalid', String(invalid));
            if (invalid) {
                field.setAttribute('aria-describedby', field.dataset.error);
            } else {
                field.removeAttribute('aria-describedby');
            }
        };

        form.addEventListener('blur', (e) => {
            if (e.target.dataset && e.target.dataset.error) {
                syncFieldAria(e.target);
            }
        }, true);

        form.addEventListener('input', (e) => {
            if (e.target.getAttribute && e.target.getAttribute('aria-invalid') === 'true') {
                syncFieldAria(e.target);
            }
        });

        form.addEventListener('invalid', (e) => {
            syncFieldAria(e.target);
        }, true);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const button = form.querySelector('.button');
            const originalText = button.textContent;

            const setStatus = (msg) => {
                button.textContent = msg;
                if (formStatus) formStatus.textContent = msg;
            };

            // Visual & screen-reader feedback - processing
            setStatus(isHR ? 'Slanje...' : 'Sending...');
            button.disabled = true;

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
                    setStatus(isHR ? 'Upit zaprimljen' : 'Request Received');
                    button.style.backgroundColor = 'var(--c2)';
                    button.style.color = 'var(--c4)';
                    form.reset();
                    selectFields.forEach(s => s.classList.remove('has-value'));
                    form.querySelectorAll('[aria-invalid]').forEach(el => {
                        el.classList.remove('user-invalid-fallback');
                        el.removeAttribute('aria-invalid');
                        el.removeAttribute('aria-describedby');
                    });
                } else {
                    // Error feedback
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            setStatus(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            setStatus(isHR ? 'Greška pri slanju' : 'Error sending message');
                        }
                    });
                }
            }).catch(error => {
                setStatus(isHR ? 'Mrežna greška' : 'Network Error');
            }).finally(() => {
                // Reset button after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    if (formStatus) formStatus.textContent = '';
                    button.style.backgroundColor = '';
                    button.style.color = '';
                    button.disabled = false;
                }, 3000);
            });
        });
    }
});
