import React from 'react';
import { Shield, Package, ClipboardCheck, CheckCircle } from 'lucide-react';

const defaultBadges = [
  { icon: Shield, label: 'Fully Insured', sub: 'Licensed & Bonded' },
  { icon: Package, label: 'Premium Materials', sub: 'High Grade Products' },
  { icon: ClipboardCheck, label: 'Labor Guarantee', sub: 'All Work Guaranteed' },
  { icon: CheckCircle, label: 'State Licensed', sub: 'CT & NJ Certified' },
];

interface TrustBadgeBarProps {
  lastBadgeOverride?: { label: string; sub?: string };
}

export const TrustBadgeBar: React.FC<TrustBadgeBarProps> = ({ lastBadgeOverride }) => {
  const badges = lastBadgeOverride
    ? [...defaultBadges.slice(0, 3), { ...defaultBadges[3], ...lastBadgeOverride }]
    : defaultBadges;

  return (
    <section className="bg-white border-b border-gray-100 py-4 md:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 group cursor-default"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.07}s both` }}
              >
                <div className="w-9 h-9 flex-shrink-0 bg-primary/8 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-200 shadow-sm">
                  <Icon className="text-primary" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-extrabold text-gray-900 leading-tight">{badge.label}</div>
                  {badge.sub && <div className="text-xs font-medium text-gray-400 leading-tight mt-0.5">{badge.sub}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
