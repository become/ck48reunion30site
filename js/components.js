/* ============================================================
   CK48 Reunion — Shared Components (Header / Footer inject)
   ============================================================ */

const HEADER_HTML = `
<header class="site-header" id="site-header">
  <div class="header-inner">
    <a href="index.html" class="header-logo">
      <img src="images/logo.png" alt="建中第48屆 30年重聚" class="header-logo__img">
    </a>
    <nav class="header-nav" aria-label="主選單">
      <a href="index.html"          class="header-nav__item">首頁</a>
      <a href="about.html"          class="header-nav__item">關於重聚</a>
      <a href="news.html"           class="header-nav__item">最新消息</a>
      <a href="event.html"          class="header-nav__item">活動資訊</a>
      <a href="memory-photos.html"  class="header-nav__item">回憶照片</a>
      <a href="faq.html"            class="header-nav__item">FAQ</a>
    </nav>
    <div class="header-actions">
      <div class="header-share" id="header-share">
        <button class="header-share__btn" id="share-btn" aria-label="分享此頁面" aria-expanded="false">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <path stroke-linecap="round" d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>
          </svg>
          分享
        </button>
        <div class="header-share__panel" id="share-panel" role="menu">
          <a id="share-line" href="#" target="_blank" rel="noopener" class="share-option share-option--line" role="menuitem">
            <span class="share-option__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
            </span>
            分享到 LINE
          </a>
          <a id="share-fb" href="#" target="_blank" rel="noopener" class="share-option share-option--fb" role="menuitem">
            <span class="share-option__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </span>
            分享到 Facebook
          </a>
          <button id="share-copy" class="share-option share-option--copy" role="menuitem">
            <span class="share-option__icon">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </span>
            複製連結
          </button>
        </div>
      </div>
      <button class="header-menu-btn" aria-label="開啟選單" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
<nav class="mobile-menu" aria-label="行動版選單">
  <div class="mobile-menu__nav">
    <a href="index.html"           class="mobile-menu__item">首頁</a>
    <a href="about.html"           class="mobile-menu__item">關於重聚</a>
    <a href="news.html"            class="mobile-menu__item">最新消息</a>
    <a href="event.html"           class="mobile-menu__item">活動資訊</a>
    <a href="memory-photos.html"   class="mobile-menu__item">回憶照片</a>
    <a href="faq.html"             class="mobile-menu__item">FAQ</a>
  </div>
</nav>`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-brand__logo">
          <img src="images/favico.ico" alt="CK48" style="width:40px;height:40px;object-fit:contain;">
          <div>
            <div class="footer-brand__name">建中第48屆</div>
            <div class="footer-brand__sub">30年重聚 · CK48 Reunion</div>
          </div>
        </div>
        <p class="footer-brand__desc">三十再聚，少年依舊。<br>2026年12月19–20日，期待與您相見。</p>
        <div class="footer-social">
          <a href="https://www.facebook.com/profile.php?id=61576521592339" target="_blank" rel="noopener" class="footer-social__link" title="三十重聚粉絲專頁" aria-label="Facebook 粉絲專頁">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="https://discord.gg/7w8Qy3JsVm" target="_blank" rel="noopener" class="footer-social__link" title="校友互動平台 Discord" aria-label="Discord">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-col__title">快速連結</div>
        <nav class="footer-nav">
          <a href="about.html"           class="footer-nav__item">關於重聚</a>
          <a href="event.html"           class="footer-nav__item">活動資訊</a>
          <a href="find-classmates.html" class="footer-nav__item">校友報到</a>
          <a href="faq.html"             class="footer-nav__item">常見問題</a>
        </nav>
      </div>
      <div class="footer-col">
        <div class="footer-col__title">活動資訊</div>
        <div class="footer-info">
          <div>📅 重聚餐會：2026/12/19</div>
          <div>🏫 返校園遊會：2026/12/20</div>
          <div>📍 地點：台北市（詳見活動資訊）</div>
          <div style="margin-top:8px">
            <a href="https://www.facebook.com/profile.php?id=61576521592339" target="_blank" rel="noopener" style="color:rgba(255,255,255,.85);text-decoration:underline;">三十重聚粉絲專頁 →</a>
          </div>
          <div>
            <a href="https://discord.gg/7w8Qy3JsVm" target="_blank" rel="noopener" style="color:rgba(255,255,255,.85);text-decoration:underline;">校友互動平台 Discord →</a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© 2026 建中第48屆30年重聚籌備委員會 · All rights reserved.</div>
      <div class="footer-hashtag">#CK48Reunion30 #建中48屆三十重聚</div>
      <div id="site-version" style="font-size:11px;opacity:.45;margin-top:4px;"></div>
    </div>
  </div>
</footer>`;

const LIGHTBOX_HTML = `
<div class="lightbox-overlay" id="lightbox" role="dialog" aria-modal="true" aria-label="圖片檢視">
  <div class="lightbox-inner">
    <button class="lightbox-prev" aria-label="上一張">&#8249;</button>
    <button class="lightbox-close" aria-label="關閉">✕</button>
    <button class="lightbox-next" aria-label="下一張">&#8250;</button>
    <img class="lightbox-img" src="" alt="" />
    <div class="lightbox-caption">
      <div class="lightbox-caption__title"></div>
      <div class="lightbox-caption__desc"></div>
      <a class="lightbox-share" href="#" target="_blank" rel="noopener">分享這張照片 →</a>
    </div>
  </div>
</div>`;

// Auto-inject on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Inject header at body start
  const headerWrap = document.getElementById('header-placeholder');
  if (headerWrap) headerWrap.innerHTML = HEADER_HTML;

  // Inject footer
  const footerWrap = document.getElementById('footer-placeholder');
  if (footerWrap) footerWrap.innerHTML = FOOTER_HTML;

  // Inject lightbox
  document.body.insertAdjacentHTML('beforeend', LIGHTBOX_HTML);

  // Inject share toast
  document.body.insertAdjacentHTML('beforeend', '<div class="share-copy-toast" id="share-toast">連結已複製！</div>');

  // Load version (generated at deploy time, absent in local dev)
  fetch('js/version.json')
    .then(r => r.ok ? r.json() : null)
    .then(d => {
      const el = document.getElementById('site-version');
      if (el && d?.version) el.textContent = d.version;
    })
    .catch(() => {});
});
