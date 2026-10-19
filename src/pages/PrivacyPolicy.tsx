import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const PrivacyPolicy: React.FC = () => (
  <div className="bg-white">
    <SEO
      title="Privacy Policy | Chimney Force"
      description="Read the Chimney Force privacy policy, including how we handle contact information and text message consent."
      canonical="/privacy-policy"
      noindex
    />
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Chimney Force</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: October 19, 2026</p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Information we collect</h2>
            <p>When you request service, contact us, or schedule an appointment, we may collect your name, phone number, email address, service details, property information, and any message you choose to send. We may also receive basic website usage information, such as pages visited and device information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">How we use your information</h2>
            <p>We use this information to respond to requests, provide estimates, schedule and perform services, communicate about an appointment, improve our website, and protect our business. We do not sell your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Text messages</h2>
            <p className="mb-3">If you separately check an SMS consent box on our contact form, Chimney Force may send text messages to the phone number you provide. Consent is not a condition of purchasing goods or services.</p>
            <p className="mb-3">Non-marketing messages may relate to your request, appointment, service updates, or customer support. Marketing messages may include promotions, offers, and company updates. Message frequency varies. Message and data rates may apply.</p>
            <p>For help, reply <strong>HELP</strong>. To stop receiving messages, reply <strong>STOP</strong>. You may withdraw consent at any time. Message delivery is subject to your mobile carrier and network availability. These SMS terms apply to recipients in the United States and Canada where the campaign is available.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">How we share information</h2>
            <p>We may share information with service providers who help us operate our website, communicate with customers, process appointments, or deliver messages. Those providers may use information only to perform services for us. We may also disclose information when required by law or needed to protect rights, safety, or security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Your choices and rights</h2>
            <p>You may ask us to review, correct, or delete personal information we hold about you, subject to legal and operational requirements. You may opt out of marketing communications at any time. To request help, email <a className="text-primary font-bold hover:underline" href="mailto:Chimneyforceinc@gmail.com">Chimneyforceinc@gmail.com</a> or call us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-950 mb-3">Contact</h2>
            <p>Chimney Force, INC<br />Chimneyforceinc@gmail.com<br />888-398-7707</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4 text-sm font-bold">
          <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
          <Link to="/contact" className="text-primary hover:underline">Contact Chimney Force</Link>
        </div>
      </article>
    </section>
  </div>
);
