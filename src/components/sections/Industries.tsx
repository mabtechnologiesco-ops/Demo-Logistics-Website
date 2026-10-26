import { ShoppingBag, Factory, Wheat, HeartPulse, HardHat, Boxes } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { IMAGES } from '@/config/images';
import { useReveal } from '@/hooks/useReveal';

const INDUSTRIES = [
  { icon: ShoppingBag, title: 'E-commerce & Retail', image: IMAGES.industries.ecommerce, alt: 'Woman managing shipping logistics for a small business' },
  { icon: Factory, title: 'Manufacturing', image: IMAGES.industries.manufacturing, alt: 'Industrial factory with metal pipes and equipment' },
  { icon: Wheat, title: 'Agriculture', image: IMAGES.industries.agriculture, alt: 'Combine harvester working in a wheat field' },
  { icon: HeartPulse, title: 'Healthcare & Pharmaceuticals', image: IMAGES.industries.healthcare, alt: 'Medical professional holding assorted medication' },
  { icon: HardHat, title: 'Construction & Industrial Supplies', image: IMAGES.industries.construction, alt: 'Piles of wooden planks at an industrial site' },
  { icon: Boxes, title: 'Wholesale & Distribution', image: IMAGES.industries.wholesale, alt: 'Large wholesale warehouse with stacked merchandise' },
];

export function Industries() {
  return (
    <section id="industries" className="section-py bg-mist">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          eyebrow="Industries We Serve"
          title="Built for the Industries That Move the World"
          description="Logistics experience across sectors that depend on dependable, well-coordinated transportation."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((item, i) => (
            <IndustryCard key={item.title} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryCard({
  icon: Icon,
  title,
  image,
  alt,
  index,
}: {
  icon: typeof ShoppingBag;
  title: string;
  image: string;
  alt: string;
  index: number;
}) {
  const { ref, inView } = useReveal();
  return (
    <article
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-900/5 card-hover ${
        inView ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 text-white shadow-lg shadow-accent-500/30">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
    </article>
  );
}
