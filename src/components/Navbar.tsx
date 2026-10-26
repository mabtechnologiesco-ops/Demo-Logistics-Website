import { useEffect, useState } from 'react';
import { Menu, X, Phone, UserCircle } from 'lucide-react';
import { SITE } from '@/config/site';

interface NavbarProps {
  onPortal: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Industries', href: '#industries' },
  { label: 'Track Shipment', href: '#tracking' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ onPortal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 shadow-lg shadow-navy-900/20 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-px mx-auto flex max-w-8xl items-center justify-between py-4">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('#home');
          }}
          className="flex items-center gap-2.5"
          aria-label={`${SITE.brand} home`}
        >
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            NEXORA
            <span className="text-accent-500"> LOGISTICS</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.href);
                }}
                className="text-sm font-medium text-white/85 transition-colors hover:text-accent-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + phone + portal */}
        <div className="hidden items-center gap-4 lg:flex">
          <button
            onClick={onPortal}
            className="flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors hover:text-accent-400"
          >
            <UserCircle className="h-4.5 w-4.5" />
            Client Login
          </button>
          <a
            href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
            className="flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-accent-400"
          >
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNav('#contact');
            }}
            className="btn-primary !py-2.5 !px-5"
          >
            Get a Quote
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden">
          <div className="mx-3 mb-3 overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-2xl animate-scale-in">
            <ul className="flex flex-col p-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(link.href);
                    }}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-accent-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 p-3">
              <button
                onClick={() => { setOpen(false); onPortal(); }}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <UserCircle className="h-4.5 w-4.5" />
                Client Login
              </button>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('#contact');
                }}
                className="btn-primary w-full"
              >
                Get a Quote
              </a>
              <a
                href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium text-white/80"
              >
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg shadow-accent-500/30">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" />
        <circle cx="7" cy="17" r="1.6" />
        <circle cx="17.5" cy="17" r="1.6" />
      </svg>
    </span>
  );
}
