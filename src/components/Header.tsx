import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X, CalendarDays } from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import { SERVICES } from '../data/servicesData';

export const Header: React.FC = () => {
  const { region, statePrefix } = useRegion();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openBooking = () => setIsBookingOpen(true);
    window.addEventListener('chimney-open-booking', openBooking);
    return () => window.removeEventListener('chimney-open-booking', openBooking);
  }, []);

  useEffect(() => {
    if (!isBookingOpen) { setWidgetLoaded(false); return; }

    const markLoaded = () => setWidgetLoaded(true);
    window.addEventListener('eapps-widget-rendered', markLoaded);

    const poll = setInterval(() => {
      const el = document.querySelector('.elfsight-app-b3712e26-a013-4938-b012-63cf2dde6df7');
      if (el && el.children.length > 0) markLoaded();
    }, 400);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.eapps?.AppsManager?.reinit) w.eapps.AppsManager.reinit();

    const fallback = setTimeout(markLoaded, 7000);
    return () => {
      window.removeEventListener('eapps-widget-rendered', markLoaded);
      clearInterval(poll);
      clearTimeout(fallback);
    };
  }, [isBookingOpen]);

  return (
    <header className="sticky top-0 left-0 right-0 z-50" role="banner">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-28">
            <Link to={statePrefix || '/'} className="flex items-center group" aria-label="Chimney Force Home">
              <img
                src="/chimney_force_fin-01.png"
                alt="Chimney Force - Professional Chimney & Fireplace Services"
                className="h-16 lg:h-24 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <Link
                to={statePrefix || '/'}
                className="text-sm font-bold text-gray-700 hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Home
              </Link>

              {/* Services dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="text-sm font-bold text-gray-700 hover:text-primary transition-colors duration-200 py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full flex items-center gap-1"
                >
                  Services
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isServicesOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 w-80">
                    <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 animate-fadeIn">
                      {SERVICES.map((svc) => {
                        const Icon = svc.icon;
                        return (
                          <Link
                            key={svc.slug}
                            to={`${statePrefix}/services/${svc.slug}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group/item"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 flex-shrink-0 bg-primary/8 rounded-lg flex items-center justify-center group-hover/item:bg-primary/15 transition-colors">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900 leading-tight group-hover/item:text-primary transition-colors">{svc.name}</div>
                              <div className="text-xs text-gray-400 leading-tight mt-0.5">{svc.tagline}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to={`${statePrefix}/about`}
                className="text-sm font-bold text-gray-700 hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                About
              </Link>
              <Link
                to={`${statePrefix}/contact`}
                className="text-sm font-bold text-gray-700 hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="hidden lg:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-extrabold text-sm hover:bg-gray-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <CalendarDays className="w-4 h-4 flex-shrink-0" />
                Book Now
              </button>
              <a
                href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                className="hidden lg:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-extrabold text-sm hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="font-extrabold">{region.phoneNumbers[0]}</span>
              </a>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="hidden md:flex lg:hidden items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-extrabold text-sm hover:bg-gray-700 active:scale-95 transition-all duration-200 shadow-md"
              >
                <CalendarDays className="w-4 h-4" />
                Book Now
              </button>
              <a
                href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                className="hidden md:flex lg:hidden items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-extrabold text-sm hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span className="font-extrabold">{region.phoneNumbers[0]}</span>
              </a>

              <a
                href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                className="md:hidden flex items-center gap-2 bg-primary text-white px-3 py-2.5 rounded-xl shadow-md active:scale-95 transition-transform duration-150 relative"
                aria-label={`Call ${region.phoneNumbers[0]}`}
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </a>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="md:hidden flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2.5 rounded-xl font-extrabold text-sm shadow-md active:scale-95 transition-transform duration-150"
                aria-label="Book appointment"
              >
                <CalendarDays className="w-4 h-4 flex-shrink-0" />
                <span>Book</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-700 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-gray-100 rounded-xl transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-120px)] overflow-y-auto">
            <nav className="px-4 py-5 space-y-1">
              <Link
                to={statePrefix || '/'}
                className="flex items-center font-bold text-gray-900 hover:text-primary hover:bg-gray-50 transition-all rounded-xl px-3 min-h-[48px] text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              <div className="pt-2 pb-1">
                <div className="text-xs font-extrabold text-gray-400 uppercase tracking-widest px-3 mb-2">Services</div>
                {SERVICES.map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <Link
                      key={svc.slug}
                      to={`${statePrefix}/services/${svc.slug}`}
                      className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all rounded-xl px-3 min-h-[48px]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-secondary flex-shrink-0" />
                      {svc.name}
                    </Link>
                  );
                })}
              </div>

              <Link
                to={`${statePrefix}/about`}
                className="flex items-center font-bold text-gray-900 hover:text-primary hover:bg-gray-50 transition-all rounded-xl px-3 min-h-[48px] text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to={`${statePrefix}/contact`}
                className="flex items-center font-bold text-gray-900 hover:text-primary hover:bg-gray-50 transition-all rounded-xl px-3 min-h-[48px] text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-3 pb-2">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsBookingOpen(true); }}
                  className="w-full flex items-center justify-center gap-2.5 bg-gray-900 text-white rounded-xl font-extrabold text-base min-h-[56px] hover:bg-gray-700 active:bg-gray-800 transition-colors shadow-lg mb-3"
                >
                  <CalendarDays className="w-5 h-5" />
                  Book Appointment
                </button>
                <a
                  href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                  className="flex items-center justify-center gap-2.5 bg-primary text-white rounded-xl font-extrabold text-base min-h-[56px] hover:bg-red-700 active:bg-red-800 transition-colors shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-extrabold">{region.phoneNumbers[0]}</span>
                </a>
                <p className="text-center text-xs text-gray-400 font-medium mt-2">Sun–Thu 8am–8pm · Fri 8am–4:30pm · Emergency 24/7</p>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Elfsight Booking Modal */}
      {isBookingOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setIsBookingOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style={{ height: 'calc(90vh - 2rem)' }}>
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <span className="font-extrabold text-gray-900">Book an Appointment</span>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
                aria-label="Close booking"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-scroll overflow-x-hidden">
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white z-10 px-8 transition-opacity duration-500 pointer-events-none"
                style={{ opacity: widgetLoaded ? 0 : 1 }}
              >
                <img src="/chimney_force_fin-01.png" alt="Chimney Force" className="h-16 w-auto opacity-90" />
                <p className="text-sm font-bold text-gray-500 tracking-wide">Loading booking calendar…</p>
                <div className="w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-primary rounded-full animate-loading-bar" />
                </div>
                <div className="w-full max-w-sm space-y-3 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-11 bg-gray-100 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.18 }} />
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div ref={widgetRef} className="elfsight-app-b3712e26-a013-4938-b012-63cf2dde6df7" data-elfsight-app-lazy></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
