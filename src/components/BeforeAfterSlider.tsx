import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';

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
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
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
          className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 text-xs md:text-sm font-extrabold rounded-tr-lg rounded-br-lg uppercase min-h-[32px] flex items-center select-none"
        >
          Before
        </div>

        <div
          className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 text-xs md:text-sm font-extrabold rounded-tl-lg rounded-bl-lg uppercase min-h-[32px] flex items-center select-none"
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
