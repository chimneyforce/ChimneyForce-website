import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const TermsOfService: React.FC = () => (
  <div className="bg-white">
    <SEO
      title="Terms of Service | Chimney Force"
      description="Review the Chimney Force website, service request, and text messaging terms of service."
      canonical="/terms-of-service"
      noindex
    />
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Chimney Force</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: October 19, 2026</p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Using this website</h2>
            <p>This website provides information about Chimney Force services and allows visitors to request contact, estimates, and appointments. By using this website, you agree to provide accurate information and to use the website lawfully.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Requests and appointments</h2>
            <p>A form submission is a request, not a guarantee that an appointment, price, or service date is available. We may contact you to confirm details, availability, scope, and pricing. Final services are subject to a separate agreement and any applicable inspection or site conditions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Text messaging terms</h2>
            <p className="mb-3">By separately checking a text message consent box, you agree that Chimney Force may send the type of messages described next to that box to the mobile number you provide. Consent is not required to purchase goods or services, and you can still contact us by phone or email.</p>
            <p className="mb-3">Non-marketing messages may include responses to your inquiry, appointment reminders, service updates, and customer support. Marketing messages may include special offers, discounts, and company updates. Message frequency varies. Message and data rates may apply.</p>
            <p>Reply <strong>HELP</strong> for help and <strong>STOP</strong> to opt out. You can withdraw consent at any time. Opting out of marketing messages does not necessarily stop service-related communications needed to complete a requested appointment, unless you also ask us not to send those messages.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Intellectual property</h2>
            <p>Website content, branding, text, photographs, and graphics belong to Chimney Force or its licensors. You may view the website for personal use, but may not copy, distribute, modify, or commercially use its content without written permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Disclaimers and changes</h2>
            <p>Website information is provided for general information and may change without notice. Chimney Force may update these terms, services, or website content at any time. The current version will be posted on this page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Contact</h2>
            <p>Questions about these terms can be sent to <a className="text-primary font-bold hover:underline" href="mailto:Chimneyforceinc@gmail.com">Chimneyforceinc@gmail.com</a> or by calling 888-398-7707.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4 text-sm font-bold">
          <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
          <Link to="/contact" className="text-primary hover:underline">Contact Chimney Force</Link>
        </div>
      </article>
    </section>
  </div>
);
