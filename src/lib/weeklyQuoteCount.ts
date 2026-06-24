// Returns a pseudo-random number between 14 and 26 that stays stable for the entire week.
// Changes every Monday so it feels fresh but never looks inflated.
export function getWeeklyQuoteCount(): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const daysFromMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);
  const seed = monday.getFullYear() * 10000 + (monday.getMonth() + 1) * 100 + monday.getDate();
  // Simple LCG to get a stable number from the seed
  const lcg = ((seed * 1664525 + 1013904223) >>> 0) % 13; // 0–12
  return 14 + lcg; // 14–26
}
