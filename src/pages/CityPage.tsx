import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SEO, createLocalBusinessSchema, createBreadcrumbSchema, createFAQSchema } from '../components/SEO';
import { getCityData } from '../data/cityData';
import { useRegion } from '../context/RegionContext';
import { SERVICES } from '../data/servicesData';
const ReviewCarousel = lazy(() => import('../components/ReviewCarousel').then(m => ({ default: m.ReviewCarousel })));
const QuoteForm = lazy(() => import('../components/QuoteForm').then(m => ({ default: m.QuoteForm })));
const WorkShowcase = lazy(() => import('../components/WorkShowcase').then(m => ({ default: m.WorkShowcase })));
import {
  Shield, Clock, Phone, CheckCircle, Search, Sparkles,
  Wrench, ArrowRight, Star,
  CalendarDays, Users, Award,
  FileText,
} from 'lucide-react';

function useCountUp(target: number, duration = 1800, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return count;
}

const FAQ_ITEMS = [
  { q: 'How often should I have my chimney inspected?', a: 'Most homeowners should have their chimney inspected at least once a year, especially before fireplace season. Regular inspections can help identify small issues before they become costly repairs.' },
  { q: 'What happens during a chimney inspection?', a: 'We evaluate the condition, safety, and performance of your chimney system, document any concerns, and explain our findings with clear recommendations.' },
  { q: 'Will I receive photos of any issues found?', a: 'Yes. We provide photo documentation whenever possible so you can clearly see what we see and better understand our recommendations.' },
  { q: 'What if you find a problem?', a: "We'll explain the issue, answer your questions, and discuss your options. There is never any obligation to move forward with repairs." },
  { q: 'Do you provide written estimates?', a: "Yes. If repairs or additional services are recommended, we'll provide clear pricing and explain the available options." },
  { q: 'How do I know if my chimney needs repairs?', a: 'Common signs include water leaks, cracked bricks, deteriorating mortar, smoke issues, unpleasant odors, rust, or visible damage around the chimney or fireplace.' },
  { q: 'Are you licensed and insured?', a: 'Yes. We are licensed and insured for the services we perform, giving homeowners added peace of mind when choosing our team.' },
  { q: 'Do you offer emergency chimney services?', a: "If you're experiencing an urgent chimney or fireplace issue, contact us and we'll do our best to accommodate your situation as quickly as possible." },
];

