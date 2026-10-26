import { ArrowRight, Mail } from 'lucide-react';
import { IMAGES } from '@/config/images';

export function CTA() {
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMAGES.cta}
          alt="Trucks driving down a highway at night with headlights"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-700/70" />
      </div>

      <div className="container-px relative z-10 mx-auto max-w-4xl py-24 text-center lg:py-32">
        <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Move Your Business Forward?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          Tell us what you need to move. Let’s find the right logistics solution for your business.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={() => scrollTo('#contact')} className="btn-primary">
            Request a Quote
            <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => scrollTo('#contact')} className="btn-ghost">
            <Mail className="h-4 w-4" />
            Contact Our Team
          </button>
        </div>
      </div>
    </section>
  );
}
