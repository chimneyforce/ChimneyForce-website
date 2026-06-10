import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Search } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useRegion } from '../context/RegionContext';

export const NotFound: React.FC = () => {
  const { region, statePrefix } = useRegion();

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="404 - Page Not Found | Chimney Force"
        description="The page you're looking for could not be found. Return to Chimney Force homepage for professional chimney services in Connecticut and New Jersey."
        canonical="/404"
      />

      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6">
              <Search className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to={statePrefix || '/'}
              className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-red-700 motion-safe:hover:scale-105 motion-safe:active:scale-95 transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/50"
            >
              <Home className="w-5 h-5 mr-3" />
              Return Home
            </Link>
            <a
              href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
              className="inline-flex items-center justify-center bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-gray-50 motion-safe:hover:scale-105 motion-safe:active:scale-95 transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/50"
            >
              <Phone className="w-5 h-5 mr-3" />
              Call {region.phoneNumbers[0]}
            </a>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-left max-w-2xl mx-auto">
            <h3 className="text-xl font-extrabold text-black mb-4">Popular Pages</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                to={statePrefix || '/'}
                className="text-primary hover:text-red-700 font-bold hover:underline"
              >
                → Home
              </Link>
              <Link
                to={`${statePrefix}/about`}
                className="text-primary hover:text-red-700 font-bold hover:underline"
              >
                → About Us
              </Link>
              <Link
                to={`${statePrefix}/contact`}
                className="text-primary hover:text-red-700 font-bold hover:underline"
              >
                → Contact
              </Link>
              <Link
                to={`${statePrefix}/services/chimney-sweep`}
                className="text-primary hover:text-red-700 font-bold hover:underline"
              >
                → Chimney Sweep
              </Link>
              <Link
                to={`${statePrefix}/services/brick-repair`}
                className="text-primary hover:text-red-700 font-bold hover:underline"
              >
                → Brick Repair
              </Link>
              <Link
                to="/sitemap"
                className="text-primary hover:text-red-700 font-bold hover:underline"
              >
                → Site Map
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
