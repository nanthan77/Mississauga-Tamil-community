'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Users, Award, Clock } from 'lucide-react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Hero() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Next major event - Tamil Heritage Month & Thaipongal 2026
  const nextEventDate = new Date('2026-01-24T17:00:00');
  const nextEventName = 'Tamil Heritage Month & Thaipongal 2026';
  const nextEventNameTamil = 'தமிழ் பாரம்பரிய மாதம் & தைப்பொங்கல் 2026';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateCountdown = () => {
      const now = new Date();
      const difference = nextEventDate.getTime() - now.getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        // If event has passed, show zeros
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [mounted]);

  const stats = [
    { icon: Users, value: '500+', label: t('hero.members') },
    { icon: Award, value: '35+', label: t('hero.years') },
    { icon: Calendar, value: '24+', label: t('hero.events') },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #8B1538 0%, #6B1028 50%, #4A0B1B 100%)'
      }}
    >
      {/* Decorative Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center">
          {/* Welcome Text */}
          <p className="text-[var(--mta-gold)] text-lg md:text-xl font-medium mb-4 animate-fade-in-up">
            {t('hero.welcome')}
          </p>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in-up">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--mta-gold)] text-[var(--mta-maroon)] font-bold rounded-lg hover:bg-[var(--mta-gold-light)] transition-all transform hover:scale-105 shadow-lg"
            >
              {t('hero.joinUs')}
            </Link>
            <a
              href="#events"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-bold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {t('hero.viewEvents')}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-[var(--mta-gold)] mx-auto mb-2" />
                <p className="text-2xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Countdown to Next Event */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-3xl mx-auto animate-fade-in-up">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-[var(--mta-gold)] mr-2" />
              <span className="text-white/80 text-sm md:text-base">{t('hero.nextEvent')}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              {nextEventName} / {nextEventNameTamil}
            </h3>
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {[
                { value: mounted ? countdown.days : 0, label: t('hero.days') },
                { value: mounted ? countdown.hours : 0, label: t('hero.hours') },
                { value: mounted ? countdown.minutes : 0, label: t('hero.mins') },
                { value: mounted ? countdown.seconds : 0, label: t('hero.secs') },
              ].map((item, index) => (
                <div key={index} className="bg-white/20 rounded-lg p-3 md:p-4">
                  <p className="text-2xl md:text-4xl font-bold text-white tabular-nums">
                    {String(item.value).padStart(2, '0')}
                  </p>
                  <p className="text-xs md:text-sm text-white/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
