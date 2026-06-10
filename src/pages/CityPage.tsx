import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SEO, createLocalBusinessSchema, createBreadcrumbSchema } from '../components/SEO';
import { getCityData } from '../data/cityData';
import { CheckCircle, Phone } from 'lucide-react';
import { useRegion } from '../context/RegionContext';

export const CityPage: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const { region } = useRegion();
  const cityData = getCityData(city || '');

  if (!cityData) {
    return <Navigate to="/" replace />;
  }

  const localBusinessSchema = createLocalBusinessSchema(
    cityData.name,
    cityData.state,
    region.phoneNumbers[0],
    `${cityData.name}, ${cityData.state} and surrounding areas`
  );

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cityData.state === 'CT' ? 'Connecticut' : 'New Jersey', url: `/${cityData.state.toLowerCase()}` },
    { name: cityData.name, url: `/${cityData.state.toLowerCase()}/${cityData.slug}` }
  ]);

  const seoTitle = `${cityData.serviceFocus.title} in ${cityData.name}, ${cityData.state} | Chimney Force`;
  const seoDescription = `${cityData.serviceFocus.description.substring(0, 155)}...`;
  const keywords = `chimney services ${cityData.name}, ${cityData.serviceFocus.title.toLowerCase()} ${cityData.name}, chimney sweep ${cityData.name} ${cityData.state}, chimney repair ${cityData.name}, fireplace services ${cityData.name}`;
  const canonicalUrl = `/${cityData.state.toLowerCase()}/${cityData.slug}`;

  return (
    <div>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={canonicalUrl}
        structuredData={[localBusinessSchema, breadcrumbs]}
      />
      <Hero
        title={cityData.serviceFocus.heroTitle}
        subtitle={`Serving ${cityData.name}, ${cityData.state} with Expert Chimney Solutions`}
        backgroundImage="/hero-fireplace.jpg"
        animatedImage="/hero-fireplace.gif"
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-secondary text-white px-4 py-2 rounded-full text-sm font-extrabold mb-4">
                RECOMMENDED FOR {cityData.name.toUpperCase()}
              </div>
              <h2 className="text-4xl font-extrabold text-black mb-6">
                {cityData.serviceFocus.title}
              </h2>
              <p className="text-lg font-medium text-gray-700 mb-6">
                {cityData.serviceFocus.description}
              </p>
              <div className="bg-gray-50 border-l-4 border-primary p-6 mb-6">
                <p className="text-sm font-extrabold text-gray-600 mb-2">TARGET MARKET</p>
                <p className="text-xl font-extrabold text-black">
                  {cityData.serviceFocus.targetMarket}
                </p>
              </div>
              <a
                href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                className="inline-flex items-center space-x-2 bg-primary text-white px-6 md:px-8 rounded-xl font-extrabold text-base md:text-lg hover:bg-red-700 active:bg-red-800 transition shadow-lg min-h-[56px]"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>Call {region.phoneNumbers[0]}</span>
              </a>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-extrabold text-black mb-6">
                Why Choose Chimney Force in {cityData.name}?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-extrabold text-black mb-1">Local Expertise</h4>
                    <p className="font-medium text-gray-600">
                      We understand the unique needs of {cityData.name} properties and provide tailored solutions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-extrabold text-black mb-1">Fast Response Time</h4>
                    <p className="font-medium text-gray-600">
                      Same-day emergency service available for urgent chimney issues.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-extrabold text-black mb-1">Licensed & Insured</h4>
                    <p className="font-medium text-gray-600">
                      Fully licensed, bonded, and insured for your peace of mind.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-extrabold text-black mb-1">Quality Guaranteed</h4>
                    <p className="font-medium text-gray-600">
                      100% satisfaction guarantee on all workmanship and materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-black mb-4">
              Complete Chimney Services in {cityData.name}
            </h2>
            <p className="text-xl font-medium text-gray-600 max-w-3xl mx-auto">
              Beyond our specialty service, we offer comprehensive chimney and fireplace solutions for all your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Chimney Inspections',
                items: ['Level 1 Safety Inspection', 'Level 2 Camera Inspection', 'Drone Roof Analysis'],
              },
              {
                title: 'Cleaning Services',
                items: ['Standard Chimney Sweep', 'Deep Creosote Removal', 'Animal Nest Removal'],
              },
              {
                title: 'Masonry Repairs',
                items: ['Brick & Stone Repair', 'Tuckpointing', 'Crown Repair'],
              },
              {
                title: 'Waterproofing',
                items: ['Leak Diagnostics', 'Flashing Repair', 'Waterproof Sealant'],
              },
              {
                title: 'Liner Installation',
                items: ['Stainless Steel Liners', 'Clay Tile Repair', 'Gas Liner Installation'],
              },
              {
                title: 'Fireplace Services',
                items: ['Gas Log Installation', 'Glass Door Installation', 'Damper Replacement'],
              },
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-extrabold text-black mb-4">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold mb-6">
            Get Expert Chimney Service in {cityData.name} Today
          </h2>
          <p className="text-xl font-medium mb-8 max-w-2xl mx-auto">
            Contact us now for a free consultation and quote. Our team is ready to help with all your chimney needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <a
              href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
              className="w-full sm:w-auto bg-white text-black px-6 md:px-8 rounded-xl font-extrabold text-base md:text-lg hover:bg-gray-200 active:bg-gray-300 transition shadow-lg inline-flex items-center justify-center space-x-2 min-h-[56px]"
            >
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span>{region.phoneNumbers[0]}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
