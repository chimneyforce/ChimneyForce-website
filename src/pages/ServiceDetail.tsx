import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle, Phone, Shield, Award, Star,
  ArrowRight, Users, Sparkles, MapPin, CalendarDays, Info,
} from 'lucide-react';
import { SEO, createServiceSchema, createBreadcrumbSchema, createFAQSchema } from '../components/SEO';
import { useRegion } from '../context/RegionContext';
import { SERVICES } from '../data/servicesData';
import { ReviewCarousel } from '../components/ReviewCarousel';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { BeforeAfterTabSection } from '../components/BeforeAfterTabSection';
import { submitQuoteRequest } from '../lib/contactSubmission';
import { parseTitleOverride } from '../lib/titleOverride';
import { resolveCtLocation } from '../lib/ctLocation';

const QUOTE_COUNT = (() => {
  const now = new Date();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (now.getDay() + 6) % 7);
  mon.setHours(0, 0, 0, 0);
  const s = mon.getFullYear() * 10000 + (mon.getMonth() + 1) * 100 + mon.getDate();
  return 14 + (((s * 1664525 + 1013904223) >>> 0) % 13);
})();

/* ─────────────────────────────────────────────────────────── */
/*  Per-service content                                        */
/* ─────────────────────────────────────────────────────────── */

interface ServiceContent {
  hero: {
    headline: string;
    offer: string;
    subheadline: string;
    trustBadges: string[];
  };
  needSection: {
    title: string;
    items: string[];
    ctaLabel: string;
  };
  whyUs: {
    headline: string;
    body: string;
    bullets: string[];
  };
  included: {
    headline: string;
    items: string[];
  };
  offer: {
    headline: string;
    items: string[];
  };
  faqs: { q: string; a: string }[];
  finalCta: {
    headline: string;
    subheadline: string;
    callout: string;
    bullets: string[];
  };
  beforeAfter: {
    before: string;
    after: string;
    caption: string;
    location: string;
  };
}

