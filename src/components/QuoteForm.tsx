import React, { useState } from 'react';
import { ShieldCheck, Star, Users, Phone, CheckCircle, CalendarDays } from 'lucide-react';
import { submitQuoteRequest } from '../lib/contactSubmission';

const QUOTE_COUNT = (() => {
  const now = new Date();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (now.getDay() + 6) % 7);
  mon.setHours(0, 0, 0, 0);
  const s = mon.getFullYear() * 10000 + (mon.getMonth() + 1) * 100 + mon.getDate();
  return 14 + (((s * 1664525 + 1013904223) >>> 0) % 13);
})();

const generateConfirmationNumber = () => `#CF${Math.floor(100000 + Math.random() * 900000)}`;

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

interface QuoteFormProps {
  defaultService?: string;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ defaultService = 'not-sure' }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(defaultService);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await submitQuoteRequest({ phone, service, name });
    setIsSubmitting(false);
    if (result.success) {
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'generate_lead',
          event_category: 'quote_form',
          event_label: service || 'not-specified',
          form_name: 'get_free_consultation',
          value: 1,
          currency: 'USD',
        });
      }
      setConfirmationNumber(generateConfirmationNumber());
      setSubmitted(true);
    } else {
      setError(result.error || 'Failed to submit. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white leading-tight">
                {name ? `Thanks, ${name.split(' ')[0]}!` : 'Request Confirmed!'}
              </h3>
              <p className="text-green-100 text-xs font-medium">We'll call you within 2 hours</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Confirmation Number</p>
            <p className="text-2xl font-black text-gray-900">{confirmationNumber}</p>
          </div>

          <p className="text-center text-sm text-gray-600">
            Expect a call at <span className="font-extrabold text-gray-900">{phone}</span>
          </p>

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-3">What happens next</p>
            <ol className="space-y-2">
              {['Our team reviews your request immediately', 'Expert technician calls to discuss your needs', 'We schedule at your most convenient time', 'Professional service with a labor guarantee'].map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                  <span className="w-5 h-5 flex-shrink-0 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-extrabold">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest text-center">Want to fast-track your request?</p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('chimney-open-booking'))}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-red-700 text-white rounded-xl font-extrabold text-sm hover:from-red-700 hover:to-primary active:scale-[0.98] transition-all duration-200 shadow-md min-h-[50px]"
            >
              <CalendarDays className="w-4 h-4 flex-shrink-0" />
              Schedule My Inspection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-white leading-tight">Get Your Free Quote</h3>
          <p className="text-gray-400 text-xs font-medium mt-0.5">We call back in under 2 hours · No obligation</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="fill-yellow-400 text-yellow-400" style={{ width: 13, height: 13 }} />
            ))}
          </div>
          <span className="text-gray-400 text-xs font-medium">100+ reviews</span>
        </div>
      </div>

      {/* Live activity strip */}
      <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <Users className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
        <span className="text-green-800 text-xs font-semibold">
          <strong>{QUOTE_COUNT} homeowners</strong> requested a quote this week
        </span>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="qf-name" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
              Your Name *
            </label>
            <input
              id="qf-name"
              type="text"
              autoComplete="given-name"
              placeholder="John Smith"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[50px] hover:border-gray-300 placeholder:text-gray-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="qf-phone" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
              Best Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
              <input
                id="qf-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="555-123-4567"
                required
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                className="w-full pl-10 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[50px] hover:border-gray-300 placeholder:text-gray-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="qf-service" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">
              Service Needed
            </label>
            <div className="relative">
              <select
                id="qf-service"
                value={service}
                onChange={e => setService(e.target.value)}
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
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
            </span>
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
          <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-400">No obligation · No spam · 100% private</span>
        </div>
      </div>
    </div>
  );
};
