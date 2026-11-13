export interface SeoProps {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  structuredData?: object | object[];
  noindex?: boolean;
}

const SITE_URL = 'https://chimneyforce.com';
const OG_IMAGE = 'https://chimneyforce.com/CF-team.webp';
const OG_IMAGE_ALT = 'Chimney Force chimney service crew with their service van';

export const buildSeoHead = ({ title, description, canonical, keywords, structuredData, noindex = false }: SeoProps) => {
  const fullCanonical = `${SITE_URL}${canonical}`;

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
      ...(noindex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
      { property: 'og:site_name', content: 'Chimney Force' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: fullCanonical },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '800' },
      { property: 'og:image:height', content: '599' },
      { property: 'og:image:alt', content: OG_IMAGE_ALT },
      { property: 'og:locale', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: OG_IMAGE },
      { name: 'twitter:image:alt', content: OG_IMAGE_ALT },
      ...(structuredData
        ? [{ 'script:ld+json': Array.isArray(structuredData) ? structuredData : [structuredData] }]
        : []),
    ],
    links: [{ rel: 'canonical', href: fullCanonical }],
  };
};

// Helper function to create LocalBusiness schema
export const createLocalBusinessSchema = (
  cityName: string,
  state: string,
  phone: string,
  serviceArea?: string
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://chimneyforce.com/${state.toLowerCase()}/${cityName.toLowerCase().replace(/\s+/g, '-')}#business`,
    name: 'Chimney Force',
    image: 'https://chimneyforce.com/chimney_force_fin-01.png',
    description: `Professional chimney sweep, inspection, cleaning, and repair services in ${cityName}, ${state}. Licensed and insured chimney experts serving residential and commercial properties.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: state,
      addressCountry: 'US',
    },
    telephone: phone,
    priceRange: '$$',
    url: `https://chimneyforce.com/${state.toLowerCase()}/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedIn: {
        '@type': 'State',
        name: state === 'CT' ? 'Connecticut' : state === 'NJ' ? 'New Jersey' : 'Pennsylvania',
      },
    },
    serviceArea: serviceArea || cityName,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Chimney Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Chimney Inspection',
            description: 'Level 1 and Level 2 chimney inspections with camera technology',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Chimney Cleaning & Sweep',
            description: 'Professional chimney sweep and creosote removal services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Chimney Repair',
            description: 'Masonry repair, tuckpointing, and chimney restoration',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Chimney Liner Installation',
            description: 'Stainless steel and aluminum liner installation and repair',
          },
        },
      ],
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '09:00',
        closes: '16:00',
      },
    ],
  };
};

// Helper function to create Service schema
export const createServiceSchema = (serviceName: string, description: string, region: string, path: string, phoneNumber: string = '888-398-7707') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    url: `https://chimneyforce.com${path}`,
    priceRange: '$$',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Chimney Force',
      image: 'https://chimneyforce.com/chimney_force_fin-01.png',
      telephone: phoneNumber,
      url: 'https://chimneyforce.com',
      areaServed: [
        { '@type': 'State', name: 'Connecticut' },
        { '@type': 'State', name: 'New Jersey' },
        { '@type': 'State', name: 'Pennsylvania' },
      ],
    },
    serviceType: 'Chimney Services',
    category: 'Home Services',
    areaServed: region,
  };
};

// Helper function to create FAQPage schema
export const createFAQSchema = (faqs: Array<{ q: string; a: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
};

// Helper function to create Organization schema
export const createOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://chimneyforce.com/#organization',
    name: 'Chimney Force',
    legalName: 'Chimney Force, INC',
    url: 'https://chimneyforce.com',
    logo: 'https://chimneyforce.com/chimney_force_fin-01.png',
    image: 'https://chimneyforce.com/chimney_force_fin-01.png',
    description: 'Professional chimney and fireplace services across Connecticut, New Jersey and Pennsylvania. Licensed, insured, and certified chimney experts providing inspection, cleaning, repair, and installation services.',
    foundingDate: '2010',
    telephone: '888-398-7707',
    email: 'Chimneyforceinc@gmail.com',
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: 'Connecticut',
        addressRegion: 'CT',
        addressCountry: 'US',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'New Jersey',
        addressRegion: 'NJ',
        addressCountry: 'US',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: '1000 Northbrook Dr #100',
        addressLocality: 'Trevose',
        addressRegion: 'PA',
        postalCode: '19053',
        addressCountry: 'US',
      },
    ],
    areaServed: [
      {
        '@type': 'State',
        name: 'Connecticut',
      },
      {
        '@type': 'State',
        name: 'New Jersey',
      },
      {
        '@type': 'State',
        name: 'Pennsylvania',
      },
    ],
    sameAs: [
      'https://www.facebook.com/chimneyforce',
      'https://www.instagram.com/chimneyforce',
      'https://www.linkedin.com/company/chimneyforce',
    ],
  };
};

// Helper function to create BreadcrumbList schema
export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://chimneyforce.com${item.url}`,
    })),
  };
};
