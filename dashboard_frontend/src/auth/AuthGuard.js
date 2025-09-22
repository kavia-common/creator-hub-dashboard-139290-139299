import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * PUBLIC_INTERFACE
 * AuthGuard protects private routes by checking for a token.
 * If the user is not authenticated, redirect to /login with redirect param.
 */
export default function AuthGuard({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  // If authenticated, render children; otherwise redirect to login preserving intended path
  if (!token) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }
  return children;
}
