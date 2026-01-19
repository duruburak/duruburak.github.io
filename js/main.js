// ============================================
// CONSTANTS - All magic numbers and configurations in one place
// ============================================
const CONFIG = {
    SCROLL_THRESHOLD: 20, // Scroll position where navbar changes style
    DEBOUNCE_DELAY: 10, // Debounce duration for scroll event (ms)
    RESIZE_DEBOUNCE_DELAY: 100, // Debounce duration for window resize (ms)
    PARTICLE_COUNT: 120, // Number of particles to create
    EMAIL: "duruburak.tr@gmail.com", // Email address to copy
};

// ============================================
// UTILITY FUNCTIONS - Reusable helper functions
// ============================================

/**
 * Debounce utility - Prevents a function from being called too frequently
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time (ms)
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

/**
 * Checks the existence of an element and throws an error
 * @param {HTMLElement} element - Element to check
 * @param {string} errorMsg - Error message
 */
const assertElement = (element, errorMsg) => {
    if (!element) {
        console.warn(errorMsg);
        return false;
    }
    return true;
};

// ============================================
// NAVBAR MODULE - Manages sidebar and scroll effects
// ============================================
const NavbarModule = {
    init() {
        // Get and check element references
        this.sidebar = document.querySelector(".navbar-sidebar");
        this.sidebarOpenBtn = document.querySelector(".nav-menu-open-button");
        this.sidebarCloseBtn = document.querySelector(".nav-menu-close-button");
        this.navbar = document.querySelector(".navbar");

        // Initialize navbar scroll effect if exists
        if (this.navbar) {
            this.initScrollEffect();
        }

        // Add event listeners if sidebar elements exist
        if (this.sidebar && this.sidebarOpenBtn && this.sidebarCloseBtn) {
            this.initSidebar();
        }
    },

    // Adds sidebar open/close event listeners
    initSidebar() {
        this.sidebarOpenBtn.addEventListener("click", () =>
            this.toggleSidebar(true),
        );
        this.sidebarCloseBtn.addEventListener("click", () =>
            this.toggleSidebar(false),
        );

        // Added feature to close sidebar with ESC key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.sidebar.style.display === "flex") {
                this.toggleSidebar(false);
            }
        });
    },

    /**
     * Opens or closes the sidebar
     * @param {boolean} show - true to open, false to close
     */
    toggleSidebar(show) {
        this.sidebar.style.display = show ? "flex" : "none";
        // Updated aria-hidden attribute for accessibility
        this.sidebar.setAttribute("aria-hidden", !show);
    },

    // Adds or removes "scrolled" class to navbar on scroll event
    initScrollEffect() {
        // Debounced scroll handler - Optimized for performance
        const handleScroll = debounce(() => {
            this.navbar.classList.toggle(
                "scrolled",
                window.scrollY > CONFIG.SCROLL_THRESHOLD,
            );
        }, CONFIG.DEBOUNCE_DELAY);

        // Passive event listener - Improves scroll performance
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Check on initial load as well
        handleScroll();
    },
};

