import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { loginWithInstagram, exchangeCodeForToken, logout } from './auth/instagram';
import { Api } from './services/api';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Audience from './pages/Audience';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublishModal from './components/PublishModal';
import LinkAccountModal from './components/LinkAccountModal';
import AuthGuard from './auth/AuthGuard';

// App Shell

function AppShell() {
  const { token, setToken, setUser } = useAuth();
  const [showPublish, setShowPublish] = useState(false);
  const [showLinkAccount, setShowLinkAccount] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OAuth callback (if redirected here)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const provider = params.get('provider');

    async function handleOAuth() {
      if (code && provider === 'instagram') {
        try {
          const res = await exchangeCodeForToken(code);
          setToken(res.access_token);
          setUser({
            name: res.user?.username || 'Instagram Creator',
            avatar: res.user?.profile_picture || '',
            provider: 'instagram',
          });
          // Determine redirect target if provided
          const redirect = params.get('redirect') || '/';
          navigate(redirect, { replace: true });
        } catch (e) {
          console.error('OAuth exchange failed', e);
          navigate('/login', { replace: true });
        }
      }
    }
    handleOAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const navItems = useMemo(() => ([
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/posts', label: 'Posts', icon: '📝' },
    { to: '/audience', label: 'Audience', icon: '👥' },
    { to: '/accounts', label: 'Accounts', icon: '🔗' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ]), []);

  const onLogout = () => {
    logout();
    setToken(null);
    setUser(null);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">CH</div>
          Creator Hub
        </div>
        <nav className="nav">
          {navItems.map(n => (
            <NavLink key={n.to} to={n.to} end className={({ isActive }) => isActive ? 'active' : undefined}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'grid', gap: 8 }}>
          {!token ? (
            <NavLink to="/login" className="btn btn-primary" style={{ textAlign: 'center' }}>
              <span>🔐</span> Sign in
            </NavLink>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => setShowLinkAccount(true)}>
                <span>➕</span> Link Account
              </button>
              <button className="btn btn-outline" onClick={onLogout}>
                <span>↪</span> Logout
              </button>
            </>
          )}
          <div className="separator" />
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            OAuth via Instagram. Ensure env vars are set in .env:
            <div>REACT_APP_INSTAGRAM_CLIENT_ID</div>
            <div>REACT_APP_INSTAGRAM_REDIRECT_URI</div>
          </div>
        </div>
      </aside>

      <header className="topbar">
        <div className="search">
          <span>🔎</span>
          <input className="input" placeholder="Search posts, analytics..." style={{ background: 'transparent', border: 'none', padding: 0 }} />
        </div>
        <div className="actions">
          <button className="btn icon-btn" title="Notifications">🔔</button>
          <button className="btn btn-amber" onClick={() => setShowPublish(true)}><span>⚡</span> Quick Publish</button>
          <UserBadge />
        </div>
      </header>

      <main className="content">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private (guarded) routes */}
          <Route
            path="/"
            element={(
              <AuthGuard>
                <Dashboard onQuickPublish={() => setShowPublish(true)} />
              </AuthGuard>
            )}
          />
          <Route
            path="/posts"
            element={(
              <AuthGuard>
                <Posts />
              </AuthGuard>
            )}
          />
          <Route
            path="/audience"
            element={(
              <AuthGuard>
                <Audience />
              </AuthGuard>
            )}
          />
          <Route
            path="/accounts"
            element={(
              <AuthGuard>
                <Accounts onLinkAccount={() => setShowLinkAccount(true)} />
              </AuthGuard>
            )}
          />
          <Route
            path="/settings"
            element={(
              <AuthGuard>
                <Settings />
              </AuthGuard>
            )}
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showPublish && <PublishModal onClose={() => setShowPublish(false)} />}
      {showLinkAccount && <LinkAccountModal onClose={() => setShowLinkAccount(false)} />}
    </div>
  );
}

function UserBadge() {
  const { user } = useAuth();
  const initials = user?.name ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'CG';
  return (
    <div className="row" style={{ gap: 10 }}>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Signed in</div>
        <div style={{ fontWeight: 700 }}>{user?.name || 'Guest'}</div>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: '#eaf1ff',
        color: '#2563EB', display: 'grid', placeItems: 'center', fontWeight: 800, border: '1px solid #cfe0ff'
      }}>
        {initials}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application component that wires routing, auth context, and layout.
   * Implements Instagram OAuth, sidebar layout, top action bar, and modals.
   */
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
