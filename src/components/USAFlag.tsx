interface USAFlagProps {
  className?: string;
}

export function USAFlag({ className = 'w-7 h-5' }: USAFlagProps) {
  return (
    <svg className={className} viewBox="0 0 190 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer border */}
      <rect x="1" y="1" width="188" height="98" rx="4" stroke="white" strokeWidth="2" opacity="0.5" />

      {/* Stripes */}
      <rect x="1" y="1" width="188" height="7.7" rx="4" fill="white" fillOpacity="0.15" />
      <rect x="1" y="16.3" width="188" height="7.7" fill="white" fillOpacity="0.15" />
      <rect x="1" y="31.6" width="188" height="7.7" fill="white" fillOpacity="0.15" />
      <rect x="1" y="46.9" width="188" height="7.7" fill="white" fillOpacity="0.15" />
      <rect x="1" y="62.2" width="188" height="7.7" fill="white" fillOpacity="0.15" />
      <rect x="1" y="77.5" width="188" height="7.7" fill="white" fillOpacity="0.15" />
      <rect x="1" y="92.3" width="188" height="6.7" rx="4" fill="white" fillOpacity="0.15" />

      {/* Canton (blue field) */}
      <rect x="1" y="1" width="76" height="54" rx="4" stroke="white" strokeWidth="1.5" opacity="0.6" fill="white" fillOpacity="0.08" />

      {/* Stars - proper 5-pointed star paths arranged in rows */}
      {/* Row 1: 6 stars */}
      <g fill="white" opacity="0.9">
        <polygon points="10,8 11.2,11.6 15,11.6 11.9,13.8 13.1,17.4 10,15.2 6.9,17.4 8.1,13.8 5,11.6 8.8,11.6" />
        <polygon points="23,8 24.2,11.6 28,11.6 24.9,13.8 26.1,17.4 23,15.2 19.9,17.4 21.1,13.8 18,11.6 21.8,11.6" />
        <polygon points="36,8 37.2,11.6 41,11.6 37.9,13.8 39.1,17.4 36,15.2 32.9,17.4 34.1,13.8 31,11.6 34.8,11.6" />
        <polygon points="49,8 50.2,11.6 54,11.6 50.9,13.8 52.1,17.4 49,15.2 45.9,17.4 47.1,13.8 44,11.6 47.8,11.6" />
        <polygon points="62,8 63.2,11.6 67,11.6 63.9,13.8 65.1,17.4 62,15.2 58.9,17.4 60.1,13.8 57,11.6 60.8,11.6" />
      </g>
      {/* Row 2: 5 stars (offset) */}
      <g fill="white" opacity="0.9">
        <polygon points="16.5,20 17.7,23.6 21.5,23.6 18.4,25.8 19.6,29.4 16.5,27.2 13.4,29.4 14.6,25.8 11.5,23.6 15.3,23.6" />
        <polygon points="29.5,20 30.7,23.6 34.5,23.6 31.4,25.8 32.6,29.4 29.5,27.2 26.4,29.4 27.6,25.8 24.5,23.6 28.3,23.6" />
        <polygon points="42.5,20 43.7,23.6 47.5,23.6 44.4,25.8 45.6,29.4 42.5,27.2 39.4,29.4 40.6,25.8 37.5,23.6 41.3,23.6" />
        <polygon points="55.5,20 56.7,23.6 60.5,23.6 57.4,25.8 58.6,29.4 55.5,27.2 52.4,29.4 53.6,25.8 50.5,23.6 54.3,23.6" />
      </g>
      {/* Row 3: 6 stars */}
      <g fill="white" opacity="0.9">
        <polygon points="10,32 11.2,35.6 15,35.6 11.9,37.8 13.1,41.4 10,39.2 6.9,41.4 8.1,37.8 5,35.6 8.8,35.6" />
        <polygon points="23,32 24.2,35.6 28,35.6 24.9,37.8 26.1,41.4 23,39.2 19.9,41.4 21.1,37.8 18,35.6 21.8,35.6" />
        <polygon points="36,32 37.2,35.6 41,35.6 37.9,37.8 39.1,41.4 36,39.2 32.9,41.4 34.1,37.8 31,35.6 34.8,35.6" />
        <polygon points="49,32 50.2,35.6 54,35.6 50.9,37.8 52.1,41.4 49,39.2 45.9,41.4 47.1,37.8 44,35.6 47.8,35.6" />
        <polygon points="62,32 63.2,35.6 67,35.6 63.9,37.8 65.1,41.4 62,39.2 58.9,41.4 60.1,37.8 57,35.6 60.8,35.6" />
      </g>
      {/* Row 4: 4 stars (offset) */}
      <g fill="white" opacity="0.9">
        <polygon points="16.5,44 17.7,47.6 21.5,47.6 18.4,49.8 19.6,53.4 16.5,51.2 13.4,53.4 14.6,49.8 11.5,47.6 15.3,47.6" />
        <polygon points="29.5,44 30.7,47.6 34.5,47.6 31.4,49.8 32.6,53.4 29.5,51.2 26.4,53.4 27.6,49.8 24.5,47.6 28.3,47.6" />
        <polygon points="42.5,44 43.7,47.6 47.5,47.6 44.4,49.8 45.6,53.4 42.5,51.2 39.4,53.4 40.6,49.8 37.5,47.6 41.3,47.6" />
        <polygon points="55.5,44 56.7,47.6 60.5,47.6 57.4,49.8 58.6,53.4 55.5,51.2 52.4,53.4 53.6,49.8 50.5,47.6 54.3,47.6" />
      </g>
    </svg>
  );
}
