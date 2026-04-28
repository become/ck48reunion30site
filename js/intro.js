/* ============================================================
   CK48 Reunion — Intro Animation
   俠客劃出48，黑幕墜落，網站登場
   ============================================================ */

(function () {
  // Only play once per session
  if (sessionStorage.getItem('ck48_intro_done')) return;

  const CSS = `
    #ck48-intro {
      position: fixed; inset: 0; z-index: 99999;
      background: #000;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    #ck48-intro.fall {
      transition: transform 0.9s cubic-bezier(0.55, 0, 1, 0.45);
      transform: translateY(110vh);
    }
    #intro-skip {
      position: absolute; bottom: 32px; right: 32px;
      background: none; border: 1px solid rgba(255,255,255,.3);
      color: rgba(255,255,255,.5); font-size: 12px; padding: 6px 14px;
      border-radius: 20px; cursor: pointer; font-family: inherit;
      transition: all .2s; letter-spacing: .05em;
    }
    #intro-skip:hover { border-color: rgba(255,255,255,.7); color: rgba(255,255,255,.9); }
    #intro-canvas { position: absolute; inset: 0; }
    #intro-svg {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      overflow: visible;
    }
    .sword-trail {
      fill: none; stroke: #fff;
      stroke-linecap: round; stroke-linejoin: round;
      opacity: 0;
    }
    .num-path {
      fill: none;
      stroke: #c8a050;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 6;
    }
  `;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // Build overlay
  const overlay = document.createElement('div');
  overlay.id = 'ck48-intro';

  // SVG stage
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'intro-svg';
  svg.setAttribute('viewBox', '0 0 400 300');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // ── 俠客剪影 ──────────────────────────────────────────────
  // Simple silhouette: head + body + arms + sword
  const swordsman = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  swordsman.id = 'swordsman';
  swordsman.setAttribute('transform', 'translate(310, 150)');
  swordsman.innerHTML = `
    <!-- cloak/body -->
    <ellipse cx="0" cy="18" rx="14" ry="22" fill="#1a1a1a" stroke="rgba(255,255,255,.15)" stroke-width=".5"/>
    <!-- head -->
    <circle cx="0" cy="-10" r="9" fill="#1a1a1a" stroke="rgba(255,255,255,.2)" stroke-width=".5"/>
    <!-- top knot -->
    <ellipse cx="0" cy="-20" rx="3" ry="6" fill="rgba(255,255,255,.2)"/>
    <!-- rear arm (static) -->
    <line x1="-8" y1="4" x2="-22" y2="18" stroke="rgba(255,255,255,.15)" stroke-width="3" stroke-linecap="round"/>
    <!-- sword arm (will animate) -->
    <g id="sword-arm">
      <line id="arm-line" x1="6" y1="2" x2="28" y2="-16"
            stroke="rgba(255,255,255,.25)" stroke-width="3.5" stroke-linecap="round"/>
      <!-- sword blade -->
      <g id="blade">
        <line x1="28" y1="-16" x2="80" y2="-68"
              stroke="#e8e8e8" stroke-width="1.5" stroke-linecap="round"/>
        <!-- guard -->
        <line x1="26" y1="-14" x2="34" y2="-20"
              stroke="#c8a050" stroke-width="3" stroke-linecap="round"/>
      </g>
    </g>
    <!-- legs -->
    <line x1="-5" y1="38" x2="-8" y2="58" stroke="rgba(255,255,255,.15)" stroke-width="3" stroke-linecap="round"/>
    <line x1="5" y1="38" x2="8" y2="58" stroke="rgba(255,255,255,.15)" stroke-width="3" stroke-linecap="round"/>
  `;
  svg.appendChild(swordsman);

  // ── 劍跡（揮劍弧線）────────────────────────────────────────
  const trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  trail.classList.add('sword-trail');
  trail.setAttribute('d', 'M 340 82 Q 280 120 220 155 Q 180 175 155 200');
  trail.setAttribute('stroke-width', '2');
  trail.setAttribute('stroke', 'rgba(200,160,80,.6)');
  svg.appendChild(trail);

  // ── 「48」路徑 ─────────────────────────────────────────────
  // Hand-crafted paths centered at ~(200,150), size ~120×100
  // "4": two strokes — diagonal down-left, horizontal, then vertical
  const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path4.classList.add('num-path');
  path4.setAttribute('stroke-width', '7');
  // 4: top-left angled stroke + crossbar + right vertical
  path4.setAttribute('d', 'M 118 100 L 118 175 M 118 140 L 158 140 M 148 100 L 148 175');
  svg.appendChild(path4);

  // "8": two rounded rectangles stacked
  const path8 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path8.classList.add('num-path');
  path8.setAttribute('stroke-width', '7');
  // 8: top oval then bottom oval
  path8.setAttribute('d', 'M 200 140 C 200 120 228 120 228 140 C 228 155 200 155 200 155 C 200 155 172 155 172 140 C 172 120 200 120 200 140 Z M 200 155 C 200 155 232 158 232 172 C 232 188 200 190 200 190 C 200 190 168 188 168 172 C 168 158 200 155 200 155 Z');
  svg.appendChild(path8);

  // ── 光芒（完成後閃現）──────────────────────────────────────
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  glow.setAttribute('cx', '182'); glow.setAttribute('cy', '150');
  glow.setAttribute('rx', '120'); glow.setAttribute('ry', '60');
  glow.setAttribute('fill', 'rgba(200,160,80,0)');
  glow.id = 'intro-glow';
  svg.insertBefore(glow, swordsman);

  overlay.appendChild(svg);

  // Skip button
  const skipBtn = document.createElement('button');
  skipBtn.id = 'intro-skip';
  skipBtn.textContent = '跳過';
  overlay.appendChild(skipBtn);

  document.body.prepend(overlay);
  document.body.style.overflow = 'hidden';

  // ── 動畫序列 ──────────────────────────────────────────────
  function setDash(el, total) {
    el.style.strokeDasharray = total;
    el.style.strokeDashoffset = total;
  }

  function animateDash(el, duration, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        el.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
        el.style.strokeDashoffset = '0';
        setTimeout(resolve, duration);
      }, delay);
    });
  }

  function finish() {
    sessionStorage.setItem('ck48_intro_done', '1');
    // Glow flash
    glow.setAttribute('fill', 'rgba(200,160,80,0.12)');
    setTimeout(() => {
      glow.setAttribute('fill', 'rgba(200,160,80,0)');
    }, 300);

    // Fall after brief pause
    setTimeout(() => {
      overlay.classList.add('fall');
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 1000);
    }, 600);
  }

  function skip() {
    sessionStorage.setItem('ck48_intro_done', '1');
    overlay.style.transition = 'opacity .3s';
    overlay.style.opacity = '0';
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 350);
  }

  skipBtn.addEventListener('click', skip);

  // Start sequence
  setTimeout(() => {
    // 1. 俠客揮劍：blade rotates via CSS animation
    const arm = document.getElementById('sword-arm');
    arm.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
    arm.style.transformOrigin = '6px 2px';
    arm.style.transform = 'rotate(-45deg)';

    // 2. Trail flash
    setTimeout(() => {
      trail.style.opacity = '1';
      trail.style.transition = 'opacity .15s';
      setTimeout(() => {
        trail.style.transition = 'opacity .5s';
        trail.style.opacity = '0';
      }, 150);
    }, 300);

    // 3. Draw "4"
    const len4 = path4.getTotalLength();
    setDash(path4, len4);
    animateDash(path4, 600, 500).then(() => {
      // 4. Draw "8"
      const len8 = path8.getTotalLength();
      setDash(path8, len8);
      return animateDash(path8, 700, 100);
    }).then(() => {
      finish();
    });

  }, 400);

})();
