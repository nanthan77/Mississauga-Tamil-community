'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { events, Event } from '@/data/events';
import { Calendar, MapPin, Clock, Users, Share2, CalendarPlus, ArrowRight, Check } from 'lucide-react';

type CategoryFilter = 'all' | 'cultural' | 'religious' | 'sports' | 'youth' | 'seniors' | 'community';

export default function Events() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const categories: { key: CategoryFilter; label: string; labelTa: string }[] = [
    { key: 'all', label: 'All', labelTa: 'அனைத்தும்' },
    { key: 'cultural', label: 'Cultural', labelTa: 'கலாச்சாரம்' },
    { key: 'religious', label: 'Religious', labelTa: 'மதம்' },
    { key: 'sports', label: 'Sports', labelTa: 'விளையாட்டு' },
    { key: 'youth', label: 'Youth', labelTa: 'இளைஞர்' },
    { key: 'seniors', label: 'Seniors', labelTa: 'மூத்தோர்' },
  ];

  const filteredEvents = (activeCategory === 'all'
    ? events
    : events.filter(event => event.category === activeCategory))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ta-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    // Keeping subtle backgrounds but using glass styles
    return 'bg-[var(--glass-highlight)] text-white border border-[var(--glass-border)]';
  };

  return (
    <section id="events" className="py-12 sm:py-16 md:py-24 relative">
      {/* Background Decor */}
      <div className="absolute bottom-1/4 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-[var(--accent-red)] opacity-5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {t('events.title')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
            {t('events.subtitle')}
          </p>
        </div>

        {/* Category Filters - Horizontal scroll on mobile */}
        <div className="mb-8 sm:mb-12 md:mb-16 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex sm:flex-wrap sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all backdrop-blur-sm border whitespace-nowrap flex-shrink-0 min-h-[40px] sm:min-h-[44px] ${activeCategory === category.key
                  ? 'bg-[var(--accent-gold)] text-[var(--bg-primary)] border-[var(--accent-gold)] font-bold'
                  : 'bg-[var(--glass-bg)] text-slate-300 border-[var(--glass-border)] hover:bg-[var(--glass-highlight)] hover:text-white'
                  }`}
              >
                {language === 'en' ? category.label : category.labelTa}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid - Blog Style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {filteredEvents.map((event: Event) => (
            <EventCard
              key={event.id}
              event={event}
              language={language}
              t={t}
              formatDate={formatDate}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>

        {/* View All Events CTA */}
        <div className="text-center mt-10 sm:mt-16 md:mt-20">
          <a
            href="#"
            className="inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 bg-[var(--glass-bg)] border border-[var(--accent-gold)] text-[var(--accent-gold)] font-semibold rounded-lg hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all uppercase tracking-wider text-sm sm:text-base min-h-[48px]"
          >
            {t('events.viewAll')}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}

interface EventCardProps {
  event: Event;
  language: string;
  t: (key: string) => string;
  formatDate: (date: string) => string;
  getCategoryColor: (category: string) => string;
}

function EventCard({ event, language, t, formatDate, getCategoryColor }: EventCardProps) {
  return (
    <article className="glass-panel rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col group border-0 ring-1 ring-[var(--glass-border)]">
      {/* Event Image */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden group-hover:scale-105 transition-transform duration-500">
        {event.image ? (
          <img
            src={event.image}
            alt={language === 'en' ? event.title : event.titleTamil}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-500 p-4">
              <Calendar className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 opacity-30 group-hover:text-[var(--accent-gold)] transition-colors" />
              <p className="text-xs sm:text-sm opacity-50 uppercase tracking-widest">Event Image</p>
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {event.isFeatured && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-[var(--accent-gold)] text-[var(--bg-primary)] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider shadow-md z-10">
            FEATURED
          </div>
        )}

        {/* Category Badge */}
        <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-10 ${getCategoryColor(event.category)}`}>
          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 line-clamp-2 leading-tight">
          {language === 'en' ? event.title : event.titleTamil}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center text-slate-400 text-xs sm:text-sm mb-1.5 sm:mb-2">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-[var(--accent-gold)] flex-shrink-0" />
          <span className="truncate">{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-[var(--accent-gold)] flex-shrink-0" />
          <span>{event.time}</span>
        </div>

        {/* Venue */}
        <div className="flex items-start text-slate-300 text-xs sm:text-sm mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-[var(--glass-border)]">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 mt-0.5 text-[var(--accent-red)] flex-shrink-0" />
          <span className="line-clamp-2">{language === 'en' ? event.venue : event.venueTamil}</span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3 leading-relaxed flex-grow">
          {language === 'en' ? event.description : event.descriptionTamil}
        </p>

        {/* Pricing */}
        <div className="bg-[var(--glass-bg)] rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[var(--glass-border)]">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-[var(--accent-gold)]" />
              <span className="font-medium text-slate-300">{t('events.members')}:</span>
            </div>
            <span className="font-bold text-green-400">
              {event.pricing.members === 'FREE' ? t('events.free') : `$${event.pricing.members}`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-auto">
          <button className="flex-1 bg-[var(--accent-red)] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-xs sm:text-sm shadow-lg shadow-red-900/20 min-h-[44px]">
            {t('events.register')}
          </button>
          <button className="p-2.5 sm:p-3 border border-[var(--glass-border)] rounded-lg hover:bg-[var(--glass-highlight)] hover:text-[var(--accent-gold)] transition-colors text-slate-400 min-w-[44px] min-h-[44px] flex items-center justify-center" title={t('events.share')}>
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
