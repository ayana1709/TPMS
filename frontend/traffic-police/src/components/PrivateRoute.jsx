import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