const CONTENT: Record<string, ServiceContent> = {
  'chimney-sweep-cleaning': {
    hero: {
      headline: 'Protect Your Home From Chimney Fires',
      offer: 'Professional Chimney Sweeping & Safety Inspection Starting at $99',
      subheadline: 'Remove dangerous creosote, boost performance, and ensure seasonal safety.',
      trustBadges: ['Certified Pros', 'Book Same-Week', 'Mess-Free Service', 'Before/After Photos'],
    },
    needSection: {
      title: 'It May Be Time For A Chimney Sweep If:',
      items: [
        "It's been over a year since your last cleaning",
        'You smell smoke even when the fireplace isn\'t in use',
        'Smoke enters your home when burning fires',
        'You see black soot buildup',
        "You've recently purchased your home",
        "Your fireplace isn't drafting properly",
      ],
      ctaLabel: 'Schedule My Inspection',
    },
    whyUs: {
      headline: 'Local Chimney Experts You Can Count On',
      body: "For over 15 years, we've helped homeowners keep their fireplaces clean, safe, and ready for the season.",
      bullets: ['Family-Owned & Operated', 'Licensed & Insured', 'Thousands of Chimneys Serviced', 'Clean, Respectful Technicians', 'Before & After Photos Included', 'Honest Recommendations — No Pressure'],
    },
    included: {
      headline: 'Every Chimney Sweep Includes',
      items: ['Complete chimney sweeping', 'Creosote removal', 'Fireplace cleaning', 'Safety inspection', 'Draft check', 'Before & after photos'],
    },
    offer: {
      headline: 'Chimney Sweep + Fireplace Safety Check Included',
      items: ['Professional chimney sweeping', 'Safety inspection', 'Photo Documentation Included', 'Written condition report'],
    },
    faqs: [
      { q: 'How often should I have my chimney cleaned?', a: 'Most homeowners should have their chimney inspected and cleaned at least once a year, especially if they use their fireplace regularly.' },
      { q: 'How long does a chimney sweep take?', a: 'Most chimney sweep appointments take between 45 and 90 minutes, depending on the condition of the chimney.' },
      { q: 'Will there be dust or a mess in my home?', a: 'No. We use professional containment equipment and take extra care to keep your home clean throughout the process.' },
      { q: 'How do I know if my chimney needs cleaning?', a: 'Common signs include: strong smoke odors, black soot buildup, poor fireplace draft, smoke entering the room, or more than one year since the last cleaning.' },
      { q: 'What is included with the chimney sweep?', a: 'Every service includes a professional chimney sweep, safety inspection, before-and-after photos, and recommendations if any issues are found.' },
      { q: 'What if you find a problem during the inspection?', a: "If we find any concerns, we'll show you photos, explain the issue clearly, and provide options. There is never any obligation to move forward with repairs." },
      { q: 'Do I need to be home during the appointment?', a: 'Yes, someone 18 or older should be present to provide access and review the inspection findings with our technician.' },
      { q: 'How soon can I schedule an appointment?', a: 'In most cases, we can schedule appointments within a few days. During peak fireplace season, availability may be more limited.' },
      { q: 'Are your technicians licensed and insured?', a: 'Yes. Our team is fully insured and trained to perform chimney cleaning and inspection services safely and professionally.' },
      { q: 'How much does a chimney sweep cost?', a: 'Most chimney sweep services range from $99–$149, depending on the type, condition, and accessibility of the chimney. Contact us today for a quick quote and availability.' },
      { q: 'Why choose us instead of another chimney company?', a: "Because we don't just clean chimneys—we help homeowners understand the condition of their fireplace system. Every visit includes a safety inspection, before-and-after photos, and honest recommendations with no pressure." },
    ],
    finalCta: {
      headline: 'Enjoy Your Fireplace With Confidence',
      subheadline: "Whether it's been a year or several years since your last chimney cleaning, our team will make sure your chimney is clean, safe, and ready to use.",
      callout: 'Book Your Chimney Sweep Today',
      bullets: ['Convenient Scheduling', 'Safety Inspection Included', 'Before & After Photos'],
    },
    beforeAfter: {
      before: '/Sweep-before.jpeg',
      after: '/Sweep-after.jpeg',
      caption: 'Deep Cleaning & Creosote Removal',
      location: 'West Hartford, CT',
    },
  },

  'chimney-inspections': {
    hero: {
      headline: 'Chimney Inspections For Safety, Performance & Peace Of Mind',
      offer: 'Get Clear Answers About The Condition Of Your Chimney',
      subheadline: 'Overdue for an inspection? We\'ll make sure your fireplace is safe and ready for the season.',
      trustBadges: ['Full Evaluations', 'Photos Included', 'Book Same-Week', 'Pro Inspectors'],
    },
    needSection: {
      title: 'Is It Time For A Chimney Inspection?',
      items: [
        "It's been over a year since your last inspection",
        "You're planning to use your fireplace this season",
        "You've noticed smoke or drafting issues",
        'You recently experienced a chimney leak',
        "Your fireplace isn't performing as expected",
        'You want to identify problems before they become expensive repairs',
      ],
      ctaLabel: 'Schedule My Inspection',
    },
    whyUs: {
      headline: 'Inspections You Can Actually Trust',
      body: 'Our certified inspectors provide clear, honest findings — never up-selling repairs you don\'t need.',
      bullets: ['Licensed & Insured', 'Thousands of Chimneys Evaluated', 'Photos Included', 'Licensed & Insured', 'No High-Pressure Sales', 'Written Condition Report Provided'],
    },
    included: {
      headline: 'Every Inspection Includes',
      items: [
        'Comprehensive chimney evaluation',
        'Fireplace system assessment',
        'Visible masonry inspection',
        'Chimney cap & crown inspection',
        'Draft and airflow evaluation',
        'Photo documentation',
        'Written condition report',
        'Recommendations when needed',
      ],
    },
    offer: {
      headline: 'Comprehensive Chimney Safety Inspection',
      items: ['Comprehensive chimney evaluation', 'Fireplace system assessment', 'Photo documentation provided', 'Honest recommendations — no pressure'],
    },
    faqs: [
      { q: 'How often should I have my chimney inspected?', a: 'Most homeowners should schedule a chimney inspection at least once per year, especially before fireplace season.' },
      { q: 'What does a chimney inspection include?', a: 'Our inspections evaluate the visible condition, safety, and performance of your chimney and fireplace system while documenting any concerns we identify.' },
      { q: 'Will I receive photos?', a: 'Yes. We provide photos of any notable findings and areas of concern.' },
      { q: 'How long does an inspection take?', a: 'Most inspections take between 45 and 90 minutes depending on the chimney system and any concerns being evaluated.' },
      { q: 'What if you find a problem?', a: "We'll explain what we found, answer your questions, and provide recommendations. There is never any obligation to move forward with repairs." },
      { q: 'Do I need an inspection if my fireplace seems to be working fine?', a: 'Yes. Many chimney issues develop gradually and may not be obvious until significant damage has occurred.' },
      { q: 'Are your technicians licensed and insured?', a: 'Yes. Our team is fully insured and experienced in chimney inspections and evaluations.' },
      { q: 'How much does a chimney inspection cost?', a: 'Pricing varies depending on the type of chimney and the scope of the inspection. Contact us for current pricing and availability.' },
      { q: 'Why choose us instead of another chimney company?', a: 'Because we focus on helping homeowners understand the condition of their chimney—not selling services they may not need. Every inspection includes photos, honest recommendations, and clear next steps.' },
    ],
    finalCta: {
      headline: "Know What's Going On Before Small Problems Become Major Repairs",
      subheadline: 'Many chimney issues start small and go unnoticed until they become expensive to fix. A professional inspection can help identify concerns early and give you confidence in the safety and condition of your chimney.',
      callout: 'Schedule Your Chimney Inspection Today',
      bullets: ['Photo Documentation Included', 'Written Condition Report', 'Honest, No-Pressure Findings'],
    },
    beforeAfter: {
      before: '/Inspection_Before.jpeg',
      after: '/inspection-after.jpeg',
      caption: 'Level II Camera Inspection',
      location: 'Darien, CT',
    },
  },

  'chimney-leaks-water-damage': {
    hero: {
      headline: 'Stop Chimney Leaks Before They Cause Costly Water Damage',
      offer: 'Professional Chimney Leak Inspection & Repair Solutions',
      subheadline: 'Stop water damage in its tracks. We pinpoint chimney leaks and recommend the exact repair you need.',
      trustBadges: ['Leak Detect Pros', 'Book Same-Week', 'Photos Included', 'Licensed & Insured'],
    },
    needSection: {
      title: 'You May Have a Chimney Leak If:',
      items: [
        'Water appears inside your fireplace',
        'You notice stains on walls or ceilings',
        'Bricks are crumbling or deteriorating',
        'You see white staining on the chimney exterior',
        'A musty smell appears after rain',
        'Water drips into your firebox',
        'Rust appears on the damper or fireplace components',
      ],
      ctaLabel: 'Find My Leak',
    },
    whyUs: {
      headline: 'Local Chimney Leak Experts You Can Count On',
      body: "For years, we've helped homeowners stop leaks, prevent water damage, and protect their homes from expensive chimney repairs.",
      bullets: ['Licensed & Insured', '1,000+ Chimneys Served', 'Leak Detection Specialists', 'Before & After Photos Included', 'Written Repair Recommendations', 'No High-Pressure Sales'],
    },
    included: {
      headline: 'Our Leak Service Includes',
      items: [
        'Full exterior chimney evaluation',
        'Flashing inspection',
        'Crown inspection',
        'Chimney cap inspection',
        'Masonry assessment',
        'Moisture intrusion evaluation',
        'Before & After Photos',
        'Written repair recommendations',
      ],
    },
    offer: {
      headline: 'Complete Chimney Leak Evaluation Included',
      items: [
        'Professional Leak Inspection',
        'Photo Documentation',
        'Moisture Damage Assessment',
        'Written Condition Report',
        'Repair Recommendations',
      ],
    },
    faqs: [
      { q: 'Why is water entering my fireplace?', a: 'Common causes include damaged flashing, cracked crowns, missing chimney caps, deteriorated masonry, or failed waterproofing.' },
      { q: 'Can a chimney leak cause structural damage?', a: 'Yes. Water intrusion can damage brickwork, framing, ceilings, drywall, insulation, and fireplace components if left untreated.' },
      { q: 'How do you determine where the leak is coming from?', a: 'We perform a detailed visual inspection of the chimney system and identify common entry points using photos and moisture indicators.' },
      { q: 'Do all chimney leaks require major repairs?', a: 'No. Many leaks can be resolved with targeted repairs such as flashing repair, crown sealing, cap replacement, or waterproofing.' },
      { q: 'Can I just waterproof my chimney?', a: 'Not always. Waterproofing helps protect masonry but will not solve leaks caused by flashing, crown, or cap issues.' },
      { q: 'Will I receive photos of the damage?', a: 'Yes. We provide photos showing the condition of your chimney and any areas of concern.' },
      { q: 'How soon should I address a chimney leak?', a: 'As soon as possible. Water damage worsens over time and can significantly increase repair costs.' },
      { q: 'Are your technicians licensed and insured?', a: 'Yes. Our team is fully insured and trained to diagnose and repair chimney leaks safely and professionally.' },
      { q: 'How much does chimney leak repair cost?', a: "Costs vary depending on the cause and extent of the damage. After the inspection, we'll provide clear recommendations and pricing options." },
      { q: 'Why choose us instead of another chimney company?', a: "Because we focus on identifying the true source of the leak—not just treating the symptoms. Every inspection includes photos, honest recommendations, and solutions tailored to your chimney's needs." },
    ],
    finalCta: {
      headline: 'Protect Your Home From Water Damage',
      subheadline: 'Water intrusion rarely gets better on its own. The sooner a chimney leak is identified, the easier and more affordable it is to repair.',
      callout: 'Book Your Leak Inspection Today',
      bullets: ['Convenient Scheduling', 'Photo Inspection Included', 'Written Condition Report'],
    },
    beforeAfter: {
      before: '/Chimney_Leak_Before.jpeg',
      after: '/Chimney_Leak_After.jpeg',
      caption: 'Waterproofing & Leak Repair',
      location: 'Darien, CT',
    },
  },

  'chimney-repair-masonry': {
    hero: {
      headline: 'Chimney Repair & Masonry Work Done Right For Long-Term Protection',
      offer: 'Professional Chimney Repair & Masonry Restoration Solutions',
      subheadline: "Cracked bricks, deteriorating mortar joints, leaning chimneys, or visible damage? Our experts can restore your chimney's safety, appearance, and structural integrity.",
      trustBadges: ['Masonry Specialists', 'Book Same-Week', 'Photos Included', 'Licensed & Insured'],
    },
    needSection: {
      title: 'Your Chimney May Need Repair If:',
      items: [
        'Bricks are cracked or falling apart',
        'Mortar joints are deteriorating',
        'The chimney appears to lean',
        'Pieces of masonry are falling off',
        'Water damage is visible',
        'White staining appears on the exterior',
        'The chimney crown is cracked',
        'You notice loose or missing bricks',
      ],
      ctaLabel: 'Schedule My Inspection',
    },
    whyUs: {
      headline: 'Local Chimney Repair Experts You Can Count On',
      body: "For years, we've helped homeowners repair damaged chimneys, restore masonry, and prevent costly structural problems.",
      bullets: ['Licensed & Insured', '1,000+ Chimneys Repaired', 'Skilled Masonry Specialists', 'Before & After Photos Included', 'Written Repair Recommendations', 'No High-Pressure Sales'],
    },
    included: {
      headline: 'Every Chimney Repair Evaluation Includes',
      items: [
        'Complete chimney inspection',
        'Brick and mortar assessment',
        'Crown inspection',
        'Structural stability evaluation',
        'Water damage assessment',
        'Before & After Photos',
        'Written repair recommendations',
      ],
    },
    offer: {
      headline: 'Complete Chimney Repair Evaluation Included',
      items: [
        'Structural Assessment',
        'Masonry Condition Report',
        'Photo Documentation',
        'Written Repair Recommendations',
        'Multiple Repair Options When Available',
      ],
    },
    faqs: [
      { q: 'What causes chimney bricks and mortar to deteriorate?', a: 'Exposure to rain, snow, freezing temperatures, and age can cause masonry materials to break down over time.' },
      { q: 'What is tuckpointing?', a: 'Tuckpointing involves removing damaged mortar and replacing it with new mortar to restore the strength and appearance of the chimney.' },
      { q: 'Can damaged masonry lead to bigger problems?', a: 'Yes. Small masonry issues can eventually lead to water damage, structural instability, and more costly repairs.' },
      { q: 'How do I know if my chimney needs repair or rebuilding?', a: 'Our inspection evaluates the overall condition of the chimney and helps determine the most cost-effective solution.' },
      { q: 'Can loose bricks be repaired?', a: 'In many cases, yes. Individual bricks can often be replaced without rebuilding the entire chimney.' },
      { q: 'Will I receive photos of the damage?', a: 'Yes. We provide photos documenting the condition of your chimney and any areas requiring attention.' },
      { q: 'How long do chimney repairs typically take?', a: 'Repair timelines vary depending on the extent of the damage. Smaller repairs may take a day, while larger restoration projects may require additional time.' },
      { q: 'Are your technicians licensed and insured?', a: 'Yes. Our team is fully insured and experienced in chimney repair and masonry restoration.' },
      { q: 'How much does chimney repair cost?', a: 'Costs vary depending on the type and severity of the damage. We provide detailed recommendations and transparent pricing after the inspection.' },
      { q: 'Why choose us instead of another chimney company?', a: "Because we focus on long-term solutions—not temporary fixes. Every evaluation includes photos, honest recommendations, and repair options designed to protect your home and your investment." },
    ],
    finalCta: {
      headline: 'Protect Your Home With Professional Chimney Repairs',
      subheadline: 'Ignoring masonry damage can lead to water intrusion, structural problems, and significantly higher repair costs. Addressing issues early helps protect your chimney and your home.',
      callout: 'Schedule Your Chimney Repair Inspection Today',
      bullets: ['Convenient Scheduling', 'Photo Inspection Included', 'Written Condition Report'],
    },
    beforeAfter: {
      before: '/Repair-before.jpg',
      after: '/Repair-after.jpeg',
      caption: 'Chimney Masonry Repair & Restoration',
      location: 'Greenwich, CT',
    },
  },

  'chimney-caps-covers': {
    hero: {
      headline: 'Chimney Caps & Covers Installed To Keep Water & Animals Out',
      offer: 'Chimney Caps & Covers Installed To Keep Water & Animals Out',
      subheadline: 'Protect your chimney from water, animals, and debris with a properly installed cap.',
      trustBadges: ['Chimney Cap Pros', 'Book Same-Week', 'Premium Material', 'Licensed & Insured'],
    },
    needSection: {
      title: 'Your Chimney May Need A New Cap Or Cover If:',
      items: [
        'Water enters your fireplace after rain',
        'You hear animals in your chimney',
        'Your current cap is rusted or damaged',
        'Leaves and debris collect inside the chimney',
        'Your chase cover is rusting',
        'You notice stains around the fireplace',
        'Your chimney has no cap installed',
      ],
      ctaLabel: 'Schedule My Evaluation',
    },
    whyUs: {
      headline: 'Local Chimney Protection Experts You Can Count On',
      body: "For years, we've helped homeowners protect their chimneys from water intrusion, animal entry, and premature deterioration.",
      bullets: ['Licensed & Insured', '1,000+ Chimneys Serviced', 'Custom-Fit Solutions', 'Before & After Photos Included', 'Honest Recommendations — No Pressure'],
    },
    included: {
      headline: 'Every Chimney Cap & Cover Evaluation Includes',
      items: [
        'Existing cap inspection',
        'Chase cover inspection',
        'Water intrusion assessment',
        'Animal entry point evaluation',
        'Chimney condition review',
        'Photo documentation',
        'Written recommendations',
      ],
    },
    offer: {
      headline: 'Get Answers From A Chimney Expert',
      items: [
        'Photo Documentation Included',
        'Honest Recommendations',
        'Protection Options Explained Clearly',
        'No High-Pressure Sales',
      ],
    },
    faqs: [
      { q: 'What does a chimney cap do?', a: 'A chimney cap helps prevent rain, animals, leaves, and debris from entering your chimney.' },
      { q: 'What is a chase cover?', a: 'A chase cover protects the top of a prefabricated chimney system from water intrusion and deterioration.' },
      { q: 'Can a missing chimney cap cause leaks?', a: 'Yes. Rainwater can enter the chimney and contribute to moisture-related damage.' },
      { q: 'Can chimney caps keep animals out?', a: 'Yes. Properly installed chimney caps help prevent birds, squirrels, raccoons, and other animals from entering.' },
      { q: 'How do I know if my chimney cap needs replacement?', a: 'Common signs include rust, corrosion, visible damage, loose components, or recurring water and animal issues.' },
      { q: "What's the difference between galvanized and stainless steel caps?", a: 'Stainless steel generally offers greater durability and resistance to corrosion.' },
      { q: 'Will I receive photos of the issue?', a: 'Yes. We document any concerns and explain our recommendations clearly.' },
      { q: 'How long does installation take?', a: 'Most cap and cover installations can be completed in a single visit.' },
      { q: 'Are your technicians licensed and insured?', a: 'Yes.' },
      { q: 'Why choose us instead of another chimney company?', a: 'Because we focus on helping homeowners protect their chimneys before small issues become expensive repairs. Every evaluation includes photos, honest recommendations, and clear next steps.' },
    ],
    finalCta: {
      headline: 'Protect Your Chimney From Water, Animals & Future Damage',
      subheadline: 'A properly installed chimney cap or cover can help prevent water intrusion, animal entry, and unnecessary damage to your chimney system.',
      callout: 'Schedule Your Chimney Cap Evaluation Today',
      bullets: ['Convenient Scheduling', 'Photo Inspection Included', 'Honest Recommendations'],
    },
    beforeAfter: {
      before: '/Caps_before.jpeg',
      after: '/Caps_after.jpeg',
      caption: 'Custom Stainless Steel Cap Installation',
      location: 'Westport, CT',
    },
  },

  'chimney-liners': {
    hero: {
      headline: 'Chimney Liner Installation For Safe, Efficient Venting',
      offer: 'Chimney Liner Installation For Safe, Efficient Venting',
      subheadline: 'A properly sized chimney liner helps improve drafting, protect your chimney structure, and safely vent smoke and gases from your home.',
      trustBadges: ['Certified Pros', 'Book Same-Week', 'Lifetime Warranty', 'Licensed & Insured'],
    },
    needSection: {
      title: 'Your Chimney May Need A New Liner If:',
      items: [
        'Smoke enters your home',
        'Your fireplace drafts poorly',
        "You're converting fuel types",
        'Your current liner is damaged',
        'Your chimney failed inspection',
        "You've recently installed a new appliance",
        'Your chimney has never been relined',
      ],
      ctaLabel: 'Check My Liner',
    },
    whyUs: {
      headline: 'Local Chimney Experts You Can Count On',
      body: "For years, we've helped homeowners improve fireplace safety and performance with professional chimney liner solutions.",
      bullets: ['Family-Owned & Operated', 'Licensed & Insured', 'Thousands of Chimneys Serviced', 'Before & After Photos Included'],
    },
    included: {
      headline: 'Every Chimney Liner Evaluation Includes',
      items: [
        'Existing liner assessment',
        'Draft and venting evaluation',
        'Appliance compatibility review',
        'Chimney inspection',
        'Photo documentation',
        'Written recommendations',
      ],
    },
    offer: {
      headline: 'Get Answers From A Chimney Expert',
      items: [
        'Photo Documentation Included',
        'Honest Recommendations',
        'Venting Assessment',
        'No High-Pressure Sales',
      ],
    },
    faqs: [
      { q: 'What does a chimney liner do?', a: 'A chimney liner helps safely vent smoke, heat, and combustion gases while protecting the chimney structure.' },
      { q: 'How do I know if my liner is damaged?', a: 'Signs may include poor draft, smoke issues, failed inspections, visible deterioration, or appliance replacement requirements.' },
      { q: 'Do all chimneys need liners?', a: 'Most modern codes require properly functioning liners, but the condition and type of liner vary from home to home.' },
      { q: "What's the difference between clay and stainless steel liners?", a: 'Clay liners are common in older chimneys, while stainless steel liners offer improved durability and compatibility with many heating appliances.' },
      { q: 'Can a damaged liner be dangerous?', a: 'Yes. A damaged liner can increase the risk of heat transfer, poor venting, and improper exhaust of combustion gases.' },
      { q: 'Will I receive photos of the inspection?', a: 'Yes. We provide photos documenting any concerns and explaining our recommendations.' },
      { q: 'How long does liner installation take?', a: 'Most installations can be completed within a day, depending on the chimney configuration.' },
      { q: 'Are your technicians licensed and insured?', a: 'Yes.' },
      { q: 'How much does a chimney liner cost?', a: 'Pricing depends on chimney size, appliance type, and liner requirements.' },
      { q: 'Why choose us instead of another chimney company?', a: 'Because we focus on helping homeowners understand their options first. Every evaluation includes photos, honest recommendations, and clear explanations without pressure.' },
    ],
    finalCta: {
      headline: 'Improve Safety, Performance & Peace Of Mind',
      subheadline: 'A properly functioning chimney liner helps protect your home, improve fireplace performance, and ensure safe venting for years to come.',
      callout: 'Schedule Your Liner Evaluation Today',
      bullets: ['Convenient Scheduling', 'Photo Inspection Included', 'Honest Recommendations'],
    },
    beforeAfter: {
      before: '/Before_Chimney_Liners.jpeg',
      after: '/After_Chimney_Liners.jpeg',
      caption: 'Stainless Steel Liner Installation',
      location: 'Fairfield, CT',
    },
  },

  'gas-fireplace-log-sets': {
    hero: {
      headline: 'Gas Fireplace & Log Set Solutions For Comfort & Peace Of Mind',
      offer: 'Gas Fireplace & Log Set Solutions For Comfort & Peace Of Mind',
      subheadline: "Whether your gas fireplace isn't performing properly or you're considering new gas logs, we'll help you understand your options and find the right solution for your home.",
      trustBadges: ['Easy Scheduling', 'Labor Guarantee', 'Book Same-Week', 'Clear Next Steps'],
    },
    needSection: {
      title: 'It May Be Time For A Gas Fireplace Evaluation If:',
      items: [
        'Your fireplace won\'t ignite',
        "The pilot light won't stay lit",
        'The flames appear weak or uneven',
        'You notice unusual odors',
        "Your fireplace isn't heating properly",
        'Your gas logs are outdated or damaged',
        "You're considering upgrading your fireplace",
      ],
      ctaLabel: 'Schedule My Evaluation',
    },
    whyUs: {
      headline: 'Helping Homeowners Find The Right Fireplace Solution',
      body: "Whether you're dealing with a performance issue or considering an upgrade, we'll help you understand your options and determine the best next step for your home.",
      bullets: ['Honest Recommendations', 'Clear Communication', 'Repair & Upgrade Options', 'Photo Documentation Included', 'No High-Pressure Sales', 'Family-Owned & Operated'],
    },
    included: {
      headline: 'Every Gas Fireplace Evaluation Includes',
      items: [
        'Fireplace performance assessment',
        'Gas log evaluation',
        'Safety review',
        'Photo documentation',
        'Solution recommendations',
        'Repair or upgrade options when appropriate',
        'Clear next steps',
      ],
    },
    offer: {
      headline: 'Get Answers From A Fireplace Expert',
      items: [
        'Expert Guidance',
        'Honest Recommendations',
        'Repair & Upgrade Options',
        'Clear Next Steps',
        'No High-Pressure Sales',
      ],
    },
    faqs: [
      { q: "Why isn't my gas fireplace working properly?", a: 'Gas fireplaces can experience a variety of performance issues. An evaluation helps determine the cause and identify the most appropriate solution.' },
      { q: 'Can I replace my existing gas logs?', a: 'In many cases, yes. New gas log sets can improve both appearance and overall fireplace enjoyment.' },
      { q: 'How do I know if my gas logs should be replaced?', a: 'Damaged, deteriorated, or outdated log sets may benefit from replacement.' },
      { q: 'Can I upgrade the appearance of my fireplace?', a: 'Absolutely. Many homeowners choose to upgrade their gas logs or fireplace components for a more modern and attractive look.' },
      { q: 'Will I receive recommendations?', a: "Yes. We'll explain our findings and discuss available options based on your goals and budget." },
      { q: 'How much does a gas fireplace project cost?', a: 'Costs vary depending on the fireplace system, condition, and desired improvements.' },
      { q: 'Why choose us instead of another company?', a: 'Because we focus on helping homeowners understand their options first. Our goal is to provide honest recommendations, clear guidance, and the right solution for your home.' },
    ],
    finalCta: {
      headline: "Enjoy A Fireplace You'll Love Using Again",
      subheadline: "Whether you're looking to improve performance, update your gas logs, or explore your options, we'll help you find the right solution for your home.",
      callout: 'Schedule Your Gas Fireplace Evaluation Today',
      bullets: ['Convenient Scheduling', 'Honest Recommendations', 'Clear Next Steps'],
    },
    beforeAfter: {
      before: '/Gas-before.jpeg',
      after: '/Gas-after.jpeg',
      caption: 'Gas Fireplace & Log Set Installation',
      location: 'Stamford, CT',
    },
  },
};