// ============================================
// PORTFOLIO MODULE - Manages project filtering and rendering
// ============================================
const PortfolioModule = {
    // Project data - In real application, this data comes from an API
    projects: [
        {
            title: "[coming soon...] E-Commerce Data Analysis on GCP Using BigQuery",
            category: ["case-study", "data-science"],
            image: "assets/images/project-case-study-ecommerce.png",
            link: "#",
        },
        {
            title: "Comprehensive Exploratory Data Analysis of Movies Dataset With Python",
            category: ["case-study", "data-science"],
            image: "assets/images/project-eda-movies.png",
            link: "https://github.com/duruburak/EDA-w-Python",
        },
        {
            title: "Desktop Weather App",
            category: "python",
            image: "assets/images/project-weather-app.png",
            link: "https://github.com/duruburak/Weather-App",
        },
        {
            title: "Color Extractor App",
            category: ["python", "data-science"],
            image: "assets/images/project-color-extractor-app.png",
            link: "https://github.com/duruburak/Color-Extractor",
        },
        {
            title: "Multiple Image Watermarker",
            category: ["python", "data-science"],
            image: "assets/images/project-watermarker-app.png",
            link: "https://github.com/duruburak/Multiple-Watermarker",
        },
        {
            title: "Typing Speed & Accuracy Calculator",
            category: "python",
            image: "assets/images/project-typing-speed-accuracy-calculator.png",
            link: "https://github.com/duruburak/typing-speed-accuracy-test",
        },
        {
            title: "Secure Password Generator",
            category: "python",
            image: "assets/images/project-secure-password-generator.png",
            link: "https://github.com/duruburak/secure-password-generator",
        },
        {
            title: "TIC TAC TOE Game",
            category: "python",
            image: "assets/images/project-tic-tac-toe-game.png",
            link: "https://github.com/duruburak/TIC-TAC-TOE-Game",
        },
    ],

    init() {
        this.grid = document.getElementById("portfolioGrid");
        this.filterButtons = document.querySelectorAll(".filter-btn");

        // Don't start module if grid doesn't exist
        if (!assertElement(this.grid, "Portfolio grid element not found"))
            return;

        this.render(this.projects);
        this.attachFilterEvents();
    },

    /**
     * Renders projects to DOM
     * @param {Array} items - List of projects to render
     */
    render(items) {
        // Cleaner HTML creation with template literals
        // Title and link values should be escaped for XSS protection (for production)
        this.grid.innerHTML = items
            .map(
                (item) => `
                <div class="portfolio-item ${item.category} flex-fill show">
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" aria-label="${item.title}">
                        <img src="${item.image}" alt="${item.title}" class="img-fluid" loading="lazy">
                        <h3>${item.title}</h3>
                    </a>
                </div>
            `,
            )
            .join("");

        // Accessibility announce after render (optional)
        this.announceResults(items.length);
    },

    // Adds event listeners to filter buttons
    attachFilterEvents() {
        this.filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => this.handleFilter(btn));
        });
    },

    /**
     * Handles filter button click event
     * @param {HTMLElement} btn - Clicked filter button
     */
    handleFilter(btn) {
        // Update active state
        this.filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Filtering operation - Shorter with ternary operator
        const filter = btn.dataset.filter;
        const filtered =
            filter === "all"
                ? this.projects
                : this.projects.filter((p) => {
                      // Eğer p.category bir array ise
                      if (Array.isArray(p.category)) {
                          return p.category.includes(filter);
                      }
                      // Eğer p.category tek bir string ise
                      return p.category === filter;
                  });

        this.render(filtered);
    },

    /**
     * Announces result count for screen reader users
     * @param {number} count - Number of projects shown
     */
    announceResults(count) {
        const announcement = `Showing ${count} project${
            count !== 1 ? "s" : ""
        }`;
        // Can use aria-live region for announcement (must exist in HTML)
        const liveRegion = document.getElementById("portfolio-live-region");
        if (liveRegion) {
            liveRegion.textContent = announcement;
        }
    },
};

// ============================================
// PARTICLE EFFECT MODULE - Animated particle effect on canvas
// ============================================
const ParticleEffect = {
    init() {
        this.spanElement = document.querySelector(".home-span-item");

        if (
            !assertElement(
                this.spanElement,
                "Particle effect target element not found",
            )
        )
            return;

        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.startAnimation();
    },

    // Creates and sets up the canvas element
    setupCanvas() {
        this.canvas = document.createElement("canvas");
        this.spanElement.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d", {
            alpha: true, // Transparency support
            desynchronized: true, // Performance optimization
        });
        this.resizeCanvas();
    },

    // Adjusts canvas size according to parent element
    resizeCanvas() {
        const rect = this.spanElement.getBoundingClientRect();
        // Set canvas resolution
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.createTextMask();
    },

    // Creates particles
    createParticles() {
        this.particles = [];

        // More modern and readable with Array.from
        this.particles = Array.from(
            { length: CONFIG.PARTICLE_COUNT },
            () => new Particle(this.canvas),
        );
    },

    // Creates a mask in the shape of text (particles will appear in this shape)
    createTextMask() {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext("2d");

        const text = this.spanElement.textContent || this.spanElement.innerText;
        const computedStyle = window.getComputedStyle(this.spanElement);

        // Get and apply font settings
        tempCtx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        tempCtx.textAlign = "center";
        tempCtx.textBaseline = "middle";
        tempCtx.fillStyle = "white";
        tempCtx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);

        // Get image data for mask
        this.textMask = tempCtx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height,
        );
    },

    // Sets up event listeners
    setupEventListeners() {
        // Debounced handler for resize event
        const handleResize = debounce(() => {
            this.resizeCanvas();
        }, CONFIG.RESIZE_DEBOUNCE_DELAY);

        window.addEventListener("resize", handleResize, { passive: true });
    },

    // Starts the animation loop
    startAnimation() {
        this.isAnimating = true;
        this.animate();
    },

    // Main animation loop
    animate() {
        if (!this.isAnimating) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw all particles
        this.particles.forEach((particle) => {
            particle.update();
            particle.draw(this.ctx);
        });

        // Apply text mask (particles only visible inside text)
        if (this.textMask) {
            this.ctx.globalCompositeOperation = "destination-in";
            this.ctx.putImageData(this.textMask, 0, 0);
            this.ctx.globalCompositeOperation = "source-over";
        }

        // Schedule next frame
        requestAnimationFrame(() => this.animate());
    },

    // Stops animation (for cleanup)
    stop() {
        this.isAnimating = false;
    },
};

