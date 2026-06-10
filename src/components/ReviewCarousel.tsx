import React, { useEffect } from 'react';
import { Star } from 'lucide-react';

export const ReviewCarousel: React.FC = () => {
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="py-14 md:py-20 bg-gradient-to-br from-red-50 via-white to-rose-50 relative overflow-hidden">
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

        {/* Elfsight widget */}
        <div className="elfsight-app-ed9f7cb7-bfce-481d-a2fd-c565c4986687" data-elfsight-app-lazy />
      </div>
    </section>
  );
};
