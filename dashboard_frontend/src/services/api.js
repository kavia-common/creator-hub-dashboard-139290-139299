const BASE = process.env.REACT_APP_API_BASE || '';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch (e) {
    // Propagate error so callers can decide how to fallback
    throw e;
  }
}

// PUBLIC_INTERFACE
export const Api = {
  /** Fetches dashboard analytics. Placeholder returns mock data. */
  async getAnalytics() {
    try {
      return await request('/api/analytics', { method: 'GET' });
    } catch {
      return {
        summary: {
          engagement: 12450,
          reach: 89200,
          growth: 3.8,
          posts: 214
        },
        timeseries: Array.from({ length: 12 }).map((_, i) => ({
          month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
          engagement: Math.round(500 + Math.random() * 2500),
          reach: Math.round(3000 + Math.random() * 9000)
        })),
        topPosts: [
          { id: 'p1', title: 'Summer vibes 🌊', engagement: 1540, reach: 9800, status: 'Published' },
          { id: 'p2', title: 'Behind the scenes 🎬', engagement: 1210, reach: 7200, status: 'Published' },
          { id: 'p3', title: 'New drop soon', engagement: 980, reach: 6400, status: 'Scheduled' }
        ]
      };
    }
  },

  /** Returns connected social accounts. */
  async getAccounts() {
    try {
      return await request('/api/accounts', { method: 'GET' });
    } catch {
      return [
        { id: 'ig-1', provider: 'instagram', handle: '@demo.creator', status: 'Connected' }
      ];
    }
  },

  /** Publishes a new post (placeholder). */
  async publishPost({ caption, mediaUrl, platforms }) {
    try {
      return await request('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, mediaUrl, platforms })
      });
    } catch {
      return { id: String(Date.now()), status: 'Published', caption, mediaUrl, platforms };
    }
  },

  /** Links an account (placeholder). */
  async linkAccount({ provider }) {
    try {
      return await request('/api/accounts/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
    } catch {
      return { id: `${provider}-${Date.now()}`, provider, status: 'Pending' };
    }
  },

  /** Lists posts (placeholder). */
  async listPosts() {
    try {
      return await request('/api/posts', { method: 'GET' });
    } catch {
      return [
        { id: 'p100', caption: 'Launch day!', status: 'Published', date: '2025-09-01', platform: 'instagram' },
        { id: 'p101', caption: 'Teaser', status: 'Scheduled', date: '2025-09-12', platform: 'instagram' }
      ];
    }
  },

  /** Audience data placeholder. */
  async getAudience() {
    try {
      return await request('/api/audience', { method: 'GET' });
    } catch {
      return {
        demographics: [
          { segment: '18-24', percent: 32 },
          { segment: '25-34', percent: 41 },
          { segment: '35-44', percent: 17 },
          { segment: '45+', percent: 10 }
        ],
        locations: [
          { region: 'US', percent: 46 },
          { region: 'UK', percent: 18 },
          { region: 'CA', percent: 12 },
          { region: 'DE', percent: 8 }
        ],
        recentFollowers: [
          { id: 'u1', name: 'Lena', handle: '@lenart' },
          { id: 'u2', name: 'Marco', handle: '@marco.design' },
          { id: 'u3', name: 'Aisha', handle: '@ai.creative' }
        ]
      };
    }
  }
};
