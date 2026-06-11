import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle, Phone, Shield, Award, Star,
  ArrowRight, Users, Sparkles, MapPin, CalendarDays, Info,
} from 'lucide-react';
import { SEO, createServiceSchema, createBreadcrumbSchema } from '../components/SEO';
import { useRegion } from '../context/RegionContext';
import { SERVICES } from '../data/servicesData';
import { ReviewCarousel } from '../components/ReviewCarousel';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { submitQuoteRequest } from '../lib/contactSubmission';

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
      trustBadges: ['Certified Technicians', 'Same-Week Booking', 'Mess-Free Service', 'Before/After Photos'],
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
      before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-before.jpg',
      after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-after.jpg',
      caption: 'Deep Cleaning & Creosote Removal',
      location: 'West Hartford, CT',
    },
  },

  'chimney-inspections': {
    hero: {
      headline: 'Know Exactly What\'s Going On Inside Your Chimney',
      offer: 'Certified Chimney Inspection — Level 1 & Level 2 Available',
      subheadline: 'A thorough chimney inspection is the first step to a safe, efficient fireplace. We document everything with photos so you can see exactly what we see.',
      trustBadges: ['Certified Inspectors', 'Photo Documentation Included', 'Level 1 & Level 2 Available', 'Written Condition Report', 'No Pressure Recommendations'],
    },
    needSection: {
      title: 'You Should Schedule an Inspection If:',
      items: [
        "It's been over a year since your last inspection",
        "You're buying or selling a home",
        "You've had a chimney fire or unusual odors",
        'Smoke is backing up into your living space',
        "You've noticed cracks or visible damage",
        "Your fireplace hasn't been used in several years",
      ],
      ctaLabel: 'Schedule My Inspection',
    },
    whyUs: {
      headline: 'Inspections You Can Actually Trust',
      body: 'Our certified inspectors follow NFPA 211 standards and provide clear, honest findings — never up-selling repairs you don\'t need.',
      bullets: ['Certified to NFPA 211 Standards', 'Photo & Video Documentation', 'Written Condition Report Provided', 'Honest, No-Pressure Findings', 'Level 1 & Level 2 Inspections', 'Real Estate Inspections Available'],
    },
    included: {
      headline: 'Every Inspection Includes',
      items: ['Visual inspection of firebox & liner', 'Flue & damper evaluation', 'Crown & cap assessment', 'Draft & ventilation check', 'Photo documentation', 'Written findings report'],
    },
    offer: {
      headline: 'Comprehensive Chimney Safety Inspection',
      items: ['Level 1 visual safety inspection', 'Firebox & liner condition report', 'Photo documentation provided', 'Honest recommendations — no pressure'],
    },
    faqs: [
      { q: 'What is a Level 1 chimney inspection?', a: 'A Level 1 inspection is a visual examination of the accessible portions of your chimney. It covers the exterior, interior, and all accessible components of the chimney structure and flue.' },
      { q: 'What is a Level 2 chimney inspection?', a: 'A Level 2 inspection includes everything in Level 1 plus a camera scan of the flue interior. It is recommended when buying or selling a home, after any chimney event, or when damage is suspected.' },
      { q: 'How long does a chimney inspection take?', a: 'Most inspections take 45–60 minutes for Level 1 and 60–90 minutes for Level 2, depending on the size and condition of the chimney.' },
      { q: 'Do you provide photos?', a: 'Yes. We document our findings with photos so you can see exactly what we see inside and outside the chimney.' },
      { q: 'What if problems are found?', a: "We'll walk you through the findings clearly, show you photos, and explain your options. You are never obligated to book repairs on the spot." },
      { q: 'How often should I get a chimney inspection?', a: 'The NFPA recommends a chimney inspection at least once a year, even if you do not use the fireplace regularly.' },
      { q: 'Are you certified inspectors?', a: 'Yes. Our technicians are trained and certified to perform Level 1 and Level 2 chimney inspections following industry safety standards.' },
    ],
    finalCta: {
      headline: 'Get Peace of Mind Before Fireplace Season',
      subheadline: "Don't wait until there's a problem. A certified inspection gives you a clear picture of your chimney's condition — and the confidence to use your fireplace safely.",
      callout: 'Schedule Your Chimney Inspection Today',
      bullets: ['Photo Documentation Included', 'Written Condition Report', 'Honest, No-Pressure Findings'],
    },
    beforeAfter: {
      before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg',
      after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg',
      caption: 'Level II Camera Inspection',
      location: 'Darien, CT',
    },
  },

  'chimney-leaks-water-damage': {
    hero: {
      headline: 'Stop Chimney Leaks Before They Damage Your Home',
      offer: 'Chimney Leak Diagnosis, Flashing Repair & Waterproofing',
      subheadline: 'Water is the number-one enemy of your chimney. Our experts find the source fast and fix it right — protecting your home from costly structural damage.',
      trustBadges: ['Leak Diagnosis Included', 'Flashing Repair Specialists', 'Professional Waterproofing', 'Photo Documentation', 'Licensed & Insured'],
    },
    needSection: {
      title: 'You May Have a Chimney Leak If:',
      items: [
        'You see water stains on the ceiling near the chimney',
        'You notice rust inside the firebox',
        'Bricks or mortar are crumbling or cracking',
        'There are white stains (efflorescence) on the chimney',
        'You hear dripping sounds during rain',
        'You smell musty odors from the fireplace',
      ],
      ctaLabel: 'Find My Leak',
    },
    whyUs: {
      headline: 'We Find the Source — Then Fix It Right',
      body: 'Chimney leaks rarely have just one cause. Our technicians trace water intrusion to its source and address every contributing factor.',
      bullets: ['Thorough Leak Diagnostics', 'Flashing Repair & Replacement', 'Professional-Grade Waterproofing', 'Crown Repair & Sealing', 'Cap & Cover Installation', 'Photo Documentation Throughout'],
    },
    included: {
      headline: 'Our Leak Service Includes',
      items: ['Complete leak diagnostic', 'Source identification with photos', 'Flashing inspection & repair', 'Crown & cap evaluation', 'Waterproofing application', 'Written repair report'],
    },
    offer: {
      headline: 'Comprehensive Chimney Leak Repair',
      items: ['Leak source diagnostic', 'Flashing repair or replacement', 'Professional waterproofing sealant', 'Photo documentation throughout'],
    },
    faqs: [
      { q: 'Why is my chimney leaking?', a: 'Chimney leaks typically stem from one or more of these causes: damaged or improperly installed flashing, a cracked or missing crown, deteriorated mortar, a missing or damaged chimney cap, or porous brick.' },
      { q: 'How serious is a chimney leak?', a: "A chimney leak can cause wood rot, mold growth, deteriorating masonry, and interior water damage. It's important to address leaks promptly to avoid escalating repair costs." },
      { q: 'Can you fix chimney leaks on the same visit?', a: 'Many minor leaks — such as crown sealing and cap installation — can be addressed on the same visit as the diagnostic. More involved repairs such as flashing replacement are typically scheduled as a follow-up.' },
      { q: 'What is flashing and why does it leak?', a: 'Flashing is the metal seal between your chimney and the roof. Over time, caulking dries out, metal corrodes, and expansion/contraction cycles pull flashing away from the chimney — allowing water in.' },
      { q: 'Does waterproofing really work?', a: 'Yes. Professional-grade chimney waterproofing penetrates the masonry and repels water while still allowing the chimney to breathe. It significantly extends the life of your chimney.' },
      { q: 'How much does chimney leak repair cost?', a: 'Cost depends on the source of the leak. A crown seal or cap installation starts around $150–$250. Flashing repair ranges from $300–$800. Contact us for a free diagnostic and quote.' },
    ],
    finalCta: {
      headline: 'Don\'t Let a Small Leak Become a Big Problem',
      subheadline: 'Water damage compounds quickly. The sooner you address a chimney leak, the less damage — and the lower the repair cost.',
      callout: 'Book Your Leak Inspection Today',
      bullets: ['Same-Week Appointments', 'Photo Documentation Included', 'Honest, Itemized Quote'],
    },
    beforeAfter: {
      before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg',
      after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg',
      caption: 'Waterproofing & Leak Repair',
      location: 'Darien, CT',
    },
  },

  'chimney-repair-masonry': {
    hero: {
      headline: 'Restore Your Chimney Before Small Cracks Become Big Problems',
      offer: 'Expert Chimney Masonry Repair — Brick, Crown & Tuckpointing',
      subheadline: 'Damaged mortar and crumbling brick don\'t just look bad — they let water in and compromise structural integrity. We restore chimneys to last.',
      trustBadges: ['Expert Masonry Technicians', 'Matching Brick & Mortar', 'Crown Repair & Rebuild', 'Tuckpointing Specialists', 'Licensed & Insured'],
    },
    needSection: {
      title: 'Your Chimney May Need Masonry Repair If:',
      items: [
        'Mortar joints are crumbling, cracked, or missing',
        'Bricks are spalling, chipping, or falling out',
        'The chimney crown is cracked or deteriorating',
        'You see white staining (efflorescence) on the brick',
        'Water is entering the firebox or attic',
        "Your chimney looks visibly damaged or out of plumb",
      ],
      ctaLabel: 'Get My Repair Quote',
    },
    whyUs: {
      headline: 'Masonry Repairs Done to Last',
      body: "We don't just patch surfaces — we identify root causes and repair them properly using matched materials built for the CT and NJ climate.",
      bullets: ['Tuckpointing & Repointing', 'Brick Repair & Replacement', 'Crown Repair & Rebuild', 'Firebox Restoration', 'Matched Brick & Mortar Colors', 'Structural Repairs Guaranteed'],
    },
    included: {
      headline: 'Our Masonry Repair Service Includes',
      items: ['Visual assessment & documentation', 'Mortar joint repointing/tuckpointing', 'Brick repair or replacement', 'Crown repair or rebuild', 'Spall & crack sealing', 'Written scope of work'],
    },
    offer: {
      headline: 'Professional Chimney Masonry Repair',
      items: ['Complete masonry assessment', 'Tuckpointing & repointing', 'Crown repair or rebuild', 'Before & after photo documentation'],
    },
    faqs: [
      { q: 'What is tuckpointing?', a: 'Tuckpointing (also called repointing) is the process of removing deteriorated mortar from chimney joints and replacing it with fresh mortar. It restores the structural integrity and weather resistance of the chimney.' },
      { q: 'How serious is spalling brick?', a: "Spalling brick means the surface is flaking or breaking apart, usually due to water damage. Left untreated, it accelerates and can eventually require full section rebuilds — so it's best caught early." },
      { q: 'Can you match the existing brick and mortar color?', a: 'Yes. We take care to source brick and mix mortar that closely matches the color and texture of your existing chimney.' },
      { q: 'What causes chimney crowns to crack?', a: 'Chimney crowns crack over time due to freeze-thaw cycles, settling, and natural weathering. A cracked crown allows water to enter the chimney and accelerates damage to the liner and masonry below.' },
      { q: 'How long does masonry repair last?', a: 'With quality materials and proper workmanship, tuckpointing and masonry repairs typically last 20–30 years. We back all labor with our workmanship guarantee.' },
      { q: 'How much does chimney masonry repair cost?', a: 'Tuckpointing and minor repairs start around $300–$600. Crown repair ranges from $200–$800. Full brick repair sections vary by scope. We provide itemized written quotes with no obligation.' },
    ],
    finalCta: {
      headline: 'Protect Your Chimney — and Your Home',
      subheadline: 'Every year you wait on masonry repair, water does more damage. Let us assess the situation and give you a clear, honest path forward.',
      callout: 'Book Your Masonry Assessment Today',
      bullets: ['Written Quote Included', 'Matched Brick & Mortar', 'Labor Guarantee on All Repairs'],
    },
    beforeAfter: {
      before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg',
      after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg',
      caption: 'Chimney Masonry Repair & Restoration',
      location: 'Greenwich, CT',
    },
  },

  'chimney-caps-covers': {
    hero: {
      headline: 'Keep Water, Animals & Debris Out of Your Chimney',
      offer: 'Custom Chimney Cap & Cover Installation — Stainless & Copper Available',
      subheadline: "A properly fitted chimney cap is one of the most cost-effective ways to protect your chimney. We measure, source, and install the right cap for your chimney.",
      trustBadges: ['Custom-Fit Caps', 'Stainless & Copper Options', 'Animal Blockage Prevention', 'Same-Week Installation', 'Licensed & Insured'],
    },
    needSection: {
      title: 'You May Need a New Chimney Cap If:',
      items: [
        'Your chimney has no cap at all',
        'Your existing cap is rusted, bent, or broken',
        'You\'ve had animals or birds nesting in the flue',
        'Water is entering the chimney during rain',
        'Leaves and debris are falling into the firebox',
        "Your chase cover is missing or deteriorating",
      ],
      ctaLabel: 'Get My Cap Installed',
    },
    whyUs: {
      headline: 'The Right Cap, Installed Right',
      body: 'A poorly fitted cap is almost as bad as no cap. We measure your flue precisely and install caps that seal properly and last.',
      bullets: ['Precision Measurement & Fitting', 'Stainless Steel & Copper Options', 'Multi-Flue Caps Available', 'Chase Cover Replacement', 'Animal Deterrent Screens', 'Installed Same Day in Most Cases'],
    },
    included: {
      headline: 'Our Cap Installation Service Includes',
      items: ['Flue measurement & assessment', 'Cap selection & sourcing', 'Professional installation', 'Seal & fit verification', 'Post-install inspection', 'Photo documentation'],
    },
    offer: {
      headline: 'Chimney Cap Installation Package',
      items: ['Precise flue measurement', 'Premium stainless steel cap', 'Professional installation', 'Post-install photo documentation'],
    },
    faqs: [
      { q: 'Why does my chimney need a cap?', a: 'A chimney cap keeps rain, snow, animals, and debris out of your flue. It also prevents sparks from escaping the chimney, which is a fire hazard.' },
      { q: 'What is the difference between a chimney cap and a chase cover?', a: "A chimney cap sits on top of individual flue tiles. A chase cover is a flat or sloped cover that seals the top of an entire prefabricated chimney chase. Both serve as protective covers but are different products." },
      { q: 'How long do chimney caps last?', a: 'Stainless steel caps typically last 15–25 years. Galvanized caps last 5–10 years. Copper caps can last 50+ years with minimal maintenance.' },
      { q: 'Can you install a cap on the same day?', a: 'Yes, in most cases. We carry a wide range of standard size caps in our vehicles and can often install on the initial visit.' },
      { q: 'What if an animal is already in my chimney?', a: "We handle animal removal as part of the service and then install a cap to prevent re-entry. We do not seal the chimney until any animals have been safely cleared." },
      { q: 'How much does chimney cap installation cost?', a: 'Standard stainless steel cap installation starts around $150–$300. Custom caps for non-standard flues or copper material are priced based on size and specification.' },
    ],
    finalCta: {
      headline: 'Protect Your Chimney Year-Round',
      subheadline: "A chimney cap is a small investment that prevents big problems — water damage, animal infestations, and debris blockages.",
      callout: 'Book Your Cap Installation Today',
      bullets: ['Same-Week Appointments', 'Same-Day Installation Available', 'Licensed & Insured Technicians'],
    },
    beforeAfter: {
      before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg',
      after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg',
      caption: 'Custom Stainless Steel Cap Installation',
      location: 'Westport, CT',
    },
  },

  'chimney-liners': {
    hero: {
      headline: 'A Safe, Code-Compliant Chimney Starts With the Right Liner',
      offer: 'Stainless Steel Chimney Liner Installation — Gas, Oil & Wood Systems',
      subheadline: 'A damaged or missing liner is a serious fire and carbon monoxide hazard. We install UL-listed liners that protect your home and bring your chimney up to code.',
      trustBadges: ['UL-Listed Liner Systems', 'Gas, Oil & Wood Compatible', 'Code Compliant Installation', 'Lifetime Liner Warranty', 'Licensed & Insured'],
    },
    needSection: {
      title: 'You May Need a New Chimney Liner If:',
      items: [
        'Your home was built before 1990',
        'You\'ve switched from oil to gas heat',
        'A camera inspection revealed liner cracks or damage',
        'You\'ve experienced a chimney fire',
        'Carbon monoxide has been detected in your home',
        "Your clay tile liner is broken or deteriorating",
      ],
      ctaLabel: 'Check My Liner',
    },
    whyUs: {
      headline: 'Liner Installations That Meet Code & Last Decades',
      body: 'We install UL-listed stainless steel liner systems sized precisely for your appliance — ensuring proper draft, safe venting, and long-term performance.',
      bullets: ['UL-Listed Stainless Systems', 'Sized to Your Appliance', 'Gas, Oil & Wood Applications', 'Full HeatShield Restoration Available', 'Permits & Code Compliance', 'Lifetime Liner Warranty Available'],
    },
    included: {
      headline: 'Our Liner Installation Includes',
      items: ['Pre-installation flue measurement', 'Liner sizing to appliance output', 'UL-listed stainless liner', 'Top plate & termination cap', 'Smoke test & draft verification', 'Installation documentation'],
    },
    offer: {
      headline: 'Complete Chimney Relining Package',
      items: ['UL-listed stainless steel liner', 'Properly sized for your system', 'Top plate & cap included', 'Smoke test & code compliance'],
    },
    faqs: [
      { q: 'What is a chimney liner and why is it important?', a: "A chimney liner is the interior channel that guides combustion gases safely out of the home. It protects the surrounding structure from heat and corrosive gases. Without a sound liner, you're at risk for chimney fire, CO intrusion, and structural damage." },
      { q: 'What type of liner do I need?', a: 'The right liner depends on your fuel type (wood, gas, or oil) and the appliance BTU output. We assess your system and recommend the correct liner size and material.' },
      { q: 'What is the difference between a flexible liner and rigid liner?', a: 'Flexible stainless liner systems are installed in one continuous run and work well in chimneys with offsets. Rigid sections are used in straight flues. Most residential installations use flexible liner.' },
      { q: 'How long does chimney liner installation take?', a: 'Most liner installations are completed in 2–4 hours depending on chimney height and configuration.' },
      { q: 'Does a new liner come with a warranty?', a: "Yes. Our UL-listed liner systems come with manufacturer warranties ranging from lifetime to 20 years, depending on the system selected." },
      { q: 'How much does chimney liner installation cost?', a: 'Stainless steel liner installation typically ranges from $1,500–$3,500 depending on flue height, diameter, and access. We provide detailed written quotes with no obligation.' },
    ],
    finalCta: {
      headline: 'A Sound Liner Means a Safe Home',
      subheadline: "Don't delay a liner inspection or installation. It's one of the most critical safety components in your chimney system.",
      callout: 'Book Your Liner Consultation Today',
      bullets: ['Free Written Quote', 'UL-Listed Systems Only', 'Licensed & Code-Compliant Installation'],
    },
    beforeAfter: {
      before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-after.jpg',
      after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/chimney-sweep-before.jpg',
      caption: 'Stainless Steel Liner Installation',
      location: 'Fairfield, CT',
    },
  },

  'gas-fireplace-log-sets': {
    hero: {
      headline: 'Gas Fireplace & Log Set Service, Repair & Installation',
      offer: 'Expert Gas Fireplace Service — Inspection, Cleaning & Log Set Solutions',
      subheadline: 'Gas fireplaces require regular service to operate safely and efficiently. Whether you need an inspection, a repair, or a new log set installation — we handle it all.',
      trustBadges: ['Gas Appliance Specialists', 'Log Set Installation', 'Safety Inspection Included', 'Same-Week Appointments', 'Licensed & Insured'],
    },
    needSection: {
      title: 'It May Be Time to Service Your Gas Fireplace If:',
      items: [
        "It hasn't been serviced in over a year",
        'The pilot light keeps going out',
        'You notice a gas smell near the fireplace',
        'The flame is yellow or irregular instead of blue',
        'The unit turns on but shuts off unexpectedly',
        'You want to upgrade to a new log set',
      ],
      ctaLabel: 'Schedule My Service',
    },
    whyUs: {
      headline: 'Gas Fireplace Experts You Can Trust',
      body: 'Gas fireplaces have unique service requirements. Our technicians are trained specifically on gas appliances — not just chimney sweeps doing double duty.',
      bullets: ['Trained Gas Appliance Technicians', 'Full Inspection & Cleaning', 'Thermocouple & Valve Service', 'Log Set Sales & Installation', 'Safety Verification Before We Leave', 'Licensed & Insured'],
    },
    included: {
      headline: 'Our Gas Fireplace Service Includes',
      items: ['Burner & pilot system inspection', 'Glass panel cleaning', 'Log set inspection or installation', 'Gas line connection check', 'Ventilation & flue inspection', 'Safety test before sign-off'],
    },
    offer: {
      headline: 'Gas Fireplace Service & Safety Package',
      items: ['Burner & pilot inspection', 'Glass & component cleaning', 'Log set inspection or swap', 'Full safety verification'],
    },
    faqs: [
      { q: 'How often should a gas fireplace be serviced?', a: 'Gas fireplaces should be professionally inspected and serviced at least once a year, ideally before the heating season begins.' },
      { q: 'Is a gas fireplace safe without a chimney?', a: 'Direct-vent gas fireplaces vent through an exterior wall and do not require a traditional chimney. However, they still require regular inspection to ensure the vent pipe and seals are intact.' },
      { q: 'Can you install gas log sets?', a: 'Yes. We supply and install vented and vent-free gas log sets for existing fireplaces. We help you select the right BTU and style for your space.' },
      { q: 'What causes a gas fireplace pilot to keep going out?', a: 'Common causes include a dirty or failing thermocouple, a clogged pilot orifice, or a faulty gas valve. Our technicians diagnose and service these components.' },
      { q: 'Do gas fireplaces produce carbon monoxide?', a: 'When properly maintained and vented, gas fireplaces produce very low levels of CO. However, a blocked vent, cracked heat exchanger, or improper installation can increase CO levels — which is why annual service is critical.' },
      { q: 'How much does gas fireplace service cost?', a: 'A standard gas fireplace inspection and cleaning starts around $99–$175. Log set installation and repair costs vary by scope. Contact us for availability and pricing.' },
    ],
    finalCta: {
      headline: 'Keep Your Gas Fireplace Safe and Ready to Use',
      subheadline: 'Regular service means reliable heat, safe operation, and a fireplace that looks and works the way it should.',
      callout: 'Book Your Gas Fireplace Service Today',
      bullets: ['Safety Inspection Included', 'Log Set Installation Available', 'Same-Week Appointments'],
    },
    beforeAfter: {
      before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-before.jpg',
      after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-after.jpg',
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
      before: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-before.jpg',
      after: 'https://cgpoxvmlrecntospmmss.supabase.co/storage/v1/object/public/website-images/fireplace-install-after.jpg',
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

function HeroForm({ region }: { region: { phoneNumbers: string[] } }) {
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
        <h2 className="text-xl font-extrabold text-white leading-tight">Get Your Free Quote</h2>
        <p className="text-gray-400 text-xs font-medium mt-0.5">We call back within 2 hours · No obligation</p>
      </div>
      <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-70" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-green-800 text-xs font-semibold"><strong>47 homeowners</strong> requested a quote this week</span>
      </div>
      <div className="p-6">
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
            <div className="bg-white rounded-xl border border-green-100 p-4 text-left">
              <p className="text-xs font-extrabold text-gray-700 mb-2">What happens next:</p>
              <ol className="space-y-1.5">
                {['Our team reviews your request immediately', 'Expert technician calls to discuss your needs', 'We schedule at your most convenient time', 'Professional service — labor guarantee included'].map((s, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="font-extrabold text-green-600 w-3 flex-shrink-0">{i + 1}.</span>{s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-red-700 font-medium text-sm">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="sd-name" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">Your Name *</label>
              <input id="sd-name" type="text" name="name" placeholder="John Smith" required autoComplete="given-name"
                value={form.name} onChange={handleChange}
                className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[50px] hover:border-gray-300 placeholder:text-gray-300 bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label htmlFor="sd-phone" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">Best Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input id="sd-phone" type="tel" name="phone" placeholder="(555) 123-4567" required inputMode="tel" autoComplete="tel"
                  value={form.phone} onChange={handleChange}
                  className="w-full pl-10 pr-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all min-h-[50px] hover:border-gray-300 placeholder:text-gray-300 bg-gray-50 focus:bg-white" />
              </div>
            </div>
            <div>
              <label htmlFor="sd-service" className="block text-xs font-extrabold text-gray-600 uppercase tracking-wide mb-1.5">Service Needed</label>
              <div className="relative">
                <select id="sd-service" name="service" value={form.service} onChange={handleChange}
                  className="w-full px-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/15 focus:border-primary font-medium transition-all appearance-none bg-gray-50 focus:bg-white min-h-[50px] hover:border-gray-300 cursor-pointer">
                  {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-gradient-to-r from-primary to-red-700 text-white rounded-xl font-extrabold text-base hover:from-red-700 hover:to-primary active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group">
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <span className="relative flex items-center gap-2">
                {submitting ? (
                  <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending...</>
                ) : 'Get My Free Quote →'}
              </span>
            </button>
            <p className="text-center text-xs text-gray-400 font-medium">No obligation · No spam · 100% private</p>
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

  const seoTitle = `${service.name} in ${getRegionText()} | Chimney Force`;
  const seoDescription = `Expert ${service.name.toLowerCase()} services in ${getRegionText()}. Licensed & insured. Same-day service available. Call now!`;
  const keywords = `${service.name.toLowerCase()}, chimney services, chimney force, ${isCT ? 'ct' : isNJ ? 'nj' : 'ct nj'}`;

  const serviceSchema = createServiceSchema(service.name, seoDescription, getRegionText(), region.phoneNumbers[0]);
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
        structuredData={[serviceSchema, breadcrumbs]}
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
                  Serving {region.regionName}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-tight">
                {content.hero.headline}
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
                    <span className="font-bold text-white">Sub-contractor disclosure:</span> The gas plumbing portions of this service may be performed by qualified, licensed sub-contractors on our behalf.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {content.needSection.items.map((item, idx) => (
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
        <section className="py-16 md:py-20 bg-white">
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
        <section className="py-16 md:py-20 bg-gray-50">
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
                  <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-secondary to-amber-400 text-gray-900 pl-3 pr-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-[0_4px_20px_rgba(234,179,8,0.45)] border border-yellow-300/40">
                    <span className="flex items-center justify-center w-5 h-5 bg-gray-900/15 rounded-full flex-shrink-0">
                      <MapPin className="w-3 h-3" />
                    </span>
                    Serving {region.regionName}
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Starting at $99</div>
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
                      { stat: '$99',     label: 'Starting Price' },
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
        <section className="py-16 md:py-20 bg-white">
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
                  Get My Appointment
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
