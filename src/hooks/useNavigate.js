import { useLocation } from 'wouter';

const ROUTE_MAP = {
  dashboard: '/dashboard',
  screening: '/dashboard/screening/new',
  history: '/dashboard/history',
  analytics: '/dashboard/analytics',
  settings: '/dashboard/settings',
  alerts: '/dashboard/history',
  profile: '/dashboard/profile',
  home: '/',
  features: '/features',
  contact: '/contact',
  about: '/about',
};

export default function useNavigate() {
  const [, setLocation] = useLocation();
  return (key) => {
    const path = ROUTE_MAP[key] || (key.startsWith('/') ? key : `/dashboard/${key}`);
    setLocation(path);
  };
}
