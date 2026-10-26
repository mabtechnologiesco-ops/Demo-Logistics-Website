import { useEffect, useState } from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '@/config/site';

// Inline WhatsApp glyph (lucide-react has no WhatsApp brand icon)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const configured = WHATSAPP_NUMBER !== 'REPLACE_WITH_CLIENT_NUMBER' && /^\d{6,}$/.test(WHATSAPP_NUMBER);

  const href = configured
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : undefined;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;
    const t = setTimeout(() => setShowTooltip(true), 2500);
    const t2 = setTimeout(() => setShowTooltip(false), 7000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const button = (
    <button
      type="button"
      disabled={!configured}
      aria-label={configured ? 'Chat on WhatsApp' : 'WhatsApp number not configured'}
      className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 ${
        configured
          ? 'bg-[#25D366] text-white hover:scale-105 hover:shadow-2xl focus-visible:ring-[#25D366]'
          : 'cursor-not-allowed bg-gray-300 text-gray-500'
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
      {!configured && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] font-bold text-white ring-2 ring-white">
          !
        </span>
      )}
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2 sm:bottom-7 sm:right-7">
      {showTooltip && (
        <div className="mb-1 hidden items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-white shadow-xl animate-fade-in lg:flex">
          <WhatsAppIcon className="h-4 w-4" />
          Chat on WhatsApp
          <span className="absolute -bottom-1 right-7 h-2 w-2 rotate-45 bg-[#25D366]" />
        </div>
      )}

      {configured ? (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          {button}
        </a>
      ) : (
        <div title="WhatsApp number not configured — set WHATSAPP_NUMBER in src/config/site.ts">
          {button}
        </div>
      )}
    </div>
  );
}
