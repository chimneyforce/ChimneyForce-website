import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Info, Mail, MapPin, Wrench } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useRegion } from '../context/RegionContext';
import { MEGA_MENU_SERVICES } from '../data/servicesData';
import { CT_CITIES, NJ_CITIES } from '../data/cityData';

export const Sitemap: React.FC = () => {
  const { statePrefix } = useRegion();

  return (
    <div className="bg-white">
      <SEO
        title="Site Map | Chimney Force"
        description="Browse all pages and services offered by Chimney Force. Find chimney services in Connecticut and New Jersey including cleaning, repair, inspection, and more."
        canonical="/sitemap"
      />

      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4 md:mb-6 leading-tight">
              Site Map
            </h1>
            <p className="text-lg md:text-xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Navigate all pages and services offered by Chimney Force
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Pages */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-extrabold text-black">Main Pages</h2>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={statePrefix || '/'}
                    className="text-primary hover:text-red-700 font-bold hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={`${statePrefix}/about`}
                    className="text-primary hover:text-red-700 font-bold hover:underline"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to={`${statePrefix}/contact`}
                    className="text-primary hover:text-red-700 font-bold hover:underline"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services by Category */}
            {MEGA_MENU_SERVICES.map((column, colIndex) => (
              <div key={colIndex} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-extrabold text-black">{column.title}</h2>
                </div>
                <ul className="space-y-2">
                  {column.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        to={`${statePrefix}/services/${service.slug}`}
                        className="text-primary hover:text-red-700 font-bold hover:underline"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Connecticut Cities */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-extrabold text-black">Connecticut</h2>
              </div>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {CT_CITIES.map((city) => (
                  <li key={city.slug}>
                    <Link
                      to={`/ct/${city.slug}`}
                      className="text-primary hover:text-red-700 font-bold hover:underline"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* New Jersey Cities */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-extrabold text-black">New Jersey</h2>
              </div>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {NJ_CITIES.map((city) => (
                  <li key={city.slug}>
                    <Link
                      to={`/nj/${city.slug}`}
                      className="text-primary hover:text-red-700 font-bold hover:underline"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Info */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-extrabold text-black">Additional</h2>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/sitemap"
                    className="text-primary hover:text-red-700 font-bold hover:underline"
                  >
                    Site Map
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-primary to-red-700 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Need Help Finding Something?
            </h2>
            <p className="text-xl mb-6">
              Contact us directly and we'll be happy to assist you
            </p>
            <Link
              to={`${statePrefix}/contact`}
              className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-gray-100 motion-safe:hover:scale-105 motion-safe:active:scale-95 transition-all duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              <Mail className="w-5 h-5 mr-3" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
