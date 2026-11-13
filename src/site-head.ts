export const FONT_STYLESHEET_URL = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap';

export const siteMeta = [
  { charSet: 'UTF-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' },
  { name: 'theme-color', content: '#C62828' },
  { title: 'Chimney Sweep & Repair in CT, NJ & PA | Chimney Force' },
  { name: 'description', content: 'Chimney sweep, inspection, cleaning and repair across Connecticut, New Jersey and Pennsylvania. Licensed, insured, same-day service and a labor guarantee.' },
  { name: 'keywords', content: 'chimney sweep, chimney cleaning, chimney inspection, chimney repair, fireplace services, Connecticut, New Jersey, Pennsylvania, CT, NJ, PA' },
  { property: 'og:image', content: 'https://chimneyforce.com/CF-team.webp' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:image', content: 'https://chimneyforce.com/CF-team.webp' },
];

export const siteLinks = [
  { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48.png' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
  { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
  { rel: 'preconnect', href: 'https://ob.buzzfufighter.com', crossOrigin: 'anonymous' as const },
  { rel: 'preload', as: 'image', type: 'image/webp', href: '/hero-fireplace-480.webp', media: '(max-width: 480px)', fetchPriority: 'high' as const },
  { rel: 'preload', as: 'image', type: 'image/webp', href: '/hero-fireplace-768.webp', media: '(min-width: 481px) and (max-width: 768px)', fetchPriority: 'high' as const },
  { rel: 'preload', as: 'image', type: 'image/webp', href: '/hero-fireplace-1280.webp', media: '(min-width: 769px) and (max-width: 1280px)', fetchPriority: 'high' as const },
  { rel: 'preload', as: 'image', type: 'image/webp', href: '/hero-fireplace-1920.webp', media: '(min-width: 1281px)', fetchPriority: 'high' as const },
  { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
  { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
];

// Injected by script so the font stylesheet never blocks the first paint.
const montserratLoader = {
  children: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='${FONT_STYLESHEET_URL}';document.head.appendChild(l);})();`,
};

const trackingLoader = {
  children: `window.addEventListener('load', function() {
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NTWZLSLT');

  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18234959413';
  document.head.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18234959413');
  gtag('config', 'AW-18234959413/_HXCCNHq_MQcELXMjfdD', {
    'phone_conversion_number': '203-350-0898'
  });
  window.gtag = gtag;

  var bfScript = document.createElement('script');
  bfScript.async = true;
  bfScript.src = 'https://ob.buzzfufighter.com/i/7f8b2b3a04dadd1afb951971ee2d9ecf.js';
  bfScript.className = 'ct_clicktrue';
  document.head.appendChild(bfScript);
});`,
};

// Loads the Elfsight platform once the browser is idle; the id lets lib/elfsight reuse the same tag.
const elfsightLoader = {
  children: `(function(){function load(){if(document.getElementById('elfsight-platform-sdk'))return;var s=document.createElement('script');s.id='elfsight-platform-sdk';s.src='https://elfsightcdn.com/platform.js';s.async=true;s.dataset.loaded='false';s.addEventListener('load',function(){s.dataset.loaded='true';},{once:true});document.body.appendChild(s);}function schedule(){if(typeof requestIdleCallback==='function'){requestIdleCallback(load,{timeout:2000});}else{setTimeout(load,1500);}}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',schedule);}else{schedule();}})();`,
};

const leadConnectorChat = {
  src: 'https://widgets.leadconnectorhq.com/loader.js',
  'data-resources-url': 'https://widgets.leadconnectorhq.com/chat-widget/loader.js',
  'data-widget-id': '6ad56f03d3ae3b035c4fe3da',
  'data-source': 'WEB_USER',
};

export const siteScripts = [montserratLoader, trackingLoader, elfsightLoader, leadConnectorChat];
