// ===== COUNTDOWN TIMER =====
const weddingDate = new Date('2026-07-16T17:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== NAV DOTS =====
const dots = document.querySelectorAll('.nav-dot');
const sections = [];

dots.forEach(dot => {
    const targetId = dot.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);
    if (targetEl) sections.push({ dot, el: targetEl });

    dot.addEventListener('click', () => {
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    });
});

const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            dots.forEach(d => d.classList.remove('active'));
            const match = sections.find(s => s.el === entry.target);
            if (match) match.dot.classList.add('active');
        }
    });
}, { threshold: 0.3 });

sections.forEach(s => dotObserver.observe(s.el));

// ===== FLOATING HEARTS =====
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['♥', '♡', '❤', '💕'];

    for (let i = 0; i < 15; i++) {
        const span = document.createElement('span');
        span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = (8 + Math.random() * 12) + 's';
        span.style.animationDelay = (Math.random() * 10) + 's';
        span.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
        container.appendChild(span);
    }
}
createFloatingHearts();

// ===== FORM =====
function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById('rsvpForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('Анкета:', data);

    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
}

document.querySelectorAll('input[name="attendance"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const guestGroup = document.getElementById('guestCountGroup');
        guestGroup.style.display = e.target.value === 'no' ? 'none' : 'block';
    });
});
