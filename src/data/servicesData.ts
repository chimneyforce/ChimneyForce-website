import { Sparkles, Search, Droplets, Wrench, Shield, Layers, Flame } from 'lucide-react';
import type { ComponentType } from 'react';

export interface ServiceItem {
  name: string;
  slug: string;
  icon: ComponentType<{ className?: string }>;
  tagline: string;
}

export const SERVICES: ServiceItem[] = [
  {
    name: 'Chimney Sweep & Cleaning',
    slug: 'chimney-sweep-cleaning',
    icon: Sparkles,
    tagline: 'Remove creosote, improve draft, stay safe',
  },
  {
    name: 'Chimney Inspections',
    slug: 'chimney-inspections',
    icon: Search,
    tagline: 'Certified level 1 & 2 safety inspections',
  },
  {
    name: 'Chimney Leaks & Water Damage',
    slug: 'chimney-leaks-water-damage',
    icon: Droplets,
    tagline: 'Flashing, waterproofing & leak diagnostics',
  },
  {
    name: 'Chimney Repair & Masonry',
    slug: 'chimney-repair-masonry',
    icon: Wrench,
    tagline: 'Brick repair, tuckpointing & crown restoration',
  },
  {
    name: 'Chimney Caps & Covers',
    slug: 'chimney-caps-covers',
    icon: Shield,
    tagline: 'Custom stainless & copper caps installed',
  },
  {
    name: 'Chimney Liners',
    slug: 'chimney-liners',
    icon: Layers,
    tagline: 'Stainless steel liner installation & relining',
  },
  {
    name: 'Gas Fireplace & Log Sets',
    slug: 'gas-fireplace-log-sets',
    icon: Flame,
    tagline: 'Gas fireplace service, repair & log set installs',
  },
];
