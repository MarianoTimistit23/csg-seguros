document.addEventListener('DOMContentLoaded', function() {
    /**
     * Navbar
     */
    window.onscroll = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            document.querySelector(".js-header")?.classList.add('scrolled');
        } else {
            document.querySelector(".js-header")?.classList.remove('scrolled');
        }
    };
    
    /**
     * Animate on scroll (Intersection Observer API)
     */
    const faders = document.querySelectorAll('.js-animation-fade-in, .js-animation-fade-in-container, .js-animation-fade-in-up, .js-animation-fade-in-up-container');

    const options = {
        threshold: .15
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Normal fade-in animation
                if (entry.target.classList.contains('js-animation-fade-in')) {
                    entry.target.classList.add('js-animation-visible');
                    appearOnScroll.unobserve(entry.target);
                }

                // Fade-in-up animation
                if (entry.target.classList.contains('js-animation-fade-in-up')) {
                    entry.target.classList.add('js-animation-visible');
                    appearOnScroll.unobserve(entry.target);
                }

                // Staggered fade-in animation for container and children
                if (entry.target.classList.contains('js-animation-fade-in-container')) {
                    entry.target.classList.add('js-animation-visible');
                    const children = entry.target.querySelectorAll('.js-animation-fade-in-children');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('js-animation-visible');
                        }, index * 200); // Adjust the delay as needed (200ms here)
                    });
                    appearOnScroll.unobserve(entry.target);
                }

                // Staggered fade-in-up animation for container and children
                if (entry.target.classList.contains('js-animation-fade-in-up-container')) {
                    entry.target.classList.add('js-animation-visible');
                    const children = entry.target.querySelectorAll('.js-animation-fade-in-up-children');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('js-animation-visible');
                        }, index * 200); // Adjust the delay as needed (200ms here)
                    });
                    appearOnScroll.unobserve(entry.target);
                }
            }
        });
    }, options);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    /**
     * Metrics counters (animate from 0 to target on scroll)
     */
    /*const counterEls = document.querySelectorAll('.js-counter');

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    function animateCounter(el, target, duration = 1500) {
        const start = 0;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const value = Math.floor(start + (target - start) * eased);
            el.textContent = value.toLocaleString('es-AR');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString('es-AR');
            }
        }

        requestAnimationFrame(update);
    }

    const countersObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.animated === 'true') {
                obs.unobserve(el);
                return;
            }
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (!Number.isNaN(target)) {
                animateCounter(el, target);
                el.dataset.animated = 'true';
            }
            obs.unobserve(el);
        });
    }, { threshold: 0.4 });

    counterEls.forEach(el => countersObserver.observe(el));*/

    /**
     * Hamburger Menu Toggle
     */
    const hamburgerMenuToggle = document.querySelector('.header__hamburger-menu-container');
    const navMenu = document.querySelector('.header__nav-container-mobile ul');
    const body = document.querySelector('body');

    hamburgerMenuToggle?.addEventListener('click', () => {
        hamburgerMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    // Close menu and allow scroll on anchor link click
    const anchorLinks = navMenu.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Scroll to the anchor element
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Close the menu
                hamburgerMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    });

    /**
     * Testimonials Slider
     */
    const testimonialsSlider = new Swiper('.js-testimonials-slider', {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 16, 
        centeredSlides: true, 
        pagination: {
            el: '.swiper-pagination',
        }
    });

    /**
     * Company Logos Slider
     */
    const companyLogosSlider = new Swiper('.js-company-logos-slider', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 42, 
        speed: 8000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
    });

    /* --- FAQs --- */
    /*document.querySelectorAll('.js-faq').forEach((el, index) => {
        const accordion = new Accordion(el);
        // Open the first FAQ by default
        if (index === 0) {
            accordion.open();
        }
    });*/

    /**
     * Contact Form
     */
    const form = document.getElementById('js-contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const loader = document.querySelector('.js-loader');
    const successMessage = document.querySelector('.success-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Disable submit button and show loader
        submitButton.disabled = true;
        loader.style.display = 'flex';
        
        try {
            const formData = new FormData(form);
            const body = new URLSearchParams(formData).toString();
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            });
            
            // Check if response is successful
            if (response.ok) {
                // Hide loader and form, show success message
                loader.style.display = 'none';
                form.style.display = 'none';
                successMessage.style.display = 'flex';
                form.reset();
            } else {
                // Handle error - re-enable button and hide loader
                submitButton.disabled = false;
                loader.style.display = 'none';
                alert('There was an error sending your message. Please try again.');
            }
        } catch (error) {
            // Handle network errors
            submitButton.disabled = false;
            loader.style.display = 'none';
            alert('There was an error sending your message. Please try again.');
        }
    });

});



class Accordion {
    static instances = []; // Track all accordion instances

    constructor(el) {
        // Store elements
        this.el = el; // <details>
        this.summary = el.querySelector('.js-faq-question'); 
        this.content = el.querySelector('.js-faq-answer');

        this.animation = null; // Animation object (so we can cancel it if needed)
        this.isClosing = false;
        this.isExpanding = false;

        // Add instance to static array
        Accordion.instances.push(this);

        // Detect user clicks on the summary element
        this.summary.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(e) {

        e.preventDefault();
        // Add an overflow on the <details> to avoid content overflowing
        this.el.style.overflow = 'hidden';
        // Check if the element is being closed or is already closed
        if (this.isClosing || !this.el.open) {
            this.open();
        // Check if the element is being openned or is already open
        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }

    shrink() {

        // Set the element as "being closed"
        this.isClosing = true;
        
        // Store the current height of the element
        const startHeight = `${this.el.offsetHeight}px`;
        // Calculate the height of the summary
        const endHeight = `${this.summary.offsetHeight}px`;
        
        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }
        
        // Start a WAAPI animation
        this.animation = this.el.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
            }, {
            duration: 200,
            easing: 'ease-out'
        });
        
        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(false);
        // If the animation is cancelled, isClosing variable is set to false
        this.animation.oncancel = () => this.isClosing = false;
    }

    open() {

        // Close all other open accordions
        Accordion.instances.forEach(instance => {
            if (instance !== this && instance.el.open) {
                instance.shrink();
            }
        });

        // Proceed with opening this accordion
        this.el.style.height = `${this.el.offsetHeight}px`; // Apply a fixed height on the element
        this.el.open = true; // Force the [open] attribute on the details element
        window.requestAnimationFrame(() => this.expand()); // Wait for the next frame to call the expand function
    }

    expand() {

        // Set the element as "being expanding"
        this.isExpanding = true;
        // Get the current fixed height of the element
        const startHeight = `${this.el.offsetHeight}px`;
        // Calculate the open height of the element (summary height + content height)
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
        
        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }
        
        // Start a WAAPI animation
        this.animation = this.el.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
            }, {
            duration: 600,
            easing: 'ease-out'
        });
        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(true);
        // If the animation is cancelled, isExpanding variable is set to false
        this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
        
        // Set the open attribute based on the parameter
        this.el.open = open;
        // Clear the stored animation
        this.animation = null;
        // Reset isClosing & isExpanding
        this.isClosing = false;
        this.isExpanding = false;
        // Remove the overflow hidden and the fixed height
        this.el.style.height = this.el.style.overflow = '';
    }
}