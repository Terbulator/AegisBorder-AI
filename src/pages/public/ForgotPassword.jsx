import { useState } from 'react';
import { Link } from 'wouter';
import { Shield, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Reset password</h1>
          <p className="text-sm text-foreground/60 mt-1">Enter your email and we'll send a reset link</p>
        </div>
        {sent ? (
          <div className="bg-white rounded-xl border border-border p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm text-foreground/70">If an account exists with <strong>{email}</strong>, you'll receive a reset link shortly.</p>
            <Link href="/login" className="inline-flex items-center gap-2 mt-4 text-sm text-accent font-medium hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Send reset link</button>
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-foreground/50 hover:text-foreground/70 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
