// Centralized image assets — served locally from /public/images for reliability.
export const IMAGES = {
  hero: '/images/hero.jpg',
  cta: '/images/cta.jpg',
  about: '/images/about.jpg',
  services: {
    freight: '/images/service-freight.jpg',
    road: '/images/service-road.jpg',
    warehouse: '/images/service-warehouse.jpg',
    express: '/images/service-express.jpg',
  },
  industries: {
    ecommerce: '/images/ind-ecommerce.jpg',
    manufacturing: '/images/ind-manufacturing.jpg',
    agriculture: '/images/ind-agriculture.jpg',
    healthcare: '/images/ind-healthcare.jpg',
    construction: '/images/ind-construction.jpg',
    wholesale: '/images/ind-wholesale.jpg',
  },
} as const;
