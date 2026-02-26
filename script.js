// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const sectionNavButtons = document.querySelectorAll('.section-nav-btn');
    const heroProjectsBtn = document.querySelector('.hero-cta-projects');
    const heroAboutBtn = document.querySelector('.hero-cta-about');
    const introOverlay = document.getElementById('intro-overlay');
    const introName = introOverlay ? introOverlay.querySelector('.intro-name') : null;
    const body = document.body;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const kineticSections = new WeakMap();
    let heroTitleElement = null;
    let heroTitleChars = [];

    function splitText(element, { type = 'chars' } = {}) {
        if (!element) return [];
        const text = element.textContent;
        if (!text || !text.trim()) return [];

        const words = text.trim().split(/\s+/);
        element.textContent = '';

        const spans = [];

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('kt-word');

            if (type === 'chars') {
                Array.from(word).forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.classList.add('kt-char');
                    charSpan.textContent = char;
                    wordSpan.appendChild(charSpan);
                    spans.push(charSpan);
                });
            } else {
                wordSpan.textContent = word;
                spans.push(wordSpan);
            }

            element.appendChild(wordSpan);

            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });

        return spans;
    }

    function initKineticTypography() {
        if (typeof gsap === 'undefined' || prefersReducedMotion) {
            return;
        }

        sections.forEach(section => {
            const data = {};

            if (section.id === 'home') {
                const heroTitle = section.querySelector('.hero-title');
                const heroDesc = section.querySelector('.hero-description');

                data.heroTitleChars = splitText(heroTitle, { type: 'chars' });
                data.heroDescWords = splitText(heroDesc, { type: 'words' });

                heroTitleElement = heroTitle;
                heroTitleChars = data.heroTitleChars;
            } else {
                const title = section.querySelector('.section-title');
                if (title) {
                    data.titleChars = splitText(title, { type: 'chars' });
                }

                if (section.id === 'about') {
                    const aboutParas = section.querySelectorAll('.about-text p');
                    data.bodyWords = [];
                    aboutParas.forEach(p => {
                        data.bodyWords = data.bodyWords.concat(splitText(p, { type: 'words' }));
                    });
                }

                if (section.id === 'skills') {
                    const headings = section.querySelectorAll('.skill-category h3');
                    data.skillHeadingsChars = [];
                    headings.forEach(h => {
                        data.skillHeadingsChars = data.skillHeadingsChars.concat(splitText(h, { type: 'chars' }));
                    });
                }

                if (section.id === 'projects') {
                    const projectTitles = section.querySelectorAll('.project-header h3');
                    data.projectTitleChars = [];
                    projectTitles.forEach(h => {
                        data.projectTitleChars = data.projectTitleChars.concat(splitText(h, { type: 'chars' }));
                    });
                }

                if (section.id === 'certifications') {
                    const certTitles = section.querySelectorAll('.cert-card h3');
                    data.certTitleChars = [];
                    certTitles.forEach(h => {
                        data.certTitleChars = data.certTitleChars.concat(splitText(h, { type: 'chars' }));
                    });
                }

                if (section.id === 'contact') {
                    const contactHeadings = section.querySelectorAll('.contact-details h3');
                    data.contactHeadingChars = [];
                    contactHeadings.forEach(h => {
                        data.contactHeadingChars = data.contactHeadingChars.concat(splitText(h, { type: 'chars' }));
                    });
                }
            }

            kineticSections.set(section, data);
        });
    }

    function initHeroNameInteractions() {
        if (typeof gsap === 'undefined' || prefersReducedMotion) {
            return;
        }

        if (!heroTitleElement || !heroTitleChars.length) return;

        gsap.set(heroTitleChars, {
            transformOrigin: '50% 50%'
        });

        // Constant "liquid breathing" idle animation using variable font + chromatic aberration
        const centerIndex = (heroTitleChars.length - 1) / 2;

        gsap.to(heroTitleElement, {
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            '--wght': 760,
            letterSpacing: '0.14em',
            '--ca-x': '1.5px',
            '--ca-y': '1px'
        });

        gsap.to(heroTitleChars, {
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            y: (i) => gsap.utils.mapRange(0, heroTitleChars.length - 1, -4, 4, i),
            scaleY: 1.06,
            stagger: {
                each: 0.06,
                from: 'center'
            }
        });

        let scrollRaf = null;

    function updateOnScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
            const windowHeight = window.innerHeight || 1;

            let t = scrollTop / windowHeight;
            t = Math.max(0, Math.min(1, t));

            const intensity = t;

            gsap.to(heroTitleChars, {
                duration: 0.3,
                ease: 'power3.out',
                overwrite: 'auto',
                skewX: i => gsap.utils.mapRange(
                    0,
                    heroTitleChars.length - 1,
                    -10 * intensity,
                    10 * intensity,
                    i
                ),
                scaleX: 1 + 0.15 * intensity,
                y: i => gsap.utils.mapRange(
                    0,
                    heroTitleChars.length - 1,
                    -4 * intensity,
                    4 * intensity,
                    i
                ),
                x: i => {
                    const center = (heroTitleChars.length - 1) / 2;
                    return (i - center) * 2 * intensity;
                }
            });
        }

        function onScroll() {
            if (scrollRaf !== null) return;
            scrollRaf = requestAnimationFrame(() => {
                scrollRaf = null;
                updateOnScroll();
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        updateOnScroll();

        heroTitleElement.addEventListener('mouseenter', () => {
            gsap.fromTo(
                heroTitleChars,
                {
                    y: 0,
                    scaleY: 1
                },
                {
                    duration: 0.45,
                    y: -10,
                    scaleY: 1.25,
                    ease: 'power2.out',
                    stagger: {
                        each: 0.035,
                        from: 'center'
                    },
                    yoyo: true,
                    repeat: 1,
                    overwrite: 'auto'
                }
            );
        });
    }

    function setupIntroOverlay() {
        if (!introOverlay || !introName || !heroTitleElement || typeof gsap === 'undefined') {
            return;
        }

        let revealed = false;

        function revealHome() {
            if (revealed) return;
            revealed = true;

            const heroRect = heroTitleElement.getBoundingClientRect();
            const introRect = introName.getBoundingClientRect();

            const scaleX = introRect.width / heroRect.width || 1;
            const scaleY = introRect.height / heroRect.height || 1;
            const scale = (scaleX + scaleY) / 2;

            const dx = introRect.left - heroRect.left;
            const dy = introRect.top - heroRect.top;

            gsap.set(heroTitleElement, {
                x: dx,
                y: dy,
                scale: scale,
                opacity: 1
            });

            gsap.to(heroTitleElement, {
                duration: 1.1,
                x: 0,
                y: 0,
                scale: 1,
                ease: 'power3.inOut'
            });

            gsap.to(introOverlay, {
                duration: 0.8,
                opacity: 0,
                ease: 'power2.out',
                onComplete() {
                    introOverlay.style.display = 'none';
                }
            });
        }

        window.addEventListener('click', revealHome, { once: true });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                revealHome();
            }
        });
    }

    function playKineticTypography(section) {
        if (typeof gsap === 'undefined' || prefersReducedMotion) {
            return;
        }

        if (!section || section.dataset.ktPlayed === 'true') return;

        const data = kineticSections.get(section);
        if (!data) return;

        section.dataset.ktPlayed = 'true';

        const tl = gsap.timeline({
            defaults: {
                ease: 'power3.out',
                duration: 0.8
            }
        });

        if (data.heroTitleChars && data.heroTitleChars.length) {
            tl.from(data.heroTitleChars, {
                opacity: 0,
                y: 40,
                stagger: 0.04
            }, 0);
        }

        if (data.heroDescWords && data.heroDescWords.length) {
            tl.from(data.heroDescWords, {
                opacity: 0,
                y: 20,
                stagger: 0.02
            }, '-=0.3');
        }

        if (data.titleChars && data.titleChars.length) {
            tl.from(data.titleChars, {
                opacity: 0,
                y: 30,
                stagger: 0.03
            }, 0);
        }

        if (data.bodyWords && data.bodyWords.length) {
            tl.from(data.bodyWords, {
                opacity: 0,
                y: 20,
                stagger: 0.01
            }, '-=0.4');
        }

        if (data.skillHeadingsChars && data.skillHeadingsChars.length) {
            tl.from(data.skillHeadingsChars, {
                opacity: 0,
                y: 25,
                rotateX: -90,
                stagger: 0.02
            }, '-=0.3');
        }

        if (data.projectTitleChars && data.projectTitleChars.length) {
            tl.from(data.projectTitleChars, {
                opacity: 0,
                y: 40,
                skewX: 10,
                stagger: 0.015
            }, 0);
        }

        if (data.certTitleChars && data.certTitleChars.length) {
            tl.from(data.certTitleChars, {
                opacity: 0,
                y: 25,
                scale: 0.8,
                stagger: 0.03
            }, 0);
        }

        if (data.contactHeadingChars && data.contactHeadingChars.length) {
            tl.from(data.contactHeadingChars, {
                opacity: 0,
                y: 25,
                stagger: 0.03
            }, 0);
        }
    }

    // Vanta.js background effects
    let vantaEffects = {};
    let lastIsMobile = null;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function initVantaEffects() {
        // Respect reduced motion preference
        if (prefersReducedMotion) {
            return;
        }

        const container = document.getElementById('vanta-main');
        if (!container || typeof VANTA === 'undefined' || typeof VANTA.GLOBE !== 'function') {
            return;
        }

        const mobile = isMobile();

        const baseOptions = {
            el: '#vanta-main',
            mouseControls: !mobile,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: mobile ? 1.0 : 1.0,
            scaleMobile: mobile ? 0.8 : 0.5,
            color: 0xff6b35,
            color2: 0xff8c42,
            backgroundColor: 0x0a0a0a,
            size: mobile ? 0.8 : 1.0
        };

        vantaEffects.main = VANTA.GLOBE(baseOptions);
    }

    function destroyVantaEffects() {
        Object.keys(vantaEffects).forEach(key => {
            if (vantaEffects[key] && typeof vantaEffects[key].destroy === 'function') {
                vantaEffects[key].destroy();
            }
        });
        vantaEffects = {};
    }

    function handleVantaResize() {
        const nowIsMobile = isMobile();

        // On first run, set baseline and init once
        if (lastIsMobile === null) {
            lastIsMobile = nowIsMobile;
            initVantaEffects();
        } else if (nowIsMobile !== lastIsMobile) {
            // Crossing breakpoint: destroy and re-init with new dimensions/config
            destroyVantaEffects();
            initVantaEffects();
            lastIsMobile = nowIsMobile;
        } else {
            // Same mode, just resize existing effects if available
            Object.keys(vantaEffects).forEach(key => {
                if (vantaEffects[key] && typeof vantaEffects[key].resize === 'function') {
                    vantaEffects[key].resize();
                }
            });
        }
    }

    // Initialize Vanta effects with responsive resize handling
    handleVantaResize();

    // Handle window resize/orientation changes for responsiveness
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleVantaResize, 200);
    });

    function initTypewriter() {
        const el = document.querySelector('.hero-subtitle-typewriter');
        const cursor = document.querySelector('.hero-subtitle-cursor');
        const fullText = 'Information Technology Student';
        if (!el) return;

        if (prefersReducedMotion) {
            el.textContent = fullText;
            if (cursor) cursor.style.visibility = 'hidden';
            return;
        }

        let index = 0;
        let isDeleting = false;
        const typeSpeed = 90;
        const deleteSpeed = 55;
        const pauseAfterType = 2200;
        const pauseAfterDelete = 400;

        function tick() {
            const current = el.textContent;
            if (!isDeleting) {
                if (index <= fullText.length) {
                    el.textContent = fullText.slice(0, index);
                    index++;
                    setTimeout(tick, typeSpeed);
                } else {
                    isDeleting = true;
                    setTimeout(tick, pauseAfterType);
                }
            } else {
                if (index > 0) {
                    index--;
                    el.textContent = fullText.slice(0, index);
                    setTimeout(tick, deleteSpeed);
                } else {
                    isDeleting = false;
                    setTimeout(tick, pauseAfterDelete);
                }
            }
        }

        setTimeout(tick, 600);
    }

    // Initialize kinetic typography
    initKineticTypography();
    initHeroNameInteractions();
    setupIntroOverlay();
    initTypewriter();

    // Initialize: Set animation delays for all sections
    sections.forEach(section => {
        setAnimationDelays(section);
    });

    // Toggle mobile menu (if navbar exists)
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link (if navbar exists)
    if (navMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Function to set animation delays for child elements
    function setAnimationDelays(section) {
        const skillCategories = section.querySelectorAll('.skill-category');
        skillCategories.forEach((category, index) => {
            category.style.setProperty('--delay', index);
        });

        const projectCards = section.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.setProperty('--delay', index);
        });

        const certCards = section.querySelectorAll('.cert-card');
        certCards.forEach((card, index) => {
            card.style.setProperty('--delay', index);
        });

        const contactItems = section.querySelectorAll('.contact-item');
        contactItems.forEach((item, index) => {
            item.style.setProperty('--delay', index);
        });
    }

    // Section switching and navigation highlighting
    function showSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        sections.forEach(section => {
            section.classList.toggle('active', section === targetSection);
        });

        playKineticTypography(targetSection);

        const currentId = targetId;

        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentId) {
                link.classList.add('active');
            }
        });

        // Update section navigation buttons
        sectionNavButtons.forEach(button => {
            const target = button.getAttribute('data-target');
            button.classList.toggle('active', target === currentId);
        });
    }

    // Set first section as active immediately
    if (sections.length > 0) {
        showSection(sections[0].id);
    }

    // Check if View Transitions API is supported
    function supportsViewTransitions() {
        return 'startViewTransition' in document;
    }

    // Smooth view switching for navigation links with View Transitions
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            
            if (targetId) {
                if (supportsViewTransitions()) {
                    document.startViewTransition(() => {
                        showSection(targetId);
                    });
                } else {
                    showSection(targetId);
                }
            }
        });
    });

    // No horizontal scroll or swipe navigation needed; handled via showSection

    // Section navigation button click handlers with View Transitions
    sectionNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            if (targetId) {
                if (supportsViewTransitions()) {
                    document.startViewTransition(() => {
                        showSection(targetId);
                    });
                } else {
                    showSection(targetId);
                }
            }
        });
    });

    // Hero CTA buttons
    if (heroProjectsBtn) {
        heroProjectsBtn.addEventListener('click', function() {
            const targetId = 'projects';
            if (supportsViewTransitions()) {
                document.startViewTransition(() => {
                    showSection(targetId);
                });
            } else {
                showSection(targetId);
            }
        });
    }

    if (heroAboutBtn) {
        heroAboutBtn.addEventListener('click', function() {
            const targetId = 'about';
            if (supportsViewTransitions()) {
                document.startViewTransition(() => {
                    showSection(targetId);
                });
            } else {
                showSection(targetId);
            }
        });
    }

    // Micro-interactions for buttons (exclude modal view buttons from loading state)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('project-view-btn')) return;
            if (this.href && !this.href.includes('#')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });

    // Micro-interaction for skill tags
    const skillTags = document.querySelectorAll('.skill-tag, .tech-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Micro-interaction for project cards (handled via CSS hover)

    // Micro-interaction for cert cards (handled via CSS hover)

    // Project screenshots modal
    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = projectModal ? projectModal.querySelector('.project-modal-title') : null;
    const projectModalGallery = projectModal ? projectModal.querySelector('.project-modal-gallery') : null;
    const imageLightbox = document.getElementById('project-image-lightbox');
    const imageLightboxImg = imageLightbox ? imageLightbox.querySelector('img') : null;

    function openProjectModal(title, images) {
        if (!projectModal || !projectModalTitle || !projectModalGallery) return;

        projectModalTitle.textContent = title || 'Project Screenshots';
        projectModalGallery.innerHTML = '';

        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${title} screenshot`;
            projectModalGallery.appendChild(img);
        });

        projectModal.classList.add('open');
        body.style.overflow = 'hidden';
        projectModal.setAttribute('aria-hidden', 'false');
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('open');
        body.style.overflow = '';
        projectModal.setAttribute('aria-hidden', 'true');
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('[data-modal-close]')) {
                closeProjectModal();
            }
        });

        // Delegate click on gallery images to open fullscreen view
        projectModal.addEventListener('click', (e) => {
            const img = e.target.closest('.project-modal-gallery img');
            if (!img || !imageLightbox || !imageLightboxImg) return;
            imageLightboxImg.src = img.src;
            imageLightboxImg.alt = img.alt || 'Project screenshot enlarged';
            imageLightbox.classList.add('open');
            imageLightbox.setAttribute('aria-hidden', 'false');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('open')) {
                closeProjectModal();
            }
            if (e.key === 'Escape' && imageLightbox && imageLightbox.classList.contains('open')) {
                imageLightbox.classList.remove('open');
                imageLightbox.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (imageLightbox) {
        imageLightbox.addEventListener('click', () => {
            imageLightbox.classList.remove('open');
            imageLightbox.setAttribute('aria-hidden', 'true');
        });
    }

    const viewButtons = document.querySelectorAll('.project-view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.project-card');
            const titleEl = card ? card.querySelector('.project-header h3') : null;
            const title = titleEl ? titleEl.textContent.trim() : 'Project Screenshots';
            const imagesAttr = button.getAttribute('data-images') || '';
            const images = imagesAttr.split(',').map(src => src.trim()).filter(Boolean);
            if (!images.length) return;
            openProjectModal(title, images);
        });
    });

    // Certification cards - open corresponding PDF certificates
    const certCards = document.querySelectorAll('.cert-card[data-pdf]');
    certCards.forEach(card => {
        const pdfPath = card.getAttribute('data-pdf');
        if (!pdfPath) return;

        const openCert = () => {
            window.open(pdfPath, '_blank');
        };

        card.addEventListener('click', openCert);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCert();
            }
        });
    });
});