// ============================================
// PARTICLE CLASS - Defines behavior of a single particle
// ============================================
class Particle {
    // Particle configuration - Defined as constant within class
    static CONFIG = {
        MIN_SIZE: 0.5,
        MAX_SIZE: 2.5,
        MIN_SPEED_Y: 0.5,
        MAX_SPEED_Y: 2.5,
        SPEED_X_RANGE: 0.5,
        MIN_OPACITY: 0.3,
        MAX_OPACITY: 0.8,
        ROTATION_SPEED_RANGE: 0.02,
        GLOW_OPACITY_MULTIPLIER: 0.3,
        GLOW_SIZE_MULTIPLIER: 2,
        BOUNDARY_MARGIN: 10,
    };

    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    // Resets particle to initial values
    reset() {
        const cfg = Particle.CONFIG;

        // Position
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;

        // Appearance
        this.size =
            Math.random() * (cfg.MAX_SIZE - cfg.MIN_SIZE) + cfg.MIN_SIZE;
        this.opacity =
            Math.random() * (cfg.MAX_OPACITY - cfg.MIN_OPACITY) +
            cfg.MIN_OPACITY;

        // Motion
        this.speedY =
            Math.random() * (cfg.MAX_SPEED_Y - cfg.MIN_SPEED_Y) +
            cfg.MIN_SPEED_Y;
        this.speedX = (Math.random() - 0.5) * cfg.SPEED_X_RANGE;

        // Rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * cfg.ROTATION_SPEED_RANGE;
    }

    // Updates particle position and rotation
    update() {
        const cfg = Particle.CONFIG;

        // Move upward
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // Reset from bottom if moved past top
        if (this.y < -cfg.BOUNDARY_MARGIN) {
            this.y = this.canvas.height + cfg.BOUNDARY_MARGIN;
            this.x = Math.random() * this.canvas.width;
        }

        // Recenter if moved past sides
        if (
            this.x < -cfg.BOUNDARY_MARGIN ||
            this.x > this.canvas.width + cfg.BOUNDARY_MARGIN
        ) {
            this.x = Math.random() * this.canvas.width;
        }
    }

    /**
     * Draws particle on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    draw(ctx) {
        const cfg = Particle.CONFIG;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Main particle (white)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect (pink) - With lower opacity
        ctx.fillStyle = `rgba(254, 83, 186, ${
            this.opacity * cfg.GLOW_OPACITY_MULTIPLIER
        })`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * cfg.GLOW_SIZE_MULTIPLIER, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// ============================================
// CONTACT MODULE - Manages email copying and social media links
// ============================================
const ContactModule = {
    init() {
        this.emailBtn = document.getElementById("contact-email");

        if (!this.emailBtn) return;

        this.emailTooltip = this.emailBtn.querySelector(".email-tooltip");

        // Add event listeners
        this.emailBtn.addEventListener("click", () => this.copyEmail());
        this.emailBtn.addEventListener("mouseleave", () => this.resetTooltip());

        // Setup social media buttons
        this.initSocialLinks();
    },

    // Copies email address to clipboard
    async copyEmail() {
        try {
            await navigator.clipboard.writeText(CONFIG.EMAIL);
            this.emailTooltip.textContent = "Copied! ✅";

            // Reset tooltip after 2 seconds
            setTimeout(() => this.resetTooltip(), 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
            this.emailTooltip.textContent = "Copy failed ❌";
        }
    },

    // Resets tooltip text to default
    resetTooltip() {
        if (this.emailTooltip) {
            this.emailTooltip.textContent = "Copy e-mail address";
        }
    },

    // Adds click events to social media links
    initSocialLinks() {
        const socialLinks = document.querySelectorAll(
            ".contact-item:not(#contact-email)",
        );

        socialLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const url = link.dataset.url;

                if (url) {
                    window.open(url, "_blank", "noopener,noreferrer"); // Added noopener and noreferrer for security
                }
            });
        });
    },
};

// ============================================
// INITIALIZATION - Start all modules when page loads
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    try {
        // Initialize all modules
        NavbarModule.init();
        PortfolioModule.init();
        ParticleEffect.init();
        ContactModule.init();

        console.log("✅ All modules initialized successfully");
    } catch (error) {
        console.error("❌ Error during initialization:", error);
    }
});

// ============================================
// CLEANUP - Cleanup operations when page closes (optional)
// ============================================
window.addEventListener("beforeunload", () => {
    // Stop animation (prevent memory leak)
    if (ParticleEffect.isAnimating) {
        ParticleEffect.stop();
    }
});
