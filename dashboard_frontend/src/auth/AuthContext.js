import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocalStore } from '../services/localStore';

/**
 * PUBLIC_INTERFACE
 * Provides authentication state (token, user) and setters to the app.
 */
const AuthContext = createContext({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Auth context provider that persists session to localStorage (via LocalStore),
   * while maintaining backward compatibility with existing sessionStorage keys.
   */
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);

  // On mount, hydrate from LocalStore; fallback to old sessionStorage keys if present
  useEffect(() => {
    const { token: t, user: u } = LocalStore.getAuthState();
    if (t && u) {
      setTokenState(t);
      setUser(u);
      return;
    }
    // Backward compatibility: if previous sessionStorage-based auth exists, migrate it
    const legacyToken = sessionStorage.getItem('auth_token');
    const legacyUser = sessionStorage.getItem('auth_user');
    if (legacyToken && legacyUser) {
      try {
        const parsed = JSON.parse(legacyUser);
        setTokenState(legacyToken);
        setUser(parsed);
        // Best-effort: if we can find or create a user, store a LocalStore session
        const existing = parsed?.email ? LocalStore.getUserByEmail(parsed.email) : null;
        const userId = existing?.id || genLegacyUser(parsed);
        LocalStore.saveSession({ token: legacyToken, userId });
      } catch {
        // ignore parse error
      }
    }
  }, []);

  // Generate a placeholder user if coming from legacy session without localStore user
  function genLegacyUser(parsed) {
    const email = parsed?.email || `${(parsed?.name || 'user').toLowerCase()}@example.com`;
    const name = parsed?.name || email.split('@')[0];
    try {
      const created = LocalStore.addUser({ email, password: 'legacy', name });
      return created.id;
    } catch {
      // If email existed, use it
      const existing = LocalStore.getUserByEmail(email);
      return existing?.id;
    }
  }

  const setToken = (t) => {
    setTokenState(t);
    // session will be fully saved when setUser is called with a valid user
    if (!t) {
      LocalStore.clearSession();
      sessionStorage.removeItem('auth_token'); // legacy cleanup
    } else {
      // keep legacy in sync for compatibility with other code paths
      sessionStorage.setItem('auth_token', t);
    }
  };

  const setUserPersist = (u) => {
    setUser(u);
    if (u && token) {
      // Find or create a local user record and save session
      const email = u.email || `${(u.name || 'user').toLowerCase()}@example.com`;
      let localUser = LocalStore.getUserByEmail(email);
      if (!localUser) {
        try {
          localUser = LocalStore.addUser({ email, password: 'oauth/local', name: u.name || email.split('@')[0] });
        } catch {
          localUser = LocalStore.getUserByEmail(email);
        }
      }
      if (localUser) {
        LocalStore.saveSession({ token, userId: localUser.id });
      }
    }
    if (!u) {
      LocalStore.clearSession();
      sessionStorage.removeItem('auth_user'); // legacy cleanup
    } else {
      // keep legacy in sync
      sessionStorage.setItem('auth_user', JSON.stringify(u));
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser: setUserPersist }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Accessor hook for AuthContext. */
  return useContext(AuthContext);
}
