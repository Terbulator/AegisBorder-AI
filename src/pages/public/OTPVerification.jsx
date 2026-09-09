import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Shield, CheckCircle } from 'lucide-react';

export default function OTPVerification() {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerified(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Verify OTP</h1>
          <p className="text-sm text-foreground/60 mt-1">Enter the 6-digit code sent to your email</p>
        </div>
        {verified ? (
          <div className="bg-white rounded-xl border border-border p-6 shadow-soft text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <p className="text-sm text-foreground/70 mb-4">Verification successful.</p>
            <button onClick={() => setLocation('/dashboard')} className="py-2.5 px-6 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">Continue</button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="bg-white rounded-xl border border-border p-6 shadow-soft space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input key={i} ref={(el) => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
                  value={digit} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-mono font-bold border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" />
              ))}
            </div>
            <button type="submit" disabled={otp.some((d) => !d)}
              className="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors">
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
