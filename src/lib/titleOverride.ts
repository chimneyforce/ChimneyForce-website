export const parseTitleOverride = (value: string | null): string | null => {
  if (!value) return null;

  const title = value
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return title || null;
};
