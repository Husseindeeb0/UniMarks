import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role === 'ADMIN') {
    if (location.pathname !== '/admin') {
      return <Navigate to="/admin" />;
    }
  } else if (user?.role === 'TEACHER') {
    if (location.pathname !== '/teacher') {
      return <Navigate to="/teacher" />;
    }
  } else if (user?.role === 'STUDENT') {
    if (location.pathname !== '/') {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
