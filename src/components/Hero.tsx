import React, { useState, useEffect } from 'react';
import { CheckCircle, Shield, Phone, Users, CalendarDays, MapPin } from 'lucide-react';
import { submitQuoteRequest } from '../lib/contactSubmission';
import { useRegion } from '../context/RegionContext';

interface HeroProps {
  title: React.ReactNode;
  subtitle?: string;
  backgroundImage?: string;
  animatedImage?: string;
}

const SERVICE_OPTIONS = [
  { value: 'not-sure',      label: 'Not sure yet — help me decide' },
  { value: 'inspection',    label: 'Chimney Inspection' },
  { value: 'cleaning',      label: 'Chimney Cleaning' },
  { value: 'repair',        label: 'Repair Services' },
  { value: 'liner',         label: 'Liner Installation' },
  { value: 'waterproofing', label: 'Waterproofing' },
  { value: 'emergency',     label: 'Emergency Service' },
  { value: 'other',         label: 'Other' },
];

const TRUST_CHIPS = [
  { icon: Shield,       label: 'Licensed & Insured' },
  { icon: CheckCircle,  label: 'Labor Guarantee' },
  { icon: CalendarDays, label: 'Same-Week Booking' },
  { icon: Users,        label: 'Family-Owned' },
];

export const Hero: React.FC<HeroProps> = ({
  title,
  backgroundImage = '/hero-fireplace.jpg',
  animatedImage   = '/hero-fireplace.gif',
}) => {
  const { region } = useRegion();

  const [formData, setFormData] = useState({ name: '', phone: '', service: 'not-sure' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [staticLoaded, setStaticLoaded] = useState(false);
  const [showAnimated, setShowAnimated] = useState(false);

  useEffect(() => {
    if (staticLoaded && animatedImage) {
      const t = setTimeout(() => setShowAnimated(true), 120);
      return () => clearTimeout(t);
    }
  }, [staticLoaded, animatedImage]);

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
        setFormData({ name: '', phone: '', service: 'not-sure' });
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

  return (
    <div
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: 'calc(100svh - 80px)' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {!staticLoaded && <div className="absolute inset-0 bg-gray-950" />}
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          width="1920" height="900"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setStaticLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; setStaticLoaded(true); }}
        />
        {animatedImage && (
          <img
            src={animatedImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700"
            style={{ opacity: showAnimated ? 1 : 0 }}
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 lg:items-center">

          {/* ── Left: Copy ───────────────────────────────── */}
          <div className="text-white space-y-5">

          {/* Urgency pill + location pill */}
            <div className="flex flex-wrap items-center gap-2 animate-fadeInDown">
              <div className="inline-flex items-center gap-2 bg-secondary text-gray-900 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-md">
                <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="#e40000" stroke="none"/>
                  <circle cx="12" cy="10" r="3" fill="#e89f00" stroke="none"/>
                </svg>
                Serving {region.regionName}
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-[clamp(2rem,5.5vw,3.5rem)] font-black leading-[1.08] tracking-tight animate-fadeInUp"
              style={{ animationDelay: '0.08s' }}
            >
              {title}
            </h1>

            {/* Subline */}
            <p
              className="text-base md:text-lg font-medium text-gray-200 leading-relaxed max-w-xl animate-fadeInUp"
              style={{ animationDelay: '0.16s' }}
            >
              <span className="lg:hidden">Fast, professional solutions — from sweep to full rebuilds.</span>
              <span className="hidden lg:inline">Whether you're dealing with a leak, damaged masonry, smoke issues, or simply want peace of mind — we'll help you understand the condition of your chimney and the best next steps for your home.</span>
            </p>

            {/* Social proof badge */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.22s' }}>
              <div className="inline-flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 shadow-lg">
                <Users className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-white text-sm font-medium">
                  <strong className="font-extrabold text-white">10,000+</strong> homeowners served
                </span>
              </div>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 animate-fadeInUp" style={{ animationDelay: '0.28s' }}>
              {TRUST_CHIPS.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 animate-badgePop backdrop-blur-sm"
                  style={{ animationDelay: `${0.32 + i * 0.07}s` }}
                >
                  <div className="w-5 h-5 flex-shrink-0 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
                    <Icon className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-xs font-bold text-white leading-tight whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Form card ─────────────────────────── */}
          <div className="w-full animate-fadeInRight" style={{ animationDelay: '0.15s' }}>
            <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/8 overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                <h2 className="text-lg font-extrabold text-white leading-tight">Get a Free Consultation</h2>
              </div>

              {/* Live activity strip */}
              <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-green-800 text-xs font-semibold">
                  <strong>47 homeowners</strong> requested a quote this week
                </span>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6">
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
                    <div className="bg-white rounded-xl border border-green-100 p-4 text-left mb-4">
                      <p className="text-xs font-extrabold text-gray-700 mb-2">What happens next:</p>
                      <ol className="space-y-1.5">
                        {[
                          'Our team reviews your request immediately',
                          'Expert technician calls to discuss your needs',
                          'We schedule at your most convenient time',
                          'Professional service — labor guarantee included',
                        ].map((s, i) => (
                          <li key={i} className="flex gap-2 text-xs text-gray-600">
                            <span className="font-extrabold text-green-600 w-3 flex-shrink-0">{i + 1}.</span>{s}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new Event('chimney-open-booking'))}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white rounded-xl font-extrabold text-sm active:scale-[0.98] transition-all duration-200 shadow-md min-h-[50px]"
                    >
                      <CalendarDays className="w-4 h-4 flex-shrink-0" />
                      Schedule My Inspection
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                        <p className="text-red-700 font-medium text-sm">{error}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="hero-name" className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="hero-name"
                        type="text"
                        name="name"
                        placeholder="John Smith"
                        required
                        autoComplete="given-name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[52px] hover:border-gray-300 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="hero-phone" className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">
                        Best Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <input
                          id="hero-phone"
                          type="tel"
                          name="phone"
                          placeholder="(555) 123-4567"
                          required
                          inputMode="tel"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[52px] hover:border-gray-300 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="hero-service" className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">
                        Service Needed
                      </label>
                      <div className="relative">
                        <select
                          id="hero-service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all appearance-none bg-gray-50 focus:bg-white min-h-[52px] hover:border-gray-300 cursor-pointer"
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
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white rounded-xl font-extrabold text-base active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          Chat With An Expert
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                      <Shield className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-gray-500">No obligation &nbsp;·&nbsp; No spam &nbsp;·&nbsp; 100% private</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
