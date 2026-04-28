/* ============================================================
   CK48 Reunion — Intro Animation v2
   俠客揮劍，黑幕墜落，logo 亮相
   ============================================================ */

(function () {
  if (sessionStorage.getItem('ck48_intro_done')) return;

  const CSS = `
    #ck48-intro {
      position: fixed; inset: 0; z-index: 99999;
      background: #000;
      overflow: hidden;
    }
    #ck48-intro.fall {
      transition: transform 1.1s cubic-bezier(0.55, 0, 1, 0.45);
      transform: translateY(110vh);
    }
    #intro-skip {
      position: absolute; bottom: 32px; right: 32px;
      background: none; border: 1px solid rgba(255,255,255,.3);
      color: rgba(255,255,255,.5); font-size: 12px; padding: 6px 14px;
      border-radius: 20px; cursor: pointer; font-family: inherit;
      transition: all .2s; letter-spacing: .05em; z-index: 3;
    }
    #intro-skip:hover { border-color:rgba(255,255,255,.7); color:rgba(255,255,255,.9); }

    /* ── Logo ── */
    #ck48-logo-wrap {
      position: absolute;
      left: 50%; top: 50%;
      transform: translate(-54%, -50%);
      width: min(460px, 80vw);
      z-index: 2;
      pointer-events: none;
    }
    #ck48-logo {
      width: 100%; display: block;
      /* invert: black→white strokes; hue-rotate keeps red building red */
      filter: invert(1) hue-rotate(180deg);
      mix-blend-mode: screen;
      /* start hidden: clip from right side */
      clip-path: inset(0 0 0 100%);
    }
    #ck48-logo.reveal {
      /* sweep reveal right→left to match sword direction */
      transition: clip-path 0.6s cubic-bezier(0.15, 0, 0.35, 1);
      clip-path: inset(0 0 0 0%);
    }

    /* ── SVG overlay ── */
    #ck48-svg {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      overflow: visible;
      z-index: 1;
      pointer-events: none;
    }

    /* ── Sword arm keyframes: wind-up → fast slash → follow-through ── */
    @keyframes ck48ArmSwing {
      0%   { transform: rotate(38deg); }   /* raised, wind-up start */
      16%  { transform: rotate(52deg); }   /* peak wind-up */
      58%  { transform: rotate(-90deg); }  /* SLASH — very fast */
      76%  { transform: rotate(-84deg); }  /* slight rebound */
      100% { transform: rotate(-86deg); }  /* settle */
    }
    /* Body leans forward into the strike */
    @keyframes ck48BodyLean {
      0%   { transform: rotate(-3deg) translateX(0); }
      16%  { transform: rotate(-7deg) translateX(4px); }
      58%  { transform: rotate( 4deg) translateX(-6px); }
      100% { transform: rotate( 2deg) translateX(-4px); }
    }
    /* Trail flashes then fades */
    @keyframes ck48Trail {
      0%   { opacity: 0; }
      6%   { opacity: 1; }
      100% { opacity: 0; }
    }

    #ck48-sword-arm {
      transform-origin: 5px 2px;
    }
    #ck48-sword-arm.swinging {
      animation: ck48ArmSwing 0.75s cubic-bezier(0.25, 0, 0.15, 1) forwards;
    }
    #ck48-body-g.leaning {
      transform-origin: 0px 26px;
      animation: ck48BodyLean 0.75s cubic-bezier(0.25, 0, 0.15, 1) forwards;
    }
    .ck48-trail.active {
      animation: ck48Trail 0.5s ease-out forwards;
    }

    /* Glow pulse */
    @keyframes ck48Glow {
      0%   { opacity: 0; }
      30%  { opacity: 1; }
      100% { opacity: 0; }
    }
    #ck48-glow.flash {
      animation: ck48Glow 0.55s ease-out forwards;
    }
  `;

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ── Overlay ─────────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.id = 'ck48-intro';

  /* ── Logo (actual logo.png, inverted for dark bg) ─────── */
  const logoWrap = document.createElement('div');
  logoWrap.id = 'ck48-logo-wrap';
  const logoImg = document.createElement('img');
  logoImg.id = 'ck48-logo';
  logoImg.src = 'images/logo.png';
  logoImg.alt = '建中48屆30重聚';
  logoImg.draggable = false;
  logoWrap.appendChild(logoImg);
  overlay.appendChild(logoWrap);

  /* ── SVG stage ───────────────────────────────────────── */
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'ck48-svg';
  svg.setAttribute('viewBox', '0 0 400 300');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  /* Glow ellipse behind swordsman */
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  glow.id = 'ck48-glow';
  glow.setAttribute('cx', '320'); glow.setAttribute('cy', '148');
  glow.setAttribute('rx', '55'); glow.setAttribute('ry', '70');
  glow.setAttribute('fill', 'rgba(200,160,80,0.2)');
  glow.style.opacity = '0';
  svg.appendChild(glow);

  /* ── Sword slash trails (3 offset paths = motion blur) ── */
  const trailDefs = [
    { d: 'M 352 72 Q 288 114 224 152 Q 184 173 160 200', sw: '3',   stroke: 'rgba(220,185,90,0.8)' },
    { d: 'M 356 68 Q 292 110 228 148 Q 188 169 164 196', sw: '2',   stroke: 'rgba(220,185,90,0.5)' },
    { d: 'M 348 76 Q 284 118 220 155 Q 180 176 156 204', sw: '1.4', stroke: 'rgba(220,185,90,0.3)' },
  ];
  const trailEls = trailDefs.map(def => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.classList.add('ck48-trail');
    p.setAttribute('d', def.d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', def.stroke);
    p.setAttribute('stroke-width', def.sw);
    p.setAttribute('stroke-linecap', 'round');
    p.style.opacity = '0';
    svg.appendChild(p);
    return p;
  });

  /* ── Swordsman silhouette ─────────────────────────────── */
  const swordsman = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  swordsman.setAttribute('transform', 'translate(320, 144)');

  /* Body group — rotates for lean */
  const bodyG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  bodyG.id = 'ck48-body-g';
  bodyG.innerHTML = `
    <!-- back leg -->
    <line x1="-7" y1="37" x2="-13" y2="58"
          stroke="rgba(255,255,255,.10)" stroke-width="4" stroke-linecap="round"/>
    <!-- front leg — wider stance -->
    <line x1="5" y1="37" x2="12" y2="58"
          stroke="rgba(255,255,255,.13)" stroke-width="4" stroke-linecap="round"/>
    <!-- front foot -->
    <line x1="12" y1="58" x2="21" y2="63"
          stroke="rgba(255,255,255,.10)" stroke-width="3" stroke-linecap="round"/>
    <!-- cloak / torso -->
    <ellipse cx="0" cy="17" rx="13" ry="22"
             fill="#0d0d0d" stroke="rgba(255,255,255,.13)" stroke-width=".6"/>
    <!-- rear arm -->
    <line x1="-9" y1="4" x2="-24" y2="21"
          stroke="rgba(255,255,255,.10)" stroke-width="3.5" stroke-linecap="round"/>
    <!-- head -->
    <circle cx="0" cy="-12" r="9.5"
            fill="#0d0d0d" stroke="rgba(255,255,255,.14)" stroke-width=".6"/>
    <!-- topknot stem -->
    <line x1="0" y1="-21" x2="0" y2="-30"
          stroke="rgba(255,255,255,.18)" stroke-width="2" stroke-linecap="round"/>
    <!-- topknot bun -->
    <ellipse cx="0" cy="-32" rx="2.2" ry="4"
             fill="rgba(255,255,255,.16)"/>
  `;

  /* Sword arm — rotates for swing */
  const armG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  armG.id = 'ck48-sword-arm';
  armG.innerHTML = `
    <!-- upper arm -->
    <line x1="5"  y1="2"   x2="24" y2="-15"
          stroke="rgba(255,255,255,.22)" stroke-width="4.5" stroke-linecap="round"/>
    <!-- forearm -->
    <line x1="24" y1="-15" x2="38" y2="-26"
          stroke="rgba(255,255,255,.20)" stroke-width="3.5" stroke-linecap="round"/>
    <!-- grip / handle -->
    <line x1="38" y1="-26" x2="48" y2="-36"
          stroke="#9a6f10" stroke-width="5.5" stroke-linecap="round"/>
    <!-- tsuba (guard) — perpendicular to blade -->
    <line x1="44" y1="-30" x2="52" y2="-42"
          stroke="#c8a050" stroke-width="4.5" stroke-linecap="round"/>
    <!-- blade (long, thin) -->
    <line x1="48" y1="-36" x2="96" y2="-86"
          stroke="#d8d8e8" stroke-width="2.2" stroke-linecap="round"/>
    <!-- blade edge gleam -->
    <line x1="49" y1="-37" x2="94" y2="-84"
          stroke="rgba(255,255,255,.55)" stroke-width=".7" stroke-linecap="round"/>
  `;

  bodyG.appendChild(armG);
  swordsman.appendChild(bodyG);
  svg.appendChild(swordsman);
  overlay.appendChild(svg);

  /* ── Skip button ─────────────────────────────────────── */
  const skipBtn = document.createElement('button');
  skipBtn.id = 'intro-skip';
  skipBtn.textContent = '跳過';
  overlay.appendChild(skipBtn);

  document.body.prepend(overlay);
  document.body.style.overflow = 'hidden';

  /* ── Finish ───────────────────────────────────────────── */
  function finish() {
    sessionStorage.setItem('ck48_intro_done', '1');
    glow.classList.add('flash');
    setTimeout(() => {
      overlay.classList.add('fall');
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 1200);
    }, 650);
  }

  function skip() {
    sessionStorage.setItem('ck48_intro_done', '1');
    overlay.style.transition = 'opacity .3s';
    overlay.style.opacity = '0';
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 350);
  }

  skipBtn.addEventListener('click', skip);

  /* ── Start sequence ───────────────────────────────────── */
  function startAnim() {
    // 1. Sword swing keyframes (wind-up → fast slash → settle)
    bodyG.classList.add('leaning');
    armG.classList.add('swinging');

    // 2. Trail flash at peak of slash (~360ms into swing)
    setTimeout(() => {
      trailEls.forEach(t => t.classList.add('active'));
    }, 355);

    // 3. Reveal logo right→left as sword cuts through (~380ms)
    setTimeout(() => {
      logoImg.classList.add('reveal');
    }, 375);

    // 4. Glow burst + curtain fall
    setTimeout(finish, 1500);
  }

  // Wait for logo image before animating (usually already cached)
  setTimeout(() => {
    if (logoImg.complete) {
      startAnim();
    } else {
      logoImg.addEventListener('load', startAnim, { once: true });
      logoImg.addEventListener('error', startAnim, { once: true });
    }
  }, 450);

})();
