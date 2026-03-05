// ==========================================================================
// Theme Management (Dark/Light Mode)
// ==========================================================================
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use system preference
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const setTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
};

// Initialize theme
setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ==========================================================================
// Navigation & Scroll Effects
// ==========================================================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');

// Navbar Scrolled State & Scroll Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Mobile Menu Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80; // nav height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Top Action
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Active Link Highlighting on Scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
});

// ==========================================================================
// Typing Effect
// ==========================================================================
const typingText = document.getElementById('typing-text');
const roles = [
    'Python Developer',
    'Computer Science Student',
    'Data Analyst',
    'Flask Specialist'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeSequence() {
    if (!typingText) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing new word
    }

    setTimeout(typeSequence, typingSpeed);
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeSequence, 1000);
    initScrollReveal();
});

// ==========================================================================
// Scroll Reveal Animations (Custom AOS alternative)
// ==========================================================================
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Optional: unobserve to animate only once
                // observer.unobserve(entry.target); 
            } else {
                // Remove to animate every time it scrolls into view
                entry.target.classList.remove('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

// ==========================================================================
// Contact Form Submission (AJAX)
// ==========================================================================
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnContent = submitBtn.innerHTML;

        // Basic Client-Side Validation
        const email = formData.get('email').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showFormFeedback('Please enter a valid email address.', 'error');
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showFormFeedback(data.message, 'success');
                contactForm.reset();

                // Reset floating labels by blurring all inputs
                contactForm.querySelectorAll('input, textarea').forEach(el => el.blur());
            } else {
                showFormFeedback(data.message || 'Error sending message.', 'error');
            }
        } catch (error) {
            console.error('Contact Form Error:', error);
            showFormFeedback('Network error. Please try again later.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
}

function showFormFeedback(message, type) {
    if (!formMessage) return;
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;

    // Auto-hide message after 5 seconds
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

// Dev Console Message
console.log('%c🚀 Portfolio Designed & Built seamlessly', 'color: #3b82f6; font-size: 16px; font-weight: bold;');