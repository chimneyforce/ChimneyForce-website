import React, { lazy, Suspense } from 'react';
import { Shield, Package, Users, Clock, CalendarDays, CheckCircle, Star, Phone } from 'lucide-react';
const WorkShowcase = lazy(() => import('../components/WorkShowcase').then(m => ({ default: m.WorkShowcase })));
const QuoteForm = lazy(() => import('../components/QuoteForm').then(m => ({ default: m.QuoteForm })));
import { SEO, createOrganizationSchema, createBreadcrumbSchema } from '../components/SEO';
import { useRegion } from '../context/RegionContext';

export const About: React.FC = () => {
  const { isCT, isNJ, statePrefix } = useRegion();

  const getRegionText = () => {
    if (isCT) return `Connecticut`;
    if (isNJ) return `New Jersey`;
    return "Connecticut and New Jersey";
  };

  const organizationSchema = createOrganizationSchema();

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: statePrefix || '/' },
    { name: 'About', url: `${statePrefix}/about` }
  ]);

  const seoTitle = `About Chimney Force | Professional Chimney Services in ${getRegionText()}`;
  const seoDescription = "Learn about Chimney Force - Your trusted chimney and fireplace experts serving Connecticut and New Jersey since 2010. Licensed, insured, premium materials with 10,000+ satisfied customers.";
  const keywords = "about chimney force, chimney company ct nj, licensed chimney services, certified chimney sweep, professional chimney repair";

  return (
    <div className="bg-white">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={`${statePrefix}/about`}
        structuredData={[organizationSchema, breadcrumbs]}
      />
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4 md:mb-6 leading-tight">
              About Chimney Force
            </h1>
            <p className="text-lg md:text-xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Your trusted chimney and fireplace experts serving {getRegionText()} since 2010
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center mb-16 md:mb-20">
            <div>
              <img
                src="/CF-team.webp"
                alt="Chimney Force team of certified technicians"
                className="rounded-2xl shadow-2xl"
                width="800"
                height="599"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-black mb-6">
                Professional Service You Can Trust
              </h2>
              <p className="text-lg font-medium text-gray-600 mb-4 leading-relaxed">
                At Chimney Force, we're committed to keeping your home safe and your fireplace functioning perfectly. Our team of certified technicians brings years of experience and expertise to every job.
              </p>
              <p className="text-lg font-medium text-gray-600 mb-6 leading-relaxed">
                We use state-of-the-art equipment and follow industry best practices to deliver exceptional results that exceed your expectations.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="font-medium text-gray-700">Fully Insured & Licensed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="font-medium text-gray-700">Labor Guarantee & Quality Parts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="font-medium text-gray-700">10,000+ Satisfied Customers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="font-medium text-gray-700">Same-Day Emergency Service</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-red-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Our Commitment to Excellence
            </h2>
            <p className="text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              Every project we undertake is backed by our 100% satisfaction guarantee. We don't just meet expectations – we exceed them.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={null}><WorkShowcase /></Suspense>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 480px)" srcSet="/hero-fireplace-480.webp" type="image/webp" />
            <source media="(max-width: 768px)" srcSet="/hero-fireplace-768.webp" type="image/webp" />
            <source media="(max-width: 1280px)" srcSet="/hero-fireplace-1280.webp" type="image/webp" />
            <source media="(min-width: 1281px)" srcSet="/hero-fireplace-1920.webp" type="image/webp" />
            <img src="/hero-fireplace.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" decoding="async" width="1920" height="1080" />
          </picture>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary text-gray-900 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-8">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <Clock className="w-3.5 h-3.5" />
                Limited Slots This Week
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-5">
                Ready to Work With a Team{' '}
                <span className="font-black">You Can Trust?</span>
              </h2>

              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg font-medium">
                Now that you know who we are, let us show you the difference. Schedule your free inspection and see why over 10,000 homeowners choose Chimney Force.
              </p>

              <div className="flex items-center gap-3 mb-8">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="fill-secondary text-secondary w-5 h-5" />)}
                </div>
                <span className="text-white font-extrabold text-sm">5.0</span>
                <span className="text-gray-400 text-sm">· 100+ homeowners trust us</span>
              </div>

              <ul className="space-y-3 mb-10">
                {[
                  { icon: <CheckCircle className="w-4 h-4" />, text: 'Licensed, insured & certified technicians' },
                  { icon: <CheckCircle className="w-4 h-4" />, text: '100% satisfaction guarantee on every job' },
                  { icon: <CheckCircle className="w-4 h-4" />, text: 'Same-day emergency service available' },
                  { icon: <CheckCircle className="w-4 h-4" />, text: 'Free consultation — no obligation' },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-gray-300 text-sm font-medium">
                    <span className="text-secondary flex-shrink-0">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('chimney-open-booking'))}
                  className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-red-700 text-white px-7 py-4 rounded-xl font-extrabold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <CalendarDays className="w-4 h-4" />
                  Book Now
                </button>
                <a
                  href="tel:+18604796036"
                  className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-7 py-4 rounded-xl font-extrabold text-sm transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <Phone className="w-4 h-4" />
                  (860) 479-6036
                </a>
              </div>
            </div>

            <div className="w-full max-w-lg mx-auto lg:mx-0">
              <Suspense fallback={null}><QuoteForm /></Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