/* Fallback content for any unlisted slug */
function fallbackContent(serviceName: string): ServiceContent {
  return {
    hero: {
      headline: `Professional ${serviceName} You Can Count On`,
      offer: `Expert ${serviceName} — Licensed, Insured & Guaranteed`,
      subheadline: 'Our certified technicians deliver quality workmanship with honest recommendations and no pressure.',
      trustBadges: ['Certified Technicians', 'Same-Week Appointments', 'Photo Documentation', 'Labor Guarantee', 'Licensed & Insured'],
    },
    needSection: {
      title: `Signs You Need ${serviceName}:`,
      items: ['Visible damage or deterioration', 'Unusual odors or smoke issues', "It's been over a year since last service", 'You recently purchased your home', 'Reduced fireplace performance', 'Visible water damage or staining'],
      ctaLabel: 'Get My Quote',
    },
    whyUs: {
      headline: 'Local Experts You Can Trust',
      body: "For over 15 years, we've helped homeowners protect their homes with professional chimney services.",
      bullets: ['Family-Owned & Operated', 'Licensed & Insured', 'Thousands of Homes Served', 'Photo Documentation', 'Honest Recommendations', 'Labor Guarantee'],
    },
    included: {
      headline: 'Service Includes',
      items: ['Full assessment & documentation', 'Professional service delivery', 'Photo documentation', 'Written findings report', 'Honest recommendations', 'Labor guaranteed'],
    },
    offer: {
      headline: `Professional ${serviceName}`,
      items: ['Comprehensive assessment', 'Professional service', 'Photo documentation', 'Written report & recommendations'],
    },
    faqs: [
      { q: 'Are you licensed and insured?', a: 'Yes. Our team is fully licensed and insured for all services we perform.' },
      { q: 'Do you provide photos?', a: 'Yes. We document our work with before-and-after photos on every visit.' },
      { q: 'How soon can I schedule?', a: 'We typically schedule within a few days. Contact us for current availability.' },
      { q: 'What if problems are found?', a: "We'll explain everything clearly with photos and give you options. No pressure, no obligation." },
    ],
    finalCta: {
      headline: 'Ready to Get Started?',
      subheadline: 'Our team is ready to help. Contact us today for availability and a free quote.',
      callout: 'Book Your Service Today',
      bullets: ['Convenient Scheduling', 'Photo Documentation Included', 'Labor Guarantee'],
    },
    beforeAfter: {
      before: '/Sweep-before.jpeg',
      after: '/Sweep-after.jpeg',
      caption: serviceName,
      location: 'CT & NJ',
    },
  };
}