function FaqSection({ cityName }: { cityName: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i));

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Common Questions in {cityName}</h2>
          <p className="mt-3 text-gray-600 font-medium">Everything you need to know before booking.</p>
        </div>
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="text-sm md:text-base font-bold text-gray-900 leading-snug">{item.q}</span>
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  open === i ? 'border-primary bg-primary/10 rotate-45' : 'border-gray-200'
                }`}>
                  <ArrowRight className={`w-3.5 h-3.5 transition-all duration-200 ${open === i ? 'text-primary -rotate-45' : 'text-gray-600 rotate-45'}`} />
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed font-medium border-t border-gray-50 bg-gray-50/50 animate-fadeInDown">
                  <p className="pt-4">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCopy({ region }: { region: { phoneNumbers: string[] } }) {
  return (
    <div className="rounded-2xl px-6 py-7 shadow-2xl border border-white/10" style={{ backgroundColor: 'rgba(10,10,10,0.92)' }}>
      <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
        Why Homeowners Choose Us
      </div>
      <h2 className="text-2xl md:text-3xl font-black leading-tight text-white mb-3">
        Helping Property Owners Protect What Matters Most.
      </h2>
      <p className="text-sm leading-relaxed text-gray-300 mb-6">
        Whether you need a simple repair or a more comprehensive solution, we'll help you understand your options and move forward with confidence.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { stat: '15+', label: 'Years Experience' },
          { stat: '1,000+', label: 'Chimneys Served' },
          { stat: '100%', label: 'Labor Guaranteed' },
          { stat: 'Same-Week', label: 'Appointments' },
        ].map(({ stat, label }) => (
          <div key={label} className="bg-white/5 border border-white/15 rounded-xl px-3 py-3">
            <div className="text-xl font-black text-primary leading-none mb-1">{stat}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white px-5 py-3 rounded-xl font-extrabold text-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
        >
          <Phone className="w-4 h-4" />
          {region.phoneNumbers[0]}
        </a>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('chimney-open-booking'))}
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-900 px-5 py-3 rounded-xl font-extrabold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <CalendarDays className="w-4 h-4" />
          Book Now
        </button>
      </div>
    </div>
  );
}

export const CityPage: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const { region, statePrefix } = useRegion();
  const cityData = getCityData(city || '');

  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const [ctaVideoVisible, setCtaVideoVisible] = useState(false);

  const yearsCount = useCountUp(15, 1400, statsStarted);
  const jobsCount = useCountUp(10000, 2000, statsStarted);
  const satisfactionCount = useCountUp(100, 1200, statsStarted);
  const reviewsCount = useCountUp(98, 1600, statsStarted);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
      }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const statsObserver = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setStatsStarted(true); statsObserver.disconnect(); } },
      { threshold: 0.25 }
    );
    if (statsRef.current) statsObserver.observe(statsRef.current);

    const ctaObserver = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setCtaVideoVisible(true); ctaObserver.disconnect(); } },
      { threshold: 0.1, rootMargin: '200px' }
    );
    if (ctaSectionRef.current) ctaObserver.observe(ctaSectionRef.current);

    return () => { revealObserver.disconnect(); statsObserver.disconnect(); ctaObserver.disconnect(); };
  }, []);

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

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const seoTitle = `Chimney Sweep & Repair Services in ${cityData.name}, ${cityData.state} | Chimney Force`;
  const seoDescription = `Expert chimney sweep, inspection, cleaning & repair services in ${cityData.name}, ${cityData.state}. Licensed & insured. Same-day service. Labor guarantee. Call now!`;
  const keywords = `chimney services ${cityData.name}, chimney sweep ${cityData.name}, chimney repair ${cityData.name} ${cityData.state}, fireplace services ${cityData.name}, chimney inspection ${cityData.name}`;
  const canonicalUrl = `/${cityData.state.toLowerCase()}/${cityData.slug}`;

  return (
    <div>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={canonicalUrl}
        structuredData={[localBusinessSchema, breadcrumbs, faqSchema]}
      />

      <Hero
        title={<>Expert Chimney & Fireplace{' '}<span className="text-white font-black">Services in {cityData.name}.</span></>}
        subtitle={`Serving ${cityData.name}, ${cityData.state} with Professional Chimney Solutions`}
      />

      {/* Stats bar */}
      <div ref={statsRef} className="bg-gray-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: yearsCount, suffix: '+', label: 'Years Experience', icon: Award },
              { value: jobsCount, suffix: '+', label: 'Homes Served', icon: Users },
              { value: satisfactionCount, suffix: '%', label: 'Satisfaction Rate', icon: Shield },
              { value: reviewsCount, suffix: '+', label: '5-Star Reviews', icon: Star },
            ].map(({ value, suffix, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-white tabular-nums leading-none">
                    {value.toLocaleString()}{suffix}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Chimney Services in {cityData.name}
            </h2>
            <p className="mt-4 text-gray-600 text-lg font-medium max-w-2xl mx-auto">
              Select a service to learn more about what we do and how we can help protect your home.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {SERVICES.map(({ icon: Icon, name, slug }, i) => (
              <Link
                key={slug}
                to={`${statePrefix}/services/${slug}`}
                className={`reveal reveal-delay-${Math.min(i + 1, 6)} group flex flex-col gap-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-primary rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm font-extrabold text-gray-900 group-hover:text-primary transition-colors duration-200 leading-snug flex-1">{name}</span>
                <span className="inline-flex items-center gap-1 text-primary font-extrabold text-xs group-hover:gap-2 transition-all duration-200">
                  Learn More <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Team photo section */}
      <section className="bg-gray-950 overflow-hidden">
        <div className="relative">
          <img
            src="/CF-team.webp"
            alt="Chimney Force crew standing in front of service van"
            className="w-full h-auto block"
            width="800"
            height="599"
            loading="lazy"
            decoding="async"
          />
          <div className="hidden lg:block absolute bottom-8 xl:bottom-14 left-1/2 -translate-x-1/2 w-[55%] max-w-2xl">
            <TeamCopy region={region} />
          </div>
        </div>
        <div className="lg:hidden px-5 py-10">
          <TeamCopy region={region} />
        </div>
      </section>

      {/* Work showcase */}
      <Suspense fallback={null}><WorkShowcase /></Suspense>

      {/* Process timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
              <CheckCircle className="w-3.5 h-3.5" />
              Our Process
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">What To Expect</h2>
            <p className="mt-3 text-gray-600 font-medium">Five easy steps from call to completed job.</p>
          </div>

          <ol className="relative border-l-2 border-gray-100 ml-5 space-y-0">
            {[
              { n: 1, icon: CalendarDays, title: 'Schedule Your Inspection', desc: 'Choose a convenient appointment time online or by phone.' },
              { n: 2, icon: Search, title: 'We Evaluate The Problem', desc: "We'll inspect your chimney system and document any concerns." },
              { n: 3, icon: Award, title: 'Review Photos & Findings', desc: "We'll show you exactly what we found — no guesswork." },
              { n: 4, icon: CheckCircle, title: 'Receive Honest Recommendations', desc: 'Get clear options and transparent pricing, zero pressure.' },
              { n: 5, icon: Shield, title: 'Move Forward With Confidence', desc: 'Address issues now or plan for future maintenance on your terms.' },
            ].map(({ n, icon: Icon, title, desc }, i, arr) => (
              <li key={n} className={`reveal reveal-delay-${i + 1} relative pl-12 ${i < arr.length - 1 ? 'pb-10' : ''}`}>
                <span className="absolute -left-[21px] top-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-extrabold shadow-md ring-4 ring-white">
                  {n}
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <h3 className="text-base font-extrabold text-gray-900 leading-tight">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviews */}
      <Suspense fallback={null}><ReviewCarousel /></Suspense>

      {/* FAQ */}
      <FaqSection cityName={cityData.name} />

      {/* Final CTA */}
      <section ref={ctaSectionRef} className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 480px)" srcSet="/hero-fireplace-480.webp" type="image/webp" />
            <source media="(max-width: 768px)" srcSet="/hero-fireplace-768.webp" type="image/webp" />
            <source media="(max-width: 1280px)" srcSet="/hero-fireplace-1280.webp" type="image/webp" />
            <source media="(min-width: 1281px)" srcSet="/hero-fireplace-1920.webp" type="image/webp" />
            <img src="/hero-fireplace.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" decoding="async" width="1920" height="1080" />
          </picture>
          {ctaVideoVisible && (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover absolute inset-0"
              aria-hidden="true"
            >
              <source src="/hero-fireplace.webm" type="video/webm" />
              <source src="/hero-fireplace.mp4" type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 bg-secondary text-gray-900 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-8">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <Clock className="w-3.5 h-3.5" />
                Limited Slots This Week
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-5">
                Get Expert Chimney Service in {cityData.name}{' '}
                <span className="font-black">Today</span>
              </h2>

              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg font-medium">
                Many chimney issues start small and go unnoticed until they become expensive repairs. A professional inspection gives you peace of mind and clear next steps.
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
                  { icon: <Search className="w-4 h-4" />, text: 'Free consultation — no obligation' },
                  { icon: <CheckCircle className="w-4 h-4" />, text: 'Photo documentation of every job' },
                  { icon: <FileText className="w-4 h-4" />, text: 'Written condition report' },
                  { icon: <Wrench className="w-4 h-4" />, text: 'Recommendations when needed' },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-gray-300 text-sm font-medium">
                    <span className="text-secondary flex-shrink-0">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('chimney-open-booking'))}
                className="inline-flex items-center gap-3 bg-primary hover:bg-red-700 text-white px-7 py-4 rounded-xl font-extrabold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                <CalendarDays className="w-4 h-4" />
                Book Now
              </button>
            </div>

            <div className="w-full max-w-lg mx-auto lg:mx-0 reveal reveal-delay-2">
              <Suspense fallback={null}><QuoteForm /></Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
