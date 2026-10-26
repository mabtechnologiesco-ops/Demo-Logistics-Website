// Central site configuration — replace placeholders with client's real details before launch.
export const SITE = {
  brand: 'Nexora Logistics',
  brandShort: 'Nexora',
  phone: '+1 (555) 000-0000',
  email: 'hello@nexora-logistics.example',
  address: '1200 Commerce Way, Suite 400, Metropolis, NY 10001',
  hours: 'Mon–Fri, 8:00 AM – 6:00 PM (EST)',
  social: {
    linkedin: '#',
    twitter: '#',
    facebook: '#',
    instagram: '#',
  },
} as const;

// WhatsApp click-to-chat. Replace with client's international number (digits only, no +).
export const WHATSAPP_NUMBER = 'REPLACE_WITH_CLIENT_NUMBER';
export const WHATSAPP_MESSAGE = 'Hello! I would like to learn more about your logistics services.';
