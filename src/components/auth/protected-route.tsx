import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from 'src/store/hooks';

// ----------------------------------------------------------------------

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // If not authenticated, redirect to sign-in
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ----------------------------------------------------------------------

type PublicRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function PublicRoute({ children, redirectTo = '/' }: PublicRouteProps) {
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

  // If authenticated, redirect to dashboard
  if (isAuthenticated && accessToken) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

