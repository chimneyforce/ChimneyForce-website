import { useEffect } from 'react';
import { loadElfsightPlatform } from '../lib/elfsight';

export const FloatingReviewBadge: React.FC = () => {
  useEffect(() => {
    let cancelled = false;

    const load = () => {
      if (cancelled) return;
      loadElfsightPlatform()
        .then(() => {
          if (cancelled) return;
          const w = window as any;
          if (w.eapps?.AppsManager?.reinit) w.eapps.AppsManager.reinit();
        })
        .catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(load, { timeout: 5000 });
      return () => { cancelled = true; (window as any).cancelIdleCallback(handle); };
    }
    const timer = setTimeout(load, 4000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  return (
    <div className="elfsight-app-2d926996-85d2-46e4-a94b-2e8f8bffdc68" />
  );
};


export { FloatingReviewBadge }