const CLIENT_ID = process.env.REACT_APP_INSTAGRAM_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_INSTAGRAM_REDIRECT_URI;
// NOTE: REACT_APP_INSTAGRAM_CLIENT_SECRET must NOT be used on the client for security.
// The code exchange should happen on a backend. We provide a placeholder endpoint below.

const OAUTH_AUTH_URL = 'https://api.instagram.com/oauth/authorize';

// PUBLIC_INTERFACE
export function loginWithInstagram() {
  /** Redirects user to Instagram OAuth authorization screen. */
  if (!CLIENT_ID || !REDIRECT_URI) {
    alert('Instagram OAuth is not configured. Please set REACT_APP_INSTAGRAM_CLIENT_ID and REACT_APP_INSTAGRAM_REDIRECT_URI in .env.');
    return;
  }
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'user_profile,user_media',
    response_type: 'code',
    state: 'creatorhub_instagram',
  }).toString();
  window.location.href = `${OAUTH_AUTH_URL}?${params}&provider=instagram`;
}

// PUBLIC_INTERFACE
export async function exchangeCodeForToken(code) {
  /**
   * Exchanges the Instagram authorization code for an access token.
   * For security, this should call your backend. Here we attempt a placeholder:
   * - Tries to call /api/auth/instagram/exchange (stub)
   * - If not available, returns a mocked token for demo use.
   */
  const endpoint = '/api/auth/instagram/exchange';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
    });
    if (!res.ok) throw new Error('Backend not available');
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn('Falling back to demo token due to backend unavailability.', e);
    // Demo fallback
    await new Promise(r => setTimeout(r, 400));
    return {
      access_token: 'demo_instagram_access_token',
      user: { username: 'demo.creator', profile_picture: '' },
      expires_in: 3600,
      provider: 'instagram',
      demo: true,
    };
  }
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clears auth state on client; server session revocation would occur on backend. */
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_user');
}
