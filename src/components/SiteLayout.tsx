import React from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { RegionProvider } from '../context/RegionContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { FONT_STYLESHEET_URL } from '../site-head';

export const SiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <noscript>
      <iframe src="https://ob.buzzfufighter.com/ns/7f8b2b3a04dadd1afb951971ee2d9ecf.html?ch=" width="0" height="0" style={{ display: 'none' }} />
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NTWZLSLT" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
      <link href={FONT_STYLESHEET_URL} rel="stylesheet" />
    </noscript>
    <RegionProvider>
      <ScrollToTop />
      <div className="min-h-screen">
        <div className="max-w-[1600px] mx-auto bg-white min-h-screen flex flex-col lg:my-6 lg:rounded-2xl lg:shadow-2xl overflow-clip">
          <Header />
          <main className="grow">{children}</main>
          <ClientOnly>
            <div className="elfsight-app-2d926996-85d2-46e4-a94b-2e8f8bffdc68"></div>
          </ClientOnly>
          <Footer />
        </div>
      </div>
    </RegionProvider>
  </>
);
