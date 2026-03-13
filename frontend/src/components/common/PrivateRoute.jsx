import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;