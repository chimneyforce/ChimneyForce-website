import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Shield, Package, Phone, Users, Flame } from 'lucide-react';
import { SEO, createServiceSchema, createBreadcrumbSchema } from '../components/SEO';
import { TrustBadgeBar } from '../components/TrustBadgeBar';
import { useRegion } from '../context/RegionContext';
import { submitQuoteRequest } from '../lib/contactSubmission';

const SERVICE_OPTIONS = [
  { value: 'gas-fireplace', label: 'Gas Fireplace Service' },
  { value: 'gas-log-sets', label: 'Gas Log Set Installation' },
  { value: 'pilot-light', label: 'Gas Valve & Pilot Light Repair' },
  { value: 'inspection', label: 'Gas Fireplace Inspection' },
  { value: 'not-sure', label: 'Not sure yet — help me decide' },
  { value: 'other', label: 'Other' },
];

export const GasFireplaceLogSets: React.FC = () => {
  const { statePrefix } = useRegion();

  const [formData, setFormData] = useState({ name: '', phone: '', service: 'gas-fireplace' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const [staticLoaded, setStaticLoaded] = useState(false);
  const [showAnimated, setShowAnimated] = useState(false);

  useEffect(() => {
    if (staticLoaded) {
      const t = setTimeout(() => setShowAnimated(true), 100);
      return () => clearTimeout(t);
    }
  }, [staticLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await submitQuoteRequest(formData);
    setIsSubmitting(false);
    if (result.success) {
      setConfirmationNumber('CF' + Date.now().toString().slice(-6));
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', phone: '', service: 'gas-fireplace' });
        setConfirmationNumber('');
      }, 14000);
    } else {
      setError(result.error || 'Failed to submit. Please try again.');
    }
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: name === 'phone' ? formatPhone(value) : value }));
  };

  const trustBullets = [
    { icon: Shield, label: 'Qualified Licensed & Insured Field Crew' },
    { icon: Package, label: 'Photo Documentation Included' },
    { icon: Clock, label: 'Same-Week Appointments' },
    { icon: Users, label: 'Family-Owned & Operated' },
  ];

  const serviceSchema = createServiceSchema(
    'Gas Fireplace & Log Sets',
    'Professional gas fireplace and log set services including installation, repair, and inspection.',
    statePrefix
  );
  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: statePrefix || '/' },
    { name: 'Gas Fireplace & Log Sets', url: `${statePrefix}/services/gas-fireplace-log-sets` },
  ]);

  return (
    <div>
      <SEO
        title="Gas Fireplace & Log Set Solutions | Chimney Force"
        description="Whether your gas fireplace isn't performing properly or you're considering new gas logs, we'll help you understand your options and find the right solution for your home."
        keywords="gas fireplace service, gas log sets, gas log installation, pilot light repair, gas fireplace inspection"
        canonical={`${statePrefix}/services/gas-fireplace-log-sets`}
        structuredData={[serviceSchema, breadcrumbs]}
      />

      {/* Hero — mirrors Home hero layout exactly */}
      <div className="relative min-h-[600px] md:min-h-[660px] lg:h-[700px] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {!staticLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
          )}
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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-xs font-extrabold shadow-lg uppercase tracking-wide">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-700" />
                </span>
                <Flame className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Gas Fireplace &amp; Log Sets</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                Gas Fireplace &amp; Log Set Solutions For Comfort &amp; Peace Of Mind.
              </h1>

              <p className="text-base md:text-lg font-medium text-gray-200 leading-relaxed max-w-xl animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                Whether your gas fireplace isn't performing properly or you're considering new gas logs, we'll help you understand your options and find the right solution for your home.
              </p>

              <div className="grid grid-cols-2 gap-2 animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
                {trustBullets.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 hover:border-secondary/40 hover:bg-black/50 transition-all duration-200">
                    <div className="w-8 h-8 flex-shrink-0 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm font-bold text-white leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className="inline-flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 shadow-lg">
                  <Users className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-white text-sm font-medium">
                    <strong className="font-extrabold text-white">10,000+</strong> homeowners served
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 italic animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
                Gas fireplace services may be performed by qualified specialty sub-contractors.
              </p>
            </div>

            {/* Right: form */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-white leading-tight">Get Answers From An Expert</h2>
                    <p className="text-gray-400 text-xs font-medium mt-0.5">We call back within 2 hours · No obligation</p>
                  </div>
                </div>

                <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-2">
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-green-800 text-xs font-semibold">
                    <strong>47 homeowners</strong> requested a quote this week
                  </span>
                </div>

                <div className="p-6">
                  {submitted ? (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center animate-scaleIn">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-xl font-extrabold text-green-800 mb-1">
                        {formData.name ? `Got it, ${formData.name.split(' ')[0]}!` : 'Request Confirmed!'}
                      </p>
                      <div className="inline-block bg-white border-2 border-green-200 rounded-lg px-4 py-2 my-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirmation</p>
                        <p className="text-lg font-extrabold text-gray-900">#{confirmationNumber}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">We'll call <strong>{formData.phone}</strong> within 2 hours</p>
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                          <p className="text-red-700 font-medium text-sm">{error}</p>
                        </div>
                      )}

                      <div>
                        <label htmlFor="gf-name" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
                          Your Name *
                        </label>
                        <input
                          id="gf-name"
                          type="text"
                          name="name"
                          placeholder="John Smith"
                          required
                          autoComplete="given-name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[50px] hover:border-gray-300 placeholder:text-gray-300 bg-gray-50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="gf-phone" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
                          Best Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                          <input
                            id="gf-phone"
                            type="tel"
                            name="phone"
                            placeholder="(555) 123-4567"
                            required
                            inputMode="tel"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[50px] hover:border-gray-300 placeholder:text-gray-300 bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="gf-service" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
                          Service Needed
                        </label>
                        <div className="relative">
                          <select
                            id="gf-service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
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
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-primary to-red-700 text-white rounded-xl font-extrabold text-base hover:from-red-700 hover:to-primary active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="relative flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Sending...
                            </>
                          ) : 'Get Answers From An Expert →'}
                        </span>
                      </button>

                      <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <a
                        href="tel:+18883987707"
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-800 text-gray-900 rounded-xl font-extrabold text-base hover:bg-gray-900 hover:text-white active:scale-[0.98] transition-all duration-200 min-h-[56px]"
                      >
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        Schedule My Appointment
                      </a>

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

      <TrustBadgeBar lastBadgeOverride={{ label: 'Qualified Licensed & Insured Field Crew', sub: 'Qualified Specialty Sub-Contractors' }} />
    </div>
  );
};
