import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { loadElfsightPlatform } from '../lib/elfsight';

export const ReviewCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | null = null;

    const checkReady = () => {
      const widget = el.querySelector('.elfsight-app-ed9f7cb7-bfce-481d-a2fd-c565c4986687');
      if (widget && widget.children.length > 0) {
        if (!cancelled) setWidgetReady(true);
        if (poll) clearInterval(poll);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadElfsightPlatform().catch(() => {});
          poll = setInterval(checkReady, 500);
          observer.disconnect();
        }
      },
      { rootMargin: '800px' }
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
      if (poll) clearInterval(poll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-14 md:py-20 bg-gradient-to-br from-red-50 via-white to-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(circle, #fee2e2 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-5">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            Verified Customer Reviews
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Real Stories From Real Homeowners
          </h2>
        </div>

        {/* Skeleton placeholder while widget loads */}
        {!widgetReady && (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 bg-gray-200 rounded-full w-28" />
                      <div className="h-2.5 bg-gray-100 rounded-full w-20" />
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded-full w-full" />
                    <div className="h-3 bg-gray-200 rounded-full w-5/6" />
                    <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Elfsight widget */}
        <div
          className="elfsight-app-ed9f7cb7-bfce-481d-a2fd-c565c4986687"
          data-elfsight-app-lazy
          style={!widgetReady ? { position: 'absolute', visibility: 'hidden' } : undefined}
        />
      </div>
    </section>
  );
};
