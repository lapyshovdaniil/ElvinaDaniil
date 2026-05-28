// ===== COUNTDOWN =====
const weddingDate = new Date('2025-07-16T13:00:00');

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

// ===== FLOATING DECORATIONS =====
(function createFloatingEls() {
    const container = document.getElementById('floatingEls');
    if (!container) return;
    const items = ['♥', '♡', '✿', '❀', '🌿', '✦'];

    for (let i = 0; i < 18; i++) {
        const span = document.createElement('span');
        span.textContent = items[Math.floor(Math.random() * items.length)];
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = (12 + Math.random() * 16) + 's';
        span.style.animationDelay = (Math.random() * 14) + 's';
        span.style.fontSize = (0.7 + Math.random() * 0.9) + 'rem';
        container.appendChild(span);
    }
})();

// ===== BG MOSAIC =====
(function initMosaic() {
    const container = document.getElementById('bgMosaic');
    if (!container) return;

    const srcs = [
        'photos-combined.png','photo.jpg','slide2.jpg',
        'slide4.jpg','slide5.jpg'
    ];

    // Без повторов: сосед слева, сосед сверху, и сосед по диагонали
    function buildGrid(rows, cols) {
        const grid = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const used = new Set();
                // сосед слева
                if (c > 0) used.add(grid[(r * cols) + c - 1]);
                // сосед сверху
                if (r > 0) used.add(grid[((r - 1) * cols) + c]);
                // диагонали сверху
                if (r > 0 && c > 0) used.add(grid[((r - 1) * cols) + c - 1]);
                if (r > 0 && c < cols - 1) used.add(grid[((r - 1) * cols) + c + 1]);

                const avail = [];
                for (let j = 0; j < srcs.length; j++) {
                    if (!used.has(j)) avail.push(j);
                }
                grid.push(avail[Math.floor(Math.random() * avail.length)]);
            }
        }
        return grid;
    }

    const pageH = Math.max(document.body.scrollHeight, 8000);

    const vw = window.innerWidth;
    const cols = 2;
    const sizes = [
        [140, 140], [160, 160], [150, 180], [170, 150], [140, 170]
    ];
    const rowH = 180;
    const rows = Math.ceil(pageH / rowH);
    const total = rows * cols;
    const sequence = buildGrid(rows, cols);

    for (let i = 0; i < total; i++) {
        const img = document.createElement('img');
        img.src = srcs[sequence[i]];
        img.alt = '';
        img.loading = 'lazy';

        const col = i % cols;
        const row = Math.floor(i / cols);

        const [w, h] = sizes[i % sizes.length];
        const rot = (Math.random() - 0.5) * 14;
        // Распределяем по всей ширине экрана
        const zoneW = vw / cols;
        const maxX = vw - w; // не вылезать за правый край
        const x = Math.min(col * zoneW + (Math.random() * (zoneW - w * 0.5)), maxX);
        const y = row * rowH + (Math.random() * 30 - 15);

        img.style.cssText =
            '--w:' + w + 'px;--h:' + h + 'px;' +
            'left:' + x + 'px;top:' + y + 'px;' +
            'transform:rotate(' + rot + 'deg);';

        container.appendChild(img);
    }

    // Высота мозаики = высота контента (пересчёт после загрузки)
    container.style.height = pageH + 'px';
    window.addEventListener('load', () => {
        container.style.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) + 'px';
    });
})();

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
        setTimeout(() => { btn.textContent = 'отправить'; }, 3000);
    });
}
