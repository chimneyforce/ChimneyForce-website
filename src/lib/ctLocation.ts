import ctLocations from '../data/ctLocations.json';

const locations: Record<string, string> = ctLocations;

const findLocation = (locationId: string | null): string | null => {
  if (!locationId) return null;

  return locations[locationId.trim()] ?? null;
};

export const resolveCtLocation = (
  interestLocationId: string | null,
  physicalLocationId: string | null
): string | null => {
  return findLocation(interestLocationId) ?? findLocation(physicalLocationId);
};
