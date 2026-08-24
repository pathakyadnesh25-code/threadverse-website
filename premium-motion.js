/* =========================================================
   THREADVERSE
   PREMIUM MOTION ENGINE
   ---------------------------------------------------------
   Handles:
   • Page loader
   • Scroll reveal
   • Hero entrance
   • Text reveal
   • Mouse parallax
   • Magnetic buttons
   • Navbar scroll state
   • Active navigation
   • Process timeline
   • Product entrance animation
   • 3D product-card hover
   • Smooth image movement
   • Cursor glow
   • About/footer reveal
   • Reduced-motion support
   ========================================================= */

(() => {

    "use strict";


    /* =====================================================
       01. INITIALIZATION
    ===================================================== */

    document.addEventListener("DOMContentLoaded", () => {

        console.log("THREADVERSE Premium Motion Engine started.");

        initPageLoader();

        initScrollReveal();

        initHeroAnimation();

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

    });



    /* =====================================================
       02. REDUCED MOTION
       Respect user's browser accessibility setting.
    ===================================================== */

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;



    /* =====================================================
       03. PAGE LOADER
    ===================================================== */

    function initPageLoader() {

        const loader =
            document.querySelector(".page-loader");

        if (!loader) return;


        if (prefersReducedMotion) {

            loader.classList.add("loader-complete");

            setTimeout(() => {

                loader.remove();

            }, 100);

            return;

        }


        document.body.classList.add("page-loading");


        window.addEventListener("load", () => {

            setTimeout(() => {

                loader.classList.add("loader-complete");

                document.body.classList.remove("page-loading");

            }, 500);


            setTimeout(() => {

                if (loader) {

                    loader.remove();

                }

            }, 1400);

        });

    }



    /* =====================================================
       04. HERO ANIMATION
    ===================================================== */

    function initHeroAnimation() {

        const hero =
            document.querySelector("[data-hero]");

        if (!hero) return;


        if (prefersReducedMotion) {

            hero.classList.add("hero-ready");

            return;

        }


        requestAnimationFrame(() => {

            setTimeout(() => {

                hero.classList.add("hero-ready");

            }, 100);

        });

    }



    /* =====================================================
       05. SCROLL REVEAL
    ===================================================== */

    function initScrollReveal() {

        const elements =
            document.querySelectorAll("[data-reveal]");

        if (!elements.length) return;


        if (prefersReducedMotion) {

            elements.forEach(element => {

                element.classList.add("is-visible");

            });

            return;

        }


        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) return;


                        entry.target.classList.add("is-visible");


                        observerInstance.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -70px 0px"
                }
            );


        elements.forEach(element => {

            observer.observe(element);

        });

    }



    /* =====================================================
       06. TEXT REVEAL
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

        });

    }


    initTextReveal();



    /* =====================================================
       07. MOUSE PARALLAX
    ===================================================== */

    function initParallax() {

        const hero =
            document.querySelector("[data-hero]");

        if (!hero) return;

        if (prefersReducedMotion) return;


        const layers =
            hero.querySelectorAll(
                "[data-parallax]"
            );

        if (!layers.length) return;


        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;


        hero.addEventListener(
            "mousemove",
            event => {

                const rect =
                    hero.getBoundingClientRect();


                mouseX =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;


                mouseY =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

            }
        );


        hero.addEventListener(
            "mouseleave",
            () => {

                mouseX = 0;
                mouseY = 0;

            }
        );


        function animateParallax() {

            currentX +=
                (mouseX - currentX) * 0.05;

            currentY +=
                (mouseY - currentY) * 0.05;


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
                    `translate3d(${moveX}px, ${moveY}px, 0)`;

            });


            requestAnimationFrame(
                animateParallax
            );

        }


        animateParallax();

    }



    /* =====================================================
       08. MAGNETIC BUTTONS
    ===================================================== */

    function initMagneticButtons() {

        const buttons =
            document.querySelectorAll(
                ".magnetic-btn"
            );

        if (!buttons.length) return;

        if (prefersReducedMotion) return;


        /*
         * Disable magnetic effect on touch devices.
         */

        const isTouchDevice =
            window.matchMedia(
                "(hover: none)"
            ).matches;


        if (isTouchDevice) return;


        buttons.forEach(button => {

            button.addEventListener(
                "mousemove",
                event => {

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
                        x * 0.15;


                    const moveY =
                        y * 0.15;


                    button.style.transform =
                        `translate3d(${moveX}px, ${moveY}px, 0)`;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";

                }
            );

        });

    }



    /* =====================================================
       09. NAVBAR SCROLL EFFECT
    ===================================================== */

    function initNavbar() {

        const navbar =
            document.querySelector(
                "[data-nav]"
            );

        if (!navbar) return;


        let ticking = false;


        function updateNavbar() {

            if (window.scrollY > 40) {

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

                if (!ticking) {

                    window.requestAnimationFrame(
                        updateNavbar
                    );

                    ticking = true;

                }

            },
            { passive: true }
        );


        updateNavbar();

    }



    /* =====================================================
       10. ACTIVE NAVIGATION
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


        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting)
                            return;


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
                    threshold: 0.35,
                    rootMargin:
                        "-80px 0px -40% 0px"
                }
            );


        sections.forEach(section => {

            sectionObserver.observe(section);

        });

    }



    /* =====================================================
       11. PROCESS TIMELINE
    ===================================================== */

    function initProcessAnimation() {

        const process =
            document.querySelector(
                "[data-process]"
            );


        if (!process) return;


        const steps =
            process.querySelectorAll(
                ".step"
            );


        const progress =
            process.querySelector(
                ".process-line-progress"
            );


        if (!steps.length) return;


        if (prefersReducedMotion) {

            process.classList.add(
                "process-active"
            );

            return;

        }


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


        /*
         * Progress line follows scroll position.
         */

        if (progress) {

            window.addEventListener(
                "scroll",
                () => {

                    const rect =
                        process.getBoundingClientRect();


                    const windowHeight =
                        window.innerHeight;


                    const start =
                        windowHeight * 0.75;


                    const end =
                        -rect.height * 0.25;


                    let percentage =
                        (start - rect.top) /
                        (start - end);


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

                },
                { passive: true }
            );

        }

    }



    /* =====================================================
       12. PRODUCT ANIMATIONS
       ===================================================== */

    function initProductAnimations() {

        const productGrid =
            document.querySelector(
                ".products-grid"
            );


        if (!productGrid) return;


        /*
         * Products are inserted by script.js.
         *
         * MutationObserver waits for Supabase
         * products to appear.
         */

        const observer =
            new MutationObserver(
                mutations => {

                    let hasNewProducts =
                        false;


                    mutations.forEach(
                        mutation => {

                            if (
                                mutation.addedNodes &&
                                mutation.addedNodes.length
                            ) {

                                hasNewProducts =
                                    true;

                            }

                        }
                    );


                    if (hasNewProducts) {

                        animateProducts(
                            productGrid
                        );

                    }

                }
            );


        observer.observe(
            productGrid,
            {
                childList: true,
                subtree: true
            }
        );


        /*
         * In case products already exist.
         */

        animateProducts(productGrid);

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


                card.style.setProperty(
                    "--product-delay",
                    `${Math.min(index * 90, 500)}ms`
                );


                card.classList.add(
                    "product-motion-ready"
                );


                /*
                 * Trigger browser layout before
                 * adding visible class.
                 */

                requestAnimationFrame(() => {

                    setTimeout(() => {

                        card.classList.add(
                            "product-motion-visible"
                        );

                    }, 50);

                });

            }
        );

    }



    /* =====================================================
       13. PREMIUM CARD TILT
    ===================================================== */

    function initCardTilt() {

        if (prefersReducedMotion) return;


        const isTouchDevice =
            window.matchMedia(
                "(hover: none)"
            ).matches;


        if (isTouchDevice) return;


        /*
         * Use MutationObserver because products
         * are loaded dynamically from Supabase.
         */

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

                if (processed.has(card))
                    return;


                processed.add(card);


                card.addEventListener(
                    "mousemove",
                    event => {

                        const rect =
                            card.getBoundingClientRect();


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
                            ((x - centerX) /
                                centerX) *
                            3;


                        const rotateX =
                            ((centerY - y) /
                                centerY) *
                            3;


                        card.style.transform =
                            `perspective(1000px)
                             rotateX(${rotateX}deg)
                             rotateY(${rotateY}deg)
                             translateY(-9px)`;

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "";

                    }
                );

            });

        }


        setupCards();


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



    /* =====================================================
       14. CURSOR GLOW
    ===================================================== */

    function initCursorGlow() {

        if (prefersReducedMotion) return;


        const desktop =
            window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches;


        if (!desktop) return;


        const glow =
            document.createElement("div");


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


        document.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;

            },
            {
                passive: true
            }
        );


        function animateCursor() {

            currentX +=
                (mouseX - currentX) *
                0.12;


            currentY +=
                (mouseY - currentY) *
                0.12;


            glow.style.transform =
                `translate3d(
                    ${currentX}px,
                    ${currentY}px,
                    0
                ) translate(-50%, -50%)`;


            requestAnimationFrame(
                animateCursor
            );

        }


        animateCursor();


        /*
         * Hide cursor glow over mobile
         * or when pointer leaves page.
         */

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
       15. SMOOTH ANCHOR NAVIGATION
    ===================================================== */

    function initSmoothAnchors() {

        const anchors =
            document.querySelectorAll(
                'a[href^="#"]'
            );


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


                    const target =
                        document.querySelector(
                            targetId
                        );


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
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        navHeight -
                        15;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth"

                    });

                }
            );

        });

    }



    /* =====================================================
       16. FOOTER ANIMATION
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


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            footer.classList.add(
                                "footer-visible"
                            );

                            observer.unobserve(
                                footer
                            );

                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );


        observer.observe(footer);

    }



    /* =====================================================
       17. PAGE VISIBILITY
       ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

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
       18. PERFORMANCE SAFETY
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
       19. DEBUG INFORMATION
    ===================================================== */

    console.log(
        "THREADVERSE motion systems loaded:"
    );

    console.log(
        "✓ Page loader"
    );

    console.log(
        "✓ Hero reveal"
    );

    console.log(
        "✓ Scroll animations"
    );

    console.log(
        "✓ Mouse parallax"
    );

    console.log(
        "✓ Magnetic buttons"
    );

    console.log(
        "✓ Navbar animation"
    );

    console.log(
        "✓ Active navigation"
    );

    console.log(
        "✓ Process timeline"
    );

    console.log(
        "✓ Dynamic product animation"
    );

    console.log(
        "✓ Product card tilt"
    );

    console.log(
        "✓ Cursor glow"
    );

    console.log(
        "✓ Smooth navigation"
    );

})();
