import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object | object[];
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  keywords,
  ogType = 'website',
  ogImage = 'https://chimneyforce.com/chimney_force_fin-01.png',
  structuredData,
  noindex = false,
}) => {
  const siteUrl = 'https://chimneyforce.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph Tags */}
      <meta property="og:site_name" content="Chimney Force" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}
    </Helmet>
  );
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
        name: state === 'CT' ? 'Connecticut' : 'New Jersey',
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '16:00',
      },
    ],
  };
};

// Helper function to create Service schema
export const createServiceSchema = (serviceName: string, description: string, region: string, phoneNumber: string = '(888) 398-7707') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    url: `https://chimneyforce.com/services/${serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
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
    description: 'Professional chimney and fireplace services across Connecticut and New Jersey. Licensed, insured, and certified chimney experts providing inspection, cleaning, repair, and installation services.',
    foundingDate: '2010',
    telephone: '(888) 398-7707',
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
    ],
    sameAs: [
      'https://www.facebook.com/chimneyforce',
      'https://www.instagram.com/chimneyforce',
      'https://www.linkedin.com/company/chimneyforce',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '98',
      bestRating: '5',
      worstRating: '1',
    },
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
