import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const IMAGES = [
  { src: '/chimney-crown-rebuild.webp', label: 'Chimney Crown Rebuild' },
  { src: '/chimney-crown-repair.webp', label: 'Chimney Crown Repair' },
  { src: '/chimney-flashing.webp', label: 'Chimney Flashing' },
  { src: '/chimney-inspection.webp', label: 'Chimney Inspection' },
  { src: '/chimney-liner.webp', label: 'Chimney Liner' },
  { src: '/chimney-masonry-rebuild.webp', label: 'Chimney Masonry Rebuild' },
  { src: '/chimney-waterproofing.webp', label: 'Chimney Waterproofing' },
  { src: '/custom-fireplace-insert.webp', label: 'Custom Fireplace Insert' },
  { src: '/custom-fireplace-insert-2.webp', label: 'Custom Fireplace Insert' },
  { src: '/fireplace-conversion.webp', label: 'Fireplace Conversion' },
  { src: '/fireplace-insert.webp', label: 'Fireplace Insert' },
  { src: '/stainless-steel-chase-cover.webp', label: 'Stainless Steel Chase Cover' },
];

export function WorkShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5" />
            Our Work
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Quality You Can See
          </h2>
          <p className="mt-4 text-gray-500 text-lg font-medium max-w-2xl mx-auto">
            Real projects completed by our team — from chimney repairs to full fireplace installations.
          </p>
        </div>
      </div>

      {/* Mobile: snap-scroll strip */}
      <MobileCarousel />
      {/* Desktop: infinite auto-scroll */}
      <DesktopMarquee />
    </section>
  );
}

function MobileCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (el.scrollWidth / IMAGES.length));
      setActive(Math.min(idx, IMAGES.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="lg:hidden">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4"
      >
        {IMAGES.map((img, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 w-[80vw] sm:w-[60vw] relative group rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-64 sm:h-72 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
              {img.label}
            </span>
          </div>
        ))}
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to image ${i + 1}`}
            onClick={() => {
              const el = scrollRef.current;
              if (!el) return;
              const cardWidth = el.scrollWidth / IMAGES.length;
              el.scrollTo({ left: cardWidth * i, behavior: 'smooth' });
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf: number;
    let pos = 0;
    const speed = 0.5; // px per frame

    const singleSetWidth = track.scrollWidth / 2;

    const step = () => {
      if (!paused) {
        pos += speed;
        if (pos >= singleSetWidth) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const doubled = [...IMAGES, ...IMAGES];

  return (
    <div
      className="hidden lg:block overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={trackRef} className="flex gap-5 will-change-transform" style={{ width: 'max-content' }}>
        {doubled.map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-[340px] h-[240px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
          >
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-sm transition-transform duration-300 group-hover:translate-y-0 translate-y-0">
              {img.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkShowcase;
