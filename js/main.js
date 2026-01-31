// ========================================
// FORGED SOLUTIONS - Main JavaScript
// Version: 2.0 - Project Builder
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Forged JS v2.0 loaded');

    // Hero page-load animation
    const heroContent = document.querySelector('.hero-animate');
    if (heroContent) {
        // Small delay ensures CSS is ready
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                heroContent.classList.add('loaded');
            });
        });
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.querySelector('.nav__links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add 'scrolled' class to nav on scroll
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // TYPEWRITER EFFECT
    // ========================================

    const typewriterElements = document.querySelectorAll('.typewriter');

    typewriterElements.forEach(function(element) {
        const textSpan = element.querySelector('.typewriter__text');
        const cursor = element.querySelector('.terminal-cursor');
        const fullText = element.dataset.text;
        let isTyping = false;
        let typeTimeout = null;

        // Hide cursor initially
        if (cursor) cursor.style.opacity = '0';

        // Set up Intersection Observer to trigger when section is visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Only start if not already typing
                    if (!isTyping) {
                        isTyping = true;
                        // Reset text
                        textSpan.textContent = '';
                        // Wait for snap animation to complete before typing
                        setTimeout(function() {
                            typeText(textSpan, fullText, cursor, function() {
                                // Typing complete
                            });
                        }, 800);
                    }
                } else {
                    // Left viewport - reset for next time
                    isTyping = false;
                    clearTimeout(typeTimeout);
                    textSpan.textContent = '';
                    if (cursor) cursor.style.opacity = '0';
                }
            });
        }, { threshold: 0.8 });

        observer.observe(element);
    });

    function typeText(element, text, cursor, callback) {
        const typingSpeed = 100; // ms per character

        // Show cursor when typing starts
        if (cursor) cursor.style.opacity = '1';

        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, typingSpeed);
            } else {
                // Typing complete
                if (callback) callback();
            }
        }

        type();
    }

    // ========================================
    // FADE WORDS ANIMATION
    // ========================================

    // Track if snap scroll is active (to prevent observer from firing during snap)
    window.fadeWordsSnapActive = false;

    // Function to trigger fade animation (called by snap scroll)
    window.triggerFadeWords = function(section) {
        const fadeElement = section.querySelector('.fade-words');
        if (fadeElement && !fadeElement.classList.contains('animate')) {
            fadeElement.classList.add('animate');
        }
    };

    // Function to reset fade animation (called when leaving section)
    window.resetFadeWords = function(section) {
        const fadeElement = section.querySelector('.fade-words');
        if (fadeElement) {
            fadeElement.classList.remove('animate');
        }
    };

    // Function to trigger section fade animation (called by snap scroll)
    window.triggerFadeSection = function(section) {
        const fadeElement = section.querySelector('.fade-section');
        if (fadeElement && !fadeElement.classList.contains('animate')) {
            fadeElement.classList.add('animate');
        }
    };

    // Function to trigger header fade animation (called by snap scroll)
    window.triggerFadeHeader = function(section) {
        const fadeHeader = section.querySelector('.fade-header');
        if (fadeHeader && !fadeHeader.classList.contains('animate')) {
            fadeHeader.classList.add('animate');

            // Trigger tile animations after header fade completes (1s)
            const fadeTiles = section.querySelector('.fade-tiles');
            if (fadeTiles && !fadeTiles.classList.contains('animate')) {
                setTimeout(function() {
                    fadeTiles.classList.add('animate');
                }, 1000);
            }
        }
    };

    // Fallback: Intersection Observer for mobile/free scroll only
    document.querySelectorAll('.fade-words').forEach(function(element) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                // Don't trigger if snap scroll is handling it
                if (window.fadeWordsSnapActive) return;

                if (entry.isIntersecting && !element.classList.contains('animate')) {
                    // Extra delay for non-snap scroll
                    setTimeout(function() {
                        if (!element.classList.contains('animate')) {
                            element.classList.add('animate');
                        }
                    }, 1000);
                } else if (!entry.isIntersecting) {
                    // Reset when leaving viewport
                    element.classList.remove('animate');
                }
            });
        }, { threshold: 0.9 });

        observer.observe(element);
    });

    // Fallback: Intersection Observer for fade-section on mobile/free scroll
    document.querySelectorAll('.fade-section').forEach(function(element) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (window.fadeWordsSnapActive) return;

                if (entry.isIntersecting && !element.classList.contains('animate')) {
                    setTimeout(function() {
                        if (!element.classList.contains('animate')) {
                            element.classList.add('animate');
                        }
                    }, 500);
                } else if (!entry.isIntersecting) {
                    // Reset when leaving viewport
                    element.classList.remove('animate');
                }
            });
        }, { threshold: 0.3 });

        observer.observe(element);
    });

    // Scroll indicators - show/hide based on position
    const scrollUpIndicator = document.getElementById('scroll-up');
    const scrollDownIndicator = document.getElementById('scroll-down');

    function updateScrollIndicators() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const scrollBottom = scrollHeight - scrollTop - clientHeight;

        const showUp = scrollTop > clientHeight * 0.5;
        const showDown = scrollBottom > 100;

        // Show scroll up when not at top (past first section)
        if (scrollUpIndicator) {
            if (showUp) {
                scrollUpIndicator.classList.add('visible');
            } else {
                scrollUpIndicator.classList.remove('visible');
            }
        }

        // Show scroll down when not at bottom
        if (scrollDownIndicator) {
            if (showDown) {
                scrollDownIndicator.classList.add('visible');
            } else {
                scrollDownIndicator.classList.remove('visible');
            }
        }

        // When both visible, hide text (show only arrows)
        if (scrollUpIndicator && scrollDownIndicator) {
            if (showUp && showDown) {
                scrollUpIndicator.classList.add('arrows-only');
                scrollDownIndicator.classList.add('arrows-only');
            } else {
                scrollUpIndicator.classList.remove('arrows-only');
                scrollDownIndicator.classList.remove('arrows-only');
            }
        }
    }

    if (scrollUpIndicator || scrollDownIndicator) {
        window.addEventListener('scroll', updateScrollIndicators);
        // Initial check
        updateScrollIndicators();
    }

    // ========================================
    // SMOOTH FULL-PAGE SCROLL SNAP
    // Apple-style smooth section transitions
    // ========================================

    const snapSections = document.querySelectorAll('.snap-section');
    const regularContent = document.getElementById('regular-content');

    if (snapSections.length > 0) {
        // Configuration
        const config = {
            animationDuration: 150,      // Very fast
            scrollThreshold: 150,        // Accumulated scroll needed to trigger (down)
            scrollUpThreshold: 300,      // Higher threshold for scrolling up
            snapDelay: 900,              // Delay before snapping to nearest section (up)
            cooldownAfterSnap: 300,      // Cooldown after animation to prevent skipping
            touchThreshold: 30,          // Min touch delta to trigger snap
            mobileBreakpoint: 768        // Disable snap below this width
        };

        // State
        let currentSectionIndex = 0;
        let isAnimating = false;
        let lastSnapTime = 0;
        let scrollAccumulator = 0;
        let lastWheelTime = 0;
        let snapTimeout = null;
        let freeScrollMode = false;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isMobileView = window.innerWidth <= config.mobileBreakpoint;

        // Simple easing - smooth deceleration, no bounce
        function easeOutQuad(t) {
            return t * (2 - t);
        }

        // Cache mobile check - update on resize
        function updateMobileCheck() {
            isMobileView = window.innerWidth <= config.mobileBreakpoint;
        }

        // Get current section based on scroll position
        function getCurrentSection() {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            for (let i = snapSections.length - 1; i >= 0; i--) {
                const section = snapSections[i];
                const rect = section.getBoundingClientRect();
                const sectionTop = scrollY + rect.top;

                // If we're more than 30% into this section, consider it current
                if (scrollY >= sectionTop - viewportHeight * 0.3) {
                    return i;
                }
            }
            return 0;
        }

        // Get nearest section based on which one occupies most of viewport
        function getNearestSection() {
            let maxVisibility = 0;
            let nearestIndex = 0;

            snapSections.forEach(function(section, index) {
                const rect = section.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                // Calculate how much of the section is visible
                const visibleTop = Math.max(0, rect.top);
                const visibleBottom = Math.min(viewportHeight, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                if (visibleHeight > maxVisibility) {
                    maxVisibility = visibleHeight;
                    nearestIndex = index;
                }
            });

            return nearestIndex;
        }

        // Snap to nearest section after scrolling stops
        function snapToNearest() {
            if (isAnimating) return;
            if (isInRegularContent()) {
                freeScrollMode = false;
                return;
            }

            const nearest = getNearestSection();
            if (nearest !== currentSectionIndex) {
                goToSection(nearest);
            } else {
                // Already on nearest, but might need to align
                const section = snapSections[currentSectionIndex];
                const rect = section.getBoundingClientRect();
                if (Math.abs(rect.top) > 50) {
                    goToSection(currentSectionIndex);
                }
            }

            // Re-engage controlled scroll mode after snap
            freeScrollMode = false;
        }

        // Check if we're in the regular content area
        function isInRegularContent() {
            if (!regularContent) return false;
            const rect = regularContent.getBoundingClientRect();
            return rect.top < window.innerHeight * 0.5;
        }

        // Smooth scroll to a specific Y position
        function smoothScrollTo(targetY, duration, callback) {
            const startY = window.scrollY;
            const distance = targetY - startY;
            const startTime = performance.now();

            isAnimating = true;

            // Start first frame immediately (no wait for rAF)
            window.scrollTo(0, startY + distance * 0.08);

            function animationStep(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = easeOutQuad(progress);

                window.scrollTo(0, startY + distance * easeProgress);

                if (progress < 1) {
                    requestAnimationFrame(animationStep);
                } else {
                    isAnimating = false;
                    lastSnapTime = Date.now();
                    if (callback) callback();
                }
            }

            requestAnimationFrame(animationStep);
        }

        // Navigate to a specific section
        function goToSection(index, duration) {
            if (index < 0 || index >= snapSections.length) return;
            if (isAnimating) return;

            const previousIndex = currentSectionIndex;
            const section = snapSections[index];
            const targetY = section.offsetTop;

            currentSectionIndex = index;

            // Mark snap as active to prevent observer from firing
            window.fadeWordsSnapActive = true;

            // Reset animations on sections we're leaving
            snapSections.forEach(function(sec, i) {
                if (i !== index) {
                    if (window.resetFadeWords) {
                        window.resetFadeWords(sec);
                    }
                }
            });

            smoothScrollTo(targetY, duration || config.animationDuration, function() {
                // Trigger fade animations 0.25 seconds after snap completes
                setTimeout(function() {
                    if (window.triggerFadeWords) {
                        window.triggerFadeWords(section);
                    }
                    if (window.triggerFadeSection) {
                        window.triggerFadeSection(section);
                    }
                    if (window.triggerFadeHeader) {
                        window.triggerFadeHeader(section);
                    }
                    window.fadeWordsSnapActive = false;
                }, 250);
            });
        }

        // Navigate to regular content (exit snap zone)
        function goToRegularContent() {
            if (isAnimating || !regularContent) return;

            smoothScrollTo(regularContent.offsetTop, config.animationDuration);
        }

        // Handle wheel events - accumulator for down, instant for up
        function handleWheel(e) {
            // Quick exits
            if (isMobileView) return;

            // Check if we're in the regular content area
            const inRegularContent = regularContent && regularContent.getBoundingClientRect().top < window.innerHeight * 0.5;

            // In regular content - handle transition back to snap zone
            if (inRegularContent) {
                const regularTop = regularContent.getBoundingClientRect().top;

                // Scrolling up near top of regular content - snap back to last section
                if (e.deltaY < 0 && regularTop >= -10 && !isAnimating) {
                    e.preventDefault();
                    freeScrollMode = false;
                    clearTimeout(snapTimeout);
                    goToSection(snapSections.length - 1);
                    return;
                }

                // Otherwise, allow natural scrolling in regular content
                return;
            }

            // SCROLLING UP - engage free scroll mode
            if (e.deltaY < 0) {
                freeScrollMode = true;
                scrollAccumulator = 0;

                // Debounce snap to nearest section when scrolling stops
                clearTimeout(snapTimeout);
                snapTimeout = setTimeout(snapToNearest, config.snapDelay);
                return;
            }

            // SCROLLING DOWN
            // If in free scroll mode, allow natural scroll and reset snap timer
            if (freeScrollMode) {
                clearTimeout(snapTimeout);
                snapTimeout = setTimeout(snapToNearest, config.snapDelay);
                return;
            }

            // Controlled scroll down - block default and use accumulator
            e.preventDefault();
            if (isAnimating) return;

            // SCROLLING DOWN - use accumulator to prevent skipping
            if (Date.now() - lastSnapTime < config.cooldownAfterSnap) return;

            // Reset accumulator if direction changed or too much time passed
            const now = Date.now();
            if (now - lastWheelTime > 200 || scrollAccumulator < 0) {
                scrollAccumulator = 0;
            }
            lastWheelTime = now;

            // Accumulate scroll
            scrollAccumulator += e.deltaY;

            // Check if threshold reached
            if (scrollAccumulator >= config.scrollThreshold) {
                if (currentSectionIndex < snapSections.length - 1) {
                    goToSection(currentSectionIndex + 1);
                } else if (regularContent) {
                    goToRegularContent();
                }
                scrollAccumulator = 0;
                lastSnapTime = Date.now();
            }
        }

        // Handle touch events for mobile-like gestures on desktop
        function handleTouchStart(e) {
            if (isMobileView) return;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }

        function handleTouchEnd(e) {
            if (isMobileView) return;
            if (isAnimating) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchDelta = touchStartY - touchEndY;
            const touchDuration = Date.now() - touchStartTime;

            // Only trigger on quick swipes with sufficient distance
            if (Math.abs(touchDelta) < config.touchThreshold) return;
            if (touchDuration > 500) return; // Too slow

            // Check cooldown
            if (Date.now() - lastScrollTime < config.cooldownTime) return;

            // If in regular content
            if (isInRegularContent()) {
                const regularRect = regularContent.getBoundingClientRect();
                if (touchDelta < 0 && regularRect.top >= -50) {
                    goToSection(snapSections.length - 1);
                }
                return;
            }

            if (touchDelta > 0) {
                // Swiping up (scroll down)
                if (currentSectionIndex < snapSections.length - 1) {
                    goToSection(currentSectionIndex + 1);
                } else {
                    goToRegularContent();
                }
            } else {
                // Swiping down (scroll up)
                if (currentSectionIndex > 0) {
                    goToSection(currentSectionIndex - 1);
                }
            }
        }

        // Handle keyboard navigation
        function handleKeydown(e) {
            if (isMobileView) return;
            if (isAnimating) return;

            // Only handle if not in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Check cooldown
            if (Date.now() - lastScrollTime < config.cooldownTime) return;

            if (isInRegularContent()) return; // Allow normal keyboard scroll in regular content

            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    if (currentSectionIndex < snapSections.length - 1) {
                        goToSection(currentSectionIndex + 1);
                    } else {
                        goToRegularContent();
                    }
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    if (currentSectionIndex > 0) {
                        goToSection(currentSectionIndex - 1);
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSection(0);
                    break;
            }
        }

        // Initialize current section on load
        function initCurrentSection() {
            currentSectionIndex = getCurrentSection();
        }

        // Handle resize
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                updateMobileCheck();
                if (!isMobileView && !isInRegularContent()) {
                    const section = snapSections[currentSectionIndex];
                    if (section) {
                        window.scrollTo(0, section.offsetTop);
                    }
                }
            }, 150);
        }

        // Bind events
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', handleResize);

        // Initialize
        initCurrentSection();

        // If page loads not at top, align to nearest section
        if (window.scrollY > 50 && !isMobileView && !isInRegularContent()) {
            setTimeout(function() {
                goToSection(currentSectionIndex, 500);
            }, 100);
        }

        // Scroll up indicator click - scroll to top and reset section index
        if (scrollUpIndicator) {
            scrollUpIndicator.style.cursor = 'pointer';
            scrollUpIndicator.style.pointerEvents = 'auto';
            scrollUpIndicator.addEventListener('click', function() {
                currentSectionIndex = 0;
                freeScrollMode = false;
                clearTimeout(snapTimeout);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        console.log('Smooth scroll snap initialized with', snapSections.length, 'sections');
    }

    // ========================================
    // SOLUTION FILTERING
    // ========================================

    const filterBtns = document.querySelectorAll('.filter-btn');
    const solutionCards = document.querySelectorAll('.projects-grid .card[data-tags]');

    if (filterBtns.length > 0 && solutionCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');

                // Filter cards
                solutionCards.forEach(card => {
                    const tags = card.dataset.tags || '';
                    if (filter === 'all' || tags.includes(filter)) {
                        card.classList.remove('card--hidden');
                    } else {
                        card.classList.add('card--hidden');
                    }
                });
            });
        });
    }

    // ========================================
    // PROJECT BUILDER WIZARD
    // ========================================

    const pathSelection = document.getElementById('path-selection');
    const quickInquiry = document.getElementById('quick-inquiry');
    const projectWizard = document.getElementById('project-wizard');

    // Only run wizard code if elements exist
    if (pathSelection && quickInquiry && projectWizard) {
        console.log('Project Builder elements found, initializing...');
        initProjectBuilder();
    } else {
        console.log('Project Builder elements not found:', { pathSelection: !!pathSelection, quickInquiry: !!quickInquiry, projectWizard: !!projectWizard });
    }

    function initProjectBuilder() {
        // Wizard state
        const wizardState = {
            currentStep: 1,
            totalSteps: 6,
            data: loadWizardData()
        };

        // Path selection
        const pathCards = document.querySelectorAll('.path-card');
        const backToPathButtons = document.querySelectorAll('.back-to-paths');

        pathCards.forEach(card => {
            card.addEventListener('click', () => {
                const path = card.dataset.path;
                console.log('Path card clicked:', path);
                pathSelection.style.display = 'none';

                if (path === 'quick') {
                    quickInquiry.style.display = 'block';
                } else if (path === 'wizard') {
                    projectWizard.style.display = 'block';
                    updateProgress();
                    updateSummary();
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        backToPathButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                quickInquiry.style.display = 'none';
                projectWizard.style.display = 'none';
                pathSelection.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // Step 1: Project Type Selection cards
        const selectionCards = document.querySelectorAll('.selection-card');
        selectionCards.forEach(card => {
            card.addEventListener('click', () => {
                selectionCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                wizardState.data.projectType = card.dataset.value;
                saveWizardData(wizardState.data);

                // Enable next button
                const nextBtn = document.querySelector('[data-step="1"] .wizard-next');
                if (nextBtn) nextBtn.disabled = false;

                // Update fields visibility based on project type
                updateConditionalFields();
            });
        });

        // Step 2: Industry cards
        const industryCards = document.querySelectorAll('.industry-card');
        industryCards.forEach(card => {
            card.addEventListener('click', () => {
                industryCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                wizardState.data.industry = card.dataset.value;
                saveWizardData(wizardState.data);

                // Enable next button for step 2
                const nextBtn = document.querySelector('[data-step="2"] .wizard-next');
                if (nextBtn) nextBtn.disabled = false;

                // Pre-check compliance for certain industries
                preSelectCompliance(card.dataset.value);

                updateSummary();
            });
        });

        // Pill buttons (timeline)
        const pills = document.querySelectorAll('.pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const name = pill.dataset.name;
                // Deselect siblings with same name
                document.querySelectorAll(`.pill[data-name="${name}"]`).forEach(p => {
                    p.classList.remove('selected');
                });
                pill.classList.add('selected');
                wizardState.data[name] = pill.dataset.value;
                saveWizardData(wizardState.data);
                updateSummary();
            });
        });

        // Budget cards
        const budgetCards = document.querySelectorAll('.budget-card');
        budgetCards.forEach(card => {
            card.addEventListener('click', () => {
                budgetCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                wizardState.data.budget = card.dataset.value;
                saveWizardData(wizardState.data);
                updateSummary();
            });
        });

        // Navigation buttons
        document.querySelectorAll('.wizard-next').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                collectStepData(wizardState.currentStep);
                goToStep(wizardState.currentStep + 1);
            });
        });

        document.querySelectorAll('.wizard-back').forEach(btn => {
            btn.addEventListener('click', () => {
                goToStep(wizardState.currentStep - 1);
            });
        });

        document.querySelectorAll('.wizard-skip').forEach(btn => {
            btn.addEventListener('click', () => {
                // Skip logic based on project type
                const projectType = wizardState.data.projectType;

                if (wizardState.currentStep === 1) {
                    if (!projectType) {
                        wizardState.data.projectType = 'notsure';
                        saveWizardData(wizardState.data);
                    }
                    // notsure skips to step 5 (Timeline)
                    if (wizardState.data.projectType === 'notsure') {
                        goToStep(5);
                        return;
                    }
                    // assessment skips to step 4 (Challenge)
                    if (wizardState.data.projectType === 'assessment') {
                        goToStep(4);
                        return;
                    }
                }

                goToStep(wizardState.currentStep + 1);
            });
        });

        function goToStep(step) {
            const projectType = wizardState.data.projectType;

            // Handle conditional skipping based on project type
            // notsure: skip steps 2,3,4 -> go directly to step 5
            if (projectType === 'notsure') {
                if (step > 1 && step < 5) {
                    step = 5;
                }
                // Going back from step 5 with notsure goes to step 1
                if (wizardState.currentStep === 5 && step < 5) {
                    step = 1;
                }
            }

            // assessment: skip steps 2,3 -> go to step 4
            if (projectType === 'assessment') {
                if (step > 1 && step < 4) {
                    step = 4;
                }
                // Going back from step 4 with assessment goes to step 1
                if (wizardState.currentStep === 4 && step < 4 && step > 1) {
                    step = 1;
                }
            }

            if (step < 1 || step > wizardState.totalSteps) return;

            // Update step visibility
            document.querySelectorAll('.wizard-step').forEach(s => {
                s.classList.remove('active');
            });

            const targetStep = document.querySelector(`.wizard-step[data-step="${step}"]`);
            if (targetStep) {
                targetStep.classList.add('active');
            }

            wizardState.currentStep = step;
            updateProgress();
            updateSummary();
            updateConditionalFields();

            // Scroll to top of wizard
            projectWizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function updateProgress() {
            // Update progress bar fill
            const progressFill = document.getElementById('progress-fill');
            const percentage = (wizardState.currentStep / wizardState.totalSteps) * 100;
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }

            // Update step indicators
            document.querySelectorAll('.wizard-progress__step').forEach(step => {
                const stepNum = parseInt(step.dataset.step);
                step.classList.remove('active', 'completed');

                if (stepNum < wizardState.currentStep) {
                    step.classList.add('completed');
                } else if (stepNum === wizardState.currentStep) {
                    step.classList.add('active');
                }
            });
        }

        function updateConditionalFields() {
            const projectType = wizardState.data.projectType;
            const industry = wizardState.data.industry;
            const systems = wizardState.data.systems || [];

            // Check if any SAP system is selected
            const hasSAP = systems.some(s => s.startsWith('sap-') || s.startsWith('s4hana'));

            // Show/hide volume field (for integration/esignature)
            const volumeField = document.querySelector('.wizard-fields--volume');
            if (volumeField) {
                volumeField.style.display = (projectType === 'integration' || projectType === 'esignature') ? 'block' : 'none';
            }

            // Show/hide SAP modules (when SAP selected)
            const sapModulesField = document.querySelector('.wizard-fields--sap-modules');
            if (sapModulesField) {
                sapModulesField.style.display = hasSAP ? 'block' : 'none';
            }

            // Show/hide esignature fields
            const esignatureFields = document.querySelectorAll('.wizard-fields--esignature');
            esignatureFields.forEach(f => {
                f.style.display = (projectType === 'esignature') ? 'block' : 'none';
            });

            // Show/hide compliance (for esignature, or pharma/food industries)
            const complianceField = document.querySelector('.wizard-fields--compliance');
            if (complianceField) {
                const showCompliance = projectType === 'esignature' ||
                    industry === 'pharma-life-sciences' ||
                    industry === 'food-manufacturing';
                complianceField.style.display = showCompliance ? 'block' : 'none';
            }

            // Show/hide pain points based on project type
            const painpointsEsig = document.querySelector('.wizard-fields--painpoints-esignature');
            const painpointsInt = document.querySelector('.wizard-fields--painpoints-integration');
            const painpointsAuto = document.querySelector('.wizard-fields--painpoints-automation');

            if (painpointsEsig) painpointsEsig.style.display = (projectType === 'esignature') ? 'block' : 'none';
            if (painpointsInt) painpointsInt.style.display = (projectType === 'integration') ? 'block' : 'none';
            if (painpointsAuto) painpointsAuto.style.display = (projectType === 'automation') ? 'block' : 'none';
        }

        function preSelectCompliance(industry) {
            // Pre-check relevant compliance options for certain industries
            if (industry === 'food-manufacturing') {
                const fsmaCheckbox = document.querySelector('input[name="compliance"][value="fsma-204"]');
                if (fsmaCheckbox && !fsmaCheckbox.checked) {
                    fsmaCheckbox.checked = true;
                    if (!wizardState.data.compliance) wizardState.data.compliance = [];
                    if (!wizardState.data.compliance.includes('fsma-204')) {
                        wizardState.data.compliance.push('fsma-204');
                    }
                }
            }

            if (industry === 'pharma-life-sciences') {
                const fda21Checkbox = document.querySelector('input[name="compliance"][value="fda-21cfr11"]');
                const gxpCheckbox = document.querySelector('input[name="compliance"][value="gxp"]');
                if (fda21Checkbox && !fda21Checkbox.checked) {
                    fda21Checkbox.checked = true;
                    if (!wizardState.data.compliance) wizardState.data.compliance = [];
                    if (!wizardState.data.compliance.includes('fda-21cfr11')) {
                        wizardState.data.compliance.push('fda-21cfr11');
                    }
                }
                if (gxpCheckbox && !gxpCheckbox.checked) {
                    gxpCheckbox.checked = true;
                    if (!wizardState.data.compliance.includes('gxp')) {
                        wizardState.data.compliance.push('gxp');
                    }
                }
            }

            saveWizardData(wizardState.data);
        }

        // Listen for system checkbox changes to show/hide SAP modules
        document.querySelectorAll('input[name="systems"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                // Update systems in state
                if (!wizardState.data.systems) wizardState.data.systems = [];
                if (checkbox.checked) {
                    if (!wizardState.data.systems.includes(checkbox.value)) {
                        wizardState.data.systems.push(checkbox.value);
                    }
                } else {
                    wizardState.data.systems = wizardState.data.systems.filter(v => v !== checkbox.value);
                }
                saveWizardData(wizardState.data);
                updateConditionalFields();
                updateSummary();
            });
        });

        // Listen for other checkbox changes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.name && checkbox.name !== 'systems') {
                checkbox.addEventListener('change', () => {
                    if (!wizardState.data[checkbox.name]) wizardState.data[checkbox.name] = [];
                    if (checkbox.checked) {
                        if (!wizardState.data[checkbox.name].includes(checkbox.value)) {
                            wizardState.data[checkbox.name].push(checkbox.value);
                        }
                    } else {
                        wizardState.data[checkbox.name] = wizardState.data[checkbox.name].filter(v => v !== checkbox.value);
                    }
                    saveWizardData(wizardState.data);
                    updateSummary();
                });
            }
        });

        function collectStepData(step) {
            const stepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
            if (!stepEl) return;

            // Collect form inputs
            stepEl.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.name) {
                    if (input.type === 'checkbox') {
                        if (!wizardState.data[input.name]) {
                            wizardState.data[input.name] = [];
                        }
                        if (input.checked) {
                            if (!wizardState.data[input.name].includes(input.value)) {
                                wizardState.data[input.name].push(input.value);
                            }
                        } else {
                            wizardState.data[input.name] = wizardState.data[input.name].filter(v => v !== input.value);
                        }
                    } else {
                        wizardState.data[input.name] = input.value;
                    }
                }
            });

            saveWizardData(wizardState.data);
        }

        function updateSummary() {
            const summaryContent = document.getElementById('summary-content');
            if (!summaryContent) return;

            const data = wizardState.data;
            let html = '';

            // Project type
            if (data.projectType) {
                const typeLabels = {
                    'integration': 'System Integration',
                    'esignature': 'eSignature & Approvals',
                    'automation': 'Workflow Automation',
                    'custom': 'Custom Application',
                    'assessment': 'Technical Assessment',
                    'notsure': 'Discovery / Not Sure'
                };
                html += createSummaryItem('Project Type', typeLabels[data.projectType] || data.projectType, 1);
            }

            // Industry
            if (data.industry) {
                const industryLabels = {
                    'food-manufacturing': 'Food & Beverage Manufacturing',
                    'manufacturing': 'Manufacturing',
                    'pharma-life-sciences': 'Pharma & Life Sciences',
                    'distribution': 'Distribution & Logistics',
                    'energy-utilities': 'Energy & Utilities',
                    'other': 'Other Industry'
                };
                html += createSummaryItem('Industry', industryLabels[data.industry] || data.industry, 2);
            }

            // Company size
            if (data.companySize) {
                html += createSummaryItem('Company Size', data.companySize + ' employees', 2);
            }

            // Systems (checkboxes)
            if (data.systems && data.systems.length > 0) {
                const systemNames = data.systems.map(formatSystemName).join(', ');
                html += createSummaryItem('Systems', systemNames, 3);
            }

            // SAP Modules
            if (data.sapModules && data.sapModules.length > 0) {
                const moduleLabels = {
                    'mm': 'MM', 'sd': 'SD', 'qm': 'QM', 'pp': 'PP',
                    'pm': 'PM', 'fi-co': 'FI/CO', 'hr': 'HCM/HR'
                };
                const moduleNames = data.sapModules.map(m => moduleLabels[m] || m).join(', ');
                html += createSummaryItem('SAP Modules', moduleNames, 3);
            }

            // Document Types (for esignature)
            if (data.documentTypes && data.documentTypes.length > 0) {
                const docLabels = {
                    'purchase-orders': 'Purchase Orders',
                    'contracts': 'Contracts',
                    'invoices': 'Invoices',
                    'quality': 'Quality Documents',
                    'hr': 'HR Documents',
                    'engineering': 'Engineering Documents'
                };
                const docNames = data.documentTypes.map(d => docLabels[d] || d).join(', ');
                html += createSummaryItem('Document Types', docNames, 3);
            }

            // Compliance
            if (data.compliance && data.compliance.length > 0) {
                const complianceLabels = {
                    'fda-21cfr11': 'FDA 21 CFR Part 11',
                    'sox': 'SOX',
                    'hipaa': 'HIPAA',
                    'gdpr': 'GDPR',
                    'fsma-204': 'FSMA 204',
                    'gxp': 'GxP'
                };
                const complianceNames = data.compliance.map(c => complianceLabels[c] || c).join(', ');
                html += createSummaryItem('Compliance', complianceNames, 3);
            }

            // Pain Points
            if (data.painPoints && data.painPoints.length > 0) {
                html += createSummaryItem('Challenges', data.painPoints.length + ' identified', 4);
            }

            // Success Metrics
            if (data.successMetrics && data.successMetrics.length > 0) {
                const metricLabels = {
                    'reduce-cycle-time': 'Reduce cycle time',
                    'reduce-errors': 'Reduce errors',
                    'achieve-compliance': 'Achieve compliance',
                    'reduce-costs': 'Reduce costs',
                    'improve-visibility': 'Improve visibility',
                    'audit-ready': 'Be audit-ready'
                };
                const metricNames = data.successMetrics.map(m => metricLabels[m] || m).join(', ');
                html += createSummaryItem('Success Metrics', metricNames, 4);
            }

            // Timeline
            if (data.timeline) {
                const timelineLabels = {
                    'urgent': 'Urgent (< 1 month)',
                    'soon': '1-2 months',
                    'planning': '3-6 months',
                    'future': '6+ months',
                    'exploring': 'Just exploring'
                };
                html += createSummaryItem('Timeline', timelineLabels[data.timeline] || data.timeline, 5);
            }

            // Budget
            if (data.budget) {
                const budgetLabels = {
                    'under10k': 'Under $10K',
                    '10-25k': '$10K - $25K',
                    '25-50k': '$25K - $50K',
                    '50-100k': '$50K - $100K',
                    '100k+': '$100K+',
                    'discuss': 'Let\'s discuss'
                };
                html += createSummaryItem('Budget', budgetLabels[data.budget] || data.budget, 5);
            }

            // Decision Makers
            if (data.decisionMakers && data.decisionMakers.length > 0) {
                const dmLabels = {
                    'just-me': 'Just me',
                    'it-team': 'IT team',
                    'business': 'Business stakeholders',
                    'procurement': 'Procurement',
                    'executive': 'Executive sponsor'
                };
                const dmNames = data.decisionMakers.map(d => dmLabels[d] || d).join(', ');
                html += createSummaryItem('Decision Makers', dmNames, 5);
            }

            if (html) {
                summaryContent.innerHTML = html;
            } else {
                summaryContent.innerHTML = '<p class="summary-empty">Complete the previous steps to build your project summary.</p>';
            }
        }

        function createSummaryItem(label, value, editStep) {
            return `
                <div class="summary-item">
                    <div class="summary-item__label">${label}</div>
                    <div class="summary-item__value">
                        ${value}
                        <span class="summary-item__edit" data-step="${editStep}">Edit</span>
                    </div>
                </div>
            `;
        }

        function formatSystemName(value) {
            const names = {
                'sap-ecc': 'SAP ECC',
                's4hana-onprem': 'S/4HANA (On-Premise)',
                's4hana-cloud': 'S/4HANA Cloud',
                'sap-bw': 'SAP BW/BW4HANA',
                'oracle-ebs': 'Oracle E-Business Suite',
                'oracle-cloud': 'Oracle Cloud ERP',
                'workday': 'Workday',
                'netsuite': 'NetSuite',
                'dynamics365': 'Microsoft Dynamics 365',
                'salesforce': 'Salesforce',
                'servicenow': 'ServiceNow',
                'docusign': 'DocuSign',
                'adobesign': 'Adobe Sign',
                'sharepoint': 'SharePoint',
                'teams': 'Microsoft Teams',
                'power-platform': 'Power Platform',
                'aws': 'AWS Services',
                'azure': 'Azure Services',
                'custom': 'Custom / Other',
                'none': 'Standalone'
            };
            return names[value] || value;
        }

        // Edit links in summary
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('summary-item__edit')) {
                const step = parseInt(e.target.dataset.step);
                if (step) goToStep(step);
            }
        });

        // Initialize on load
        updateConditionalFields();

        // Restore previously selected project type card
        if (wizardState.data.projectType) {
            const card = document.querySelector(`.selection-card[data-value="${wizardState.data.projectType}"]`);
            if (card) {
                card.classList.add('selected');
                const nextBtn = document.querySelector('[data-step="1"] .wizard-next');
                if (nextBtn) nextBtn.disabled = false;
            }
        }

        // Restore industry card
        if (wizardState.data.industry) {
            const card = document.querySelector(`.industry-card[data-value="${wizardState.data.industry}"]`);
            if (card) {
                card.classList.add('selected');
                const nextBtn = document.querySelector('[data-step="2"] .wizard-next');
                if (nextBtn) nextBtn.disabled = false;
            }
        }

        // Restore all pills (timeline, companySize, transactionVolume, approvalProcess)
        ['timeline', 'companySize', 'transactionVolume', 'approvalProcess'].forEach(name => {
            if (wizardState.data[name]) {
                const pill = document.querySelector(`.pill[data-name="${name}"][data-value="${wizardState.data[name]}"]`);
                if (pill) pill.classList.add('selected');
            }
        });

        // Restore budget
        if (wizardState.data.budget) {
            const card = document.querySelector(`.budget-card[data-value="${wizardState.data.budget}"]`);
            if (card) card.classList.add('selected');
        }

        // Restore form fields (text inputs, textareas, selects)
        Object.keys(wizardState.data).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input && !['projectType', 'industry', 'timeline', 'budget', 'companySize', 'transactionVolume', 'approvalProcess'].includes(key)) {
                if (input.type !== 'checkbox') {
                    input.value = wizardState.data[key];
                }
            }
        });

        // Restore all checkbox arrays
        const checkboxArrays = ['systems', 'sapModules', 'documentTypes', 'compliance', 'painPoints', 'successMetrics', 'decisionMakers'];
        checkboxArrays.forEach(name => {
            if (wizardState.data[name] && Array.isArray(wizardState.data[name])) {
                wizardState.data[name].forEach(value => {
                    const checkbox = document.querySelector(`input[name="${name}"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        });

        // Mobile: make summary collapsible
        const wizardSummary = document.querySelector('.wizard-summary');
        if (wizardSummary && window.innerWidth <= 768) {
            const summaryTitle = wizardSummary.querySelector('h4');
            if (summaryTitle) {
                summaryTitle.addEventListener('click', () => {
                    wizardSummary.classList.toggle('collapsed');
                });
            }
        }
    }

    // LocalStorage helpers
    function saveWizardData(data) {
        try {
            localStorage.setItem('forged_wizard_data', JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save wizard data to localStorage');
        }
    }

    function loadWizardData() {
        try {
            const saved = localStorage.getItem('forged_wizard_data');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    // ========================================
    // FORM SUBMISSIONS (Formspree Integration)
    // ========================================

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkobjoww';

    // Quick inquiry form
    const quickForm = document.getElementById('quick-form');
    if (quickForm) {
        quickForm.addEventListener('submit', handleQuickFormSubmit);
    }

    // Wizard form
    const wizardForm = document.getElementById('wizard-form');
    if (wizardForm) {
        wizardForm.addEventListener('submit', handleWizardFormSubmit);
    }

    async function handleQuickFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Basic validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ef4444';
            } else {
                field.style.borderColor = '';
            }
        });

        if (!isValid) return;

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = new FormData(form);
        formData.append('_subject', 'Quick Inquiry from Forged Website');
        formData.append('source', 'quick-inquiry');
        formData.append('submittedAt', new Date().toISOString());

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                showSuccessMessage(form, 'Thanks for reaching out! I\'ll get back to you within 24 hours.');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form error:', error);
            showErrorMessage(form, 'Something went wrong. Please try again or email directly.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }

    async function handleWizardFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Merge wizard data with form data
        const formData = new FormData(form);
        const wizardData = loadWizardData();

        // Add wizard data to form
        formData.append('_subject', 'Project Brief from Forged Website');
        formData.append('source', 'project-builder');
        formData.append('submittedAt', new Date().toISOString());

        // Add all wizard data as a formatted summary
        formData.append('projectType', wizardData.projectType || 'Not specified');
        formData.append('industry', wizardData.industry || 'Not specified');
        formData.append('companySize', wizardData.companySize || 'Not specified');
        formData.append('systems', (wizardData.systems || []).join(', ') || 'None selected');
        formData.append('sapModules', (wizardData.sapModules || []).join(', ') || 'None');
        formData.append('documentTypes', (wizardData.documentTypes || []).join(', ') || 'None');
        formData.append('compliance', (wizardData.compliance || []).join(', ') || 'None');
        formData.append('painPoints', (wizardData.painPoints || []).join(', ') || 'None');
        formData.append('successMetrics', (wizardData.successMetrics || []).join(', ') || 'None');
        formData.append('currentSituation', wizardData.currentSituation || 'Not provided');
        formData.append('desiredOutcome', wizardData.desiredOutcome || 'Not provided');
        formData.append('timeline', wizardData.timeline || 'Not specified');
        formData.append('budget', wizardData.budget || 'Not specified');
        formData.append('decisionMakers', (wizardData.decisionMakers || []).join(', ') || 'Not specified');

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Clear saved wizard data
                localStorage.removeItem('forged_wizard_data');

                // Reset form and UI
                form.reset();
                document.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
                document.querySelectorAll('.industry-card').forEach(c => c.classList.remove('selected'));
                document.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
                document.querySelectorAll('.budget-card').forEach(c => c.classList.remove('selected'));
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

                const projectWizard = document.getElementById('project-wizard');
                const pathSelection = document.getElementById('path-selection');
                if (projectWizard) projectWizard.style.display = 'none';
                if (pathSelection) pathSelection.style.display = 'block';

                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Show success after scroll
                setTimeout(() => {
                    alert('Thanks for your detailed project brief! I\'ll review everything and get back to you within 24 hours.');
                }, 300);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form error:', error);
            showErrorMessage(form, 'Something went wrong. Please try again or email directly.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }

    function showSuccessMessage(form, message) {
        // Remove any existing messages
        const existingMsg = form.parentElement.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = 'form-message form-message--success';
        msgDiv.textContent = message;
        form.parentElement.insertBefore(msgDiv, form);

        // Auto-remove after 5 seconds
        setTimeout(() => msgDiv.remove(), 5000);
    }

    function showErrorMessage(form, message) {
        // Remove any existing messages
        const existingMsg = form.parentElement.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = 'form-message form-message--error';
        msgDiv.textContent = message;
        form.parentElement.insertBefore(msgDiv, form);

        // Auto-remove after 5 seconds
        setTimeout(() => msgDiv.remove(), 5000);
    }

});
