import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X, Search, Sparkles, Wrench, Droplets, Layers, Flame, CalendarDays } from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import { MEGA_MENU_SERVICES } from '../data/servicesData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Sparkles,
  Wrench,
  Droplets,
  Layers,
  Flame,
};

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

    // 1. Elfsight's official rendered event
    window.addEventListener('eapps-widget-rendered', markLoaded);

    // 2. Poll every 400ms — catches shadow DOM / class-based render Elfsight uses
    const poll = setInterval(() => {
      const el = document.querySelector('.elfsight-app-b3712e26-a013-4938-b012-63cf2dde6df7');
      if (el && el.children.length > 0) {
        markLoaded();
      }
    }, 400);

    // 3. Kick Elfsight's manager if the script already ran before the div mounted
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.eapps?.AppsManager?.reinit) {
      w.eapps.AppsManager.reinit();
    }

    // 4. Hard fallback — dismiss loader at most after 7s
    const fallback = setTimeout(markLoaded, 7000);

    return () => {
      window.removeEventListener('eapps-widget-rendered', markLoaded);
      clearInterval(poll);
      clearTimeout(fallback);
    };
  }, [isBookingOpen]);

  return (
    <header className="sticky top-0 left-0 right-0 z-50" role="banner">
      {/* Main nav bar */}
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
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-4 z-50 w-screen max-w-[95vw] lg:max-w-5xl xl:max-w-6xl px-4">
                    <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 p-6 lg:p-8 animate-fadeIn">
                      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-5">
                        {MEGA_MENU_SERVICES.map((column, idx) => {
                          const IconComponent = iconMap[column.icon];
                          const isSingleLink = column.services.length === 1;
                          return (
                            <div key={idx}>
                              <h3 className="text-xs font-extrabold text-gray-900 mb-3 border-b-2 border-secondary/40 pb-2 flex items-center gap-1.5">
                                {IconComponent && <IconComponent className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                                <span className="truncate">{column.title}</span>
                              </h3>
                              {isSingleLink ? (
                                <Link
                                  to={`${statePrefix}/services/${column.services[0].slug}`}
                                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:text-red-700 transition-colors py-1 leading-snug"
                                  onClick={() => setIsServicesOpen(false)}
                                >
                                  <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                                  Learn More
                                </Link>
                              ) : (
                                <ul className="space-y-1.5">
                                  {column.services.map((service) => (
                                    <li key={service.slug}>
                                      <Link
                                        to={`${statePrefix}/services/${service.slug}`}
                                        className="text-xs font-medium text-gray-600 hover:text-primary transition-colors block py-1 leading-snug hover:translate-x-0.5 transition-transform"
                                        onClick={() => setIsServicesOpen(false)}
                                      >
                                        {service.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
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
              {/* Desktop: Book Now + Phone */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="hidden lg:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-extrabold text-sm hover:bg-gray-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <CalendarDays className="w-4 h-4 flex-shrink-0" />
                Book Now
              </button>
              {/* Desktop CTA */}
              <a
                href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                className="hidden lg:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-extrabold text-sm hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="font-extrabold">{region.phoneNumbers[0]}</span>
              </a>

              {/* Tablet: Book Now + Phone */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="hidden md:flex lg:hidden items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-extrabold text-sm hover:bg-gray-700 active:scale-95 transition-all duration-200 shadow-md"
              >
                <CalendarDays className="w-4 h-4" />
                Book Now
              </button>
              {/* Tablet CTA */}
              <a
                href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                className="hidden md:flex lg:hidden items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-extrabold text-sm hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span className="font-extrabold">{region.phoneNumbers[0]}</span>
              </a>

              {/* Mobile call button — shows number, not just icon */}
              <a
                href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                className="md:hidden flex items-center gap-2 bg-primary text-white px-3 py-2.5 rounded-xl shadow-md active:scale-95 transition-transform duration-150 relative"
                aria-label={`Call ${region.phoneNumbers[0]}`}
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </a>

              {/* Mobile Book Now button */}
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
                {MEGA_MENU_SERVICES.map((column) => {
                  const IconComponent = iconMap[column.icon];
                  const isSingleLink = column.services.length === 1;
                  return (
                    <div key={column.title} className="mb-3">
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        {IconComponent && <IconComponent className="w-4 h-4 text-secondary flex-shrink-0" />}
                        <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wide">{column.title}</span>
                      </div>
                      {isSingleLink ? (
                        <Link
                          to={`${statePrefix}/services/${column.services[0].slug}`}
                          className="flex items-center gap-2 text-sm font-extrabold text-primary hover:text-red-700 hover:bg-gray-50 transition-all rounded-xl px-3 min-h-[44px]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Flame className="w-4 h-4 flex-shrink-0" />
                          Learn About Gas Fireplace Services
                        </Link>
                      ) : (
                        <ul className="space-y-0.5">
                          {column.services.slice(0, 3).map((service) => (
                            <li key={service.slug}>
                              <Link
                                to={`${statePrefix}/services/${service.slug}`}
                                className="flex items-center text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all rounded-xl px-3 min-h-[44px]"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {service.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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

      {/* Elfsight Appointment Booking Modal */}
      {isBookingOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setIsBookingOpen(false); }}
        >
          {/* Modal shell — fully rounded, clips all children */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style={{ height: 'calc(90vh - 2rem)' }}>

            {/* Header bar */}
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

            {/* Body — overflow-y-scroll reserves scrollbar gutter immediately so it never appears late */}
            <div className="relative flex-1 overflow-y-scroll overflow-x-hidden">
              {/* Loader overlay — sits on top until widget renders, then fades out */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white z-10 px-8 transition-opacity duration-500 pointer-events-none"
                style={{ opacity: widgetLoaded ? 0 : 1 }}
              >
                <img
                  src="/chimney_force_fin-01.png"
                  alt="Chimney Force"
                  className="h-16 w-auto opacity-90"
                />
                <p className="text-sm font-bold text-gray-500 tracking-wide">Loading booking calendar…</p>

                {/* Animated progress bar — w-1/4 bar sweeps via translateX inside overflow-hidden */}
                <div className="w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-primary rounded-full animate-loading-bar" />
                </div>

                {/* Skeleton rows */}
                <div className="w-full max-w-sm space-y-3 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-11 bg-gray-100 rounded-xl animate-pulse"
                      style={{ opacity: 1 - i * 0.18 }}
                    />
                  ))}
                </div>
              </div>

              {/* Widget — always rendered and visible so Elfsight's IntersectionObserver fires */}
              <div className="p-4">
                {/* Elfsight Appointment Booking | Chimney Force Appointment Booking */}
                <div ref={widgetRef} className="elfsight-app-b3712e26-a013-4938-b012-63cf2dde6df7" data-elfsight-app-lazy></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
