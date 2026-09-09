import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setError('');
    setDone(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Set new password</h1>
        </div>
        {done ? (
          <div className="bg-white rounded-xl border border-border p-6 shadow-soft text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <p className="text-sm text-foreground/70 mb-4">Your password has been reset successfully.</p>
            <button onClick={() => setLocation('/login')} className="py-2.5 px-6 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Sign in</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
            {error && <div className="text-sm font-medium text-destructive bg-destructive/5 p-3 rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">New password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70" aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Confirm password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Reset password</button>
          </form>
        )}
      </div>
    </div>
  );
}
