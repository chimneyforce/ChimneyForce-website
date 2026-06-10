import React, { useState, useEffect, useRef } from 'react';
import { Users, CheckCircle, Clock, Shield } from 'lucide-react';

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const stats: Stat[] = [
  {
    icon: Clock,
    value: 15,
    suffix: '+',
    label: 'Years Serving CT & NJ',
  },
  {
    icon: Users,
    value: 10000,
    suffix: '+',
    label: 'Happy Customers',
  },
  {
    icon: CheckCircle,
    value: 1200,
    suffix: '+',
    label: 'Projects This Year',
  },
  {
    icon: Shield,
    value: 100,
    suffix: '%',
    label: 'Satisfaction Guarantee',
  },
];

export const StatisticsCounter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.value / steps;

      const timer = setInterval(() => {
        currentStep++;
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.min(
            Math.round(increment * currentStep),
            stat.value
          );
          return newCounts;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }, [isVisible]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }
    return num.toString();
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4 md:mb-6 leading-tight px-4">
            Proven Track Record of Excellence
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-600 px-4 leading-relaxed">
            Our numbers speak for themselves
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group cursor-default"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`,
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/15 to-primary/5 rounded-3xl mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 leading-none">
                  {stat.prefix}
                  {formatNumber(counts[index])}
                  <span className="text-secondary">{stat.suffix}</span>
                </div>
                <div className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wide leading-tight px-2">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
