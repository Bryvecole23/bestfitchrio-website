document.addEventListener('DOMContentLoaded', function () {

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
        });

        document.addEventListener('click', function (e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close mobile menu on nav link click
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Scroll-based nav highlighting
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-menu li a');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + section.offsetHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Floating label functionality
    const inputs = document.querySelectorAll(
        '.floating-field input[type="text"], .floating-field input[type="email"], .floating-field input[type="tel"], .floating-field textarea'
    );

    function checkInputValue(input) {
        if (input.value && input.value.trim() !== '') {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    }

    inputs.forEach(input => {
        checkInputValue(input);
        input.addEventListener('input', function () { checkInputValue(this); });
        input.addEventListener('focus', function () { this.classList.add('focused'); checkInputValue(this); });
        input.addEventListener('blur', function () { this.classList.remove('focused'); checkInputValue(this); });
        input.addEventListener('animationstart', function (e) {
            if (e.animationName === 'onAutoFillStart') this.classList.add('has-value');
        });
        input.addEventListener('change', function () { checkInputValue(this); });
    });

    setTimeout(() => { inputs.forEach(input => { checkInputValue(input); }); }, 100);

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.getElementById(href.substring(1));
                if (targetSection) {
                    const navbar = document.querySelector('.navbar');
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    window.scrollTo({ top: targetSection.offsetTop - navHeight, behavior: 'smooth' });
                }
            }
        });
    });

    // Logo hover
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        logo.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    }

    // Booking form submit
    const bookingForm = document.querySelector('#contact-form');
    const submitButton = document.querySelector('#submit-button');
    if (bookingForm && submitButton) {
        bookingForm.addEventListener('submit', function () {
            submitButton.disabled = true;
            submitButton.value = 'Opening Booking...';
        });
    }

    // Autofill detection styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes onAutoFillStart { from { opacity: 1; } to { opacity: 1; } }
        input:-webkit-autofill, textarea:-webkit-autofill { animation-name: onAutoFillStart; animation-duration: 0.001s; }
        input:-webkit-autofill + label, textarea:-webkit-autofill + label,
        input.has-value + label, textarea.has-value + label {
            top: -12px !important; left: 15px !important; font-size: 0.85rem !important;
            color: white !important; background: linear-gradient(135deg, #EB2526, #dc2626) !important;
            padding: 4px 8px !important; border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(235, 37, 38, 0.3) !important;
        }
        .floating-field input.has-value, .floating-field textarea.has-value,
        .floating-field input:-webkit-autofill, .floating-field textarea:-webkit-autofill {
            padding-top: 18px !important;
        }
    `;
    document.head.appendChild(style);

    // =============================================
    // CONFETTI ANIMATION
    // =============================================
    const canvas = document.querySelector('.grand-opening-canvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let pieces = [];
        let animId = null;

        const COLORS = [
            'rgba(235,37,38,',
            'rgba(255,255,255,',
            'rgba(235,37,38,',
            'rgba(200,200,200,',
            'rgba(255,80,80,',
        ];
        const SHAPES = ['rect', 'rect', 'rect', 'circle', 'strip'];

        // Size canvas directly to window — bypasses any layout timing issue
        function syncSize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function spawn(seedY) {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const size  = shape === 'strip'
                ? { w: 2 + Math.random() * 2,  h: 10 + Math.random() * 10 }
                : { w: 5 + Math.random() * 7,  h: 5  + Math.random() * 7  };
            return {
                x:           Math.random() * canvas.width,
                y:           seedY !== undefined ? seedY : -20 - Math.random() * canvas.height * 0.4,
                w:           size.w,
                h:           size.h,
                shape,
                color,
                alpha:       0.3  + Math.random() * 0.6,
                vy:          0.8  + Math.random() * 1.4,
                vx:          (Math.random() - 0.5) * 0.8,
                angle:       Math.random() * Math.PI * 2,
                spin:        (Math.random() - 0.5) * 0.06,
                wobble:      Math.random() * Math.PI * 2,
                wobbleSpeed: 0.02 + Math.random() * 0.03,
                wobbleAmp:   0.5  + Math.random() * 1.0,
            };
        }

        function drawPiece(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle   = p.color + '1)';
            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }
            ctx.restore();
        }

        function buildPieces() {
            syncSize();
            pieces = [];
            const count = Math.max(80, Math.floor((canvas.width * canvas.height) / 4000));
            for (let i = 0; i < count; i++) {
                pieces.push(spawn(Math.random() * canvas.height));
            }
        }

        function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach((p, i) => {
                p.wobble += p.wobbleSpeed;
                p.x      += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
                p.y      += p.vy;
                p.angle  += p.spin;
                drawPiece(p);
                if (p.y > canvas.height + 20) pieces[i] = spawn();
            });
            animId = requestAnimationFrame(tick);
        }

        function start() {
            if (animId) cancelAnimationFrame(animId);
            buildPieces();
            tick();
        }

        // Start immediately — window.innerWidth/Height are always available
        start();

        // Re-sync on resize
        window.addEventListener('resize', start);
    }

    console.log('BestFit Chiropractic JavaScript loaded successfully!');
});