'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Check, Star, Users, User, GraduationCap, Heart } from 'lucide-react';

export default function Membership() {
  const { language, t } = useLanguage();
  const { membershipTiers } = useAdmin();

  // Map icon names to components
  const iconMap: Record<string, typeof User> = {
    'Individual': User,
    'Family': Users,
    'Student': GraduationCap,
    'Senior': Heart,
  };

  const benefits = [
    { key: 'benefit1', icon: '🎫' },
    { key: 'benefit2', icon: '💰' },
    { key: 'benefit3', icon: '🗳️' },
    { key: 'benefit4', icon: '🎯' },
    { key: 'benefit5', icon: '🤝' },
    { key: 'benefit6', icon: '🌟' },
  ];

  // Filter active tiers
  const activeTiers = membershipTiers.filter(tier => tier.isActive);

  return (
    <section id="membership" className="pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-24 relative">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-blue-900/20 opacity-30 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {t('membership.title')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
            {t('membership.subtitle')}
          </p>
        </div>

        {/* Pricing Cards - 2 columns on mobile, then responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 mb-10 sm:mb-16 md:mb-20">
          {activeTiers.map((tier) => {
            const IconComponent = iconMap[tier.name] || User;
            return (
              <div
                key={tier.id}
                className={`relative glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 transition-transform hover:scale-105 duration-300 flex flex-col ${tier.isPopular ? 'border-2 border-[var(--mta-maroon)] shadow-[0_0_30px_rgba(139,21,56,0.3)]' : 'border border-slate-700'}`}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 w-full text-center">
                    <span className="bg-[var(--mta-maroon)] text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold inline-flex items-center shadow-lg uppercase tracking-wider">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                      <span className="hidden xs:inline">{language === 'en' ? 'Most Popular' : 'பிரபலமானது'}</span>
                      <span className="xs:hidden">{language === 'en' ? 'Popular' : 'பிரபல'}</span>
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 border border-slate-700 mt-2 sm:mt-0">
                  <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[var(--accent-gold)]" />
                </div>

                {/* Plan Name */}
                <h3 className="text-sm sm:text-lg md:text-xl font-bold text-center text-white mb-1 sm:mb-2">
                  {language === 'en' ? tier.name : tier.nameTamil}
                </h3>

                {/* Price */}
                <div className="text-center mb-3 sm:mb-4 md:mb-6">
                  <span className="text-xl sm:text-3xl md:text-4xl font-bold text-white">${tier.price}</span>
                  <span className="text-slate-500 text-[10px] sm:text-xs md:text-sm ml-0.5 sm:ml-1">/{t('membership.year')}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8 flex-grow">
                  {(language === 'en' ? tier.features : tier.featuresTamil).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-[10px] sm:text-xs md:text-sm text-slate-300">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 mr-1.5 sm:mr-2 md:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href="/register"
                  className={`w-full py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-center block text-xs sm:text-sm md:text-base min-h-[40px] sm:min-h-[44px] flex items-center justify-center ${tier.isPopular
                      ? 'bg-[var(--mta-maroon)] text-white hover:bg-[#6b1028] shadow-lg shadow-red-900/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                    }`}
                >
                  {t('membership.joinNow')}
                </Link>
              </div>
            );
          })}
        </div>

        {/* All Benefits */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-center text-white mb-10">
            {t('membership.benefits')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-[var(--accent-gold)] transition-colors group"
              >
                <span className="text-3xl mr-4 group-hover:scale-110 transition-transform block">{benefit.icon}</span>
                <span className="text-slate-200 font-medium">
                  {t(`membership.${benefit.key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 rounded-xl px-8 py-5 backdrop-blur-sm">
            <p className="text-slate-300">
              <strong className="text-[var(--accent-gold)] block mb-2">{language === 'en' ? 'How to Join:' : 'சேர்வது எப்படி:'}</strong>
              {language === 'en'
                ? 'E-transfer membership fee to '
                : 'உறுப்பினர் கட்டணத்தை '}
              <a href="mailto:mississaugatamils@gmail.com" className="text-[var(--accent-gold)] hover:underline font-medium">
                mississaugatamils@gmail.com
              </a>
              {language === 'en' ? ' and ' : ' க்கு மின்-பரிமாற்றம் செய்து '}
              <Link href="/register" className="text-[var(--accent-gold)] hover:underline font-medium">
                {language === 'en' ? 'fill the registration form' : 'பதிவு படிவத்தை நிரப்பவும்'}
              </Link>
              {language === 'en' ? '.' : '.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
