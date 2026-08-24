/* =========================================================
   THREADVERSE
   PREMIUM MOTION ENGINE v2.0
   ---------------------------------------------------------
   Handles:
   • Page loader
   • Hero entrance
   • Scroll reveal
   • Text reveal
   • Mouse parallax
   • Magnetic buttons
   • Navbar scroll state
   • Active navigation
   • Process timeline
   • Dynamic product entrance
   • Product card 3D tilt
   • Cursor glow
   • Smooth anchor navigation
   • Footer reveal
   • Page visibility optimization
   • Reduced-motion accessibility
   • Mobile / touch protection
   • Performance optimization
   ========================================================= */

(() => {

    "use strict";


    /* =====================================================
       01. GLOBAL CONFIGURATION
    ===================================================== */

    const CONFIG = {

        navbarScrollPoint: 40,

        revealThreshold: 0.12,

        revealRootMargin:
            "0px 0px -70px 0px",

        activeNavThreshold: 0.35,

        productDelayStep: 90,

        productMaxDelay: 500,

        cardTiltStrength: 3,

        cardLift: 9,

        parallaxSmoothness: 0.05,

        cursorSmoothness: 0.12,

        magneticStrength: 0.15

    };


    /* =====================================================
       02. REDUCED MOTION
    ===================================================== */

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       03. DEVICE DETECTION
    ===================================================== */

    const isTouchDevice =
        window.matchMedia &&
        window.matchMedia(
            "(hover: none), (pointer: coarse)"
        ).matches;


    const isDesktopPointer =
        window.matchMedia &&
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;


    /* =====================================================
       04. PAGE VISIBILITY
    ===================================================== */

    let pageIsVisible =
        !document.hidden;


    document.addEventListener(
        "visibilitychange",
        () => {

            pageIsVisible =
                !document.hidden;

            if (document.hidden) {

                document.body.classList.add(
                    "page-hidden"
                );

            } else {

                document.body.classList.remove(
                    "page-hidden"
                );

            }

        }
    );


    /* =====================================================
       05. INITIALIZATION
    ===================================================== */

    function initializeMotionEngine() {

        console.log(
            "THREADVERSE Premium Motion Engine started."
        );


        initPageLoader();

        initHeroAnimation();

        initScrollReveal();

        initTextReveal();

        initParallax();

        initMagneticButtons();

        initNavbar();

        initActiveNavigation();

        initProcessAnimation();

        initProductAnimations();

        initCardTilt();

        initCursorGlow();

        initSmoothAnchors();

        initFooterAnimation();


        console.log(
            "THREADVERSE motion systems initialized successfully."
        );

    }


    /* =====================================================
       06. PAGE LOADER
    ===================================================== */

    function initPageLoader() {

        const loader =
            document.querySelector(
                ".page-loader"
            );


        if (!loader) return;


        if (prefersReducedMotion) {

            loader.classList.add(
                "loader-complete"
            );

            setTimeout(() => {

                if (loader.isConnected) {
                    loader.remove();
                }

            }, 100);

            return;

        }


        document.body.classList.add(
            "page-loading"
        );


        const finishLoader = () => {

            setTimeout(() => {

                loader.classList.add(
                    "loader-complete"
                );

                document.body.classList.remove(
                    "page-loading"
                );

            }, 400);


            setTimeout(() => {

                if (loader.isConnected) {
                    loader.remove();
                }

            }, 1300);

        };


        if (document.readyState === "complete") {

            finishLoader();

        } else {

            window.addEventListener(
                "load",
                finishLoader,
                { once: true }
            );

        }

    }


    /* =====================================================
       07. HERO ANIMATION
    ===================================================== */

    function initHeroAnimation() {

        const hero =
            document.querySelector(
                "[data-hero]"
            );


        if (!hero) return;


        if (prefersReducedMotion) {

            hero.classList.add(
                "hero-ready"
            );

            return;

        }


        requestAnimationFrame(() => {

            setTimeout(() => {

                hero.classList.add(
                    "hero-ready"
                );

            }, 100);

        });

    }


    /* =====================================================
       08. SCROLL REVEAL
    ===================================================== */

    function initScrollReveal() {

        const elements =
            document.querySelectorAll(
                "[data-reveal]"
            );


        if (!elements.length) return;


        if (prefersReducedMotion) {

            elements.forEach(element => {

                element.classList.add(
                    "is-visible"
                );

            });

            return;

        }


        if (!("IntersectionObserver" in window)) {

            elements.forEach(element => {

                element.classList.add(
                    "is-visible"
                );

            });

            return;

        }


        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        observerInstance.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold:
                        CONFIG.revealThreshold,

                    rootMargin:
                        CONFIG.revealRootMargin
                }
            );


        elements.forEach(element => {

            observer.observe(element);

        });

    }


    /* =====================================================
       09. TEXT REVEAL
       IMPORTANT:
       Runs after DOM is ready.
    ===================================================== */

    function initTextReveal() {

        const textElements =
            document.querySelectorAll(
                "[data-text-reveal]"
            );


        if (!textElements.length) return;


        textElements.forEach(element => {

            if (
                element.classList.contains(
                    "text-reveal-ready"
                )
            ) {

                return;

            }


            element.classList.add(
                "text-reveal-ready"
            );


            if (prefersReducedMotion) {

                element.classList.add(
                    "text-reveal-visible"
                );

            }

        });

    }


    /* =====================================================
       10. MOUSE PARALLAX
    ===================================================== */

    function initParallax() {

        const hero =
            document.querySelector(
                "[data-hero]"
            );


        if (!hero) return;

        if (prefersReducedMotion) return;

        if (isTouchDevice) return;


        const layers =
            hero.querySelectorAll(
                "[data-parallax]"
            );


        if (!layers.length) return;


        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;

        let animationRunning = false;


        hero.addEventListener(
            "mousemove",
            event => {

                const rect =
                    hero.getBoundingClientRect();


                if (
                    rect.width === 0 ||
                    rect.height === 0
                ) {
                    return;
                }


                mouseX =
                    (
                        (event.clientX - rect.left) /
                        rect.width
                    ) - 0.5;


                mouseY =
                    (
                        (event.clientY - rect.top) /
                        rect.height
                    ) - 0.5;


                startParallax();

            },
            { passive: true }
        );


        hero.addEventListener(
            "mouseleave",
            () => {

                mouseX = 0;
                mouseY = 0;

                startParallax();

            }
        );


        function startParallax() {

            if (animationRunning) return;

            animationRunning = true;

            requestAnimationFrame(
                animateParallax
            );

        }


        function animateParallax() {

            animationRunning = false;


            if (!pageIsVisible) {
                return;
            }


            currentX +=
                (mouseX - currentX) *
                CONFIG.parallaxSmoothness;


            currentY +=
                (mouseY - currentY) *
                CONFIG.parallaxSmoothness;


            const distance =
                Math.abs(mouseX - currentX) +
                Math.abs(mouseY - currentY);


            layers.forEach(layer => {

                const strength =
                    parseFloat(
                        layer.dataset.parallax
                    ) || 0.1;


                const moveX =
                    currentX *
                    100 *
                    strength;


                const moveY =
                    currentY *
                    100 *
                    strength;


                layer.style.transform =
                    `translate3d(
                        ${moveX}px,
                        ${moveY}px,
                        0
                    )`;

            });


            if (distance > 0.001) {

                startParallax();

            }

        }

    }


    /* =====================================================
       11. MAGNETIC BUTTONS
    ===================================================== */

    function initMagneticButtons() {

        const buttons =
            document.querySelectorAll(
                ".magnetic-btn"
            );


        if (!buttons.length) return;

        if (prefersReducedMotion) return;

        if (!isDesktopPointer) return;


        buttons.forEach(button => {

            let resetTimer;


            button.addEventListener(
                "mousemove",
                event => {

                    clearTimeout(resetTimer);


                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    const moveX =
                        x *
                        CONFIG.magneticStrength;


                    const moveY =
                        y *
                        CONFIG.magneticStrength;


                    button.style.transform =
                        `translate3d(
                            ${moveX}px,
                            ${moveY}px,
                            0
                        )`;

                },
                { passive: true }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    resetTimer =
                        setTimeout(() => {

                            button.style.transform =
                                "";

                        }, 30);

                }
            );

        });

    }


    /* =====================================================
       12. NAVBAR SCROLL EFFECT
    ===================================================== */

    function initNavbar() {

        const navbar =
            document.querySelector(
                "[data-nav]"
            );


        if (!navbar) return;


        let ticking = false;


        function updateNavbar() {

            if (
                window.scrollY >
                CONFIG.navbarScrollPoint
            ) {

                navbar.classList.add(
                    "nav-scrolled"
                );

            } else {

                navbar.classList.remove(
                    "nav-scrolled"
                );

            }


            ticking = false;

        }


        window.addEventListener(
            "scroll",
            () => {

                if (ticking) return;


                ticking = true;


                window.requestAnimationFrame(
                    updateNavbar
                );

            },
            {
                passive: true
            }
        );


        updateNavbar();

    }


    /* =====================================================
       13. ACTIVE NAVIGATION
    ===================================================== */

    function initActiveNavigation() {

        const sections =
            document.querySelectorAll(
                "main section[id]"
            );


        const navLinks =
            document.querySelectorAll(
                "[data-nav-link]"
            );


        if (
            !sections.length ||
            !navLinks.length
        ) {
            return;
        }


        if (
            !("IntersectionObserver" in window)
        ) {
            return;
        }


        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const id =
                            entry.target.id;


                        navLinks.forEach(link => {

                            link.classList.remove(
                                "active-nav"
                            );


                            const href =
                                link.getAttribute(
                                    "href"
                                );


                            if (
                                href ===
                                `#${id}`
                            ) {

                                link.classList.add(
                                    "active-nav"
                                );

                            }

                        });

                    });

                },
                {
                    threshold:
                        CONFIG.activeNavThreshold,

                    rootMargin:
                        "-80px 0px -40% 0px"
                }
            );


        sections.forEach(section => {

            sectionObserver.observe(
                section
            );

        });

    }


    /* =====================================================
       14. PROCESS TIMELINE
    ===================================================== */

    function initProcessAnimation() {

        const process =
            document.querySelector(
                "[data-process]"
            );


        if (!process) return;


        const progress =
            process.querySelector(
                ".process-line-progress"
            );


        if (prefersReducedMotion) {

            process.classList.add(
                "process-active"
            );

            if (progress) {

                progress.style.height =
                    "100%";

            }

            return;

        }


        if (
            "IntersectionObserver" in window
        ) {

            const observer =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                process.classList.add(
                                    "process-active"
                                );

                            }

                        });

                    },
                    {
                        threshold: 0.25
                    }
                );


            observer.observe(process);

        } else {

            process.classList.add(
                "process-active"
            );

        }


        if (!progress) return;


        let ticking = false;


        function updateProcessProgress() {

            const rect =
                process.getBoundingClientRect();


            const windowHeight =
                window.innerHeight;


            const start =
                windowHeight * 0.75;


            const end =
                -rect.height * 0.25;


            let percentage =
                (
                    start - rect.top
                ) /
                (
                    start - end
                );


            percentage =
                Math.max(
                    0,
                    Math.min(
                        1,
                        percentage
                    )
                );


            progress.style.height =
                `${percentage * 100}%`;


            ticking = false;

        }


        function requestProcessUpdate() {

            if (ticking) return;

            ticking = true;

            requestAnimationFrame(
                updateProcessProgress
            );

        }


        window.addEventListener(
            "scroll",
            requestProcessUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            requestProcessUpdate,
            {
                passive: true
            }
        );


        requestProcessUpdate();

    }


    /* =====================================================
       15. PRODUCT ANIMATIONS
       Works with dynamically loaded Supabase products.
    ===================================================== */

    function initProductAnimations() {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );


        if (!productGrid) return;


        animateProducts(productGrid);


        if (
            !("MutationObserver" in window)
        ) {
            return;
        }


        let mutationScheduled = false;


        const observer =
            new MutationObserver(() => {

                if (mutationScheduled) {
                    return;
                }


                mutationScheduled = true;


                requestAnimationFrame(() => {

                    mutationScheduled =
                        false;


                    animateProducts(
                        productGrid
                    );

                });

            });


        observer.observe(
            productGrid,
            {
                childList: true,
                subtree: true
            }
        );

    }


    function animateProducts(grid) {

        const cards =
            grid.querySelectorAll(
                ".product-card"
            );


        if (!cards.length) return;


        cards.forEach(
            (card, index) => {

                if (
                    card.dataset.motionReady ===
                    "true"
                ) {
                    return;
                }


                card.dataset.motionReady =
                    "true";


                const delay =
                    Math.min(
                        index *
                        CONFIG.productDelayStep,

                        CONFIG.productMaxDelay
                    );


                card.style.setProperty(
                    "--product-delay",
                    `${delay}ms`
                );


                card.classList.add(
                    "product-motion-ready"
                );


                if (prefersReducedMotion) {

                    card.classList.add(
                        "product-motion-visible"
                    );

                    return;

                }


                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        card.classList.add(
                            "product-motion-visible"
                        );

                    });

                });

            }
        );

    }


    /* =====================================================
       16. PREMIUM PRODUCT CARD TILT
       -----------------------------------------------------
       IMPORTANT:
       Uses CSS variables instead of overwriting
       the entire transform property.
    ===================================================== */

    function initCardTilt() {

        if (prefersReducedMotion) return;

        if (!isDesktopPointer) return;


        const grid =
            document.querySelector(
                ".products-grid"
            );


        if (!grid) return;


        const processed =
            new WeakSet();


        function setupCards() {

            const cards =
                grid.querySelectorAll(
                    ".product-card"
                );


            cards.forEach(card => {

                if (
                    processed.has(card)
                ) {
                    return;
                }


                processed.add(card);


                card.style.setProperty(
                    "--tilt-x",
                    "0deg"
                );


                card.style.setProperty(
                    "--tilt-y",
                    "0deg"
                );


                card.style.setProperty(
                    "--tilt-lift",
                    "0px"
                );


                card.addEventListener(
                    "mousemove",
                    event => {

                        const rect =
                            card.getBoundingClientRect();


                        if (
                            rect.width === 0 ||
                            rect.height === 0
                        ) {
                            return;
                        }


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        const centerX =
                            rect.width / 2;


                        const centerY =
                            rect.height / 2;


                        const rotateY =
                            (
                                (x - centerX) /
                                centerX
                            ) *
                            CONFIG.cardTiltStrength;


                        const rotateX =
                            (
                                (centerY - y) /
                                centerY
                            ) *
                            CONFIG.cardTiltStrength;


                        card.style.setProperty(
                            "--tilt-x",
                            `${rotateX}deg`
                        );


                        card.style.setProperty(
                            "--tilt-y",
                            `${rotateY}deg`
                        );


                        card.style.setProperty(
                            "--tilt-lift",
                            `-${CONFIG.cardLift}px`
                        );

                    },
                    {
                        passive: true
                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.setProperty(
                            "--tilt-x",
                            "0deg"
                        );


                        card.style.setProperty(
                            "--tilt-y",
                            "0deg"
                        );


                        card.style.setProperty(
                            "--tilt-lift",
                            "0px"
                        );

                    }
                );

            });

        }


        setupCards();


        if (
            "MutationObserver" in window
        ) {

            const observer =
                new MutationObserver(() => {

                    setupCards();

                });


            observer.observe(
                grid,
                {
                    childList: true,
                    subtree: true
                }
            );

        }

    }


    /* =====================================================
       17. CURSOR GLOW
    ===================================================== */

    function initCursorGlow() {

        if (prefersReducedMotion) return;

        if (!isDesktopPointer) return;


        const glow =
            document.createElement(
                "div"
            );


        glow.className =
            "cursor-glow";


        glow.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.appendChild(glow);


        let mouseX = -200;
        let mouseY = -200;

        let currentX = -200;
        let currentY = -200;

        let animationRunning = false;


        document.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;


                if (!animationRunning) {

                    animationRunning = true;

                    requestAnimationFrame(
                        animateCursor
                    );

                }

            },
            {
                passive: true
            }
        );


        function animateCursor() {

            animationRunning = false;


            if (!pageIsVisible) {
                return;
            }


            currentX +=
                (
                    mouseX -
                    currentX
                ) *
                CONFIG.cursorSmoothness;


            currentY +=
                (
                    mouseY -
                    currentY
                ) *
                CONFIG.cursorSmoothness;


            glow.style.transform =
                `translate3d(
                    ${currentX}px,
                    ${currentY}px,
                    0
                ) translate(-50%, -50%)`;


            const distance =
                Math.abs(
                    mouseX - currentX
                ) +
                Math.abs(
                    mouseY - currentY
                );


            if (distance > 0.5) {

                animationRunning = true;

                requestAnimationFrame(
                    animateCursor
                );

            }

        }


        document.addEventListener(
            "mouseleave",
            () => {

                glow.classList.add(
                    "cursor-hidden"
                );

            }
        );


        document.addEventListener(
            "mouseenter",
            () => {

                glow.classList.remove(
                    "cursor-hidden"
                );

            }
        );

    }


    /* =====================================================
       18. SMOOTH ANCHOR NAVIGATION
    ===================================================== */

    function initSmoothAnchors() {

        const anchors =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        if (!anchors.length) return;


        anchors.forEach(anchor => {

            anchor.addEventListener(
                "click",
                event => {

                    const targetId =
                        anchor.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    let target = null;


                    try {

                        target =
                            document.querySelector(
                                targetId
                            );

                    } catch (error) {

                        console.warn(
                            "THREADVERSE: Invalid anchor selector:",
                            targetId
                        );

                        return;

                    }


                    if (!target) return;


                    event.preventDefault();


                    const navbar =
                        document.querySelector(
                            ".main-navbar"
                        );


                    const navHeight =
                        navbar
                            ? navbar.offsetHeight
                            : 0;


                    const targetPosition =
                        target
                            .getBoundingClientRect()
                            .top +
                        window.scrollY -
                        navHeight -
                        15;


                    window.scrollTo({

                        top:
                            Math.max(
                                0,
                                targetPosition
                            ),

                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth"

                    });


                    /* Update URL without jumping. */

                    if (
                        history.pushState
                    ) {

                        try {

                            history.pushState(
                                null,
                                "",
                                targetId
                            );

                        } catch (error) {

                            /* Ignore URL errors. */

                        }

                    }

                }
            );

        });

    }


    /* =====================================================
       19. FOOTER ANIMATION
    ===================================================== */

    function initFooterAnimation() {

        const footer =
            document.querySelector(
                "[data-footer]"
            );


        if (!footer) return;


        if (prefersReducedMotion) {

            footer.classList.add(
                "footer-visible"
            );

            return;

        }


        if (
            !("IntersectionObserver" in window)
        ) {

            footer.classList.add(
                "footer-visible"
            );

            return;

        }


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        footer.classList.add(
                            "footer-visible"
                        );


                        observer.unobserve(
                            footer
                        );

                    });

                },
                {
                    threshold: 0.15
                }
            );


        observer.observe(footer);

    }


    /* =====================================================
       20. PAGE EXIT
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            document.body.classList.add(
                "page-exiting"
            );

        }
    );


    /* =====================================================
       21. INITIALIZE AFTER DOM READY
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeMotionEngine,
            {
                once: true
            }
        );

    } else {

        initializeMotionEngine();

    }


    /* =====================================================
       22. DEBUG INFORMATION
    ===================================================== */

    console.log(
        "THREADVERSE Premium Motion Engine v2.0 loaded."
    );


    console.log(
        "✓ Page loader"
    );


    console.log(
        "✓ Hero reveal"
    );


    console.log(
        "✓ Scroll reveal"
    );


    console.log(
        "✓ Text reveal"
    );


    console.log(
        "✓ Mouse parallax"
    );


    console.log(
        "✓ Magnetic buttons"
    );


    console.log(
        "✓ Navbar scroll state"
    );


    console.log(
        "✓ Active navigation"
    );


    console.log(
        "✓ Process timeline"
    );


    console.log(
        "✓ Dynamic Supabase product animation"
    );


    console.log(
        "✓ Premium product card tilt"
    );


    console.log(
        "✓ Cursor glow"
    );


    console.log(
        "✓ Smooth anchor navigation"
    );


    console.log(
        "✓ Footer reveal"
    );


    console.log(
        "✓ Reduced-motion support"
    );


})();
