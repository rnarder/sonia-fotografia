// Sonia Fotografía - Main JavaScript

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile Navigation - Hamburger Menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.servicio-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form submission handling
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = this.querySelector('button[type="submit"]');
        const status = document.querySelector('#form-status');
        const honeypot = this.querySelector('input[name="website"]');
        const originalText = btn ? btn.textContent : '';

        if (honeypot && honeypot.value.trim() !== '') {
            if (status) {
                status.textContent = 'No se pudo enviar el formulario.';
                status.classList.add('is-error');
            }
            return;
        }

        if (btn) {
            btn.textContent = 'Enviando...';
            btn.disabled = true;
        }

        if (status) {
            status.textContent = '';
            status.classList.remove('is-error');
        }

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Formspree request failed');
            }

            const redirectToThanks = () => {
                this.reset();
                window.location.href = 'gracias.html';
            };

            if (typeof gtag === 'function') {
                let redirected = false;
                const safeRedirect = () => {
                    if (redirected) return;
                    redirected = true;
                    redirectToThanks();
                };

                gtag('event', 'generate_lead', {
                    event_category: 'contact',
                    event_label: 'contact_form',
                    value: 1,
                    event_callback: safeRedirect
                });

                setTimeout(safeRedirect, 800);
            } else {
                redirectToThanks();
            }
        } catch (error) {
            if (status) {
                status.textContent = 'Hubo un problema al enviar. Inténtalo de nuevo en un momento.';
                status.classList.add('is-error');
            }

            if (btn) {
                btn.textContent = originalText || 'Enviar mensaje';
                btn.disabled = false;
            }
        }
    });
} else {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function () {
            const btn = this.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = 'Enviando...';
                btn.disabled = true;
            }
        });
    });
}
