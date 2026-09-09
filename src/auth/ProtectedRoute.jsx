import { useAuth } from './AuthContext';
import { useLocation } from 'wouter';

export default function ProtectedRoute({ children, roles, allowDemo = true }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const isDemo = allowDemo && localStorage.getItem('aegisborder_demo_mode') === 'true';

  const authorized = isDemo || (user && (!roles || roles.includes(user.role)));
  if (authorized) return children;

  setLocation('/login');
  return null;
}
