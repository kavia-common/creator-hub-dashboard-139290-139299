//
// PUBLIC_INTERFACE
// A tiny localStorage-backed data store to simulate JSON persistence for users, sessions, and accounts.
// This module centralizes read/write of our "mock database" so Login/Signup and other parts of the app
// can use a consistent source of truth without a backend.

const KEYS = {
  USERS: 'ch_users',             // array of { id, email, password, name, createdAt }
  SESSION: 'ch_session',         // { token, userId }
  ACCOUNTS: 'ch_accounts'        // array of { id, userId, provider, handle, status }
};

// Initialize empty structures if absent
function ensureInit() {
  if (!localStorage.getItem(KEYS.USERS)) localStorage.setItem(KEYS.USERS, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.ACCOUNTS)) localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify([]));
}

// Helpers
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function genId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now()}`;
}

// PUBLIC_INTERFACE
export const LocalStore = {
  /** Returns array of users. */
  getUsers() {
    ensureInit();
    return readJSON(KEYS.USERS, []);
  },

  /** Adds a new user; throws if email already exists. Returns the created user. */
  addUser({ email, password, name }) {
    ensureInit();
    const users = readJSON(KEYS.USERS, []);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.code = 'EMAIL_IN_USE';
      throw err;
    }
    const user = {
      id: genId('usr'),
      email,
      password, // Note: Plaintext for demo only (do NOT store plaintext passwords in real apps)
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeJSON(KEYS.USERS, users);
    return user;
  },

  /** Validates credentials; returns user if matches, otherwise null. */
  validateCredentials(email, password) {
    ensureInit();
    const users = readJSON(KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    return user || null;
  },

  /** Returns user by id. */
  getUserById(userId) {
    ensureInit();
    return this.getUsers().find(u => u.id === userId) || null;
  },

  /** Returns user by email. */
  getUserByEmail(email) {
    ensureInit();
    const users = readJSON(KEYS.USERS, []);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  /** Saves the current session (token + userId). */
  saveSession({ token, userId }) {
    const session = { token, userId };
    writeJSON(KEYS.SESSION, session);
    return session;
  },

  /** Loads existing session or null. */
  loadSession() {
    return readJSON(KEYS.SESSION, null);
  },

  /** Clears session. */
  clearSession() {
    localStorage.removeItem(KEYS.SESSION);
  },

  /** Returns the currently logged in user hydrated from session, or null. */
  getCurrentUser() {
    const session = this.loadSession();
    if (!session) return null;
    return this.getUserById(session.userId);
  },

  /** Returns user-facing auth payload compatible with AuthContext: { token, user }. */
  getAuthState() {
    const session = this.loadSession();
    if (!session) return { token: null, user: null };
    const user = this.getUserById(session.userId);
    if (!user) return { token: null, user: null };
    return {
      token: session.token,
      user: { name: user.name, email: user.email, provider: 'local' }
    };
  },

  /** Adds or returns a connected account for a user. */
  addAccount({ userId, provider, handle, status = 'Connected' }) {
    ensureInit();
    const accounts = readJSON(KEYS.ACCOUNTS, []);
    const account = { id: genId('acc'), userId, provider, handle, status };
    accounts.push(account);
    writeJSON(KEYS.ACCOUNTS, accounts);
    return account;
  },

  /** Lists accounts for a given user. If no userId, returns empty array. */
  getAccountsForUser(userId) {
    ensureInit();
    if (!userId) return [];
    const accounts = readJSON(KEYS.ACCOUNTS, []);
    return accounts.filter(a => a.userId === userId);
  }
};
