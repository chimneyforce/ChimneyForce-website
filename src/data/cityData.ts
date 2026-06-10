export interface ServiceFocus {
  title: string;
  description: string;
  heroTitle: string;
  targetMarket: string;
}

export interface CityData {
  name: string;
  slug: string;
  state: 'CT' | 'NJ';
  serviceFocus: ServiceFocus;
}

export const CITY_DATA: Record<string, CityData> = {
  'greenwich': {
    name: 'Greenwich',
    slug: 'greenwich',
    state: 'CT',
    serviceFocus: {
      title: 'Historic Stone Restoration',
      description: 'Expert restoration services for historic stone chimneys and fireplaces in Greenwich luxury estates. We specialize in preserving the architectural integrity of high-end properties while ensuring modern safety standards.',
      heroTitle: 'Premier Stone Chimney Restoration in Greenwich, CT',
      targetMarket: '$500M+ Estates & Historic Properties',
    },
  },
  'stamford': {
    name: 'Stamford',
    slug: 'stamford',
    state: 'CT',
    serviceFocus: {
      title: 'Chimney Repair & Relining',
      description: 'High-volume chimney repair and stainless steel liner installation for wood-burning fireplaces. Serving Stamford residential properties with fast, reliable service.',
      heroTitle: 'Professional Chimney Repair & Relining in Stamford, CT',
      targetMarket: 'Wood Burning Fireplace Volume Repair',
    },
  },
  'west-hartford': {
    name: 'West Hartford',
    slug: 'west-hartford',
    state: 'CT',
    serviceFocus: {
      title: 'Brick Tuckpointing & Clay Liner Repair',
      description: 'Specialized tuckpointing and clay tile liner restoration for historic brick Tudor homes. Preserving West Hartford\'s architectural heritage with expert masonry work.',
      heroTitle: 'Expert Tuckpointing & Clay Liner Repair in West Hartford, CT',
      targetMarket: 'Historic Brick Tudor Homes',
    },
  },
  'fairfield': {
    name: 'Fairfield',
    slug: 'fairfield',
    state: 'CT',
    serviceFocus: {
      title: 'Level 2 Real Estate Inspections',
      description: 'Comprehensive Level 2 chimney inspections with camera technology for home buyers in Fairfield. Detailed reports for real estate transactions and peace of mind.',
      heroTitle: 'Level 2 Chimney Inspections for Fairfield Home Buyers',
      targetMarket: 'New Homebuyers & Real Estate',
    },
  },
  'norwalk': {
    name: 'Norwalk',
    slug: 'norwalk',
    state: 'CT',
    serviceFocus: {
      title: 'Complete Chimney Services',
      description: 'Full-service chimney inspection, cleaning, and repair for Norwalk homes. From routine maintenance to major repairs, we handle it all.',
      heroTitle: 'Complete Chimney Services in Norwalk, CT',
      targetMarket: 'Residential Homeowners',
    },
  },
  'marlboro': {
    name: 'Marlboro',
    slug: 'marlboro',
    state: 'NJ',
    serviceFocus: {
      title: 'Chase Cover Replacement',
      description: 'Specialized chase cover replacement for prefab fireplaces with metal housing. Preventing water damage and extending the life of your chimney system.',
      heroTitle: 'Chase Cover Replacement Experts in Marlboro, NJ',
      targetMarket: 'Metal Housing & Prefab Fireplaces',
    },
  },
  'manalapan': {
    name: 'Manalapan',
    slug: 'manalapan',
    state: 'NJ',
    serviceFocus: {
      title: 'Chase Cover Replacement',
      description: 'Professional chase cover installation and replacement services for Manalapan homes with prefab fireplaces. Stop leaks before they cause costly damage.',
      heroTitle: 'Chase Cover Services in Manalapan, NJ',
      targetMarket: 'Metal Housing & Prefab Fireplaces',
    },
  },
  'middletown': {
    name: 'Middletown',
    slug: 'middletown',
    state: 'NJ',
    serviceFocus: {
      title: 'Gas Liner Installation & Restoration',
      description: 'Expert gas liner installation and comprehensive chimney restoration for Middletown properties. Safe, code-compliant gas appliance venting solutions.',
      heroTitle: 'Gas Liner Installation & Chimney Restoration in Middletown, NJ',
      targetMarket: 'Gas Appliances & Full Restoration',
    },
  },
  'east-brunswick': {
    name: 'East Brunswick',
    slug: 'east-brunswick',
    state: 'NJ',
    serviceFocus: {
      title: 'Complete Chimney Services',
      description: 'Comprehensive chimney inspection, cleaning, repair, and installation services for East Brunswick homes. Your trusted local chimney experts.',
      heroTitle: 'Professional Chimney Services in East Brunswick, NJ',
      targetMarket: 'Residential Homeowners',
    },
  },
  'cherry-hill': {
    name: 'Cherry Hill',
    slug: 'cherry-hill',
    state: 'NJ',
    serviceFocus: {
      title: 'Complete Chimney Services',
      description: 'Full-service chimney care for Cherry Hill residents. From inspections to repairs, cleaning to installations, we keep your chimney safe and functional.',
      heroTitle: 'Trusted Chimney Services in Cherry Hill, NJ',
      targetMarket: 'Residential Homeowners',
    },
  },
};

export const CT_CITIES = Object.values(CITY_DATA).filter(city => city.state === 'CT');
export const NJ_CITIES = Object.values(CITY_DATA).filter(city => city.state === 'NJ');

export const getCityData = (slug: string): CityData | undefined => {
  return CITY_DATA[slug];
};
