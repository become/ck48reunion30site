/* ============================================================
   CK48 Reunion — API Client
   Base: https://api.reunion30.tw
   Header: X-Tenant-Slug: ck48
   ============================================================ */

const CK48_API = (() => {
  const BASE = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://api.reunion30.tw';
  const HEADERS = { 'X-Tenant-Slug': 'ck48', 'Content-Type': 'application/json' };

  async function get(path) {
    const res = await fetch(BASE + path, { headers: HEADERS });
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
  }

  // ISO datetime → "YYYY-MM-DD"
  function isoToDate(iso) {
    return iso ? iso.slice(0, 10) : '';
  }

  return {
    async getNews(category) {
      const qs = category && category !== 'all'
        ? `?category=${encodeURIComponent(category)}`
        : '';
      const items = await get(`/api/news${qs}`);
      return items.map(n => ({
        ...n,
        date: isoToDate(n.publishedAt),
        coverEmoji: n.coverEmoji || '📰',
      }));
    },

    async getNewsDetail(slug) {
      const item = await get(`/api/news/${encodeURIComponent(slug)}`);
      return {
        ...item,
        date: isoToDate(item.publishedAt),
        coverEmoji: item.coverEmoji || '📰',
      };
    },

    async getStats() {
      return get('/api/stats');
    },

    async getFaq() {
      const items = await get('/api/faq');
      return items.map(f => ({
        ...f,
        cat: f.category || '一般',
      }));
    },

    async getClasses() {
      return get('/api/classes');
    },

    async checkin(payload) {
      const res = await fetch(BASE + '/api/checkin', {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.error || '送出失敗，請稍後再試');
        err.code = data.code || null;
        err.message = data.error || err.message;
        throw err;
      }
      return data;
    },
  };
})();
