import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Flame } from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import { CT_CITIES, NJ_CITIES } from '../data/cityData';

export const Footer: React.FC = () => {
  const { region, statePrefix } = useRegion();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" role="contentinfo">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          <div>
            <Link to={statePrefix || '/'} className="flex items-center mb-6 group" aria-label="Chimney Force Home">
              <img
                src="/chimney_force_fin-01.png"
                alt="Chimney Force - Professional Chimney Services CT & NJ"
                className="h-16 w-auto group-hover:scale-105 transition-transform duration-300 brightness-0 invert"
              />
            </Link>
            <p className="font-medium text-gray-400 mb-6 leading-relaxed text-base">
              Professional chimney and fireplace services across Connecticut and New Jersey.
            </p>
            <div className="space-y-5">
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <div>
                  {region.phoneNumbers.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/\D/g, '')}`}
                      className="block font-medium hover:text-primary transition-colors duration-300 min-h-[44px] flex items-center text-base"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-secondary mt-1 group-hover:scale-110 transition-transform duration-300" />
                <div className="font-medium text-gray-400 leading-relaxed">
                  {region.address}<br />
                  {region.city}, {region.state} {region.zip}
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <Clock className="w-5 h-5 text-secondary mt-1 group-hover:scale-110 transition-transform duration-300" />
                <div className="font-medium text-gray-400 leading-relaxed">
                  Sun-Thu: 8am-8pm<br />
                  Fri: 9am-4pm<br />
                  Sat: Closed<br />
                  Emergency: 24/7
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-extrabold mb-4 md:mb-6 border-b-2 border-primary/30 pb-2">Connecticut Cities</h3>
            <ul className="space-y-2">
              {CT_CITIES.map((city) => (
                <li key={city.slug}>
                  <Link
                    to={`/ct/${city.slug}`}
                    className="font-medium text-gray-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block min-h-[44px] flex items-center text-base"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-extrabold mb-4 md:mb-6 border-b-2 border-primary/30 pb-2">New Jersey Cities</h3>
            <ul className="space-y-2">
              {NJ_CITIES.map((city) => (
                <li key={city.slug}>
                  <Link
                    to={`/nj/${city.slug}`}
                    className="font-medium text-gray-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block min-h-[44px] flex items-center text-base"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-extrabold mb-4 md:mb-6 border-b-2 border-primary/30 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to={statePrefix || '/'} className="font-medium text-gray-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block min-h-[44px] flex items-center text-base">
                  Home
                </Link>
              </li>
              <li>
                <Link to={`${statePrefix}/about`} className="font-medium text-gray-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block min-h-[44px] flex items-center text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={`${statePrefix}/contact`} className="font-medium text-gray-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block min-h-[44px] flex items-center text-base">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="font-medium text-gray-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block min-h-[44px] flex items-center text-base">
                  Site Map
                </Link>
              </li>
              <li>
                <Link to="/ct" className="font-medium text-gray-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block min-h-[44px] flex items-center text-base">
                  Connecticut Services
                </Link>
              </li>
              <li>
                <Link to="/nj" className="font-medium text-gray-400 hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block min-h-[44px] flex items-center text-base">
                  New Jersey Services
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 md:mt-12 pt-8 md:pt-10 text-center">
          <p className="font-medium text-gray-400 text-sm leading-relaxed">
            &copy; {new Date().getFullYear()} Chimney Force, INC. All rights reserved.
          </p>
          <p className="font-medium text-gray-500 text-xs mt-2">
            NJ HIC #13VH14064400 &nbsp;|&nbsp; CT HIC #0704493
          </p>
        </div>
      </div>
    </footer>
  );
};
