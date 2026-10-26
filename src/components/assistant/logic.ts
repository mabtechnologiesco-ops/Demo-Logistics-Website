// Lightweight rule-based demo assistant logic. No external AI API.
// Recognizes common logistics keywords and returns predefined responses
// based on the website's configured information.

export interface QuickAction {
  label: string;
  action: 'scroll' | 'link';
  target: string;
}

export interface AssistantReply {
  text: string;
  quickActions?: QuickAction[];
}

type Match = { keywords: string[]; reply: () => AssistantReply };

const BRAND = 'Nexora Logistics';

const RULES: Match[] = [
  {
    keywords: ['service', 'services', 'offer', 'what do you do', 'solutions'],
    reply: () => ({
      text: `We offer four core logistics services:\n\n1. Freight Forwarding — coordinated domestic and international cargo.\n2. Road Transportation — dependable commercial and regional deliveries.\n3. Warehousing & Distribution — storage, inventory, and distribution support.\n4. Express & Last-Mile Delivery — efficient final-destination delivery.\n\nWould you like a quote for any of these?`,
      quickActions: [{ label: 'Request a Quote', action: 'scroll', target: '#contact' }],
    }),
  },
  {
    keywords: ['freight', 'forwarding', 'cargo', 'container', 'sea', 'ocean', 'ship'],
    reply: () => ({
      text: `Our Freight Forwarding service coordinates domestic and international cargo movement — sea, road, and combined modes. We help plan, book, and manage your shipment end to end. Would you like to request a quote?`,
      quickActions: [{ label: 'Request a Quote', action: 'scroll', target: '#contact' }],
    }),
  },
  {
    keywords: ['road', 'truck', 'transportation', 'trucking', 'haul'],
    reply: () => ({
      text: `Our Road Transportation service handles commercial goods and regional deliveries with dependable scheduling. Tell us your pickup and destination for a tailored quote.`,
      quickActions: [{ label: 'Request a Quote', action: 'scroll', target: '#contact' }],
    }),
  },
  {
    keywords: ['warehouse', 'storage', 'inventory', 'distribution', 'fulfillment'],
    reply: () => ({
      text: `Our Warehousing & Distribution service covers organized storage, inventory handling, and distribution support. We can help coordinate storage alongside your shipping needs.`,
      quickActions: [{ label: 'Request a Quote', action: 'scroll', target: '#contact' }],
    }),
  },
  {
    keywords: ['express', 'last mile', 'last-mile', 'final mile', 'fast delivery', 'urgent'],
    reply: () => ({
      text: `Our Express & Last-Mile Delivery service focuses on efficient delivery to the final destination. Ideal for time-sensitive shipments.`,
      quickActions: [{ label: 'Request a Quote', action: 'scroll', target: '#contact' }],
    }),
  },
  {
    keywords: ['quote', 'pricing', 'price', 'cost', 'estimate', 'request', 'book'],
    reply: () => ({
      text: `To request a quote, scroll to the Contact section and complete the quote form with your shipment details — pickup, destination, type, and weight. Once submitted, our team can follow up. (This is a demo, so no request is actually sent.)`,
      quickActions: [
        { label: 'Go to Quote Form', action: 'scroll', target: '#contact' },
        { label: 'Track a Shipment', action: 'scroll', target: '#tracking' },
      ],
    }),
  },
  {
    keywords: ['track', 'tracking', 'where is my', 'shipment status', 'consignment', 'tracking number'],
    reply: () => ({
      text: `You can track a shipment using the tracking bar near the top of the page — enter your tracking number there. Note: this is a frontend demo, so live tracking is not connected yet. When a tracking API is added, real status updates will appear there.`,
      quickActions: [{ label: 'Track a Shipment', action: 'scroll', target: '#tracking' }],
    }),
  },
  {
    keywords: ['contact', 'phone', 'email', 'reach', 'talk', 'call', 'address', 'hours', 'support'],
    reply: () => ({
      text: `You can reach our team through the Contact section at the bottom of the page — phone, email, and office address are listed there. (These are placeholders until the client’s real details are added.)`,
      quickActions: [{ label: 'Contact Our Team', action: 'scroll', target: '#contact' }],
    }),
  },
  {
    keywords: ['international', 'global', 'overseas', 'cross border', 'export', 'import'],
    reply: () => ({
      text: `Yes — our Freight Forwarding service covers international cargo, including sea and coordinated multi-mode shipping. Share your origin and destination in the quote form and we can help plan the route.`,
      quickActions: [{ label: 'Request a Quote', action: 'scroll', target: '#contact' }],
    }),
  },
  {
    keywords: ['industry', 'industries', 'sector', 'ecommerce', 'retail', 'manufacturing', 'healthcare', 'agriculture', 'construction'],
    reply: () => ({
      text: `We serve several industries: E-commerce & Retail, Manufacturing, Agriculture, Healthcare & Pharmaceuticals, Construction & Industrial Supplies, and Wholesale & Distribution. Scroll to the Industries section to learn more.`,
      quickActions: [{ label: 'View Industries', action: 'scroll', target: '#industries' }],
    }),
  },
  {
    keywords: ['login', 'log in', 'sign in', 'portal', 'account', 'my shipments', 'my account', 'dashboard', 'client area'],
    reply: () => ({
      text: `We have a customer portal where you can view your shipment history, saved delivery addresses, and invoices. Click "Client Login" in the top navigation to sign in or create an account.`,
      quickActions: [],
    }),
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
    reply: () => ({
      text: `Hello! Welcome to ${BRAND}. I can help you explore our services, request a quote, or track a shipment. What can I help you with?`,
      quickActions: [
        { label: 'Our Services', action: 'scroll', target: '#services' },
        { label: 'Request a Quote', action: 'scroll', target: '#contact' },
      ],
    }),
  },
  {
    keywords: ['thank', 'thanks', 'great', 'perfect', 'awesome'],
    reply: () => ({
      text: `You're welcome! Is there anything else I can help you with about our logistics services?`,
    }),
  },
  {
    keywords: ['price', 'rates', 'how much', 'fee', 'charge'],
    reply: () => ({
      text: `Pricing depends on your shipment details — cargo type, weight, distance, and service. Since this is a demo, I can't provide real rates. Please request a quote through the Contact form and our team can follow up.`,
      quickActions: [{ label: 'Request a Quote', action: 'scroll', target: '#contact' }],
    }),
  },
  {
    keywords: ['hours', 'open', 'closing', 'time', 'business hours'],
    reply: () => ({
      text: `Business hours are listed in the Contact section. Since the client’s real details haven't been added yet, the hours shown are placeholders.`,
      quickActions: [{ label: 'Contact Our Team', action: 'scroll', target: '#contact' }],
    }),
  },
];

