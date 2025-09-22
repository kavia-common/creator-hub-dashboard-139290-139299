import React, { createContext, useContext, useEffect, useState } from 'react';

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
  /** Auth context provider that persists token in sessionStorage. */
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = sessionStorage.getItem('auth_token');
    const u = sessionStorage.getItem('auth_user');
    if (t) setTokenState(t);
    if (u) {
      try { setUser(JSON.parse(u)); } catch {}
    }
  }, []);

  const setToken = (t) => {
    setTokenState(t);
    if (t) sessionStorage.setItem('auth_token', t);
    else sessionStorage.removeItem('auth_token');
  };

  const setUserPersist = (u) => {
    setUser(u);
    if (u) sessionStorage.setItem('auth_user', JSON.stringify(u));
    else sessionStorage.removeItem('auth_user');
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
