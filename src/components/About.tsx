'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Target, Eye, Users, Heart, Award, Globe } from 'lucide-react';

export default function About() {
  const { language, t } = useLanguage();
  const { aboutContent } = useAdmin();

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      titleTa: 'சமூகம் முதல்',
      description: 'Everything we do is centered around serving our Tamil community',
      descriptionTa: 'நாங்கள் செய்வது அனைத்தும் தமிழ் சமூகத்திற்கு சேவை செய்வதில் மையமாக உள்ளது'
    },
    {
      icon: Award,
      title: 'Cultural Pride',
      titleTa: 'கலாச்சார பெருமை',
      description: 'Preserving and celebrating our rich Tamil heritage',
      descriptionTa: 'எங்கள் செழிப்பான தமிழ் பாரம்பரியத்தை பாதுகாத்து கொண்டாடுதல்'
    },
    {
      icon: Users,
      title: 'Unity',
      titleTa: 'ஒற்றுமை',
      description: 'Bringing generations together through shared experiences',
      descriptionTa: 'பகிரப்பட்ட அனுபவங்கள் மூலம் தலைமுறைகளை ஒன்றிணைத்தல்'
    },
    {
      icon: Globe,
      title: 'Inclusion',
      titleTa: 'உள்ளடக்கம்',
      description: 'Welcoming everyone who wishes to be part of our community',
      descriptionTa: 'எங்கள் சமூகத்தின் ஒரு பகுதியாக இருக்க விரும்பும் அனைவரையும் வரவேற்கிறோம்'
    }
  ];

  return (
    <section id="about" className="pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-[var(--accent-gold)] opacity-5 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {t('about.title')}
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
            {language === 'en' ? aboutContent.intro : aboutContent.introTamil}
          </p>
        </div>

        {/* Motto & Mission */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-16 md:mb-20">
          {/* Motto */}
          <div className="glass-panel rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-[var(--accent-gold)] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
            <div className="flex items-start sm:items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[var(--glass-highlight)] rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 md:mr-6 border border-[var(--glass-border)] flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[var(--accent-gold)]" />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider font-semibold mb-1">Our Motto</h3>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  "{aboutContent.motto}"
                  <span className="block text-[var(--accent-gold)] font-serif mt-1 text-sm sm:text-base md:text-lg">{aboutContent.mottoTamil}</span>
                </h3>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg">
              {language === 'en' ? aboutContent.mottoDescription : aboutContent.mottoDescriptionTamil}
            </p>
          </div>

          {/* Mission */}
          <div className="glass-panel rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-[var(--accent-red)] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
            <div className="flex items-start sm:items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[var(--glass-highlight)] rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 md:mr-6 border border-[var(--glass-border)] flex-shrink-0">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[var(--accent-red)]" />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider font-semibold mb-1">Our Mission</h3>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Heritage & Integration</h3>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg">
              {language === 'en' ? aboutContent.mission : aboutContent.missionTamil}
            </p>
          </div>
        </div>

        {/* Civic Leadership & Going Green */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-green-500 pl-4">
            {language === 'en' ? aboutContent.civicTitle : aboutContent.civicTitleTamil}
          </h3>
          <div className="glass-panel rounded-2xl p-8 md:p-12 border-t-4 border-t-green-500">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  {language === 'en' ? aboutContent.civicDescription : aboutContent.civicDescriptionTamil}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800 text-sm font-medium">EV Infrastructure</span>
                  <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800 text-sm font-medium">Active School Travel</span>
                  <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800 text-sm font-medium">Sustainable Events</span>
                </div>
              </div>
              <div className="bg-green-900/20 rounded-xl p-6 border border-green-800/50 text-center">
                <Globe className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-white font-bold mb-2">Eco-Conscious Galas</h4>
                <p className="text-sm text-slate-400">Implementing waste diversion and digital communication to minimize environmental footprint.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Impact & Youth */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Food Bank */}
          <div className="glass-panel rounded-2xl p-10 border-l-4 border-l-[var(--accent-gold)]">
            <div className="flex items-center mb-6">
              <Heart className="w-8 h-8 text-[var(--accent-gold)] mr-4" />
              <h3 className="text-xl font-bold text-white">
                {language === 'en' ? aboutContent.socialTitle : aboutContent.socialTitleTamil}
              </h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              {language === 'en' ? aboutContent.socialDescription : aboutContent.socialDescriptionTamil}
            </p>
          </div>

          {/* Youth Wing */}
          <div className="glass-panel rounded-2xl p-10 border-l-4 border-l-blue-500">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-blue-500 mr-4" />
              <h3 className="text-xl font-bold text-white">
                {language === 'en' ? aboutContent.youthTitle : aboutContent.youthTitleTamil}
              </h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              {language === 'en' ? aboutContent.youthDescription : aboutContent.youthDescriptionTamil}
            </p>
          </div>
        </div>

        {/* Learn More CTA */}
        <div className="text-center mt-16">
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 border border-[var(--accent-red)] text-white font-semibold rounded-lg hover:bg-[var(--accent-red)] hover:shadow-lg hover:shadow-red-900/30 transition-all font-serif tracking-wide"
          >
            {language === 'en' ? "Join Our Movement" : "எங்கள் இயக்கத்தில் இணையுங்கள்"}
          </Link>
        </div>
      </div>
    </section>
  );
}
