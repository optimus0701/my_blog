// Main JavaScript functionality
const AUTO_MODE = 1;
const MANUAL_MODE = 2;
let isClose = false;
const TARGET_URL = 'https://script.google.com/macros/s/AKfycby9Hk9wy9N4cmdjG6YYsGllXqMi93k1hFYfdnrAhFxSBaFxdclQ80uduiblswSTSEM3/exec';
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeHeader();
    initializeScrollEffects();
    initializeForms();
    initializeBackToTop();
    initializeFloatingContact();
    initializeLazyLoading();
    
    console.log('The Matrix One Premium website initialized successfully');
});

// Header functionality
function initializeHeader() {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    
    // Scroll effect for header
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements that should fade in
    const fadeElements = document.querySelectorAll('.fade-in, .features-content, .overview-item, .amenity-item, .contact-form-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Form handling
function initializeForms() {
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

async function handleFormSubmission(form) {
    // Add loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    
    const formObject = Object.fromEntries(formData.entries());
    console.log('Dữ liệu được gửi đi:', formObject);

    
    try {
        // 3. Thực hiện fetch đến cùng một URL
        const response = await fetch(TARGET_URL, {
            method: 'POST',
            body: formData // Gửi thẳng đối tượng FormData đi
        });

        if (!response.ok) {
            // Nếu server trả về lỗi (status code không phải 2xx)
            throw new Error(`Lỗi từ server: ${response.statusText}`);
        }

        const result = await response.json(); // Giả sử server trả về JSON
        console.log('Phản hồi thành công từ server:', result);
        showMessage('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');
        

    } catch (error) {
        console.error('Đã xảy ra lỗi khi gửi form:', error);
        alert('Gửi dữ liệu thất bại. Vui lòng thử lại.');

    } finally {
        // Dù thành công hay thất bại, khôi phục lại trạng thái của nút bấm
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
        window.location.href = "/thanks.html"
        submitBtn.disabled = false;
        form.reset();
        const modal = form.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    }
    
    
}

function showMessage(text, type = 'success') {
    // Create message element
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    // Add to page
    document.body.appendChild(message);
    
    // Position message
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.zIndex = '9999';
    message.style.maxWidth = '300px';
    message.style.animation = 'slideInRight 0.3s ease';
    
    // Remove after 5 seconds
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 5000);
}

// Back to top functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Floating contact functionality
function initializeFloatingContact() {
    const floatingContact = document.querySelector('.floating-contact');
    
    if (floatingContact) {
        // Add hover effects
        const floatingBtns = floatingContact.querySelectorAll('.floating-btn');
        
        floatingBtns.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Track phone clicks
        const phoneBtn = floatingContact.querySelector('.phone-btn a');
        if (phoneBtn) {
            phoneBtn.addEventListener('click', function() {
                console.log('Phone button clicked');
                // Add analytics tracking here
            });
        }
        
        // Track Zalo clicks
        const zaloBtn = floatingContact.querySelector('.zalo-btn a');
        if (zaloBtn) {
            zaloBtn.addEventListener('click', function() {
                console.log('Zalo button clicked');
                // Add analytics tracking here
            });
        }
    }
}

// Lazy loading for images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
}

// Modal functionality
function openModal(modalId, mode) {
    
    if(mode === AUTO_MODE && isClose === true) {
        return;
    }
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    isClose = true; 
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


// Performance optimization
const optimizedScrollHandler = throttle(function() {
    // Handle scroll events here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Add error reporting here
});

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;






