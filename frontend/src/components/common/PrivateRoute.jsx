import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  if (!isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
