export interface Service {
  name: string;
  slug: string;
}

export interface ServiceColumn {
  title: string;
  icon: string;
  services: Service[];
}

export const MEGA_MENU_SERVICES: ServiceColumn[] = [
  {
    title: 'Inspections',
    icon: 'Search',
    services: [
      { name: 'Chimney Inspection (Level 1 - Safety)', slug: 'chimney-inspection' },
      { name: 'Real Estate Inspection (Level 2 - Camera)', slug: 'real-estate-inspection' },
      { name: 'Gas Fireplace Inspection', slug: 'gas-fireplace-inspection' },
      { name: 'Pellet Stove Inspection', slug: 'pellet-stove-inspection' },
      { name: 'Drone Roof & Chimney Analysis', slug: 'drone-analysis' },
    ],
  },
  {
    title: 'Cleaning',
    icon: 'Sparkles',
    services: [
      { name: 'Standard Chimney Sweep', slug: 'chimney-sweep' },
      { name: 'PCR Deep Cleaning (Glazed Creosote)', slug: 'pcr-deep-cleaning' },
      { name: 'Smoke Chamber Cleaning', slug: 'smoke-chamber-cleaning' },
      { name: 'Animal Removal & Nest Blockage', slug: 'animal-removal' },
      { name: 'Dryer Vent Cleaning', slug: 'dryer-vent-cleaning' },
    ],
  },
  {
    title: 'Masonry Repairs',
    icon: 'Wrench',
    services: [
      { name: 'Brick Repair & Replacement', slug: 'brick-repair' },
      { name: 'Stone Restoration', slug: 'stone-restoration' },
      { name: 'Tuckpointing & Repointing', slug: 'tuckpointing' },
      { name: 'Chimney Crown Repair (Cement)', slug: 'crown-repair' },
      { name: 'Firebox Repair (Re-bricking)', slug: 'firebox-repair' },
    ],
  },
  {
    title: 'Waterproofing & Leaks',
    icon: 'Droplets',
    services: [
      { name: 'Chimney Leak Diagnostic', slug: 'leak-diagnostic' },
      { name: 'Flashing Repair (Lead/Copper)', slug: 'flashing-repair' },
      { name: 'Chimney Waterproofing (Sealant)', slug: 'waterproofing' },
      { name: 'Chimney Cap Installation (Stainless/Copper)', slug: 'cap-installation' },
      { name: 'Chase Cover Replacement', slug: 'chase-cover' },
    ],
  },
  {
    title: 'Liners',
    icon: 'Layers',
    services: [
      { name: 'Stainless Steel Liner Installation', slug: 'steel-liner' },
      { name: 'Clay Tile Repair (HeatShield)', slug: 'clay-tile-repair' },
      { name: 'Aluminum Liners (Gas Heaters)', slug: 'aluminum-liners' },
      { name: 'Furnace Flue Relining', slug: 'furnace-relining' },
    ],
  },
  {
    title: 'Gas Fireplace & Log Sets',
    icon: 'Flame',
    services: [
      { name: 'Gas Fireplace & Log Set Solutions', slug: 'gas-fireplace-log-sets' },
    ],
  },
];
