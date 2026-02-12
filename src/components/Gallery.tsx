'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface GalleryImage {
  id: number;
  title: string;
  titleTa: string;
  event: string;
  eventTa: string;
  year: string;
}

export default function Gallery() {
  const { language, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Gallery Data with User Provided Tamil Translations
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      title: 'Pongal Celebration',
      titleTa: 'பொங்கல் கொண்டாட்டம்',
      event: 'Pongal 2025',
      eventTa: 'பொங்கல் 2025',
      year: '2025'
    },
    {
      id: 2,
      title: 'Tamil New Year',
      titleTa: 'தமிழ் புத்தாண்டு',
      event: 'New Year 2025',
      eventTa: 'புத்தாண்டு 2025',
      year: '2025'
    },
    {
      id: 3,
      title: 'Deepavali Gala',
      titleTa: 'தீபாவளி விழா',
      event: 'Deepavali 2024',
      eventTa: 'தீபாவளி 2024',
      year: '2024'
    },
    {
      id: 4,
      title: 'Youth Cricket',
      titleTa: 'இளைஞர் கிரிக்கெட்',
      event: 'Summer Tournament',
      eventTa: 'கோடை போட்டி',
      year: '2024'
    },
    {
      id: 5,
      title: 'Cultural Dance',
      titleTa: 'கலாச்சார நடனம்',
      event: 'Talent Show 2024',
      eventTa: 'திறமை நிகழ்ச்சி 2024',
      year: '2024'
    },
    {
      id: 6,
      title: 'Seniors Day',
      titleTa: 'மூத்தோர் நாள்',
      event: 'STSP Event',
      eventTa: 'STSP நிகழ்வு',
      year: '2024'
    },
    {
      id: 7,
      title: 'Family Picnic',
      titleTa: 'குடும்ப சுற்றுலா',
      event: 'Summer Picnic',
      eventTa: 'கோடை சுற்றுலா',
      year: '2024'
    },
    {
      id: 8,
      title: 'Community Gathering',
      titleTa: 'சமூக கூட்டம்',
      event: 'Annual Meeting',
      eventTa: 'ஆண்டு கூட்டம்',
      year: '2024'
    },
  ];

  const currentIndex = selectedImage
    ? galleryImages.findIndex(img => img.id === selectedImage.id)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(galleryImages[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < galleryImages.length - 1) {
      setSelectedImage(galleryImages[currentIndex + 1]);
    }
  };

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-24 relative bg-transparent">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-[var(--accent-red)] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {language === 'en' ? 'Photo Gallery' : 'புகைப்படத் தொகுப்பு'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
            {language === 'en' ? 'Memories from our community events' : 'எங்கள் சமூக நிகழ்வுகளின் நினைவுகள்'}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="relative aspect-square glass-panel rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group hover:border-[var(--accent-gold)] transition-all duration-300"
            >
              {/* Placeholder Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                <div className="text-center text-slate-500 group-hover:scale-110 transition-transform duration-500 p-2">
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                  <p className="text-[10px] sm:text-xs md:text-sm font-medium opacity-70 line-clamp-2">{language === 'en' ? image.event : image.eventTa}</p>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4 md:p-6">
                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-sm sm:text-base md:text-lg leading-tight mb-0.5 sm:mb-1 line-clamp-2">
                    {language === 'en' ? image.title : image.titleTa}
                  </h4>
                  <p className="text-[10px] sm:text-xs md:text-sm text-[var(--accent-gold)] font-medium">
                    {language === 'en' ? image.event : image.eventTa}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <button className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 border border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold rounded-lg hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all uppercase tracking-wide bg-[var(--glass-bg)] text-sm sm:text-base min-h-[44px]">
            {language === 'en' ? 'View Full Gallery' : 'முழு கேலரியை காண்க'}
          </button>
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
            >
              <X className="w-10 h-10" />
            </button>

            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}
            {currentIndex < galleryImages.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            )}

            {/* Image Container */}
            <div
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-white rounded-lg shadow-2xl flex items-center justify-center overflow-hidden relative">
                <div className="text-center text-gray-300">
                  <ImageIcon className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="font-medium text-lg">Image Placeholder</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {language === 'en' ? selectedImage.title : selectedImage.titleTa}
                </h3>
                <p className="text-white/80 text-lg">
                  {language === 'en' ? selectedImage.event : selectedImage.eventTa} <span className="mx-2">•</span> {selectedImage.year}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
