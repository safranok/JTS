/* -------------------------------------------------------------
   WORKNEST INTERIORS - INTERACTIVE LOGIC & SPA ROUTER
   Author: Antigravity Team
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. SPA Router Init
    initRouter();

    // 2. Sticky Navbar & Header scroll effect
    initStickyHeader();

    // 3. Mobile Navigation Menu Toggle
    initMobileNav();

    // 4. Products Filter Showcase
    initProductFilters();

    // 5. Contact Form Logic & Quote Links
    initContactForm();

    // 6. FAQ Accordion Toggle
    initFaqAccordion();
}

/* ==========================================
   1. SINGLE PAGE APPLICATION (SPA) ROUTER
   ========================================== */
function initRouter() {
    const pages = document.querySelectorAll('.page-wrapper');
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a, #logo-link, [data-page]');
    
    function navigateToPage() {
        let hash = window.location.hash || '#home';
        
        // Remove active class from all pages & links
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });

        // Translate hash to page element ID
        let pageId = 'page-' + hash.replace('#', '');
        let activePage = document.getElementById(pageId);
        
        if (activePage) {
            activePage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            // Trigger specific page animation actions
            if (hash === '#home') {
                // Trigger stats counter
                setTimeout(animateStats, 300);
            }
        } else {
            // Fallback to home if page doesn't exist
            window.location.hash = '#home';
        }
        
        // Close mobile nav menu on page load
        const navMenu = document.getElementById('nav-menu');
        const mobileToggle = document.getElementById('mobile-toggle');
        if (navMenu && navMenu.classList.contains('mobile-open')) {
            navMenu.classList.remove('mobile-open');
            mobileToggle.classList.remove('active');
        }
    }

    // Hash change event listener
    window.addEventListener('hashchange', navigateToPage);
    
    // Initial navigation check
    navigateToPage();
}

/* ==========================================
   2. STICKY HEADER & SCROLL EFFECT
   ========================================== */
function initStickyHeader() {
    const header = document.querySelector('.navbar-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================
   3. MOBILE NAVIGATION ACCORDION
   ========================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
        });
    }
}

/* ==========================================
   4. BUSINESS STATS COUNTER ANIMATION
   ========================================== */
let statsAnimated = false; // Prevents re-animating multiple times if already viewing

function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    const duration = 2000; // Animation duration in ms
    
    statCards.forEach(card => {
        const targetValue = parseInt(card.getAttribute('data-target'), 10);
        const prefix = card.getAttribute('data-prefix') || '';
        const suffix = card.getAttribute('data-suffix') || '';
        const isCurrency = card.getAttribute('data-format') === 'currency';
        const numElement = card.querySelector('.stat-number');
        
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function (easeOutQuad)
            const easeProgress = progress * (2 - progress);
            
            const currentValue = Math.floor(easeProgress * targetValue);
            
            // Format value
            let formattedValue = currentValue;
            if (isCurrency) {
                // Format Indian Rupee Currency style (e.g. ₹31,12,300)
                formattedValue = formatIndianCurrency(currentValue);
            } else {
                formattedValue = currentValue.toLocaleString('en-IN');
            }
            
            numElement.textContent = `${prefix}${formattedValue}${suffix}`;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure precise ending value
                let finalFormatted = isCurrency ? formatIndianCurrency(targetValue) : targetValue.toLocaleString('en-IN');
                numElement.textContent = `${prefix}${finalFormatted}${suffix}`;
            }
        };
        
        window.requestAnimationFrame(step);
    });
}

// Indian Currency Formatter (₹31,12,300 style)
function formatIndianCurrency(num) {
    let str = num.toString();
    let lastThree = str.substring(str.length - 3);
    let otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
    }
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
}

/* ==========================================
   5. PRODUCT FILTERS & GALLERY
   ========================================== */
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active on buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger a tiny reflow to allow transition
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================
   6. CONTACT FORM & DYNAMIC QUOTE PREFILL
   ========================================== */
