import { Route, Switch, Router } from 'wouter';
import { lazy, Suspense } from 'react';
import PublicLayout from './layouts/PublicLayout';
import OpsLayout from './layouts/OpsLayout';
import ProtectedRoute from './auth/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import { VERIFICATIONS } from './pages/public/verifications';

const Home = lazy(() => import('./pages/public/Home'));
const Features = lazy(() => import('./pages/public/Features'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const VerificationLanding = lazy(() => import('./pages/public/VerificationLanding'));

const Login = lazy(() => import('./pages/public/Login'));
const Signup = lazy(() => import('./pages/public/Signup'));
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/public/ResetPassword'));
const OTPVerification = lazy(() => import('./pages/public/OTPVerification'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const NewOperation = lazy(() => import('./pages/NewOperation'));
const Screening = lazy(() => import('./pages/Screening'));
const History = lazy(() => import('./pages/History'));
const Analytics = lazy(() => import('./pages/Analytics'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function PageLoader() {
  return <div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>;
}

function Lazy({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function PublicPage({ children }) {
  return <PublicLayout><Lazy>{children}</Lazy></PublicLayout>;
}

function OpsPage({ children }) {
  return <ProtectedRoute><OpsLayout><Lazy>{children}</Lazy></OpsLayout></ProtectedRoute>;
}

export default function AppRouter() {
  return (
    <Router>
    <Switch>
      <Route path="/" component={() => <PublicPage><Home /></PublicPage>} />
      <Route path="/features" component={() => <PublicPage><Features /></PublicPage>} />
      <Route path="/about" component={() => <PublicPage><About /></PublicPage>} />
      <Route path="/contact" component={() => <PublicPage><Contact /></PublicPage>} />

      {VERIFICATIONS.map((v) => (
        <Route key={v.kind} path={`/${v.kind}`} component={() => <PublicPage><VerificationLanding kind={v.kind} /></PublicPage>} />
      ))}

      <Route path="/login" component={() => <PublicPage><Login /></PublicPage>} />
      <Route path="/signup" component={() => <PublicPage><Signup /></PublicPage>} />
      <Route path="/forgot-password" component={() => <PublicPage><ForgotPassword /></PublicPage>} />
      <Route path="/reset-password" component={() => <PublicPage><ResetPassword /></PublicPage>} />
      <Route path="/otp" component={() => <PublicPage><OTPVerification /></PublicPage>} />

      <Route path="/dashboard" component={() => <OpsPage><Dashboard /></OpsPage>} />
      <Route path="/dashboard/new" component={() => <OpsPage><NewOperation /></OpsPage>} />
      <Route path="/dashboard/screening/:id" component={() => <OpsPage><Screening /></OpsPage>} />
      <Route path="/dashboard/history" component={() => <OpsPage><History /></OpsPage>} />
      <Route path="/dashboard/analytics" component={() => <OpsPage><Analytics /></OpsPage>} />
      <Route path="/dashboard/settings" component={() => <OpsPage><SettingsPage /></OpsPage>} />
      <Route path="/dashboard/profile" component={() => <OpsPage><UserProfile /></OpsPage>} />

      <Route component={NotFoundPage} />
    </Switch>
    </Router>
  );
}
