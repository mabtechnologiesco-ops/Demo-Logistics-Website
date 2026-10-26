import { useState, type FormEvent } from 'react';
import { Package, ArrowRight, AlertCircle, Info } from 'lucide-react';

export function TrackingBar() {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'demo'>('idle');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setStatus('error');
      return;
    }
    setStatus('demo');
  };

  return (
    <section id="tracking" className="relative z-20 -mt-24">
      <div className="container-px mx-auto max-w-6xl">
        <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-navy-900/15 ring-1 ring-navy-900/5 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-accent-500">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-navy-900">Track Your Shipment</h2>
              <p className="text-sm text-ink/55">Enter your tracking number for updates.</p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
            noValidate
          >
            <div className="relative flex-1">
              <Package className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setStatus('idle');
                }}
                placeholder="Enter your tracking number"
                aria-label="Tracking number"
                aria-invalid={status === 'error'}
                className="w-full rounded-lg border border-navy-900/15 bg-mist py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-accent-500 focus:bg-white"
              />
            </div>
            <button type="submit" className="btn-primary shrink-0">
              Track Shipment
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Feedback */}
          {status === 'error' && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Please enter a tracking number to continue.
            </div>
          )}
          {status === 'demo' && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 animate-fade-in">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              This is a frontend demo, so live shipment tracking is not connected. Your tracking
              number <strong className="font-semibold">“{value.trim()}”</strong> was accepted by the
              form — connect a tracking API here to return real status updates.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
