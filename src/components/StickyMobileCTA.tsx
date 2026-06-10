import React from 'react';
import { Phone, MessageSquare, Flame } from 'lucide-react';
import { useRegion } from '../context/RegionContext';

export const StickyMobileCTA: React.FC = () => {
  const { region } = useRegion();

  const handleQuickQuote = () => {
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = formElement.querySelector('input');
      if (firstInput) setTimeout(() => (firstInput as HTMLInputElement).focus(), 500);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slideInUp"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Urgency strip */}
      <div className="bg-gray-900 text-white text-center py-1.5 px-4 flex items-center justify-center gap-1.5">
        <Flame className="w-3 h-3 text-secondary flex-shrink-0" />
        <span className="text-xs font-bold text-gray-300">
          <span className="text-secondary font-extrabold">Same-day slots available</span> — Book now before they fill up
        </span>
      </div>

      {/* Button row */}
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="flex gap-2 p-3 max-w-screen-sm mx-auto">
          <a
            href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
            className="flex-1 bg-gradient-to-r from-primary to-red-700 text-white rounded-xl font-extrabold text-sm active:scale-[0.97] transition-all duration-150 shadow-lg flex items-center justify-center gap-2 py-4 hover:from-red-700 hover:to-primary"
            aria-label="Call us now"
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>Call Now</span>
          </a>
          <button
            onClick={handleQuickQuote}
            className="flex-1 bg-gray-900 text-white rounded-xl font-extrabold text-sm active:scale-[0.97] transition-all duration-150 shadow-lg flex items-center justify-center gap-2 py-4 hover:bg-gray-800"
            aria-label="Get a quick quote"
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span>Free Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
