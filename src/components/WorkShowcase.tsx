import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      {/* Subtle texture overlay */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-14 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-5">
            <Camera className="w-3.5 h-3.5" />
            Our Work
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Quality You Can <span className="text-primary">See</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg font-medium max-w-2xl mx-auto">
            Real projects completed by our team — from chimney repairs to full fireplace installations.
          </p>
        </div>
      </div>

      <MobileCarousel />
      <DesktopMarquee />
    </section>
  );
}

/* ─── Mobile: full-bleed snap carousel with arrows ─── */

function MobileCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const gap = 16;
      const cardW = el.firstElementChild
        ? (el.firstElementChild as HTMLElement).offsetWidth + gap
        : 1;
      const idx = Math.round(el.scrollLeft / cardW);
      setActive(Math.min(Math.max(idx, 0), IMAGES.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el || !el.firstElementChild) return;
    const gap = 16;
    const cardW = (el.firstElementChild as HTMLElement).offsetWidth + gap;
    el.scrollTo({ left: cardW * idx, behavior: 'smooth' });
  }, []);

  const goPrev = () => scrollTo(Math.max(0, active - 1));
  const goNext = () => scrollTo(Math.min(IMAGES.length - 1, active + 1));

  return (
    <div className="lg:hidden relative z-10">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-5 pb-2"
      >
        {IMAGES.map((img, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 w-[78vw] sm:w-[55vw] relative rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          >
            <div className="relative aspect-[4/5]">
              <img
                src={img.src}
                alt={img.label}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-flex items-center gap-1.5 bg-white text-gray-900 text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {img.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation row: arrows + dots */}
      <div className="flex items-center justify-center gap-4 mt-5 px-5">
        <button
          onClick={goPrev}
          disabled={active === 0}
          aria-label="Previous image"
          className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 transition-all hover:bg-gray-200 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => scrollTo(i)}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <span className={`block rounded-full transition-all duration-300 ${
                i === active
                  ? 'w-7 h-2 bg-primary'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`} />
            </button>
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={active === IMAGES.length - 1}
          aria-label="Next image"
          className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 transition-all hover:bg-gray-200 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Counter */}
      <div className="text-center mt-3">
        <span className="text-xs font-bold text-gray-400 tabular-nums">
          {active + 1} / {IMAGES.length}
        </span>
      </div>
    </div>
  );
}

/* ─── Desktop: infinite marquee with hover pause + image lightbox ─── */

function DesktopMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf: number;
    const speed = 0.6;
    const singleSetWidth = track.scrollWidth / 2;

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += speed;
        if (posRef.current >= singleSetWidth) posRef.current = 0;
        track.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...IMAGES, ...IMAGES];

  return (
    <div
      className="hidden lg:block overflow-hidden relative z-10"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex gap-5 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-[360px] rounded-2xl overflow-hidden group cursor-pointer"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          >
            <div className="relative aspect-[4/5]">
              <img
                src={img.src}
                alt={img.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              {/* Overlay that intensifies on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

              {/* Pill label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                <span className="inline-flex items-center gap-1.5 bg-white text-gray-900 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-lg uppercase tracking-wide transition-transform duration-300 group-hover:-translate-y-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {img.label}
                </span>
              </div>

              {/* Subtle top-right shine on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-bl from-white/5 via-transparent to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkShowcase;
