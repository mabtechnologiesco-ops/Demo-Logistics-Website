import { FileText, ClipboardCheck, Truck, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { useReveal } from '@/hooks/useReveal';

const STEPS = [
  { icon: FileText, title: 'Request a Quote', description: 'Tell us about your shipment.' },
  { icon: ClipboardCheck, title: 'Plan Your Shipment', description: 'Review transportation requirements.' },
  { icon: Truck, title: 'Shipment in Transit', description: 'Your goods move through the agreed process.' },
  { icon: CheckCircle2, title: 'Delivery Confirmation', description: 'Confirm delivery when the shipment arrives.' },
];

export function HowItWorks() {
  return (
    <section className="section-py bg-white">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          eyebrow="How It Works"
          title="A Simple Path From Request to Delivery"
          description="A clear, four-step process that keeps you informed at every stage."
        />

        <div className="relative mt-16">
          {/* Connecting line - desktop */}
          <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-navy-900/10 lg:block" />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, i) => (
              <Step key={step.title} {...step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
  index: number;
}) {
  const { ref, inView } = useReveal();
  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center text-center ${inView ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-accent-500 shadow-lg shadow-navy-900/20 ring-4 ring-white">
        <Icon className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white ring-2 ring-white">
          {index + 1}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>

      {/* Mobile connector */}
      {index < STEPS.length - 1 && (
        <div className="mt-6 h-8 w-0.5 bg-navy-900/10 sm:hidden" />
      )}
    </div>
  );
}
