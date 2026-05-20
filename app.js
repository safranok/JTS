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

    // 7. Admin Dashboard Console Init
    initAdminConsole();
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
            } else if (hash === '#admin') {
                if (window.checkAdminAuth) window.checkAdminAuth();
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

// Handle contact form submission
window.handleContactSubmit = function(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('form-status');
    
    // Form fields
    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const interestSelect = document.getElementById('contact-interest');
    const cityEl = document.getElementById('contact-city');
    const unitsEl = document.getElementById('contact-units');
    const productEl = document.getElementById('contact-product');
    const messageEl = document.getElementById('contact-message');
    
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl.value.trim();
    const city = cityEl.value.trim();
    const units = unitsEl.value.trim();
    const product = productEl ? productEl.value.trim() : '';
    const message = messageEl ? messageEl.value.trim() : '';
    
    // Reset previous validation states
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.classList.remove('invalid'));
    
    if (statusEl) {
        statusEl.className = 'form-status-alert';
        statusEl.style.display = 'none';
        statusEl.innerHTML = '';
    }
    
    let isValid = true;
    
    // Helper to display error
    function showError(inputEl, msg) {
        inputEl.classList.add('invalid');
        const parent = inputEl.closest('.form-group');
        if (parent) {
            parent.classList.add('has-error');
            const errorSpan = parent.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.textContent = msg;
            }
        }
    }
    
    // 1. Validate Full Name
    if (!name) {
        showError(nameEl, "Full Name is required.");
        isValid = false;
    } else if (name.length < 2) {
        showError(nameEl, "Name must be at least 2 characters.");
        isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        showError(nameEl, "Name can only contain letters and spaces.");
        isValid = false;
    }
    
    // 2. Validate Email
    if (!email) {
        showError(emailEl, "Corporate Email is required.");
        isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        showError(emailEl, "Please enter a valid corporate email address.");
        isValid = false;
    }
    
    // 3. Validate Phone Number
    if (!phone) {
        showError(phoneEl, "Phone Number is required.");
        isValid = false;
    } else {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const isValidPhone = cleanPhone.length === 10 || (cleanPhone.length === 12 && cleanPhone.startsWith('91'));
        if (!isValidPhone) {
            showError(phoneEl, "Please enter a valid 10-digit Indian phone number.");
            isValid = false;
        }
    }
    
    // 4. Validate Product of Interest (Interest Dropdown)
    if (!interestSelect.value) {
        showError(interestSelect, "Please select your primary interest.");
        isValid = false;
    }
    
    // 5. Validate City
    if (!city) {
        showError(cityEl, "City is required.");
        isValid = false;
    } else if (city.length < 2) {
        showError(cityEl, "City name must be at least 2 characters.");
        isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(city)) {
        showError(cityEl, "City name can only contain letters and spaces.");
        isValid = false;
    }
    
    // 6. Validate Units
    if (!units) {
        showError(unitsEl, "Number of units is required.");
        isValid = false;
    } else {
        const unitsNum = parseInt(units, 10);
        if (isNaN(unitsNum) || unitsNum < 1) {
            showError(unitsEl, "Please enter a valid number of units (1 or more).");
            isValid = false;
        }
    }
    
    if (!isValid) {
        if (statusEl) {
            statusEl.classList.add('error');
            statusEl.textContent = "Please correct the highlighted fields before submitting.";
        }
        return;
    }
    
    // Play button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing inquiry...';
    
    // Mock network request delay (1.2 seconds)
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Save submission to LocalStorage
        const leads = JSON.parse(localStorage.getItem('worknest_leads')) || [];
        const newLead = {
            timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            name: name,
            email: email,
            phone: phone,
            interest: interestSelect.options[interestSelect.selectedIndex].text,
            product: product || 'N/A',
            city: city,
            units: parseInt(units, 10) || 1,
            message: message || 'N/A'
        };
        leads.unshift(newLead); // Add new lead to the beginning
        localStorage.setItem('worknest_leads', JSON.stringify(leads));
        
        // Reset form
        form.reset();
        const selectContainer = document.getElementById('product-quote-container');
        if (selectContainer) selectContainer.style.display = 'none';
        
        // Redirect to the Thank You confirmation page
        window.location.hash = '#thankyou';
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

