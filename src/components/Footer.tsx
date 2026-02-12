'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { sponsors } from '@/data/sponsors';
import { Facebook, Instagram, Youtube, MessageCircle, Mail, ArrowRight, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const { language, t } = useLanguage();
  const { siteSettings } = useAdmin();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === 'en' ? 'Thank you for subscribing!' : 'குழுசேர்ந்ததற்கு நன்றி!');
    setEmail('');
  };

  const quickLinks = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.events'), href: '#events' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.membership'), href: '#membership' },
    { label: t('nav.infoHub'), href: '#info-hub' },
    { label: t('nav.gallery'), href: '#gallery' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: siteSettings.facebook || '#' },
    { icon: Instagram, label: 'Instagram', href: siteSettings.instagram || '#' },
    { icon: Youtube, label: 'YouTube', href: siteSettings.youtube || '#' },
    { icon: MessageCircle, label: 'WhatsApp', href: siteSettings.whatsapp || '#' },
  ];

  // Get top sponsors for footer display
  const topSponsors = sponsors.filter(s => s.tier === 'platinum' || s.tier === 'gold').slice(0, 4);

  return (
    <footer className="bg-[var(--mta-maroon)] text-white w-full">
      {/* Sponsors Strip */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {topSponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <div className="w-24 h-12 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-600 text-xs font-medium">
                    {sponsor.name.split(' ')[0]}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo & About */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 mr-2 sm:mr-3">
                <Image
                  src="/mta-logo-transparent.png"
                  alt="MTA Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base md:text-lg leading-tight">
                  {language === 'en' ? 'Mississauga Tamils' : 'மிசிசாகா தமிழர்கள்'}
                </p>
                <p className="text-white/70 text-xs sm:text-sm">
                  {language === 'en' ? 'Association' : 'சங்கம்'}
                </p>
              </div>
            </div>
            <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">
              {language === 'en' ? siteSettings.tagline : siteSettings.taglineTamil}
            </p>
            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px]"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm py-1 inline-block min-h-[32px] flex items-center"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1">
            <h4 className="font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4">{t('footer.connect')}</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <a href={`mailto:${siteSettings.email}`} className="text-white/70 hover:text-white flex items-center py-1 min-h-[32px]">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  <span className="break-all">{siteSettings.email}</span>
                </a>
              </li>
              <li className="text-white/70 text-xs sm:text-sm">
                {language === 'en' ? siteSettings.address : siteSettings.addressTamil}
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4">{t('footer.newsletter')}</h4>
            <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
              {t('footer.newsletterText')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-2 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2.5 sm:py-2 bg-[var(--mta-gold)] text-[var(--mta-maroon)] rounded-r-lg font-semibold hover:bg-[var(--mta-gold-light)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6">
          <div className="flex flex-col gap-4 items-center text-center">
            <p className="text-white/60 text-xs sm:text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors py-1 min-h-[32px] flex items-center">
                {t('footer.privacy')}
              </a>
              <span className="text-white/40 hidden xs:inline">|</span>
              <a href="#" className="text-white/60 hover:text-white transition-colors py-1 min-h-[32px] flex items-center">
                {t('footer.terms')}
              </a>
              <span className="text-white/40 hidden xs:inline">|</span>
              <Link href="/admin" className="text-white/60 hover:text-white transition-colors flex items-center gap-1 py-1 min-h-[32px]">
                <Settings className="w-3 h-3" />
                Admin
              </Link>
            </div>
            <p className="text-white/60 text-xs sm:text-sm">
              Crafted by <a href="https://safenetcreations.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">safenetcreations.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
