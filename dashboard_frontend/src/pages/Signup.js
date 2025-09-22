import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LocalStore } from '../services/localStore';

/**
 * PUBLIC_INTERFACE
 * Signup page for creating an account using local JSON persistence.
 * Redirects to target route after successful auth.
 */
export default function Signup() {
  const { token, setToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine redirect target
  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('redirect') || '/';
  }, [location.search]);

  useEffect(() => {
    if (token) {
      navigate(redirectTarget, { replace: true });
    }
  }, [token, navigate, redirectTarget]);

  async function handleEmailSignup(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      if (!email || !password || !confirm) throw new Error('Please fill out all fields.');
      if (!/.+@.+\..+/.test(email)) throw new Error('Please enter a valid email.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');
      if (password !== confirm) throw new Error('Passwords do not match.');

      // Persist user to LocalStore (throws if email exists)
      const created = LocalStore.addUser({ email, password, name: email.split('@')[0] });

      // Create session
      const mockToken = `token_${created.id}_${Date.now()}`;
      LocalStore.saveSession({ token: mockToken, userId: created.id });

      // Update auth context
      setToken(mockToken);
      setUser({ name: created.name, email: created.email, provider: 'local' });
      navigate(redirectTarget, { replace: true });
    } catch (e) {
      setErr(e.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.brandBadge}>CH</div>
          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>Creator Hub</div>
        </div>
        <h2 style={styles.header}>Create your account</h2>
        <p style={styles.subheader}>Get started with the Creator Hub dashboard.</p>

        {err ? <div style={styles.error}>{err}</div> : null}

        <form onSubmit={handleEmailSignup} style={{ display: 'grid', gap: 10 }}>
          <label>
            <div style={styles.label}>Email</div>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            <div style={styles.label}>Password</div>
            <input
              className="input"
              type="password"
              placeholder="Choose a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label>
            <div style={styles.label}>Confirm Password</div>
            <input
              className="input"
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div style={{ fontSize: 14, color: '#6b7280', marginTop: 12, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirectTarget)}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    background: 'var(--bg)'
  },
  card: {
    width: '100%',
    maxWidth: 440,
    padding: 20,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    boxShadow: 'var(--shadow)',
    display: 'grid',
    gap: 12,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(37,99,235,0.6))',
    display: 'grid',
    placeItems: 'center',
    color: 'white',
    fontWeight: 800,
    boxShadow: 'var(--shadow)',
  },
  header: {
    margin: '8px 0 0',
    textAlign: 'center',
  },
  subheader: {
    margin: 0,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6
  },
  error: {
    background: '#FEF2F2',
    color: '#B91C1C',
    border: '1px solid #FECACA',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 14
  }
};