const FALLBACK: AssistantReply = {
  text: `I'm not sure I caught that. I can help with our logistics services, requesting a quote, shipment tracking, international shipping, and contact details. You can also reach our team directly through the Contact section.`,
  quickActions: [
    { label: 'Contact Our Team', action: 'scroll', target: '#contact' },
    { label: 'View Services', action: 'scroll', target: '#services' },
  ],
};

export function getAssistantReply(message: string): AssistantReply {
  const lower = message.toLowerCase().trim();
  if (!lower) return FALLBACK;

  // Score each rule by how many keywords it matches
  let best: { rule: Match; score: number } | null = null;
  for (const rule of RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) score += kw.length > 4 ? 2 : 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { rule, score };
  }

  return best ? best.rule.reply() : FALLBACK;
}

export const WELCOME: AssistantReply = {
  text: `Hello! Welcome to ${BRAND}. I'm your virtual assistant. I can help you explore our services, understand how to request a quote, and answer common logistics questions. How can I help?`,
  quickActions: [
    { label: 'What services do you offer?', action: 'scroll', target: '#services' },
    { label: 'Request a Quote', action: 'scroll', target: '#contact' },
    { label: 'Track a Shipment', action: 'scroll', target: '#tracking' },
  ],
};

export const SUGGESTED_QUESTIONS = [
  'What logistics services do you offer?',
  'How do I request a shipping quote?',
  'Do you offer international shipping?',
  'How can I track my shipment?',
  'How can I contact your team?',
];
