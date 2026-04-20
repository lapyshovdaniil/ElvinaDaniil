// ===== COUNTDOWN TIMER =====
// ИЗМЕНИТЕ ДАТУ СВАДЬБЫ ЗДЕСЬ:
const weddingDate = new Date('2026-08-15T16:00:00');

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

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
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

// ===== NAV HIDE/SHOW ON SCROLL =====
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 80) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    lastScroll = currentScroll;
});

// ===== FORM SUBMIT =====
function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById('rsvpForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Здесь можно подключить отправку данных на сервер
    // Например через fetch() к Google Forms, Formspree, или свой бэкенд
    console.log('Анкета:', data);

    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
}

// ===== SHOW/HIDE GUEST COUNT =====
document.querySelectorAll('input[name="attendance"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const guestGroup = document.getElementById('guestCountGroup');
        guestGroup.style.display = e.target.value === 'no' ? 'none' : 'block';
    });
});