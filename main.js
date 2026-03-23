// BestFit Chiropractic - Complete JavaScript Functionality with Jane App redirect handled by HTML form action
document.addEventListener('DOMContentLoaded', function() {
    
    // Hamburger menu functionality - FIXED for mobile interaction
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
        
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Scroll-based navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu li a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Floating label functionality
    const inputs = document.querySelectorAll('.floating-field input[type="text"], .floating-field input[type="email"], .floating-field input[type="tel"], .floating-field textarea');
    
    inputs.forEach(input => {
        checkInputValue(input);
        
        input.addEventListener('input', function() {
            checkInputValue(this);
        });
        
        input.addEventListener('focus', function() {
            this.classList.add('focused');
            checkInputValue(this);
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
            checkInputValue(this);
        });

        input.addEventListener('animationstart', function(e) {
            if (e.animationName === 'onAutoFillStart') {
                this.classList.add('has-value');
            }
        });
        
        input.addEventListener('change', function() {
            checkInputValue(this);
        });
    });
    
    function checkInputValue(input) {
        if (input.value && input.value.trim() !== '') {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    }
    
    setTimeout(() => {
        inputs.forEach(input => {
            checkInputValue(input);
        });
    }, 100);

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navbar = document.querySelector('.navbar');
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const offsetTop = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Enhanced logo hover effects
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Optional: change button text while form submits normally to Jane
    const bookingForm = document.querySelector('#contact-form');
    const submitButton = document.querySelector('#submit-button');

    if (bookingForm && submitButton) {
        bookingForm.addEventListener('submit', function() {
            submitButton.disabled = true;
            submitButton.value = 'Opening Booking...';
        });
    }

    // Auto-fill detection support
    const style = document.createElement('style');
    style.textContent = `
        @keyframes onAutoFillStart {
            from { opacity: 1; }
            to { opacity: 1; }
        }
        
        input:-webkit-autofill,
        textarea:-webkit-autofill {
            animation-name: onAutoFillStart;
            animation-duration: 0.001s;
        }
        
        input:-webkit-autofill + label,
        textarea:-webkit-autofill + label,
        input.has-value + label,
        textarea.has-value + label {
            top: -12px !important;
            left: 15px !important;
            font-size: 0.85rem !important;
            color: white !important;
            background: linear-gradient(135deg, #EB2526, #dc2626) !important;
            padding: 4px 8px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(235, 37, 38, 0.3) !important;
        }
        
        .floating-field input.has-value,
        .floating-field textarea.has-value,
        .floating-field input:-webkit-autofill,
        .floating-field textarea:-webkit-autofill {
            padding-top: 18px !important;
        }
    `;
    document.head.appendChild(style);

    console.log('BestFit Chiropractic JavaScript loaded successfully!');
});