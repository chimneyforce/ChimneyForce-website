import React, { useState } from 'react';
import { Sparkles, Search, Droplets, Wrench, Shield, Layers, Flame, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';

const BA_CATEGORIES = [
  {
    label: 'Sweep & Cleaning', icon: Sparkles,
    slides: [{ before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-before.jpg', after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-after.jpg', caption: 'Deep Cleaning & Creosote Removal', location: 'West Hartford, CT' }],
  },
  {
    label: 'Inspections', icon: Search,
    slides: [{ before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg', after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg', caption: 'Level II Chimney Inspection', location: 'Darien, CT' }],
  },
  {
    label: 'Leaks & Water', icon: Droplets,
    slides: [{ before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg', after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg', caption: 'Waterproofing & Leak Repair', location: 'Darien, CT' }],
  },
  {
    label: 'Repair & Masonry', icon: Wrench,
    slides: [{ before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg', after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg', caption: 'Chimney Repair & Restoration', location: 'Greenwich, CT' }],
  },
  {
    label: 'Caps & Covers', icon: Shield,
    slides: [{ before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg', after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg', caption: 'Custom Cap Installation', location: 'Westport, CT' }],
  },
  {
    label: 'Liners', icon: Layers,
    slides: [{ before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg', after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg', caption: 'Stainless Steel Liner Install', location: 'Fairfield, CT' }],
  },
  {
    label: 'Gas & Log Sets', icon: Flame,
    slides: [{ before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-before.jpg', after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-after.jpg', caption: 'Gas Fireplace & Log Set Install', location: 'Stamford, CT' }],
  },
];

interface BeforeAfterTabSectionProps {
  defaultTab?: number;
  singleTab?: boolean;
}

export const BeforeAfterTabSection: React.FC<BeforeAfterTabSectionProps> = ({ defaultTab = 0, singleTab = false }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [slideIndex, setSlideIndex] = useState(0);

  const category = BA_CATEGORIES[activeTab];
  const slide = category.slides[slideIndex];

  const handleTabChange = (i: number) => { setActiveTab(i); setSlideIndex(0); };
  const prev = () => setSlideIndex(i => Math.max(0, i - 1));
  const next = () => setSlideIndex(i => Math.min(category.slides.length - 1, i + 1));

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4 border border-secondary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Real Results
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Before &amp; After
          </h2>
          <p className="mt-3 text-gray-500 font-medium max-w-xl mx-auto text-base">
            Drag the slider to reveal the transformation — real jobs, real results.
          </p>
        </div>

        {!singleTab && (
          <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 sm:px-6 lg:px-8">
              {BA_CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.label}
                    onClick={() => handleTabChange(i)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 border ${
                      activeTab === i
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {cat.label}
                  </button>
                );
              })}
              <span className="flex-shrink-0 w-1" aria-hidden="true" />
            </div>
          </div>
        )}

        <div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <BeforeAfterSlider
              key={`${activeTab}-${slideIndex}`}
              beforeImage={slide.before}
              afterImage={slide.after}
              beforeAlt={`Before ${slide.caption}`}
              afterAlt={`After ${slide.caption}`}
            />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-base font-extrabold text-gray-900">{slide.caption}</p>
              <p className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />{slide.location}
              </p>
            </div>
            {category.slides.length > 1 && (
              <div className="flex items-center gap-3">
                <button onClick={prev} disabled={slideIndex === 0} className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:bg-gray-200 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-gray-500 text-sm font-medium">{slideIndex + 1}/{category.slides.length}</span>
                <button onClick={next} disabled={slideIndex === category.slides.length - 1} className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-30 hover:bg-gray-200 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
