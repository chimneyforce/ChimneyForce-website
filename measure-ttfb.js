#!/usr/bin/env node

/**
 * TTFB Measurement Tool
 * Measures Time To First Byte and connection timings for chimneyforce.com
 */

const https = require('https');
const dns = require('dns').promises;

const URL = 'https://chimneyforce.com';

async function measureTTFB() {
  console.log('🔍 Measuring TTFB for:', URL);
  console.log('═'.repeat(60));

  // Measure DNS lookup
  const dnsStart = Date.now();
  try {
    const dnsResult = await dns.resolve('chimneyforce.com');
    const dnsTime = Date.now() - dnsStart;
    console.log(`\n📡 DNS Lookup: ${dnsTime}ms`);
    console.log(`   Resolved to: ${dnsResult.join(', ')}`);
  } catch (err) {
    console.error('❌ DNS Error:', err.message);
  }

  // Measure HTTP request
  return new Promise((resolve) => {
    const startTime = Date.now();
    let connectTime = 0;
    let tlsTime = 0;
    let ttfb = 0;

    const req = https.request(URL, { method: 'GET' }, (res) => {
      ttfb = Date.now() - startTime;

      console.log('\n⚡ Performance Metrics:');
      console.log(`   Connection: ${connectTime}ms`);
      console.log(`   TLS: ${tlsTime}ms`);
      console.log(`   🎯 TTFB: ${ttfb}ms`);
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Server: ${res.headers['server'] || 'Unknown'}`);
      console.log(`   Via: ${res.headers['via'] || 'Direct'}`);
      console.log(`   CDN: ${res.headers['x-vercel-id'] || res.headers['x-nf-request-id'] || res.headers['cf-ray'] || 'None detected'}`);

      // Check caching
      console.log('\n💾 Caching:');
      console.log(`   Cache-Control: ${res.headers['cache-control'] || 'Not set'}`);
      console.log(`   ETag: ${res.headers['etag'] || 'Not set'}`);
      console.log(`   Age: ${res.headers['age'] || 'Not cached'}`);

      // Diagnosis
      console.log('\n📊 Diagnosis:');
      if (ttfb > 1000) {
        console.log('   ⚠️  TTFB > 1s - CRITICAL ISSUE');
        if (!res.headers['x-vercel-id'] && !res.headers['x-nf-request-id'] && !res.headers['cf-ray']) {
          console.log('   ❌ No CDN detected - serving from origin');
          console.log('   💡 Solution: Deploy to Vercel, Netlify, or Cloudflare');
        }
        if (res.headers['x-vercel-cache']) {
          console.log('   ℹ️  Vercel Cache:', res.headers['x-vercel-cache']);
        }
      } else if (ttfb > 500) {
        console.log('   ⚠️  TTFB > 500ms - Needs optimization');
      } else if (ttfb > 200) {
        console.log('   ⚠️  TTFB > 200ms - Acceptable but can improve');
      } else {
        console.log('   ✅ TTFB < 200ms - Excellent!');
      }

      console.log('\n═'.repeat(60));

      res.resume();
      resolve();
    });

    req.on('socket', (socket) => {
      socket.on('connect', () => {
        connectTime = Date.now() - startTime;
      });
      socket.on('secureConnect', () => {
        tlsTime = Date.now() - startTime - connectTime;
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request Error:', err.message);
      resolve();
    });

    req.end();
  });
}

// Run multiple measurements
(async () => {
  console.log('Starting TTFB measurements...\n');

  for (let i = 1; i <= 3; i++) {
    console.log(`\n📍 Measurement ${i}/3`);
    await measureTTFB();
    if (i < 3) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n✅ Measurements complete!');
  console.log('\n💡 Next Steps:');
  console.log('   1. If TTFB > 1s: Redeploy to Vercel/Netlify with config files provided');
  console.log('   2. If CDN not detected: Configure CDN or use static hosting');
  console.log('   3. If cold start detected: Use always-on CDN (not serverless functions)');
})();
