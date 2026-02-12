'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Users, Award, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CountdownTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function TropicalNordicHero() {
    const { language, t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Next major event - Thai Pongal 2026
    const nextEventDate = new Date('2026-01-24T17:00:00');

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
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateCountdown();
        const timer = setInterval(calculateCountdown, 1000);
        return () => clearInterval(timer);
    }, [mounted]);

    const stats = [
        { icon: Users, value: '500+', label: t('hero.members') },
        { icon: Award, value: '14+', label: t('hero.years') },
        { icon: Calendar, value: '24+', label: t('hero.events') },
    ];

    return (
        <section id="home" className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-final-hd.jpg"
                    alt="Toronto Skyline with Tamil Deity and Palmyra Tree"
                    fill
                    className="object-contain bg-[#0F172A]"
                    priority
                    quality={100}
                />
                {/* Gradient Overlay for Readability - Darker for poor visibility images */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/20" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 flex flex-col gap-12 items-center">

                {/* Typography & Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Welcome Tag */}
                    <div className="inline-flex items-center px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[var(--glass-border)] bg-slate-900/50 backdrop-blur-md mt-4 sm:mt-6 mb-6 sm:mb-8 shadow-lg">
                        <span className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-[var(--accent-gold)] mr-2 sm:mr-3 animate-pulse"></span>
                        <span className="text-[var(--accent-gold)] text-sm sm:text-base md:text-lg font-bold tracking-wide uppercase">
                            {t('hero.welcome')}
                        </span>
                    </div>

                    {/* Main Title - Responsive text that wraps properly on mobile */}
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
                        <span className="block sm:inline">Connecting </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-gold)] via-yellow-500 to-[var(--accent-gold)] drop-shadow-sm">Culture</span>
                        <span className="text-white"> & </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">Community</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-slate-100 mb-6 sm:mb-8 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg shadow-black px-2">
                        {language === 'en'
                            ? "Connecting the Tamil community in Mississauga and Peel region since 2012"
                            : "2012 முதல் மிசிசாகா மற்றும் பீல் பகுதியில் தமிழ் சமூகத்தை இணைக்கிறது"}
                    </p>

                    {/* CTA Buttons - Stack on very small screens */}
                    <div className="flex flex-col xs:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-2">
                        <a
                            href="#membership"
                            className="group relative inline-flex items-center justify-center px-8 py-4 bg-[var(--accent-gold)] text-[var(--bg-primary)] font-bold rounded-lg overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(230,190,109,0.5)] shadow-lg"
                        >
                            <span className="relative z-10 flex items-center">
                                {language === 'en' ? "Join Us" : "எங்களுடன் இணையுங்கள்"}
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </span>
                        </a>

                        <a
                            href="#events"
                            className="inline-flex items-center justify-center px-8 py-4 bg-slate-900/60 text-white font-medium rounded-lg border border-[var(--glass-border)] hover:bg-slate-800/80 hover:border-[var(--accent-gold)] transition-all backdrop-blur-md shadow-lg"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            {language === 'en' ? "View Events" : "நிகழ்வுகளை காண்க"}
                        </a>
                    </div>

                    {/* Stats Row - Responsive sizing */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 border-t border-[var(--glass-border)] pt-6 sm:pt-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="drop-shadow-md">
                                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-semibold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Event Card / Timer - Centered Below */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="w-full px-2"
                >
                    <div className="glass-panel rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-3xl mx-auto relative overflow-hidden border-t-4 border-t-[var(--accent-red)] bg-slate-900/30 backdrop-blur-md shadow-2xl">
                        {/* Decorative Shine */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[var(--accent-gold)] opacity-20 blur-3xl rounded-full"></div>

                        <div className="mb-4 sm:mb-6">
                            <div className="inline-block px-2 sm:px-3 py-1 bg-[var(--accent-red)] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full mb-2 sm:mb-3">
                                Upcoming Celebration
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight mb-1">
                                <span className="block sm:inline">Tamil Heritage Month &</span>
                                <span className="text-[var(--accent-gold)]"> Thai Pongal 2026</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 tamil-text opacity-90">
                                தமிழ் மரபுத் திங்கள் தைப்பொங்கல் விழா 2026
                            </p>
                        </div>

                        {/* Event Details Grid - Stack on mobile */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm">
                            <div className="flex items-start">
                                <Calendar className="w-4 h-4 text-[var(--accent-gold)] mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-slate-400 text-[10px] sm:text-xs uppercase">Date</p>
                                    <p className="text-white font-medium text-sm">Jan 24, 2026</p>
                                    <p className="text-slate-500 text-[10px] sm:text-xs">Saturday</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Clock className="w-4 h-4 text-[var(--accent-gold)] mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-slate-400 text-[10px] sm:text-xs uppercase">Time</p>
                                    <p className="text-white font-medium text-sm">5:00 PM - 9:30 PM</p>
                                </div>
                            </div>
                            <div className="col-span-1 xs:col-span-2 flex flex-col xs:flex-row items-start xs:items-center gap-2 border-t border-[var(--glass-border)] pt-3 mt-1">
                                <div className="flex items-start flex-1 min-w-0">
                                    <div className="min-w-4 pt-1 flex-shrink-0"><div className="w-2 h-2 rounded-full bg-[var(--accent-red)] animate-pulse"></div></div>
                                    <div className="min-w-0">
                                        <p className="text-slate-400 text-[10px] sm:text-xs uppercase">Location</p>
                                        <p className="text-white font-medium text-xs sm:text-sm truncate">Glenforest Secondary School</p>
                                        <p className="text-slate-500 text-[10px] truncate">3575 Fieldgate Dr, Mississauga</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-4 xs:ml-0">
                                    <span className="inline-block px-2 py-1 bg-[var(--accent-gold)] text-[var(--bg-primary)] text-[10px] sm:text-xs font-bold rounded whitespace-nowrap">
                                        FREE ADMISSION
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Countdown - Responsive sizing */}
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                            {[
                                { value: mounted ? countdown.days : 0, label: t('hero.days') },
                                { value: mounted ? countdown.hours : 0, label: t('hero.hours') },
                                { value: mounted ? countdown.minutes : 0, label: t('hero.mins') },
                                { value: mounted ? countdown.seconds : 0, label: t('hero.secs') },
                            ].map((item, index) => (
                                <div key={index} className="bg-[var(--glass-bg)] rounded-md sm:rounded-lg p-1.5 sm:p-2 text-center border border-[var(--glass-border)]">
                                    <span className="block text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 tabular-nums leading-none">
                                        {String(item.value).padStart(2, '0')}
                                    </span>
                                    <span className="block text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 uppercase tracking-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[var(--accent-gold)] to-transparent opacity-50 relative overflow-hidden">
                    <motion.div
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-white"
                    ></motion.div>
                </div>
            </motion.div>
        </section>
    );
}
