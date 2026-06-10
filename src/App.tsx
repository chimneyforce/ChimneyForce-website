import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegionProvider } from './context/RegionContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';

const CityPage = lazy(() => import('./pages/CityPage').then(module => ({ default: module.CityPage })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then(module => ({ default: module.ServiceDetail })));
const GasFireplaceLogSets = lazy(() => import('./pages/GasFireplaceLogSets').then(module => ({ default: module.GasFireplaceLogSets })));
const Sitemap = lazy(() => import('./pages/Sitemap').then(module => ({ default: module.Sitemap })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));
const AdminReviews = lazy(() => import('./pages/AdminReviews'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <RegionProvider>
        <ScrollToTop />
        <div className="min-h-screen">
          <div className="max-w-[1600px] mx-auto bg-white min-h-screen flex flex-col lg:my-6 lg:rounded-2xl lg:shadow-2xl overflow-clip">
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/ct" element={<Home />} />
                  <Route path="/nj" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  <Route path="/admin/reviews" element={<AdminReviews />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/services/gas-fireplace-log-sets" element={<GasFireplaceLogSets />} />
                  <Route path="/ct/about" element={<About />} />
                  <Route path="/nj/about" element={<About />} />
                  <Route path="/ct/contact" element={<Contact />} />
                  <Route path="/nj/contact" element={<Contact />} />
                  <Route path="/ct/services/gas-fireplace-log-sets" element={<GasFireplaceLogSets />} />
                  <Route path="/nj/services/gas-fireplace-log-sets" element={<GasFireplaceLogSets />} />
                  <Route path="/ct/services/:slug" element={<ServiceDetail />} />
                  <Route path="/nj/services/:slug" element={<ServiceDetail />} />
                  <Route path="/ct/:city" element={<CityPage />} />
                  <Route path="/nj/:city" element={<CityPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <div className="elfsight-app-2d926996-85d2-46e4-a94b-2e8f8bffdc68" data-elfsight-app-lazy></div>
            <Footer />
          </div>
        </div>
      </RegionProvider>
    </Router>
  );
}

export default App;
