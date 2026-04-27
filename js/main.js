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

  // Share button
  const shareBtn   = document.getElementById('share-btn');
  const sharePanel = document.getElementById('share-panel');
  if (shareBtn && sharePanel) {
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = sharePanel.classList.toggle('open');
      shareBtn.setAttribute('aria-expanded', String(open));
      if (open) {
        const url = encodeURIComponent(location.href);
        document.getElementById('share-line').href = `https://social-plugins.line.me/lineit/share?url=${url}`;
        document.getElementById('share-fb').href   = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      }
    });
    document.getElementById('share-copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); } catch { /* ignore */ }
      sharePanel.classList.remove('open');
      shareBtn.setAttribute('aria-expanded', 'false');
      const toast = document.getElementById('share-toast');
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }
    });
    document.addEventListener('click', (e) => {
      if (!document.getElementById('header-share').contains(e.target)) {
        sharePanel.classList.remove('open');
        shareBtn.setAttribute('aria-expanded', 'false');
      }
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
let _lightboxPhotos = [];
let _lightboxIndex  = 0;

function initLightbox() {
  const overlay  = document.getElementById('lightbox');
  if (!overlay) return;
  const imgEl    = overlay.querySelector('.lightbox-img');
  const titleEl  = overlay.querySelector('.lightbox-caption__title');
  const descEl   = overlay.querySelector('.lightbox-caption__desc');
  const shareEl  = overlay.querySelector('.lightbox-share');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn  = overlay.querySelector('.lightbox-prev');
  const nextBtn  = overlay.querySelector('.lightbox-next');

  function openAt(index) {
    const total = _lightboxPhotos.length;
    if (!total) return;
    _lightboxIndex = ((index % total) + total) % total;
    const p = _lightboxPhotos[_lightboxIndex];
    if (imgEl) { imgEl.src = p.largeUrl || p.src || ''; imgEl.alt = p.title || ''; }
    if (titleEl) titleEl.textContent = p.title || '';
    if (descEl)  descEl.textContent  = p.story  || p.desc || '';
    if (shareEl) {
      const shareUrl = p.id
        ? `${location.origin}/memory-photos.html?photo=${p.id}`
        : location.href;
      shareEl.href = shareUrl;
      shareEl.style.display = p.id ? '' : 'none';
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (imgEl) imgEl.src = '';
  }

  // Bind card clicks — support both old [data-lightbox] and new [data-photo-index]
  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      const idx = card.dataset.photoIndex;
      if (idx !== undefined) {
        openAt(parseInt(idx));
      } else {
        // Legacy: single-image mode
        _lightboxPhotos = [{ src: card.dataset.lightbox, title: card.dataset.caption || '', story: '' }];
        openAt(0);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLb);
  if (prevBtn)  prevBtn.addEventListener('click',  () => openAt(_lightboxIndex - 1));
  if (nextBtn)  nextBtn.addEventListener('click',  () => openAt(_lightboxIndex + 1));
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  openAt(_lightboxIndex - 1);
    if (e.key === 'ArrowRight') openAt(_lightboxIndex + 1);
  });
}

// Called by pages that load real photo data
function setLightboxPhotos(photos) {
  _lightboxPhotos = photos;
}

// Open lightbox for a specific photo ID (from ?photo= query param)
function openLightboxById(id) {
  const idx = _lightboxPhotos.findIndex(p => String(p.id) === String(id));
  if (idx >= 0) {
    // Wait for lightbox to be initialized
    setTimeout(() => {
      const overlay = document.getElementById('lightbox');
      if (overlay) {
        const ev = new CustomEvent('open-lightbox', { detail: { index: idx } });
        overlay.dispatchEvent(ev);
      }
    }, 100);
  }
}

function initLightboxDeepLink() {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;
  overlay.addEventListener('open-lightbox', e => {
    const idx = e.detail?.index ?? 0;
    // Re-trigger openAt via prev/next click simulation — easier: dispatch directly
    // Just set index and open
    const imgEl   = overlay.querySelector('.lightbox-img');
    const titleEl = overlay.querySelector('.lightbox-caption__title');
    const descEl  = overlay.querySelector('.lightbox-caption__desc');
    const shareEl = overlay.querySelector('.lightbox-share');
    const total   = _lightboxPhotos.length;
    _lightboxIndex = ((idx % total) + total) % total;
    const p = _lightboxPhotos[_lightboxIndex];
    if (imgEl)   { imgEl.src = p.largeUrl || p.src || ''; imgEl.alt = p.title || ''; }
    if (titleEl) titleEl.textContent = p.title || '';
    if (descEl)  descEl.textContent  = p.story  || p.desc || '';
    if (shareEl) {
      shareEl.href = p.id ? `${location.origin}/memory-photos.html?photo=${p.id}` : location.href;
      shareEl.style.display = p.id ? '' : 'none';
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
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
