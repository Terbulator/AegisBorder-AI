import { Suspense } from 'react';
import { AuthProvider } from './auth/AuthContext';
import AppRouter from './router';
import { MotionProvider } from './components/motion';
import { ToastHost } from './components/Toast';
import GuideChat from './components/GuideChat';

export default function App() {
  return (
    <AuthProvider>
      <MotionProvider>
        <div className="min-h-screen bg-background text-foreground font-sans">
          <Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Loading...</div>}>
            <AppRouter />
          </Suspense>
        </div>
        <ToastHost />
        <GuideChat />
      </MotionProvider>
    </AuthProvider>
  );
}
