import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useRegion } from '../context/RegionContext';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: {
    service: string;
    location: string;
  };
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt = 'Before',
  afterAlt = 'After',
  caption,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [isDragging]);

  const handleStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-ew-resize shadow-2xl touch-none bg-gray-200 select-none"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.opacity = '0';
          }}
          draggable={false}
        />

        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={afterImage}
            alt={afterAlt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = '0';
            }}
            draggable={false}
          />
        </div>

        <div
          className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 text-xs md:text-sm font-extrabold rounded-br-lg uppercase min-h-[32px] flex items-center select-none"
        >
          Before
        </div>

        <div
          className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 text-xs md:text-sm font-extrabold rounded-bl-lg uppercase min-h-[32px] flex items-center select-none"
        >
          After
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-2xl border-2 border-secondary flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
            style={{ left: '50%' }}
          >
            <ArrowLeftRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-primary" />
          </div>
        </div>
      </div>

      {caption && (
        <div className="mt-4 text-center">
          <p className="text-lg font-extrabold text-black">{caption.service}</p>
          <p className="text-sm font-medium text-gray-600">{caption.location}</p>
        </div>
      )}
    </div>
  );
};

export const BeforeAfterGallery: React.FC = () => {
  const { region } = useRegion();
  const projects = [
    {
      beforeImage: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg',
      afterImage: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg',
      beforeAlt: 'Broken and damaged chimney before professional repair in Greenwich, CT',
      afterAlt: 'Restored chimney after professional masonry repair and restoration in Greenwich, CT',
      service: 'Broken Chimney Repair & Restoration',
      location: 'Greenwich, CT',
    },
    {
      beforeImage: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-before.jpg',
      afterImage: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-after.jpg',
      beforeAlt: 'Dirty chimney with creosote buildup before professional cleaning in West Hartford, CT',
      afterAlt: 'Clean chimney interior after professional deep cleaning service in West Hartford, CT',
      service: 'Dirty Chimney Deep Cleaning',
      location: 'West Hartford, CT',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4 md:mb-6 leading-tight px-4">
            See the Difference Quality Makes
          </h2>
        </div>

        <div className="space-y-12 md:space-y-16">
          {projects.map((project, index) => (
            <BeforeAfterSlider
              key={index}
              beforeImage={project.beforeImage}
              afterImage={project.afterImage}
              beforeAlt={project.beforeAlt}
              afterAlt={project.afterAlt}
              caption={{
                service: project.service,
                location: project.location,
              }}
            />
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16 px-4">
          <a
            href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
            className="inline-block bg-gradient-to-r from-primary to-red-700 text-white px-8 md:px-10 rounded-xl font-extrabold text-base md:text-lg hover:from-red-700 hover:to-primary hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-3xl min-h-[56px] flex items-center justify-center"
          >
            Get Similar Results for Your Home
          </a>
        </div>
      </div>
    </section>
  );
};
