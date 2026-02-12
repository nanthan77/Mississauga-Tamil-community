'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';

// Hardcoded sponsor images from folders
const sponsorImages = {
  platinum: [
    '/sponsors/platinum/Ari Mtg.jpeg',
    '/sponsors/platinum/Dr Saba.jpg',
    '/sponsors/platinum/Dynevor Exp.jpg',
    '/sponsors/platinum/Petro Can.jpg',
  ],
  gold: [
    '/sponsors/gold/Aminah.jpg',
    '/sponsors/gold/Anakan cpa.jpg',
    '/sponsors/gold/Arctic.jpg',
    '/sponsors/gold/Chesters.jpg',
    '/sponsors/gold/Fire Wings.jpg',
    '/sponsors/gold/Lux.jpg',
    '/sponsors/gold/Newcomers.jpg',
    '/sponsors/gold/Poorna Law.jpeg',
  ],
  silver: [
    '/sponsors/silver/Aaranam.jpg',
    '/sponsors/silver/Ajitha RoyalLePage.jpeg',
    '/sponsors/silver/Ambika.jpg',
    '/sponsors/silver/Chaitanya.jpg',
    '/sponsors/silver/Darren Khan.jpg',
    '/sponsors/silver/Dr Bobby.jpg',
    '/sponsors/silver/Firstclass.jpg',
    '/sponsors/silver/H DJ.jpg',
    '/sponsors/silver/Home Reno.jpeg',
    '/sponsors/silver/Jay Remax.jpeg',
    '/sponsors/silver/Kabis.jpg',
    '/sponsors/silver/Kajan Remax.jpg',
    '/sponsors/silver/Katpagam Grocery.jpg',
    '/sponsors/silver/Mahinthan RLePage.jpg',
    '/sponsors/silver/Mercury.png',
    '/sponsors/silver/Nafisa.jpg',
    '/sponsors/silver/Niranjan RLePage.jpeg',
    '/sponsors/silver/Nita Kang.jpg',
    '/sponsors/silver/Pathy Kirupa.jpg',
    '/sponsors/silver/Platinum clean.jpg',
    '/sponsors/silver/State Fin.jpg',
    '/sponsors/silver/Thinusha.jpg',
    '/sponsors/silver/Thushy makeup.jpg',
    '/sponsors/silver/Uthayam.jpg',
    '/sponsors/silver/Uthayas.jpg',
    '/sponsors/silver/Vijaya RBC.jpg',
    '/sponsors/silver/Whiteshieldb.png',
    '/sponsors/silver/Y&A.jpg',
  ],
};

interface SponsorRowProps {
  images: string[];
  speed: string;
  tier: 'platinum' | 'gold' | 'silver';
}

function SponsorRow({ images, speed, tier }: SponsorRowProps) {
  // Duplicate for seamless scrolling
  const displayImages = [...images, ...images, ...images, ...images];

  // Responsive card size classes based on tier
  const cardSizeClasses = {
    platinum: 'w-[180px] h-[120px] sm:w-[220px] sm:h-[140px] md:w-[280px] md:h-[180px]',
    gold: 'w-[140px] h-[90px] sm:w-[180px] sm:h-[115px] md:w-[220px] md:h-[140px]',
    silver: 'w-[100px] h-[65px] sm:w-[130px] sm:h-[85px] md:w-[160px] md:h-[100px]',
  };

  return (
    <div className="overflow-hidden relative">
      <div className={`flex gap-3 sm:gap-4 md:gap-6 ${speed} hover:[animation-play-state:paused]`}>
        {displayImages.map((img, index) => (
          <div
            key={index}
            className={`${cardSizeClasses[tier]} flex-shrink-0 bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:scale-105 transition-transform duration-300`}
          >
            <img
              src={img}
              alt="Sponsor"
              className="w-full h-full object-contain p-1 sm:p-2"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SponsorShowcase() {
  const { language } = useLanguage();
  const { siteSettings } = useAdmin();

  if (!siteSettings.showHomepageSponsors) return null;

  return (
    <section className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden py-10 sm:py-12 md:py-16">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 mb-8 sm:mb-10 md:mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
          {language === 'ta'
            ? (siteSettings.homepageSponsorTitleTamil || 'எங்கள் மதிப்புமிக்க ஆதரவாளர்கள்')
            : (siteSettings.homepageSponsorTitle || 'Our Valued Sponsors')}
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed px-2">
          {language === 'ta'
            ? (siteSettings.homepageSponsorSubtitleTamil || 'எங்கள் சமூகத்தை ஆதரிக்கும் தாராள மனமுள்ள ஆதரவாளர்களுக்கு நன்றி')
            : (siteSettings.homepageSponsorSubtitle || 'Thank you to our generous sponsors for supporting our community')}
        </p>
      </div>

      {/* Platinum Sponsors */}
      <div className="mb-6 sm:mb-8 md:mb-10 relative z-10">
        <div className="text-center mb-3 sm:mb-4">
          <span className="inline-block px-3 sm:px-4 py-1 bg-gradient-to-r from-gray-300 to-gray-100 text-gray-800 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
            Platinum Sponsors
          </span>
        </div>
        <SponsorRow
          images={sponsorImages.platinum}
          speed="animate-scroll-slow"
          tier="platinum"
        />
      </div>

      {/* Gold Sponsors */}
      <div className="mb-6 sm:mb-8 md:mb-10 relative z-10">
        <div className="text-center mb-3 sm:mb-4">
          <span className="inline-block px-3 sm:px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
            Gold Sponsors
          </span>
        </div>
        <SponsorRow
          images={sponsorImages.gold}
          speed="animate-scroll-medium"
          tier="gold"
        />
      </div>

      {/* Silver Sponsors */}
      <div className="relative z-10">
        <div className="text-center mb-3 sm:mb-4">
          <span className="inline-block px-3 sm:px-4 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
            Silver Sponsors
          </span>
        </div>
        <SponsorRow
          images={sponsorImages.silver}
          speed="animate-scroll-fast"
          tier="silver"
        />
      </div>

      <style jsx global>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-slow {
          animation: scroll-left 60s linear infinite;
        }
        .animate-scroll-medium {
          animation: scroll-left 45s linear infinite;
        }
        .animate-scroll-fast {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
