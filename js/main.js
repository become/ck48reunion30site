/* ============================================================
   CK48 Reunion — Main JS
   建中第48屆畢業30年重聚官方網站
   ============================================================ */

/* ── Header scroll & mobile menu ───────────────────────────── */
function initHeader() {
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.header-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!header) return;

  // Scroll shadow
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  // Mobile menu toggle
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close when link clicked
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav item
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header-nav__item, .mobile-menu__item').forEach(el => {
    const href = el.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      el.classList.add('active');
    }
  });
}

/* ── Countdown Timer ────────────────────────────────────────── */
function initCountdown(targetDateStr, elementId) {
  const el = document.getElementById(elementId || 'countdown');
  if (!el) return;
  const target = new Date(targetDateStr).getTime();

  function update() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      ['days','hours','mins','secs'].forEach(u => {
        const node = el.querySelector('[data-unit="' + u + '"]');
        if (node) node.textContent = '00';
      });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');
    const dEl = el.querySelector('[data-unit="days"]');
    const hEl = el.querySelector('[data-unit="hours"]');
    const mEl = el.querySelector('[data-unit="mins"]');
    const sEl = el.querySelector('[data-unit="secs"]');
    if (dEl) dEl.textContent = pad(d);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }
  update();
  setInterval(update, 1000);
}

/* ── FAQ Accordion ──────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Tabs ───────────────────────────────────────────────────── */
function initTabs(containerSelector) {
  const containers = document.querySelectorAll(containerSelector || '[data-tabs]');
  containers.forEach(container => {
    const btns   = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        panels[i] && panels[i].classList.add('active');
      });
    });
  });
}

/* ── Lightbox ───────────────────────────────────────────────── */
function initLightbox() {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;
  const img     = overlay.querySelector('.lightbox-inner img');
  const caption = overlay.querySelector('.lightbox-caption');
  const close   = overlay.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.lightbox;
      const alt = card.dataset.caption || '';
      if (img) { img.src = src; img.alt = alt; }
      if (caption) caption.textContent = alt;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  if (close) close.addEventListener('click', closeLb);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  function closeLb() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── Quantity control ───────────────────────────────────────── */
function initQtyControl() {
  document.querySelectorAll('.qty-control').forEach(ctrl => {
    const minus  = ctrl.querySelector('[data-qty="minus"]');
    const plus   = ctrl.querySelector('[data-qty="plus"]');
    const numEl  = ctrl.querySelector('.qty-num');
    if (!numEl) return;
    let qty = parseInt(numEl.value || 1);
    const update = () => {
      numEl.value = qty;
      if (minus) minus.disabled = qty <= 1;
    };
    minus && minus.addEventListener('click', () => { if (qty > 1) { qty--; update(); } });
    plus  && plus.addEventListener('click',  () => { qty++; update(); });
    update();
  });
}

/* ── Smooth scroll for anchor links ────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Scroll reveal (simple) ─────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Init all ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFAQ();
  initTabs();
  initLightbox();
  initQtyControl();
  initSmoothScroll();
  initReveal();
});

/* ── Reveal CSS injection ───────────────────────────────────── */
(function addRevealStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .55s ease, transform .55s ease; }
    .reveal.revealed { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: .1s; }
    .reveal-delay-2 { transition-delay: .2s; }
    .reveal-delay-3 { transition-delay: .3s; }
    .reveal-delay-4 { transition-delay: .4s; }
  `;
  document.head.appendChild(style);
})();
