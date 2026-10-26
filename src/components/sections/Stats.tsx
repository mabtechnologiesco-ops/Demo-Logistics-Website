import { useEffect, useRef, useState } from 'react';
import { PackageCheck, Globe, Building2, Clock } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

// Demo figures — clearly editable placeholders, not verified company achievements.
const STATS = [
  { icon: PackageCheck, value: 125000, suffix: '+', label: 'Shipments Delivered' },
  { icon: Globe, value: 42, suffix: '', label: 'Countries Served' },
  { icon: Building2, value: 1800, suffix: '+', label: 'Business Clients' },
  { icon: Clock, value: 98, suffix: '%', label: 'On-Time Delivery' },
];

function useCountUp(target: number, run: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!run || startedRef.current) return;
    startedRef.current = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVal(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return val;
}

function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  run,
}: {
  icon: typeof PackageCheck;
  value: number;
  suffix: string;
  label: string;
  run: boolean;
}) {
  const v = useCountUp(value, run);
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/10 text-accent-500">
        <Icon className="h-6 w-6" />
      </span>
      <div className="text-3xl font-bold text-white sm:text-4xl">
        {v.toLocaleString()}
        <span className="text-accent-500">{suffix}</span>
      </div>
      <div className="text-sm font-medium text-white/65">{label}</div>
    </div>
  );
}

export function Stats() {
  const { ref, inView } = useReveal();
  return (
    <section className="bg-navy-900 py-16 lg:py-20">
      <div ref={ref} className="container-px mx-auto max-w-8xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} run={inView} />
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-white/40">
          Demonstration figures for layout purposes — replace with verified company data before
          launch.
        </p>
      </div>
    </section>
  );
}
