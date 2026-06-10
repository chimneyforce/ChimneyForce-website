import React from 'react';
import { Shield, Package, Users, Clock } from 'lucide-react';
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
                src="https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-professional.jpg"
                alt="Professional chimney technician with cleaning tools"
                className="rounded-2xl shadow-2xl"
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
    </div>
  );
};