/* ==========================================
   8. ADMIN CONSOLE LEAD MANAGEMENT
   ========================================== */
function initAdminConsole() {
    // Check authentication on initial load if hash is #admin
    if (window.location.hash === '#admin') {
        if (window.checkAdminAuth) window.checkAdminAuth();
    }
}

// Check admin authentication and display correct view
window.checkAdminAuth = function() {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    const loginContainer = document.getElementById('admin-login-container');
    const dashboardContainer = document.getElementById('admin-dashboard-container');
    
    if (isAuth) {
        if (loginContainer) loginContainer.style.display = 'none';
        if (dashboardContainer) {
            dashboardContainer.style.display = 'block';
            window.renderLeadsTable();
        }
    } else {
        if (dashboardContainer) dashboardContainer.style.display = 'none';
        if (loginContainer) {
            loginContainer.style.display = 'block';
            // Reset fields
            const passwordInput = document.getElementById('admin-password');
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.classList.remove('invalid');
                passwordInput.type = 'password';
                const eyeIcon = passwordInput.nextElementSibling ? passwordInput.nextElementSibling.querySelector('i') : null;
                if (eyeIcon) eyeIcon.className = 'fa-regular fa-eye';
            }
            const errorMsg = document.getElementById('admin-login-error');
            if (errorMsg) {
                const group = errorMsg.closest('.form-group');
                if (group) group.classList.remove('has-error');
            }
        }
    }
};

// Handle admin login submission
window.handleAdminLogin = function(event) {
    event.preventDefault();
    const form = event.target;
    const passwordInput = document.getElementById('admin-password');
    const errorMsg = document.getElementById('admin-login-error');
    const loginCard = document.getElementById('admin-login-card');
    
    const password = passwordInput.value;
    
    if (password === '0987654321') {
        sessionStorage.setItem('admin_authenticated', 'true');
        window.checkAdminAuth();
    } else {
        // Show inline error
        passwordInput.classList.add('invalid');
        const group = passwordInput.closest('.form-group');
        if (group) group.classList.add('has-error');
        if (errorMsg) errorMsg.textContent = "Incorrect password. Please try again.";
        
        // Shake card animation
        if (loginCard) {
            loginCard.classList.remove('shake');
            void loginCard.offsetWidth; // Trigger reflow to restart animation
            loginCard.classList.add('shake');
            setTimeout(() => {
                loginCard.classList.remove('shake');
            }, 500);
        }
    }
};

// Handle admin logout
window.handleAdminLogout = function() {
    sessionStorage.removeItem('admin_authenticated');
    window.checkAdminAuth();
};

// Toggle password visibility
window.togglePasswordVisibility = function(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const btn = input.nextElementSibling;
    if (!btn) return;
    
    const icon = btn.querySelector('i');
    if (!icon) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-regular fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-regular fa-eye';
    }
};