/* ─────────────────────────────────────────────────────────── */
/*  Hero quote form                                            */
/* ─────────────────────────────────────────────────────────── */

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

function HeroForm(_: { region: { phoneNumbers: string[] } }) {
  const [form, setForm] = useState({ name: '', phone: '', service: 'not-sure' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: name === 'phone' ? formatPhone(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await submitQuoteRequest(form);
    setSubmitting(false);
    if (result.success) {
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'generate_lead',
          event_category: 'quote_form',
          event_label: form.service || 'not-specified',
          form_name: 'get_free_consultation',
          value: 1,
          currency: 'USD',
        });
      }
      setConfirmation('CF' + Date.now().toString().slice(-6));
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', phone: '', service: 'not-sure' });
        setConfirmation('');
      }, 14000);
    } else {
      setError(result.error || 'Failed to submit. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
        <h2 className="text-lg font-extrabold text-white leading-tight">Get a Free Consultation</h2>
      </div>
      <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-70" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-green-800 text-xs font-semibold"><strong>{QUOTE_COUNT} homeowners</strong> requested a quote this week</span>
      </div>
      <div className="p-5 sm:p-6">
        {submitted ? (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center animate-scaleIn">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xl font-extrabold text-green-800 mb-1">
              {form.name ? `Got it, ${form.name.split(' ')[0]}!` : 'Request Confirmed!'}
            </p>
            <div className="inline-block bg-white border-2 border-green-200 rounded-lg px-4 py-2 my-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirmation</p>
              <p className="text-lg font-extrabold text-gray-900">#{confirmation}</p>
            </div>
            <p className="text-sm text-gray-600 mb-1">We'll call <strong>{form.phone}</strong> within 2 hours</p>
            <p className="text-xs text-green-600 font-bold mb-4">Sun–Thu 8am–8pm · Fri 8am–4:30pm · Emergency 24/7</p>
            <div className="bg-white rounded-xl border border-green-100 p-4 text-left mb-4">
              <p className="text-xs font-extrabold text-gray-700 mb-2">What happens next:</p>
              <ol className="space-y-1.5">
                {['Our team reviews your request immediately', 'Expert technician calls to discuss your needs', 'We schedule at your most convenient time', 'Professional service — labor guarantee included'].map((s, i) => (
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
              <label htmlFor="sd-name" className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Your Name *</label>
              <input id="sd-name" type="text" name="name" placeholder="John Smith" required autoComplete="given-name"
                value={form.name} onChange={handleChange}
                className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[52px] hover:border-gray-300 placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label htmlFor="sd-phone" className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Best Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input id="sd-phone" type="tel" name="phone" placeholder="555-123-4567" required inputMode="tel" autoComplete="tel"
                  value={form.phone} onChange={handleChange}
                  className="w-full pl-10 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[52px] hover:border-gray-300 placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
              </div>
            </div>
            <div>
              <label htmlFor="sd-service" className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Service Needed</label>
              <div className="relative">
                <select id="sd-service" name="service" value={form.service} onChange={handleChange}
                  className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all appearance-none bg-gray-50 focus:bg-white min-h-[52px] hover:border-gray-300 cursor-pointer">
                  {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white rounded-xl font-extrabold text-base active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (
                <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending...</>
              ) : (
                <><Phone className="w-4 h-4 flex-shrink-0" />Chat With An Expert</>
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
  );
}

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

/* ─────────────────────────────────────────────────────────── */
/*  Main component                                             */
/* ─────────────────────────────────────────────────────────── */

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { region, statePrefix, isCT, isNJ } = useRegion();
  const [searchParams] = useSearchParams();
  const titleOverride = parseTitleOverride(searchParams.get('title'));
  const ctLocation = resolveCtLocation(
    searchParams.get('loc_interest_ms'),
    searchParams.get('loc_physical_ms')
  );
  const servingLocation = isCT && ctLocation ? `${ctLocation}, CT` : region.regionName;
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Stats bar count-up
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const yearsCount        = useCountUp(15,    1400, statsStarted);
  const jobsCount         = useCountUp(10000, 2000, statsStarted);
  const satisfactionCount = useCountUp(100,   1200, statsStarted);
  const reviewsCount      = useCountUp(98,    1600, statsStarted);

  const [staticLoaded, setStaticLoaded] = useState(false);
  const [showAnimated, setShowAnimated] = useState(false);
  useEffect(() => {
    if (staticLoaded) {
      const t = setTimeout(() => setShowAnimated(true), 100);
      return () => clearTimeout(t);
    }
  }, [staticLoaded]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsStarted(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const getRegionText = () => {
    if (isCT) return 'Connecticut';
    if (isNJ) return 'New Jersey';
    return 'Connecticut and New Jersey';
  };

  const service = SERVICES.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-black mb-4">Service Not Found</h1>
          <Link to={statePrefix || '/'} className="inline-flex items-center text-primary font-bold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const content = CONTENT[service.slug] ?? fallbackContent(service.name);
  const Icon = service.icon;

  const regionShort = isCT ? 'CT' : isNJ ? 'NJ' : 'CT & NJ';
  const seoTitle = `${service.name} | ${regionShort} | Chimney Force`;
  const seoDescription = `Expert ${service.name.toLowerCase()} services in ${getRegionText()}. Licensed & insured. Same-day service available. Call now!`;
  const keywords = `${service.name.toLowerCase()}, chimney services, chimney force, ${isCT ? 'ct' : isNJ ? 'nj' : 'ct nj'}`;

  const serviceSchema = createServiceSchema(service.name, seoDescription, getRegionText(), region.phoneNumbers[0]);
  const faqSchema = createFAQSchema(content.faqs);
  const breadcrumbs = createBreadcrumbSchema([
    { name: 'Home', url: statePrefix || '/' },
    { name: 'Services', url: statePrefix || '/' },
    { name: service.name, url: `${statePrefix}/services/${service.slug}` },
  ]);

  return (
    <div className="bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-lg focus:font-bold">
        Skip to main content
      </a>

      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={`${statePrefix}/services/${service.slug}`}
        structuredData={[serviceSchema, breadcrumbs, faqSchema]}
      />

      {/* ── SECTION 1: Hero ─────────────────────────────────── */}
      <div className="relative min-h-[600px] md:min-h-[660px] lg:h-[720px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {!staticLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />}
          <img src="/hero-fireplace.jpg" alt="" aria-hidden="true"
            className="w-full h-full object-cover" width="1920" height="720"
            loading="eager" fetchPriority="high" decoding="async"
            onLoad={() => setStaticLoaded(true)}
            style={{ display: showAnimated ? 'none' : 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; setStaticLoaded(true); }} />
          {showAnimated && (
            <img src="/hero-fireplace.gif" alt="" aria-hidden="true"
              className="w-full h-full object-cover absolute inset-0"
              loading="lazy" decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 lg:items-center">

            {/* Left: copy */}
            <div className="text-white space-y-5 animate-fadeInUp">
              {/* Pills row — location */}
              <div className="flex flex-wrap items-center gap-2 animate-fadeInDown">
                <div className="inline-flex items-center gap-2 bg-secondary text-gray-900 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-md">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  Serving {servingLocation}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-tight">
                {titleOverride ?? content.hero.headline}
              </h1>

              <p className="text-base md:text-lg font-semibold text-secondary leading-tight">
                {content.hero.offer}
              </p>

              <p className="text-base text-gray-200 leading-relaxed max-w-xl">
                {content.hero.subheadline}
              </p>

              {/* Trust chips — same style as homepage */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {content.hero.trustBadges.map((badge, i) => (
                  <div
                    key={badge}
                    className="inline-flex items-center gap-1.5 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 backdrop-blur-sm animate-badgePop"
                    style={{ animationDelay: `${0.32 + i * 0.07}s` }}
                  >
                    <div className="w-5 h-5 flex-shrink-0 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-xs font-bold text-white leading-tight whitespace-nowrap">{badge}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="inline-flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 shadow-lg">
                  <Users className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-white text-sm font-medium">
                    <strong className="font-extrabold text-white">10,000+</strong> homeowners served
                  </span>
                </div>
              </div>

              {slug === 'gas-fireplace-log-sets' && (
                <div className="flex items-start gap-2.5 bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm max-w-xl">
                  <Info className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <span className="font-bold text-white">Note:</span> Plumbing side of gas fireplace services may be performed by qualified specialty sub-contractors.
                  </p>
                </div>
              )}
            </div>

            {/* Right: form */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <HeroForm region={region} />
            </div>
          </div>
        </div>
      </div>

      <div ref={statsRef} className="bg-gray-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: yearsCount,        suffix: '+', label: 'Years Experience',  icon: Award  },
              { value: jobsCount,         suffix: '+', label: 'Homes Served',      icon: Users  },
              { value: satisfactionCount, suffix: '%', label: 'Satisfaction Rate', icon: Shield },
              { value: reviewsCount,      suffix: '+', label: '5-Star Reviews',    icon: Star   },
            ].map(({ value, suffix, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="text-primary" style={{ width: 18, height: 18 }} />
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

      <main id="main-content">

        {/* ── SECTION 2: Do I Need A Chimney Sweep? ─────────── */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-5 border border-amber-200">
                <Icon className="w-3.5 h-3.5" />
                Is It Time?
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {content.needSection.title}
              </h2>
              <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto">If any of these sound familiar, it's worth getting a professional look.</p>
            </div>

            {/* Signs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
              {content.needSection.items.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/15 transition-colors">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-800 font-semibold text-sm leading-snug pt-1">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('chimney-open-booking'))}
                className="inline-flex items-center gap-2.5 bg-primary text-white px-9 py-4 rounded-xl font-extrabold text-base hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/25"
              >
                <CalendarDays className="w-5 h-5" />
                {content.needSection.ctaLabel}
              </button>
              <p className="text-xs text-gray-400 font-medium">Same-week appointments available</p>
            </div>

          </div>
        </section>

        {/* ── SECTION 3: Why Us ─────────────────────────────── */}
        <section className="bg-gray-950">
          <div className="relative w-full overflow-hidden">
            <img
              src="/Add_a_heading_(29).jpg"
              alt="Chimney Force crew standing in front of service van"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
            <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-8 xl:right-14 w-[38%]">
              <div className="rounded-2xl px-6 py-7 shadow-2xl border border-white/10" style={{ backgroundColor: 'rgba(10,10,10,0.92)' }}>
                <WhyUsContent content={content.whyUs} phone={region.phoneNumbers[0]} />
              </div>
            </div>
          </div>
          <div className="lg:hidden bg-gray-900 px-6 py-10">
            <WhyUsContent content={content.whyUs} phone={region.phoneNumbers[0]} />
          </div>
        </section>

        {/* ── SECTION 4: What's Included ────────────────────── */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                What's Included
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {content.included.headline}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {content.included.items.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 group hover:border-success/20 hover:bg-success/5 transition-all duration-200">
                  <div className="w-8 h-8 flex-shrink-0 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: Before & After ─────────────────────── */}
        {slug === 'chimney-inspections' ? (
          <BeforeAfterTabSection defaultTab={1} />
        ) : slug === 'chimney-repair-masonry' ? (
          <BeforeAfterTabSection defaultTab={3} singleTab />
        ) : slug === 'chimney-caps-covers' ? (
          <BeforeAfterTabSection defaultTab={4} singleTab />
        ) : slug === 'chimney-liners' ? (
          <BeforeAfterTabSection defaultTab={5} singleTab />
        ) : slug === 'gas-fireplace-log-sets' ? (
          <BeforeAfterTabSection defaultTab={6} singleTab />
        ) : slug === 'chimney-leaks-water-damage' ? (
          <BeforeAfterTabSection defaultTab={2} singleTab />
        ) : (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4 border border-secondary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Real Results
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                Before &amp; After
              </h2>
              <p className="mt-3 text-gray-500 font-medium max-w-xl mx-auto">
                Drag the slider to reveal the transformation — real jobs, real results.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <BeforeAfterSlider
                beforeImage={content.beforeAfter.before}
                afterImage={content.beforeAfter.after}
                beforeAlt={`Before — ${content.beforeAfter.caption}`}
                afterAlt={`After — ${content.beforeAfter.caption}`}
              />
            </div>
            <div className="mt-5 flex items-center gap-2 text-gray-500 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{content.beforeAfter.caption} · {content.beforeAfter.location}</span>
            </div>
          </div>
        </section>
        )}

        {/* ── SECTION 6: Reviews ────────────────────────────── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ReviewCarousel />
          </div>
        </section>

        {/* ── SECTION 7: Offer ──────────────────────────────── */}
        <section className="py-16 md:py-20 bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12 lg:p-14">

                {/* Top row */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                  <div className="inline-flex items-center gap-2 bg-secondary text-gray-900 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-md">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    Serving {servingLocation}
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {['chimney-inspections', 'chimney-leaks-water-damage', 'chimney-repair-masonry', 'chimney-caps-covers', 'chimney-liners'].includes(slug ?? '') ? 'Starting at $49' : 'Starting at $99'}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-center">
                  {/* Left: headline + checklist + CTA */}
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">
                      {content.offer.headline}
                    </h2>
                    <div className="space-y-3 mb-8">
                      {content.offer.items.map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="w-6 h-6 flex-shrink-0 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-white font-semibold text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new Event('chimney-open-booking'))}
                      className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-extrabold text-base hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl"
                    >
                      <CalendarDays className="w-5 h-5" />
                      Schedule My Inspection
                    </button>
                  </div>

                  {/* Right: stat grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { stat: ['chimney-inspections', 'chimney-leaks-water-damage', 'chimney-repair-masonry', 'chimney-caps-covers', 'chimney-liners'].includes(slug ?? '') ? '$49' : '$99', label: 'Starting Price' },
                      { stat: '15+',    label: 'Years Experience' },
                      { stat: '1,000+', label: 'Chimneys Served' },
                      { stat: '100%',   label: 'Satisfaction Guaranteed' },
                    ].map(({ stat, label }) => (
                      <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                        <div className="text-2xl font-black text-primary mb-1">{stat}</div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide leading-tight">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom guarantee strip */}
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
                  {['Labor Guarantee', 'No Hidden Fees', 'Licensed & Insured', 'Same-Week Appointments'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative glows */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </section>

        {/* ── SECTION 8: FAQ ────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4">
                FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Common Questions</h2>
              <p className="mt-3 text-gray-500 font-medium">Everything you need to know before booking.</p>
            </div>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {content.faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-150"
                    aria-expanded={openFAQ === i}
                  >
                    <span className="text-sm md:text-base font-bold text-gray-900 leading-snug">{faq.q}</span>
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${openFAQ === i ? 'border-primary bg-primary/10 rotate-45' : 'border-gray-200'}`}>
                      <ArrowRight className={`w-3.5 h-3.5 transition-all duration-200 ${openFAQ === i ? 'text-primary -rotate-45' : 'text-gray-400 rotate-45'}`} />
                    </span>
                  </button>
                  {openFAQ === i && (
                    <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed font-medium border-t border-gray-50 bg-gray-50/50 animate-fadeInDown">
                      <p className="pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 9: Final CTA ──────────────────────────── */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src="/hero-fireplace.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            <img src="/hero-fireplace.gif" alt="" aria-hidden="true" className="w-full h-full object-cover absolute inset-0" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 backdrop-blur-sm px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
                {content.finalCta.callout}
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
                {content.finalCta.headline}
              </h2>

              <p className="text-lg text-gray-200 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
                {content.finalCta.subheadline}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {content.finalCta.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-semibold">{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('chimney-open-booking'))}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl"
                >
                  <CalendarDays className="w-5 h-5" />
                  {['chimney-inspections', 'chimney-leaks-water-damage', 'chimney-repair-masonry', 'chimney-caps-covers', 'chimney-liners'].includes(slug ?? '') ? 'Schedule My Inspection' : 'Get My Appointment'}
                </button>
                <Link
                  to={`${statePrefix}/contact`}
                  className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-white/25 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <Award className="w-5 h-5" />
                  Speak With An Expert
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Sticky mobile bar */}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/*  Why Us content block (reused in Section 3)                 */
/* ─────────────────────────────────────────────────────────── */

function WhyUsContent({ content, phone }: { content: ServiceContent['whyUs']; phone: string }) {
  return (
    <>
      <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
        Why Homeowners Choose Us
      </div>
      <h2 className="text-2xl md:text-3xl font-black leading-tight text-white mb-3">
        {content.headline}
      </h2>
      <p className="text-sm leading-relaxed text-gray-300 mb-6">
        {content.body}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { stat: '15+',       label: 'Years Experience' },
          { stat: '1,000+',    label: 'Chimneys Served' },
          { stat: '100%',      label: 'Labor Guaranteed' },
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
          href={`tel:${phone.replace(/\D/g, '')}`}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white px-5 py-3 rounded-xl font-extrabold text-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
        >
          <Phone className="w-4 h-4" />
          {phone}
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
    </>
  );
}
