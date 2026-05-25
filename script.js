// ===== COUNTDOWN =====
const weddingDate = new Date('2025-07-16T13:15:00');
 
function updateCountdown() {
    const diff = weddingDate - new Date();
    if (diff <= 0) {
        ['days','hours','minutes','seconds'].forEach(id =>
            document.getElementById(id).textContent = '00');
        return;
    }
    document.getElementById('days').textContent =
        String(Math.floor(diff / 864e5)).padStart(2, '0');
    document.getElementById('hours').textContent =
        String(Math.floor(diff % 864e5 / 36e5)).padStart(2, '0');
    document.getElementById('minutes').textContent =
        String(Math.floor(diff % 36e5 / 6e4)).padStart(2, '0');
    document.getElementById('seconds').textContent =
        String(Math.floor(diff % 6e4 / 1e3)).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);
 
// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.15 });
 
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
 
// ===== NAV DOTS =====
const dots = document.querySelectorAll('.nav-dot');
const sections = [];
 
dots.forEach(dot => {
    const el = document.getElementById(dot.dataset.target);
    if (el) sections.push({ dot, el });
    dot.addEventListener('click', () =>
        el && el.scrollIntoView({ behavior: 'smooth' }));
});
 
const dotObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            dots.forEach(d => d.classList.remove('active'));
            const m = sections.find(s => s.el === e.target);
            if (m) m.dot.classList.add('active');
        }
    });
}, { threshold: 0.3 });
 
sections.forEach(s => dotObs.observe(s.el));
 
// ===== FORM (Google Sheets) =====
// ⚠️ ВСТАВЬ URL GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = 'ВСТАВЬ_СЮДА_URL';
 
function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById('rsvpForm');
    const btn = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
 
    btn.textContent = 'отправляем...';
    btn.disabled = true;
 
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
    })
    .catch(() => {
        btn.textContent = 'ошибка, попробуйте ещё';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = 'заполнить анкету'; }, 3000);
    });
}
