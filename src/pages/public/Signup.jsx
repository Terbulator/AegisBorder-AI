import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Shield, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'analyst' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      setLocation('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed');
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
          <h1 className="text-2xl font-display font-bold text-foreground">Create account</h1>
          <p className="text-sm text-foreground/60 mt-1">Set up your AegisBorder access</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
          {error && <div className="text-sm font-medium text-destructive bg-destructive/5 p-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Full name</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} required
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} required
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70" aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Role</label>
            <select value={form.role} onChange={(e) => update('role', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors">
              <option value="analyst">Analyst</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors">
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-sm text-foreground/50 mt-6">
          Already have an account? <Link href="/login" className="text-accent font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
