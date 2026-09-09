import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useT } from '../../i18n';

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      setLocation('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setLoading(true);
    try {
      localStorage.setItem('aegisborder_demo_mode', 'true');
      await login({ email: 'admin@aegisborder.dev', password: 'admin123' });
      setLocation('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-foreground/60 mt-1">Sign in to your AegisBorder account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
          {error && <div className="text-sm font-medium text-destructive bg-destructive/5 p-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              placeholder="officer@aegisborder.gov" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-foreground/60">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-accent font-medium hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors">
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-foreground/40">or</span></div>
          </div>
          <button type="button" onClick={handleDemo} disabled={loading}
            className="w-full py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground/70 hover:bg-surface-muted transition-colors">
            Enter Demo Mode
          </button>
        </form>
        <p className="text-center text-sm text-foreground/50 mt-6">
          Don't have an account? <Link href="/signup" className="text-accent font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