// Export inquiries database to CSV
window.exportLeadsToCSV = function() {
    const leads = JSON.parse(localStorage.getItem('worknest_leads')) || [];
    if (leads.length === 0) {
        alert("No leads available to export.");
        return;
    }
    
    // CSV Headers
    const headers = [
        "Date & Time",
        "Full Name",
        "Email Address",
        "Phone Number",
        "Product of Interest",
        "City",
        "Number of Units",
        "Other Details"
    ];
    
    // Map entries to CSV lines
    const rows = leads.map(lead => [
        lead.timestamp,
        lead.name,
        lead.email,
        lead.phone,
        lead.product && lead.product !== 'N/A' ? `${lead.interest} (${lead.product})` : lead.interest,
        lead.city,
        lead.units,
        lead.message
    ]);
    
    // Escape standard CSV characters
    const escapeCSV = (str) => {
        if (str === null || str === undefined) return '';
        const stringVal = String(str);
        if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r')) {
            return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
    };
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n');
    
    // Create blob with UTF-8 BOM to ensure clean rendering in Excel
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `worknest_inquiries_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.loadSampleLeads = function() {
    const sampleLeads = [
        {
            timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            name: 'Vikram Malhotra',
            email: 'vikram@trivectortech.in',
            phone: '+91 98450 12345',
            interest: 'Corporate Bulk Order (10+ items)',
            product: 'ErgoDesk Pro',
            city: 'Bangalore',
            units: 25,
            message: 'Need standard oak finish tops and premium white frame dual motor desks for our new workspace in Indiranagar.'
        },
        {
            timestamp: new Date(Date.now() - 3600000 * 18).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            name: 'Priya Sharma',
            email: 'priya.s@designstudio.co',
            phone: '+91 88600 55432',
            interest: 'Bespoke Design / Special Customizations',
            product: 'AirMesh Chair',
            city: 'Mumbai',
            units: 12,
            message: 'Inquiring about potential custom mesh coloring options (navy blue) to align with our brand identity.'
        },
        {
            timestamp: new Date(Date.now() - 3600000 * 30).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            name: 'Arjun Sen',
            email: 'arjun@creativehustle.com',
            phone: '+91 97110 88990',
            interest: 'Premium Single Office / Home Setups',
            product: 'StandDesk Elite',
            city: 'New Delhi',
            units: 1,
            message: 'Setting up a professional remote workstation at home. Interested in immediate shipping options.'
        }
    ];
    
    let currentLeads = JSON.parse(localStorage.getItem('worknest_leads')) || [];
    currentLeads = sampleLeads.concat(currentLeads);
    localStorage.setItem('worknest_leads', JSON.stringify(currentLeads));
    renderLeadsTable();
};

window.clearAllLeads = function() {
    if (confirm("Are you sure you want to delete all lead inquiries? This action cannot be undone.")) {
        localStorage.removeItem('worknest_leads');
        renderLeadsTable();
    }
};

window.renderLeadsTable = function() {
    const tbody = document.getElementById('admin-leads-tbody');
    const totalCountEl = document.getElementById('lead-count-total');
    const totalUnitsEl = document.getElementById('lead-count-units');
    
    if (!tbody) return;
    
    const leads = JSON.parse(localStorage.getItem('worknest_leads')) || [];
    
    // Update stats
    if (totalCountEl) totalCountEl.textContent = leads.length;
    const totalUnits = leads.reduce((sum, lead) => sum + (parseInt(lead.units, 10) || 0), 0);
    if (totalUnitsEl) totalUnitsEl.textContent = totalUnits;
    
    if (leads.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table-msg">No submissions found. Submit the contact form to capture leads or click "Load Sample Leads".</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = leads.map(lead => `
        <tr>
            <td class="lead-time">${lead.timestamp}</td>
            <td class="lead-name"><strong>${escapeHTML(lead.name)}</strong></td>
            <td class="lead-contact">
                <div class="contact-email-row"><i class="fa-regular fa-envelope"></i> <a href="mailto:${escapeHTML(lead.email)}">${escapeHTML(lead.email)}</a></div>
                <div class="contact-phone-row"><i class="fa-solid fa-phone"></i> ${escapeHTML(lead.phone)}</div>
            </td>
            <td><span class="lead-city">${escapeHTML(lead.city)}</span></td>
            <td>
                <span class="lead-interest-badge">${escapeHTML(lead.interest)}</span>
                ${lead.product && lead.product !== 'N/A' ? `<div class="lead-product-sub"><i class="fa-solid fa-chair"></i> ${escapeHTML(lead.product)}</div>` : ''}
            </td>
            <td class="lead-units-col"><strong>${lead.units}</strong></td>
            <td class="lead-details"><div class="lead-details-bubble">${escapeHTML(lead.message)}</div></td>
        </tr>
    `).join('');
};

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
