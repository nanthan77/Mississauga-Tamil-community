'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Store, Calendar, Building2, BookOpen, ArrowRight, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function InfoHub() {
  const { language, t } = useLanguage();

  const categories = [
    {
      icon: Store,
      title: t('infoHub.businesses'),
      titleTa: 'தமிழ் வணிகங்கள்',
      description: t('infoHub.businessesDesc'),
      descriptionTa: 'மிசிசாகாவில் தமிழர்களுக்கு சொந்தமான வணிகங்களைக் கண்டறியவும்',
      count: '150+',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50/10',
    },
    {
      icon: Calendar,
      title: t('infoHub.gtaEvents'),
      titleTa: 'GTA தமிழ் நிகழ்வுகள்',
      description: t('infoHub.gtaEventsDesc'),
      descriptionTa: 'கிரேட்டர் டொரன்டோ பகுதி முழுவதும் வரவிருக்கும் நிகழ்வுகள்',
      count: '50+',
      color: 'bg-green-500',
      bgColor: 'bg-green-50/10',
    },
    {
      icon: Building2,
      title: t('infoHub.organizations'),
      titleTa: 'தமிழ் அமைப்புகள்',
      description: t('infoHub.organizationsDesc'),
      descriptionTa: 'GTA-யில் உள்ள தமிழ் சங்கங்களின் அடைவு',
      count: '25+',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50/10',
    },
    {
      icon: BookOpen,
      title: t('infoHub.resources'),
      titleTa: 'சமூக வளங்கள்',
      description: t('infoHub.resourcesDesc'),
      descriptionTa: 'உதவிகரமான சேவைகள் மற்றும் ஆதரவு',
      count: '100+',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50/10',
    },
  ];

  // Sample upcoming GTA events
  const gtaEvents = [
    {
      title: 'Brampton Tamil Association - Thai Pongal',
      titleTa: 'பிராம்ப்டன் தமிழ் சங்கம் - தைப் பொங்கல்',
      date: 'Jan 13, 2026',
      location: 'Brampton',
    },
    {
      title: 'Markham Tamil Association - New Year Gala',
      titleTa: 'மார்க்கம் தமிழ் சங்கம் - புத்தாண்டு விழா',
      date: 'Apr 14, 2026',
      location: 'Markham',
    },
    {
      title: 'Scarborough Tamil Festival',
      titleTa: 'ஸ்கார்பரோ தமிழ் திருவிழா',
      date: 'Jul 25, 2026',
      location: 'Scarborough',
    },
  ];

  // Sample business categories
  const businessCategories = [
    { name: 'Restaurants', nameTa: 'உணவகங்கள்', count: 45 },
    { name: 'Professional Services', nameTa: 'தொழில்முறை சேவைகள்', count: 32 },
    { name: 'Healthcare', nameTa: 'சுகாதாரம்', count: 28 },
    { name: 'Education', nameTa: 'கல்வி', count: 20 },
    { name: 'Beauty & Wellness', nameTa: 'அழகு & ஆரோக்கியம்', count: 15 },
    { name: 'Home Services', nameTa: 'வீட்டு சேவைகள்', count: 10 },
  ];

  return (
    <section id="info-hub" className="py-12 sm:py-16 md:py-24 relative">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-purple-900/10 opacity-40 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {t('infoHub.title')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
            {t('infoHub.subtitle')}
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16">
          {categories.map((category, index) => (
            <div
              key={index}
              className="glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 hover:bg-white/5 transition-all cursor-pointer group border border-slate-700/50 hover:border-slate-500"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${category.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                <category.icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${category.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2 line-clamp-2">
                {language === 'en' ? category.title : category.titleTa}
              </h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-2">
                {language === 'en' ? category.description : category.descriptionTa}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className={`text-lg sm:text-xl md:text-2xl font-bold ${category.color.replace('bg-', 'text-')}`}>
                  {category.count}
                </span>
                <button className="text-[var(--accent-gold)] font-semibold text-[10px] sm:text-xs md:text-sm flex items-center group-hover:text-white transition-colors min-h-[32px]">
                  <span className="hidden xs:inline">{t('infoHub.explore')}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming GTA Events */}
          <div className="glass-panel rounded-2xl p-8 border border-slate-700/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-[var(--accent-gold)]" />
                {language === 'en' ? 'Upcoming GTA Tamil Events' : 'வரவிருக்கும் GTA தமிழ் நிகழ்வுகள்'}
              </h3>
              <a href="#" className="text-slate-400 text-sm font-semibold flex items-center hover:text-white transition-colors">
                {language === 'en' ? 'View All' : 'அனைத்தும் காண்க'}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="space-y-4">
              {gtaEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-600"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mr-4 text-slate-300 font-bold">
                    {event.date.split(' ')[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-100 truncate mb-1">
                      {language === 'en' ? event.title : event.titleTa}
                    </h4>
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{event.date}</span>
                      <span className="mx-2 text-slate-600">|</span>
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Categories */}
          <div className="glass-panel rounded-2xl p-8 border border-slate-700/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Store className="w-5 h-5 mr-3 text-[var(--accent-gold)]" />
                {language === 'en' ? 'Business Directory' : 'வணிக அடைவு'}
              </h3>
              <a href="#" className="text-slate-400 text-sm font-semibold flex items-center hover:text-white transition-colors">
                {language === 'en' ? 'View All' : 'அனைத்தும் காண்க'}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {businessCategories.map((cat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-600"
                >
                  <span className="font-medium text-slate-300 text-sm">
                    {language === 'en' ? cat.name : cat.nameTa}
                  </span>
                  <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs font-semibold">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Your Business/Event CTA */}
        <div className="mt-16 relative overflow-hidden rounded-2xl p-10 text-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-red)] to-red-900 opacity-90 z-0"></div>
          <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-10 z-0"></div>

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {language === 'en' ? 'List Your Business or Event' : 'உங்கள் வணிகம் அல்லது நிகழ்வை பட்டியலிடுங்கள்'}
            </h3>
            <p className="text-red-100 mb-8 max-w-2xl mx-auto text-lg">
              {language === 'en'
                ? 'Are you a Tamil business owner or organizing a community event? Get listed in our directory for free!'
                : 'நீங்கள் ஒரு தமிழ் வணிக உரிமையாளரா அல்லது சமூக நிகழ்வை ஏற்பாடு செய்கிறீர்களா? எங்கள் அடைவில் இலவசமாக பட்டியலிடுங்கள்!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button className="px-8 py-3 bg-white text-red-900 font-bold rounded-lg hover:bg-red-50 transition-colors shadow-lg">
                {language === 'en' ? 'Submit Business' : 'வணிகத்தை சமர்ப்பிக்கவும்'}
              </button>
              <button className="px-8 py-3 bg-red-950/30 text-white border border-white/20 font-bold rounded-lg hover:bg-red-950/50 transition-colors">
                {language === 'en' ? 'Submit Event' : 'நிகழ்வை சமர்ப்பிக்கவும்'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
