'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';
import Image from 'next/image';

interface NavItem {
  key: string;
  href: string;
  isPage?: boolean;
}

const navItems: NavItem[] = [
  { key: 'about', href: '#about' },
  { key: 'events', href: '#events' },
  { key: 'membership', href: '#membership' },
  { key: 'sponsors', href: '/sponsors', isPage: true },
  { key: 'infoHub', href: '#info-hub' },
  { key: 'gallery', href: '#gallery' },
  { key: 'contact', href: '#contact' },
];

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navItems.map(item => item.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[var(--glass-border)] ${isScrolled
        ? 'bg-[var(--bg-primary)]/95 shadow-lg backdrop-blur-md'
        : 'bg-[var(--bg-primary)]/50 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}>
              <div className="flex items-center space-x-2">
                <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                  <Image
                    src="/mta-logo-transparent.png"
                    alt="MTA Logo"
                    fill
                    className="object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-white text-sm md:text-base leading-tight font-serif tracking-wide">
                    {language === 'en' ? 'Mississauga Tamils' : 'மிசிசாகா தமிழ்'}
                  </p>
                  <p className="text-xs text-[var(--accent-gold)] uppercase tracking-widest">
                    {language === 'en' ? 'Association' : 'ஒன்றியம்'}
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              item.isPage ? (
                <a
                  key={item.key}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 text-slate-300 hover:text-white hover:bg-[var(--glass-bg)]"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${activeSection === item.href.replace('#', '')
                    ? 'text-[var(--accent-gold)] bg-[var(--glass-highlight)]'
                    : 'text-slate-300 hover:text-white hover:bg-[var(--glass-bg)]'
                    }`}
                >
                  {t(`nav.${item.key}`)}
                </a>
              )
            ))}
          </div>

          {/* Language Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle - 44x44px minimum touch target */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 rounded-md text-sm font-medium border border-[var(--glass-border)] bg-[var(--glass-bg)] text-slate-300 hover:text-white hover:border-[var(--accent-gold)] transition-all"
              aria-label={language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
            >
              <Globe className="w-4 h-4 mr-1 sm:mr-1" />
              <span className="font-semibold hidden xs:inline">
                {language === 'en' ? 'EN' : 'தமிழ்'}
              </span>
              <span className="font-semibold xs:hidden text-xs">
                {language === 'en' ? 'EN' : 'த'}
              </span>
            </button>

            {/* Mobile Menu Button - 44x44px touch target */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-slate-300 hover:bg-[var(--glass-bg)] hover:text-white transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Full screen overlay */}
        <div
          id="mobile-menu"
          className={`lg:hidden fixed inset-x-0 top-[64px] md:top-[80px] bottom-0 bg-[var(--bg-primary)]/98 backdrop-blur-lg border-t border-[var(--glass-border)] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
        >
          <nav className="flex flex-col p-4 space-y-1 max-h-full overflow-y-auto" aria-label="Mobile navigation">
            {navItems.map((item) => (
              item.isPage ? (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-4 rounded-lg text-lg font-medium transition-colors text-slate-300 hover:text-white hover:bg-[var(--glass-bg)] min-h-[48px] flex items-center"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className={`px-4 py-4 rounded-lg text-lg font-medium transition-colors min-h-[48px] flex items-center ${activeSection === item.href.replace('#', '')
                    ? 'text-[var(--accent-gold)] bg-[var(--glass-highlight)]'
                    : 'text-slate-300 hover:text-white hover:bg-[var(--glass-bg)]'
                    }`}
                >
                  {t(`nav.${item.key}`)}
                </a>
              )
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
}
