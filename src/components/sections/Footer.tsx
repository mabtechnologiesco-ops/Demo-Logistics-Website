import { Linkedin, Twitter, Facebook, Instagram, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { SITE } from '@/config/site';

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Industries', href: '#industries' },
  { label: 'Track Shipment', href: '#tracking' },
  { label: 'Contact', href: '#contact' },
];

const SERVICE_LINKS = [
  'Freight Forwarding',
  'Road Transportation',
  'Warehousing & Distribution',
  'Express & Last-Mile Delivery',
];

const SOCIALS = [
  { icon: Linkedin, href: SITE.social.linkedin, label: 'LinkedIn' },
  { icon: Twitter, href: SITE.social.twitter, label: 'Twitter' },
  { icon: Facebook, href: SITE.social.facebook, label: 'Facebook' },
  { icon: Instagram, href: SITE.social.instagram, label: 'Instagram' },
];

export function Footer() {
  const onNav = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-px mx-auto max-w-8xl py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" />
                  <circle cx="7" cy="17" r="1.6" />
                  <circle cx="17.5" cy="17" r="1.6" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold">
                NEXORA<span className="text-accent-500"> LOGISTICS</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Dependable logistics and freight solutions — from first mile to final destination.
              Smarter shipping, reliable transportation, and supply chain solutions you can trust.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/75 transition-all hover:bg-accent-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => { e.preventDefault(); onNav(l.href); }}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-accent-400"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={(e) => { e.preventDefault(); onNav('#services'); }}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-accent-400"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">Contact</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                <a href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`} className="hover:text-accent-400">{SITE.phone}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                <a href={`mailto:${SITE.email}`} className="hover:text-accent-400">{SITE.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                <span>{SITE.address}</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-white/40">Replace placeholders with client’s verified details.</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.brand}. All rights reserved.</p>
          <p className="text-xs text-white/35">Crafted by MAB TECHNOLOGIES SL.</p>
        </div>
      </div>
    </footer>
  );
}