function initContactForm() {
    const quoteButtons = document.querySelectorAll('.quote-btn-click');
    const selectContainer = document.getElementById('product-quote-container');
    const productField = document.getElementById('contact-product');
    const interestDropdown = document.getElementById('contact-interest');
    const messageField = document.getElementById('contact-message');

    // Clicked "Request Quote" on a product card
    quoteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = btn.getAttribute('data-product');
            
            // Set dynamic fields in contact page
            if (productField && interestDropdown) {
                productField.value = productName;
                interestDropdown.value = 'corporate-bulk'; // default logic
                selectContainer.style.display = 'block';
                
                if (messageField) {
                    messageField.value = `Hi, I am interested in requesting a customized quote and catalog for the "${productName}" for our office setup. Please send pricing, color catalogs, and bulk configuration options.`;
                }
            }
            
            // Navigate directly to contact page
            window.location.hash = '#contact';
            
            // Focus on contact name field
            setTimeout(() => {
                const nameInput = document.getElementById('contact-name');
                if (nameInput) nameInput.focus();
            }, 400);
        });
    });

    // Monitor Interest Dropdown to show/hide dynamic product field
    if (interestDropdown) {
        interestDropdown.addEventListener('change', () => {
            if (interestDropdown.value !== 'corporate-bulk' && interestDropdown.value !== 'retail-home-office') {
                // Clear the preset product if they switch to general consultation
                selectContainer.style.display = 'none';
                productField.value = '';
            } else if (productField.value !== '') {
                selectContainer.style.display = 'block';
            }
        });
    }
}

// Global modal handlers
window.openProductModal = function(title, desc) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalQuoteBtn = document.getElementById('modal-quote-btn');
    const modalVisualIcon = document.querySelector('.modal-visual .modal-placeholder-img i');
    
    if (modal && modalTitle && modalDesc) {
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        
        // Update product icon based on category/title keyword
        if (title.toLowerCase().includes('desk')) {
            modalVisualIcon.className = 'fa-solid fa-table-columns';
        } else if (title.toLowerCase().includes('chair') || title.toLowerCase().includes('stool')) {
            modalVisualIcon.className = 'fa-solid fa-chair';
        } else {
            modalVisualIcon.className = 'fa-solid fa-cubes';
        }
        
        // Bind dynamic quote request click directly from modal
        modalQuoteBtn.onclick = () => {
            closeProductModal();
            
            // Set dynamic fields in contact page
            const selectContainer = document.getElementById('product-quote-container');
            const productField = document.getElementById('contact-product');
            const interestDropdown = document.getElementById('contact-interest');
            const messageField = document.getElementById('contact-message');

            if (productField && interestDropdown) {
                productField.value = title;
                interestDropdown.value = 'corporate-bulk';
                selectContainer.style.display = 'block';
                if (messageField) {
                    messageField.value = `Hi, I saw the "${title}" in the catalog quick view. I would love to request detailed physical specs, bulk corporate fitout quotes, and finish sample cards.`;
                }
            }
            
            window.location.hash = '#contact';
            setTimeout(() => {
                const nameInput = document.getElementById('contact-name');
                if (nameInput) nameInput.focus();
            }, 400);
        };

        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock body scroll
    }
};

window.closeProductModal = function() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Restore body scroll
    }
};

// Close modal when clicking outside contents
window.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (e.target === modal) {
        closeProductModal();
    }
});

// Handle contact form submission (Mock)
window.handleContactSubmit = function(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusAlert = document.getElementById('form-status');
    
    // Form fields
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const product = document.getElementById('contact-product').value;
    
    // Play button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing inquiry...';
    
    // Mock network request delay (1.2 seconds)
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        if (statusAlert) {
            statusAlert.className = 'form-status-alert success';
            let successMessage = `Thank you, ${name}! Your corporate request has been logged successfully. `;
            if (product) {
                successMessage += `An ergonomic workspace expert will send a bulk custom quote for the "${product}" to ${email} within 2 business hours.`;
            } else {
                successMessage += `An ergonomic specialist will reach out to ${email} within 2 business hours to schedule your office consultation.`;
            }
            statusAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${successMessage}`;
            statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Reset form
            form.reset();
            const selectContainer = document.getElementById('product-quote-container');
            if (selectContainer) selectContainer.style.display = 'none';
        }
    }, 1200);
};

/* ==========================================
   7. INTERACTIVE FAQ ACCORDION
   ========================================== */
function initFaqAccordion() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.parentElement;
            const content = toggle.nextElementSibling;
            
            // Check if active
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-content').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                // Calculate height dynamically
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}
