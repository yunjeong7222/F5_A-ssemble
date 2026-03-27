import {Navigate} from 'react-router-dom';
import useAuthStore from '../../store/authStore';
// import Alert from '../../utils/alert';

const PrivateRoute = ({children}) => {
    const user = useAuthStore((state) => state.user);
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
