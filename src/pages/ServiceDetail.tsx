import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Phone, Shield, Clock, Award, Star, ChevronDown, Package, Users, Sparkles } from 'lucide-react';
import { SEO, createServiceSchema, createBreadcrumbSchema } from '../components/SEO';
import { useRegion } from '../context/RegionContext';
import { MEGA_MENU_SERVICES } from '../data/servicesData';
import { TrustBadgeBar } from '../components/TrustBadgeBar';
import { QuoteForm } from '../components/QuoteForm';
import { submitQuoteRequest } from '../lib/contactSubmission';

function ServiceTeamCopy({ region }: { region: { phoneNumbers: string[] } }) {
  return (
    <>
      <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
        The Chimney Force Team
      </div>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black leading-[1.1] mb-4">
        <span className="bg-white text-gray-900 px-1 box-decoration-clone">Real Pros. Real Results.</span><br />
        <span className="bg-white text-red-600 px-1 box-decoration-clone font-black">Every Single Job.</span>
      </h2>
      <p className="text-sm md:text-base leading-relaxed mb-6">
        <span className="bg-black/60 text-gray-200 px-1 box-decoration-clone">Our crew shows up uniformed, equipped, and ready. Every technician is background-checked, state-certified, and backed by 15+ years of hands-on chimney experience.</span>
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { stat: '15+', label: 'Years Experience' },
          { stat: '10k+', label: 'Homes Served' },
          { stat: '500+', label: '5-Star Reviews' },
          { stat: '100%', label: 'Labor Guaranteed' },
        ].map(({ stat, label }) => (
          <div key={label} className="bg-gray-900/95 border border-white/15 rounded-xl px-3 py-3">
            <div className="text-xl font-black text-red-600 leading-none mb-1">{stat}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>
      <a
        href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-extrabold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
      >
        <Phone className="w-4 h-4" />
        {region.phoneNumbers[0]}
      </a>
    </>
  );
}

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { region, statePrefix, isCT, isNJ } = useRegion();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Hero bg/gif
  const [staticLoaded, setStaticLoaded] = useState(false);
  const [showAnimated, setShowAnimated] = useState(false);

  // Hero form
  const [heroForm, setHeroForm] = useState({ name: '', phone: '', service: 'not-sure' });
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [heroConfirmation, setHeroConfirmation] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (staticLoaded) {
      const t = setTimeout(() => setShowAnimated(true), 100);
      return () => clearTimeout(t);
    }
  }, [staticLoaded]);

  const formatHeroPhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHeroForm(p => ({ ...p, [name]: name === 'phone' ? formatHeroPhone(value) : value }));
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroSubmitting(true);
    setHeroError(null);
    const result = await submitQuoteRequest(heroForm);
    setHeroSubmitting(false);
    if (result.success) {
      setHeroConfirmation('CF' + Date.now().toString().slice(-6));
      setHeroSubmitted(true);
      setTimeout(() => {
        setHeroSubmitted(false);
        setHeroForm({ name: '', phone: '', service: 'not-sure' });
        setHeroConfirmation('');
      }, 14000);
    } else {
      setHeroError(result.error || 'Failed to submit. Please try again.');
    }
  };

  const SERVICE_OPTIONS = [
    { value: 'not-sure', label: 'Not sure yet — help me decide' },
    { value: 'inspection', label: 'Chimney Inspection' },
    { value: 'cleaning', label: 'Chimney Cleaning' },
    { value: 'repair', label: 'Repair Services' },
    { value: 'liner', label: 'Liner Installation' },
    { value: 'waterproofing', label: 'Waterproofing' },
    { value: 'emergency', label: 'Emergency Service' },
    { value: 'other', label: 'Other' },
  ];

  const trustBullets = [
    { icon: Shield, label: 'Fully Insured & Licensed', sub: 'CT & NJ State Certified' },
    { icon: Clock, label: 'Same-Day Service', sub: 'Emergency Available 24/7' },
    { icon: Package, label: 'High Quality Materials', sub: 'Premium Grade Products' },
  ];

  const getRegionText = () => {
    if (isCT) return `Connecticut`;
    if (isNJ) return `New Jersey`;
    return "Connecticut and New Jersey";
  };

  let service = null;
  for (const column of MEGA_MENU_SERVICES) {
    const found = column.services.find(s => s.slug === slug);
    if (found) {
      service = found;
      break;
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-black mb-4">Service Not Found</h1>
          <Link
            to={statePrefix || '/'}
            className="inline-flex items-center text-primary font-bold hover:underline"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const serviceDescription = `Professional ${service.name.toLowerCase()} services for residential and commercial properties in ${getRegionText()}. Licensed, insured, and certified chimney experts providing quality workmanship.`;

  const serviceSchema = createServiceSchema(
    service.name,
    serviceDescription,
    getRegionText(),
    region.phoneNumbers[0]
  );

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: statePrefix || '/' },
    { name: 'Services', url: statePrefix || '/' },
    { name: service.name, url: `${statePrefix}/services/${service.slug}` }
  ]);

  const seoTitle = `${service.name} in ${getRegionText()} | Chimney Force`;
  const seoDescription = `Expert ${service.name.toLowerCase()} services in ${getRegionText()}. Licensed & insured. Same-day service available. Call now!`;
  const keywords = `${service.name.toLowerCase()}, ${service.name.toLowerCase()} ${isCT ? 'ct' : isNJ ? 'nj' : 'ct nj'}, chimney services, chimney force`;

  const faqs = [
    {
      question: `How much does ${service.name.toLowerCase()} cost?`,
      answer: `Great question! Most ${service.name.toLowerCase()} projects range from $200-$350 for standard work, with more complex situations reaching $500-$800. Here's what makes us different: (1) FREE detailed quote with no obligation—we'll tell you exactly what you need, (2) Price locked in before we start—no surprises or hidden fees, (3) We only recommend what you actually need—no upselling. Call us right now for your free quote: ${region.phoneNumbers[0]}.`
    },
    {
      question: 'Do you offer same-day service?',
      answer: 'Yes! We understand chimney issues can be urgent. We offer same-day service for emergency situations and can typically schedule appointments within 24-48 hours for routine services.'
    },
    {
      question: 'Are you licensed and insured?',
      answer: 'Absolutely. We are fully licensed, insured, and certified. Our technicians undergo continuous training and follow all industry safety standards and best practices.'
    },
    {
      question: 'How long will the service take?',
      answer: 'Most services are completed within 1-3 hours, though complex jobs may take longer. We will provide you with a time estimate when we schedule your appointment.'
    },
    {
      question: 'Do you offer any guarantees?',
      answer: 'Yes! All our work comes with a labor guarantee. We stand behind our workmanship and will make it right if you are not completely satisfied.'
    }
  ];

  return (
    <div className="bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-lg focus:font-bold focus:shadow-xl"
      >
        Skip to main content
      </a>

      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={`${statePrefix}/services/${service.slug}`}
        structuredData={[serviceSchema, breadcrumbs]}
      />

      {/* Hero Section */}
      <div className="relative min-h-[600px] md:min-h-[660px] lg:h-[700px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {!staticLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />}
          <img
            src="/hero-fireplace.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            width="1920"
            height="700"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setStaticLoaded(true)}
            style={{ display: showAnimated ? 'none' : 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; setStaticLoaded(true); }}
          />
          {showAnimated && (
            <img
              src="/hero-fireplace.gif"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left: copy */}
            <div className="text-white space-y-5 animate-fadeInUp">
              {/* Urgency pill */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-xs font-extrabold shadow-lg uppercase tracking-wide">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-700" />
                </span>
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Limited slots this week</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                {service.name} Done Right—<span className="drop-shadow-md">Same Day, Guaranteed</span>
              </h1>

              <p className="text-base md:text-lg font-medium text-gray-200 leading-relaxed max-w-xl animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                Licensed &amp; Insured Professionals · Same-Day Service · Labor Guarantee
              </p>

              {/* Trust bullets */}
              <div className="space-y-3 animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
                {trustBullets.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 group-hover:scale-105 transition-all duration-200">
                      <Icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold leading-tight">{label}</div>
                      <div className="text-xs text-gray-300 leading-tight mt-0.5">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-2 text-gray-300 text-sm animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <Users className="w-4 h-4 text-yellow-400" />
                <span><strong className="text-white">10,000+</strong> homeowners served in CT &amp; NJ</span>
              </div>
            </div>

            {/* Right: form */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                {/* Form header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-white leading-tight">Get Your Free Quote</h2>
                    <p className="text-gray-400 text-xs font-medium mt-0.5">We call back within 2 hours · No obligation</p>
                  </div>
                </div>

                {/* Live activity strip */}
                <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-2">
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-green-800 text-xs font-semibold">
                    <strong>47 homeowners</strong> requested a quote this week
                  </span>
                </div>

                {/* Form body */}
                <div className="p-6">
                  {heroSubmitted ? (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center animate-scaleIn">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-xl font-extrabold text-green-800 mb-1">
                        {heroForm.name ? `Got it, ${heroForm.name.split(' ')[0]}!` : 'Request Confirmed!'}
                      </p>
                      <div className="inline-block bg-white border-2 border-green-200 rounded-lg px-4 py-2 my-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirmation</p>
                        <p className="text-lg font-extrabold text-gray-900">#{heroConfirmation}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">We'll call <strong>{heroForm.phone}</strong> within 2 hours</p>
                      <p className="text-xs text-green-600 font-bold mb-4">Sun–Thu 8am–8pm · Fri 8am–4:30pm · Emergency 24/7</p>
                      <div className="bg-white rounded-xl border border-green-100 p-4 text-left">
                        <p className="text-xs font-extrabold text-gray-700 mb-2">What happens next:</p>
                        <ol className="space-y-1.5">
                          {['Our team reviews your request immediately', 'Expert technician calls to discuss your needs', 'We schedule at your most convenient time', 'Professional service — labor guarantee included'].map((s, i) => (
                            <li key={i} className="flex gap-2 text-xs text-gray-600">
                              <span className="font-extrabold text-green-600 w-3 flex-shrink-0">{i + 1}.</span>{s}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleHeroSubmit} className="space-y-4">
                      {heroError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                          <p className="text-red-700 font-medium text-sm">{heroError}</p>
                        </div>
                      )}

                      <div>
                        <label htmlFor="sd-hero-name" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
                          Your Name *
                        </label>
                        <input
                          id="sd-hero-name"
                          type="text"
                          name="name"
                          placeholder="John Smith"
                          required
                          autoComplete="given-name"
                          value={heroForm.name}
                          onChange={handleHeroChange}
                          className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[50px] hover:border-gray-300 placeholder:text-gray-300 bg-gray-50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="sd-hero-phone" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
                          Best Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                          <input
                            id="sd-hero-phone"
                            type="tel"
                            name="phone"
                            placeholder="(555) 123-4567"
                            required
                            inputMode="tel"
                            autoComplete="tel"
                            value={heroForm.phone}
                            onChange={handleHeroChange}
                            className="w-full pl-10 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[50px] hover:border-gray-300 placeholder:text-gray-300 bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="sd-hero-service" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
                          Service Needed
                        </label>
                        <div className="relative">
                          <select
                            id="sd-hero-service"
                            name="service"
                            value={heroForm.service}
                            onChange={handleHeroChange}
                            className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all appearance-none bg-gray-50 focus:bg-white min-h-[50px] hover:border-gray-300 cursor-pointer"
                          >
                            {SERVICE_OPTIONS.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={heroSubmitting}
                        className="w-full bg-gradient-to-r from-primary to-red-700 text-white rounded-xl font-extrabold text-base hover:from-red-700 hover:to-primary active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="relative flex items-center gap-2">
                          {heroSubmitting ? (
                            <>
                              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Sending...
                            </>
                          ) : 'Get My Free Quote →'}
                        </span>
                      </button>

                      <p className="text-center text-xs text-gray-400 font-medium">
                        No obligation · No spam · 100% private
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <TrustBadgeBar />

      <main id="main-content">
      {/* Team Photo Section — full-width image, copy overlaid on desktop */}
      <section className="bg-gray-950">
        <div className="relative w-full overflow-hidden">
          <img
            src="/Add_a_heading_(29).jpg"
            alt="Chimney Force crew standing in front of service van"
            className="w-full h-auto block"
            loading="lazy"
            decoding="async"
          />
          <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-8 xl:right-14 w-[38%]">
            <div className="bg-gray-900/40 border border-white/10 rounded-2xl px-8 py-8 shadow-2xl">
              <ServiceTeamCopy region={region} />
            </div>
          </div>
        </div>
        <div className="lg:hidden bg-gray-900 px-6 py-10">
          <ServiceTeamCopy region={region} />
        </div>
      </section>

      {/* Technician Expertise Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm text-primary px-5 py-2.5 rounded-full text-sm font-extrabold mb-6">
                <Award className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                <span>Certified Professional Service</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-6 leading-tight">
                Meet Your {service.name} Experts
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                Our certified technicians bring 15+ years of experience to every job. We don't just perform services—we build lasting relationships with homeowners who trust us to keep their families safe.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h4 className="font-extrabold text-black mb-1">Rigorous Training & Certification</h4>
                    <p className="text-gray-600 leading-relaxed">Every technician completes 200+ hours of professional certification training and ongoing education.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h4 className="font-extrabold text-black mb-1">Background Checked & Insured</h4>
                    <p className="text-gray-600 leading-relaxed">Full background checks, drug screening, and comprehensive liability insurance on every team member.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h4 className="font-extrabold text-black mb-1">Your Home, Our Priority</h4>
                    <p className="text-gray-600 leading-relaxed">We treat every home with respect—protective floor coverings, shoe covers, and thorough cleanup.</p>
                  </div>
                </div>
              </div>
              <a
                href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-red-700 motion-safe:hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/50"
                aria-label={`Talk to an expert at ${region.phoneNumbers[0]}`}
              >
                <Phone className="w-5 h-5 mr-3" aria-hidden="true" />
                Talk to an Expert
              </a>
            </div>

            {/* Right Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Large featured image */}
                <div className="col-span-2 relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-roof.jpg"
                    alt="Professional chimney technician performing fireplace installation"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white font-extrabold text-lg">Expert Installation & Repair</p>
                    <p className="text-white/90 text-sm">Precision craftsmanship on every job</p>
                  </div>
                </div>

                {/* Two smaller images */}
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src="https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-cleaning-inside.jpg"
                    alt="Thorough chimney cleaning and inspection service"
                    className="w-full h-[200px] object-cover"
                  />
                </div>
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src="https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-professional.jpg"
                    alt="Rooftop chimney inspection by certified professional"
                    className="w-full h-[200px] object-cover"
                  />
                </div>
              </div>

              {/* Floating stats badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 border-4 border-primary/10">
                <div className="text-4xl font-extrabold text-primary mb-1">10,000+</div>
                <div className="text-sm font-bold text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4 md:mb-6">
              Why Choose Our {service.name} Service?
            </h2>
            <p className="text-lg md:text-xl font-medium text-gray-600 max-w-3xl mx-auto">
              Professional service backed by years of experience and thousands of satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-3">Certified Experts</h3>
              <p className="font-medium text-gray-600 leading-relaxed">
                Our technicians are fully certified and undergo continuous training to stay current with industry standards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-3">Labor Guarantee</h3>
              <p className="font-medium text-gray-600 leading-relaxed">
                Every job is backed by our comprehensive labor guarantee. Your satisfaction is our priority.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-3">Fast Response Time</h3>
              <p className="font-medium text-gray-600 leading-relaxed">
                Same-day service available for emergencies. We respond quickly to keep your home safe.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-3">5-Star Rated</h3>
              <p className="font-medium text-gray-600 leading-relaxed">
                Trusted by thousands of homeowners with consistently excellent reviews and ratings.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-3">Transparent Pricing</h3>
              <p className="font-medium text-gray-600 leading-relaxed">
                No hidden fees or surprise charges. You will know the cost upfront before we start work.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-3">Quality Equipment</h3>
              <p className="font-medium text-gray-600 leading-relaxed">
                We use state-of-the-art equipment and proven techniques for superior results every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/10 to-red-700/10 border-4 border-primary rounded-2xl p-8 md:p-12 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-extrabold text-black mb-4">
              Our 100% Satisfaction Guarantee
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              If you're not completely satisfied with our work, we'll make it right—or refund your money. No questions asked. No fine print. That's our promise to you.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
              <div>
                <CheckCircle className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-extrabold text-black mb-1">1-Year Labor Warranty</h4>
                <p className="text-sm text-gray-600">All workmanship guaranteed for one full year</p>
              </div>
              <div>
                <CheckCircle className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-extrabold text-black mb-1">Free Return Visits</h4>
                <p className="text-sm text-gray-600">We'll come back at no charge if any issues arise</p>
              </div>
              <div>
                <CheckCircle className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-extrabold text-black mb-1">No-Risk Quote</h4>
                <p className="text-sm text-gray-600">Get pricing with zero obligation to move forward</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-3">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple 3-step process to get your service completed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 text-white rounded-full flex items-center justify-center font-extrabold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-extrabold text-black mb-2">Contact Us</h3>
              <p className="text-gray-600 text-sm">Call or submit a form and we'll respond within 2 hours</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 text-white rounded-full flex items-center justify-center font-extrabold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-extrabold text-black mb-2">Schedule Service</h3>
              <p className="text-gray-600 text-sm">Pick a time that works for you. Same-day available</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 text-white rounded-full flex items-center justify-center font-extrabold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-extrabold text-black mb-2">Job Complete</h3>
              <p className="text-gray-600 text-sm">Expert service delivered with guaranteed satisfaction</p>
            </div>
          </div>

          {/* Mid-Page Quote Form */}
          <div className="max-w-5xl mx-auto mt-12">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-primary to-red-700 rounded-2xl p-8">
              <div className="text-white">
                <h3 className="text-2xl font-extrabold mb-3">Ready to Get Started?</h3>
                <p className="text-white/90 mb-4">Most appointments scheduled within 24-48 hours. Same-day service available.</p>
                <a
                  href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                  className="inline-flex items-center justify-center bg-white text-primary px-6 py-3 rounded-xl font-extrabold text-base hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {region.phoneNumbers[0]}
                </a>
              </div>
              <QuoteForm defaultService="not-sure" />
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4 md:mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl font-medium text-gray-600">
              Get answers to common questions about our {service.name.toLowerCase()} service
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-gray-50 to-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFAQ === index ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-white/50 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30"
                  aria-expanded={openFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <h3 className={`text-lg md:text-xl font-extrabold pr-4 transition-colors ${
                    openFAQ === index ? 'text-primary' : 'text-black'
                  }`}>
                    {faq.question}
                  </h3>
                  <div className={`transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" aria-hidden="true" />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div
                    className="px-6 md:px-8 pb-6 pt-2 bg-white/50"
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-red-700 to-red-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Ready to Schedule Your {service.name}?
          </h2>
          <p className="text-xl md:text-2xl font-medium text-white/95 mb-10 leading-relaxed">
            Join thousands of satisfied customers who trust us with their chimney service needs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
              className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-gray-100 motion-safe:hover:scale-105 motion-safe:active:scale-95 transition-all duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label={`Call us at ${region.phoneNumbers[0]}`}
            >
              <Phone className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
              <span>Call Now: {region.phoneNumbers[0]}</span>
            </a>
            <Link
              to={`${statePrefix}/contact`}
              className="inline-flex items-center justify-center bg-transparent text-white border-2 border-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-white/10 motion-safe:hover:scale-105 motion-safe:active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              Request Service Online
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="font-bold text-sm">Licensed & Insured</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="font-bold text-sm">Same-Day Available</span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="font-bold text-sm">Labor Guarantee</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 flex-shrink-0 fill-yellow-300 text-yellow-300" aria-hidden="true" />
              <span className="font-bold text-sm">5-Star Rated</span>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Sticky Mobile CTA Bar */}
      {showStickyBar && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 md:hidden pb-safe"
          role="complementary"
          aria-label="Quick action toolbar"
        >
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            <a
              href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
              className="flex-1 bg-primary text-white px-6 py-4 rounded-lg font-extrabold text-center hover:bg-red-700 transition-colors flex items-center justify-center min-h-[56px] focus:outline-none focus:ring-4 focus:ring-primary/50"
              aria-label={`Call ${region.phoneNumbers[0]}`}
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              Call Now
            </a>
            <Link
              to={`${statePrefix}/contact`}
              className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-lg font-extrabold text-center hover:bg-gray-700 transition-colors min-h-[56px] focus:outline-none focus:ring-4 focus:ring-gray-800/50"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
