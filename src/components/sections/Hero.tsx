import { ShieldCheck, Eye, Headset, ArrowRight, Search } from 'lucide-react';
import { IMAGES } from '@/config/images';

const TRUST = [
  { icon: ShieldCheck, label: 'Reliable Shipping' },
  { icon: Eye, label: 'Shipment Visibility' },
  { icon: Headset, label: 'Customer Support' },
];

export function Hero() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Cargo ship loaded with shipping containers at a busy seaport at dusk"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        {/* Navy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/30" />
      </div>

      {/* Content */}
      <div className="container-px relative z-10 mx-auto w-full max-w-8xl pt-28 pb-40 lg:pt-32">
        <div className="max-w-2xl">
          <span
            className="eyebrow animate-fade-up text-accent-400"
            style={{ animationDelay: '0.1s' }}
          >
            Logistics Without Limits
          </span>

          <h1
            className="mt-5 text-4xl font-bold leading-[1.08] text-white animate-fade-up sm:text-5xl lg:text-6xl xl:text-[4rem]"
            style={{ animationDelay: '0.2s' }}
          >
            Moving Your World.
            <br />
            Delivering Your Future.
          </h1>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-white/80 animate-fade-up sm:text-lg"
            style={{ animationDelay: '0.35s' }}
          >
            From first mile to final destination, we deliver dependable logistics solutions that
            keep your business moving. Smarter shipping, reliable transportation, and supply chain
            solutions you can trust.
          </p>

          {/* Buttons */}
          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            <button onClick={() => scrollTo('#contact')} className="btn-primary">
              Get a Shipping Quote
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => scrollTo('#tracking')} className="btn-ghost">
              <Search className="h-4 w-4" />
              Track Your Shipment
            </button>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-12 flex flex-wrap gap-x-8 gap-y-4 animate-fade-up"
            style={{ animationDelay: '0.65s' }}
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
                  <Icon className="h-5 w-5 text-accent-400" />
                </span>
                <span className="text-sm font-medium text-white/85">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
