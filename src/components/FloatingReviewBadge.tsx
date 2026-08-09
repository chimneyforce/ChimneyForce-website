import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { loadElfsightPlatform } from '../lib/elfsight';

export const FloatingReviewBadge: React.FC = () => {
  const [elfsightReady, setElfsightReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      loadElfsightPlatform()
        .then(() => {
          if (!cancelled) {
            const w = window as any;
            if (w.eapps?.AppsManager?.reinit) w.eapps.AppsManager.reinit();
          }
        })
        .catch(() => {});
    };

    const markReady = () => {
      if (cancelled) return;
      const el = document.querySelector('.elfsight-app-2d926996-85d2-46e4-a94b-2e8f8bffdc68');
      if (el && el.children.length > 0) {
        setElfsightReady(true);
        clearInterval(poll);
      }
    };

    if ('requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(load, { timeout: 5000 });
      var cleanup = () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(load, 4000);
      var cleanup = () => clearTimeout(timer);
    }

    const poll = setInterval(markReady, 600);

    return () => {
      cancelled = true;
      cleanup();
      clearInterval(poll);
    };
  }, []);

  return (
    <>
      {/* Static badge shown immediately, hidden once Elfsight takes over */}
      {!elfsightReady && (
        <div className="fixed bottom-4 left-4 z-40 animate-fadeInUp" style={{ animationDelay: '1.5s', animationFillMode: 'backwards' }}>
          <a
            href="https://www.google.com/maps/place/Chimney+Force"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-white rounded-full shadow-xl border border-gray-200 px-4 py-2.5 hover:shadow-2xl transition-shadow duration-300 group"
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-extrabold text-gray-900">4.9</span>
              <span className="text-[10px] font-semibold text-gray-500 group-hover:text-primary transition-colors">Google Reviews</span>
            </div>
          </a>
        </div>
      )}

      {/* Real Elfsight widget — invisible until loaded, then Elfsight positions it */}
      <div
        className="elfsight-app-2d926996-85d2-46e4-a94b-2e8f8bffdc68"
        style={{ visibility: elfsightReady ? 'visible' : 'hidden', position: elfsightReady ? undefined : 'absolute' }}
      />
    </>
  );
};
