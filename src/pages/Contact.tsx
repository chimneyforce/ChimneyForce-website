import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { SEO, createBreadcrumbSchema } from '../components/SEO';
import { useRegion } from '../context/RegionContext';
import { submitContactForm } from '../lib/contactSubmission';

export const Contact: React.FC = () => {
  const { region, isCT, isNJ, statePrefix } = useRegion();

  const getRegionText = () => {
    if (isCT) return `Connecticut`;
    if (isNJ) return `New Jersey`;
    return "Connecticut & New Jersey";
  };

  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: statePrefix || '/' },
    { name: 'Contact', url: `${statePrefix}/contact` }
  ]);

  const seoTitle = `Contact Chimney Force | Request Service in ${getRegionText()}`;
  const seoDescription = "Contact Chimney Force for professional chimney services in CT & NJ. Same-day service available. Call now or fill out our quick contact form.";
  const keywords = "contact chimney force, chimney services quote, chimney repair estimate, chimney cleaning appointment, ct nj chimney company";
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'not-sure',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await submitContactForm(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'not-sure',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setError(result.error || 'Failed to submit form. Please try again.');
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData({
        ...formData,
        [name]: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="bg-white">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={`${statePrefix}/contact`}
        structuredData={breadcrumbs}
      />
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4 md:mb-6 leading-tight">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Get in touch to request service or for emergency assistance
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-12">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-black mb-6 leading-tight">Get In Touch</h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-black mb-1 text-base">Phone</h3>
                    <a
                      href={`tel:${region.phoneNumbers[0].replace(/\D/g, '')}`}
                      className="text-base md:text-lg font-medium text-primary hover:underline min-h-[44px] flex items-center"
                    >
                      {region.phoneNumbers[0]}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">Email</h3>
                    <a
                      href="mailto:Chimneyforceinc@gmail.com"
                      className="text-lg font-medium text-primary hover:underline"
                    >
                      Chimneyforceinc@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">Service Areas</h3>
                    <p className="font-medium text-gray-600">{getRegionText()}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">Hours</h3>
                    <p className="font-medium text-gray-600">Sun-Thu: 8am-8pm</p>
                    <p className="font-medium text-gray-600">Fri: 9am-4pm</p>
                    <p className="font-medium text-gray-600">Sat: Closed</p>
                    <p className="font-medium text-gray-600">Emergency service available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-extrabold text-black mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl p-8 text-center">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <p className="text-2xl font-extrabold text-green-800 mb-3">Message Sent!</p>
                  <p className="font-medium text-green-700">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 text-center">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-bold text-gray-700 mb-2">
                      Your name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="John Smith"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/30 focus:border-primary font-medium transition-all min-h-[56px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-bold text-gray-700 mb-2">
                      Best number to reach you? *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      placeholder="(555) 123-4567"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/30 focus:border-primary font-medium transition-all min-h-[56px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-bold text-gray-700 mb-2">
                      Email <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/30 focus:border-primary font-medium transition-all min-h-[56px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-service" className="block text-sm font-bold text-gray-700 mb-2">
                      What can we help you with?
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/30 focus:border-primary font-medium transition-all appearance-none bg-white min-h-[56px]"
                    >
                      <option value="not-sure">Not sure yet - I need help deciding</option>
                      <option value="inspection">Chimney Inspection</option>
                      <option value="cleaning">Chimney Cleaning</option>
                      <option value="repair">Repair Services</option>
                      <option value="liner">Liner Installation</option>
                      <option value="waterproofing">Waterproofing</option>
                      <option value="emergency">Emergency Service</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-bold text-gray-700 mb-2">
                      Anything else we should know? <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Tell us about your chimney concerns..."
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/30 focus:border-primary font-medium transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-red-700 text-white rounded-xl font-extrabold text-base md:text-lg hover:from-red-700 hover:to-primary hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
