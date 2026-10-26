import { useState, type FormEvent } from 'react';
import { Truck, Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { SITE } from '@/config/site';

export function LoginPage({ onBack }: { onBack: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
    } else if (mode === 'signup') {
      setInfo('Account created. You are now signed in.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-900 px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="Logistics operations background"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-navy-900/70" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to site */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-navy-900/30">
          {/* Header */}
          <div className="bg-navy-900 px-7 py-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg shadow-accent-500/30">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-display text-xl font-bold text-white">Customer Portal</h1>
            <p className="mt-1 text-sm text-white/60">
              {SITE.brand} — track shipments, addresses & invoices
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-navy-900/10">
            <button
              onClick={() => { setMode('signin'); setError(null); setInfo(null); }}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                mode === 'signin'
                  ? 'border-b-2 border-accent-500 text-navy-900'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); setInfo(null); }}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                mode === 'signup'
                  ? 'border-b-2 border-accent-500 text-navy-900'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4 p-7" noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-navy-900/15 bg-mist py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-900">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full rounded-lg border border-navy-900/15 bg-mist py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {info && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 animate-fade-in">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Please wait…'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="text-center text-xs text-ink/45">
              {mode === 'signin'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                  setInfo(null);
                }}
                className="font-semibold text-accent-500 hover:text-accent-600"
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
