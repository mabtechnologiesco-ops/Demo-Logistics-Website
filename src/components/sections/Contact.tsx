import { useState, type FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { SITE } from '@/config/site';
import { useReveal } from '@/hooks/useReveal';

const CONTACT_DETAILS = [
  { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone.replace(/[^+\d]/g, '')}` },
  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: 'Office', value: SITE.address },
  { icon: Clock, label: 'Business Hours', value: SITE.hours },
];

const SHIPMENT_TYPES = ['Road Freight', 'Sea Freight', 'Air Freight', 'Warehousing', 'Express / Last-Mile', 'Other'];

const REQUIRED = ['fullName', 'email', 'phone', 'pickup', 'destination', 'shipmentType'] as const;
type FieldKey = (typeof REQUIRED)[number] | 'weight' | 'details';

export function Contact() {
  const { ref, inView } = useReveal();
  const [values, setValues] = useState<Record<FieldKey, string>>({
    fullName: '', email: '', phone: '', pickup: '', destination: '',
    shipmentType: '', weight: '', details: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (k: FieldKey, v: string) => {
    setValues((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<FieldKey, string>> = {};
    for (const k of REQUIRED) {
      if (!values[k].trim()) next[k] = 'This field is required.';
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Enter a valid email address.';
    }
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  const inputCls = (k: FieldKey) =>
    `w-full rounded-lg border bg-white py-3 px-4 text-sm text-ink placeholder:text-ink/40 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/40 ${
      errors[k] ? 'border-red-400' : 'border-navy-900/15 focus:border-accent-500'
    }`;

  return (
    <section id="contact" className="section-py bg-mist">
      <div className="container-px mx-auto max-w-8xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Contact details */}
          <div ref={ref} className={inView ? 'animate-fade-up' : 'opacity-0'}>
            <span className="eyebrow">Get in Touch</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
              Let’s Talk About Your Shipping Needs
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/65">
              Reach out with questions or request a quote. Our team is ready to help you find the
              right logistics solution.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-navy-900/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-accent-500">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/45">
                    {label}
                  </div>
                  {href ? (
                    <a href={href} className="mt-1 block text-sm font-medium text-navy-900 hover:text-accent-500">
                      {value}
                    </a>
                  ) : (
                    <div className="mt-1 text-sm font-medium text-navy-900">{value}</div>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-6 rounded-lg bg-white/60 p-4 text-xs text-ink/50">
              All contact details shown are placeholders. Replace them with the client’s verified
              information before launch.
            </p>
          </div>

          {/* Quote form */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-navy-900/10 ring-1 ring-navy-900/5 sm:p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center animate-scale-in">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-navy-900">Quote Request Received</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
                  This is a frontend demo, so your request was not actually emailed or stored. Connect
                  this form to an email service or backend to receive real quote requests. Everything
                  you entered has been validated and is ready to send.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setValues({ fullName: '', email: '', phone: '', pickup: '', destination: '', shipmentType: '', weight: '', details: '' });
                  }}
                  className="btn-outline mt-7"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h3 className="text-xl font-bold text-navy-900">Request a Quote</h3>
                <p className="mt-1 text-sm text-ink/55">Fields marked with * are required.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name *" error={errors.fullName}>
                    <input
                      type="text"
                      value={values.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      placeholder="Jane Doe"
                      className={inputCls('fullName')}
                    />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input
                      type="email"
                      value={values.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="jane@company.com"
                      className={inputCls('email')}
                    />
                  </Field>
                  <Field label="Phone Number *" error={errors.phone}>
                    <input
                      type="tel"
                      value={values.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className={inputCls('phone')}
                    />
                  </Field>
                  <Field label="Shipment Type *" error={errors.shipmentType}>
                    <select
                      value={values.shipmentType}
                      onChange={(e) => update('shipmentType', e.target.value)}
                      className={inputCls('shipmentType')}
                    >
                      <option value="">Select a type…</option>
                      {SHIPMENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Pickup Location *" error={errors.pickup}>
                    <input
                      type="text"
                      value={values.pickup}
                      onChange={(e) => update('pickup', e.target.value)}
                      placeholder="City, Country"
                      className={inputCls('pickup')}
                    />
                  </Field>
                  <Field label="Delivery Destination *" error={errors.destination}>
                    <input
                      type="text"
                      value={values.destination}
                      onChange={(e) => update('destination', e.target.value)}
                      placeholder="City, Country"
                      className={inputCls('destination')}
                    />
                  </Field>
                  <Field label="Approximate Shipment Weight">
                    <input
                      type="text"
                      value={values.weight}
                      onChange={(e) => update('weight', e.target.value)}
                      placeholder="e.g. 500 kg"
                      className={inputCls('weight')}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Additional Details">
                      <textarea
                        value={values.details}
                        onChange={(e) => update('details', e.target.value)}
                        placeholder="Tell us anything else about your shipment…"
                        rows={3}
                        className={`${inputCls('details')} resize-none`}
                      />
                    </Field>
                  </div>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Please complete the required fields highlighted above.
                  </div>
                )}

                <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
                  Request a Quote
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-900">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
