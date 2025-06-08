/**
 * @fileoverview PrivateRoute component for the Cross Sums application. Provides route protection
 * by checking for authentication token and redirecting to login if not authenticated.
 * 
 * @requires React
 * @requires react-router-dom
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * @typedef {Object} PrivateRouteProps
 * @property {React.ReactNode} children - Child components to render if authenticated
 */

/**
 * Route component that protects routes requiring authentication
 * 
 * @component
 * @param {PrivateRouteProps} props - Component props
 * @returns {JSX.Element} Either the protected content or a redirect to login
 * 
 * @example
 * <PrivateRoute>
 *   <ProtectedComponent />
 * </PrivateRoute>
 */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
}
