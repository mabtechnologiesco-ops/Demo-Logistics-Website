import { Ship, Truck, Warehouse, Bike, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { IMAGES } from '@/config/images';
import { useReveal } from '@/hooks/useReveal';

const SERVICES = [
  {
    icon: Ship,
    title: 'Freight Forwarding',
    description: 'Coordinated freight solutions for domestic and international cargo.',
    image: IMAGES.services.freight,
    alt: 'Cargo ship loaded with containers docked at a seaport',
  },
  {
    icon: Truck,
    title: 'Road Transportation',
    description: 'Dependable transportation for commercial goods and regional deliveries.',
    image: IMAGES.services.road,
    alt: 'Red semi-truck driving through a scenic highway',
  },
  {
    icon: Warehouse,
    title: 'Warehousing & Distribution',
    description: 'Organized storage, inventory handling, and distribution support.',
    image: IMAGES.services.warehouse,
    alt: 'Forklift unloading goods at a warehouse loading dock',
  },
  {
    icon: Bike,
    title: 'Express & Last-Mile Delivery',
    description: 'Efficient delivery solutions for shipments reaching their final destination.',
    image: IMAGES.services.express,
    alt: 'Delivery truck driving along a city road',
  },
];

export function Services() {
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="services" className="section-py bg-mist">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          eyebrow="Our Services"
          title="Logistics Solutions Built Around Your Business"
          description="Flexible, dependable logistics services designed to help businesses move goods efficiently and confidently."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} {...s} index={i} onLearn={() => scrollTo('#contact')} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  description,
  image,
  alt,
  index,
  onLearn,
}: {
  icon: typeof Ship;
  title: string;
  description: string;
  image: string;
  alt: string;
  index: number;
  onLearn: () => void;
}) {
  const { ref, inView } = useReveal();
  return (
    <article
      ref={ref}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy-900/5 card-hover ${
        inView ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
        <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-navy-900 shadow-lg">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-navy-900">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">{description}</p>
        <button
          onClick={onLearn}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-500 transition-colors hover:text-accent-600"
        >
          Learn More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}
