// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const body = document.body;

    // Vanta.js background effects
    let vantaEffects = {};

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function initVantaEffects() {
        // Don't initialize Vanta on mobile for better performance
        if (isMobile()) {
            return;
        }

        // Home - Globe effect
        if (document.getElementById('vanta-home')) {
            vantaEffects.home = VANTA.GLOBE({
                el: '#vanta-home',
                mouseControls: true,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 0.50,
                color: 0xff6b35,
                color2: 0xff8c42,
                backgroundColor: 0x0a0a0a,
                size: 1.00
            });
        }

        // About - Halo effect
        if (document.getElementById('vanta-about')) {
            vantaEffects.about = VANTA.HALO({
                el: '#vanta-about',
                mouseControls: true,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 0.50,
                baseColor: 0x0a0a0a,
                backgroundColor: 0x050505,
                amplitudeFactor: 1.20,
                size: 1.20
            });
        }

        // Skills - Cells effect
        if (document.getElementById('vanta-skills')) {
            vantaEffects.skills = VANTA.CELLS({
                el: '#vanta-skills',
                mouseControls: true,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 0.50,
                color1: 0xff6b35,
                color2: 0xff8c42,
                backgroundColor: 0x0a0a0a,
                size: 1.20,
                speed: 1.20
            });
        }

        // Projects - Net effect
        if (document.getElementById('vanta-projects')) {
            vantaEffects.projects = VANTA.NET({
                el: '#vanta-projects',
                mouseControls: true,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 0.50,
                color: 0xff6b35,
                backgroundColor: 0x0a0a0a,
                points: 15.00,
                maxDistance: 30.00,
                spacing: 20.00
            });
        }

        // Certifications - Dots effect
        if (document.getElementById('vanta-certifications')) {
            vantaEffects.certifications = VANTA.DOTS({
                el: '#vanta-certifications',
                mouseControls: true,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 0.50,
                color: 0xff6b35,
                color2: 0xff8c42,
                size: 3.00,
                spacing: 20.00
            });
        }

        // Contact - Fog effect
        if (document.getElementById('vanta-contact')) {
            vantaEffects.contact = VANTA.FOG({
                el: '#vanta-contact',
                mouseControls: true,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: 0xff6b35,
                midtoneColor: 0xff8c42,
                lowlightColor: 0xffa500,
                baseColor: 0x0a0a0a,
                blurFactor: 0.47,
                speed: 1.50,
                zoom: 0.90
            });
        }

    }

    // Initialize Vanta effects
    initVantaEffects();

    // Handle window resize - destroy Vanta on mobile, recreate on desktop
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const wasMobile = Object.keys(vantaEffects).length === 0;
            const isNowMobile = isMobile();
            
            if (wasMobile && !isNowMobile) {
                // Switched from mobile to desktop - initialize effects
                initVantaEffects();
            } else if (!wasMobile && isNowMobile) {
                // Switched from desktop to mobile - destroy effects
                Object.keys(vantaEffects).forEach(key => {
                    if (vantaEffects[key] && vantaEffects[key].destroy) {
                        vantaEffects[key].destroy();
                    }
                });
                vantaEffects = {};
            }
        }, 250);
    });

    // Initialize: Set animation delays for all sections
    sections.forEach(section => {
        setAnimationDelays(section);
    });

    // Use Intersection Observer to trigger animations when sections come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Set first section as active immediately
    if (sections.length > 0) {
        sections[0].classList.add('active');
    }

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

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

    // Function to get current active section based on horizontal scroll
    function getCurrentSection() {
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const windowWidth = window.innerWidth;
        const scrollPosition = scrollLeft + windowWidth / 2;

        let currentSection = sections[0];
        sections.forEach(section => {
            const sectionLeft = section.offsetLeft;
            const sectionWidth = section.offsetWidth;
            if (scrollPosition >= sectionLeft && scrollPosition < sectionLeft + sectionWidth) {
                currentSection = section;
            }
        });

        return currentSection;
    }

    // Active navigation highlighting
    function updateActiveSection() {
        const currentSection = getCurrentSection();
        const currentId = currentSection.getAttribute('id');

        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentId) {
                link.classList.add('active');
            }
        });
    }

    // Horizontal scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveSection, 50);

        // Add scroll effect to navbar
        const navbar = document.querySelector('.navbar');
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (scrollLeft > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    }, { passive: true });

    // Check if View Transitions API is supported
    function supportsViewTransitions() {
        return 'startViewTransition' in document;
    }

    // Smooth horizontal scrolling for navigation links with View Transitions
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                if (supportsViewTransitions()) {
                    // Use View Transitions API for smooth transitions
                    document.startViewTransition(() => {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'start'
                        });
                    });
                } else {
                    // Fallback for browsers without View Transitions support
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start'
                    });
                }
            }
        });
    });

    // Handle wheel events for horizontal scrolling
    let isScrolling = false;
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        // Check if scrolling vertically
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            isScrolling = true;
            
            const scrollAmount = e.deltaY;
            window.scrollBy({
                left: scrollAmount,
                behavior: 'auto'
            });
            
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        }
    }, { passive: false });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const currentSection = getCurrentSection();
            const currentIndex = Array.from(sections).indexOf(currentSection);
            
            if (diff > 0 && currentIndex < sections.length - 1) {
                // Swipe left - go to next section
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - go to previous section
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        }
    }

    // Initialize on load
    updateActiveSection();

    // Section indicator click handlers with View Transitions
    const sectionIndicators = document.querySelectorAll('.section-indicator');
    sectionIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                if (supportsViewTransitions()) {
                    document.startViewTransition(() => {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'start'
                        });
                    });
                } else {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start'
                    });
                }
            }
        });
    });

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