import { CheckCircle2, ClipboardList, Eye, SlidersHorizontal, MessageSquare } from 'lucide-react';
import { IMAGES } from '@/config/images';
import { useReveal } from '@/hooks/useReveal';

const BENEFITS = [
  {
    icon: ClipboardList,
    title: 'Reliable Delivery Coordination',
    description: 'Planned, communicated, and managed shipments from pickup to delivery.',
  },
  {
    icon: Eye,
    title: 'Shipment Visibility',
    description: 'Track your cargo through every stage of the journey with clear updates.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Flexible Logistics Solutions',
    description: 'Services that adapt to your cargo type, schedule, and destination.',
  },
  {
    icon: MessageSquare,
    title: 'Responsive Customer Support',
    description: 'A team that answers quickly and keeps you informed throughout.',
  },
];

export function About() {
  const { ref, inView } = useReveal();
  return (
    <section id="about" className="section-py bg-white">
      <div className="container-px mx-auto max-w-8xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div
            ref={ref}
            className={`relative ${inView ? 'animate-fade-up' : 'opacity-0'}`}
          >
            <div className="overflow-hidden rounded-2xl shadow-xl shadow-navy-900/10">
              <img
                src={IMAGES.about}
                alt="Warehouse employee operating a forklift to move stocked goods"
                loading="lazy"
                className="h-[420px] w-full object-cover lg:h-[520px]"
              />
            </div>
            {/* Accent frame */}
            <div className="absolute -bottom-5 -right-5 -z-10 h-40 w-40 rounded-2xl bg-accent-500/10 lg:h-52 lg:w-52" />
            <div className="absolute -top-4 -left-4 -z-10 h-28 w-28 rounded-2xl border-2 border-navy-700/15" />
          </div>

          {/* Content */}
          <div>
            <span className="eyebrow">Why Partner With Us</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
              More Than Moving Cargo. Moving Business Forward.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink/65 sm:text-lg">
              We combine dependable transportation, thoughtful coordination, and customer-focused
              service to help businesses keep their supply chains moving.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, title, description }, i) => (
                <div
                  key={title}
                  className={`flex gap-3.5 ${inView ? 'animate-fade-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.15 + i * 0.1}s` }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-accent-500">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="flex items-center gap-1.5 text-base font-semibold text-navy-900">
                      <CheckCircle2 className="h-4 w-4 text-accent-500" />
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
