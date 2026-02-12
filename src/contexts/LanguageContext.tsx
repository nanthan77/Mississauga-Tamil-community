'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.events': 'Events',
    'nav.about': 'About',
    'nav.membership': 'Membership',
    'nav.sponsors': 'Sponsors',
    'nav.infoHub': 'Info Hub',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',

    // Hero Section
    'hero.welcome': 'Welcome to',
    'hero.title': 'Mississauga Tamils Association',
    'hero.subtitle': 'Connecting Tamil Community in Mississauga & Peel Region Since 1990',
    'hero.joinUs': 'Join Our Community',
    'hero.viewEvents': 'View Events',
    'hero.members': 'Members',
    'hero.years': 'Years Serving',
    'hero.events': 'Events/Year',
    'hero.nextEvent': 'Next Event',
    'hero.days': 'Days',
    'hero.hours': 'Hours',
    'hero.mins': 'Mins',
    'hero.secs': 'Secs',

    // Sponsors Section
    'sponsors.title': 'Our Valued Sponsors',
    'sponsors.subtitle': 'Thank you to our sponsors for supporting the Tamil community',
    'sponsors.become': 'Become a Sponsor',

    // Events Section
    'events.title': 'Upcoming Events',
    'events.subtitle': 'Join us for exciting community gatherings and cultural celebrations',
    'events.viewAll': 'View All Events',
    'events.register': 'Register Now',
    'events.addCalendar': 'Add to Calendar',
    'events.share': 'Share',
    'events.free': 'FREE',
    'events.members': 'Members',
    'events.nonMembers': 'Non-Members',
    'events.family': 'Family',
    'events.thisWeek': 'This Week',
    'events.cultural': 'Cultural',
    'events.religious': 'Religious',
    'events.sports': 'Sports',
    'events.youth': 'Youth',
    'events.seniors': 'Seniors',
    'events.all': 'All',

    // About Section
    'about.title': 'About Us',
    'about.subtitle': 'Building bridges, preserving heritage, empowering community',
    'about.mission': 'Our Mission',
    'about.missionText': 'To unite and serve the Tamil community in Mississauga and Peel Region by preserving our rich cultural heritage, supporting newcomers, empowering youth, and fostering intergenerational connections.',
    'about.vision': 'Our Vision',
    'about.visionText': 'To be the premier Tamil community organization in the Greater Toronto Area, recognized for excellence in cultural preservation, community service, and member engagement.',
    'about.leadership': 'Our Leadership',
    'about.learnMore': 'Learn More About Us',

    // Membership Section
    'membership.title': 'Become a Member',
    'membership.subtitle': 'Join our community and enjoy exclusive benefits',
    'membership.individual': 'Individual',
    'membership.familyPlan': 'Family',
    'membership.student': 'Student',
    'membership.senior': 'Senior',
    'membership.year': '/year',
    'membership.joinNow': 'Join Now',
    'membership.benefits': 'Member Benefits',
    'membership.benefit1': 'Priority event registration',
    'membership.benefit2': 'Discounts on tickets and workshops',
    'membership.benefit3': 'Voting rights in elections',
    'membership.benefit4': 'Access to member-only programs',
    'membership.benefit5': 'Community networking opportunities',
    'membership.benefit6': 'Leadership and volunteer opportunities',

    // Info Hub Section
    'infoHub.title': 'Information Hub',
    'infoHub.subtitle': 'Your one-stop resource for Tamil community information in the GTA',
    'infoHub.businesses': 'Tamil Businesses',
    'infoHub.businessesDesc': 'Find Tamil-owned businesses in Mississauga',
    'infoHub.gtaEvents': 'GTA Tamil Events',
    'infoHub.gtaEventsDesc': 'Upcoming events across Greater Toronto Area',
    'infoHub.organizations': 'Tamil Organizations',
    'infoHub.organizationsDesc': 'Directory of Tamil associations in GTA',
    'infoHub.resources': 'Community Resources',
    'infoHub.resourcesDesc': 'Helpful services and support',
    'infoHub.explore': 'Explore',

    // Gallery Section
    'gallery.title': 'Photo Gallery',
    'gallery.subtitle': 'Memories from our community events',
    'gallery.viewAll': 'View Full Gallery',

    // Contact Section
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We would love to hear from you',
    'contact.name': 'Your Name',
    'contact.email': 'Email Address',
    'contact.phone': 'Phone Number',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.address': 'Address',
    'contact.followUs': 'Follow Us',

    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.connect': 'Connect With Us',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterText': 'Subscribe to receive updates about events and community news',
    'footer.subscribe': 'Subscribe',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.copyright': '© 2026 Mississauga Tamils Association. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.events': 'நிகழ்வுகள்',
    'nav.about': 'எங்களை பற்றி',
    'nav.membership': 'உறுப்பினர்',
    'nav.sponsors': 'ஆதரவாளர்கள்',
    'nav.infoHub': 'தகவல் மையம்',
    'nav.gallery': 'படத்தொகுப்பு',
    'nav.contact': 'தொடர்பு',

    // Hero Section
    'hero.welcome': 'வரவேற்கிறோம்',
    'hero.title': 'மிசிசாகா தமிழ் சங்கம்',
    'hero.subtitle': '1990 முதல் மிசிசாகா மற்றும் பீல் பகுதியில் தமிழ் சமூகத்தை இணைக்கிறது',
    'hero.joinUs': 'எங்களுடன் இணையுங்கள்',
    'hero.viewEvents': 'நிகழ்வுகளை காண்க',
    'hero.members': 'உறுப்பினர்கள்',
    'hero.years': 'ஆண்டுகள் சேவை',
    'hero.events': 'ஆண்டுக்கு நிகழ்வுகள்',
    'hero.nextEvent': 'அடுத்த நிகழ்வு',
    'hero.days': 'நாட்கள்',
    'hero.hours': 'மணி',
    'hero.mins': 'நிமிடம்',
    'hero.secs': 'விநாடி',

    // Sponsors Section
    'sponsors.title': 'எங்கள் ஆதரவாளர்கள்',
    'sponsors.subtitle': 'தமிழ் சமூகத்தை ஆதரிக்கும் எங்கள் ஆதரவாளர்களுக்கு நன்றி',
    'sponsors.become': 'ஆதரவாளராக இணையுங்கள்',

    // Events Section
    'events.title': 'வரவிருக்கும் நிகழ்வுகள்',
    'events.subtitle': 'சமூக கூட்டங்கள் மற்றும் கலாச்சார கொண்டாட்டங்களில் கலந்துகொள்ளுங்கள்',
    'events.viewAll': 'அனைத்து நிகழ்வுகளும்',
    'events.register': 'பதிவு செய்யுங்கள்',
    'events.addCalendar': 'காலண்டரில் சேர்க்க',
    'events.share': 'பகிர்',
    'events.free': 'இலவசம்',
    'events.members': 'உறுப்பினர்கள்',
    'events.nonMembers': 'உறுப்பினர் அல்லாதவர்கள்',
    'events.family': 'குடும்பம்',
    'events.thisWeek': 'இந்த வாரம்',
    'events.cultural': 'கலாச்சாரம்',
    'events.religious': 'மதம்',
    'events.sports': 'விளையாட்டு',
    'events.youth': 'இளைஞர்',
    'events.seniors': 'மூத்தோர்',
    'events.all': 'அனைத்தும்',

    // About Section
    'about.title': 'எங்களை பற்றி',
    'about.subtitle': 'பாலங்களை உருவாக்குதல், பாரம்பரியத்தை பாதுகாத்தல், சமூகத்தை மேம்படுத்துதல்',
    'about.mission': 'எங்கள் நோக்கம்',
    'about.missionText': 'எங்களின் பணக்கார கலாச்சார பாரம்பரியத்தை பாதுகாத்து, புதியவர்களை ஆதரித்து, இளைஞர்களை மேம்படுத்தி, தலைமுறைகளுக்கிடையேயான இணைப்புகளை வளர்ப்பதன் மூலம் மிசிசாகா மற்றும் பீல் பகுதியில் தமிழ் சமூகத்தை ஒன்றிணைத்து சேவை செய்வது.',
    'about.vision': 'எங்கள் தொலைநோக்கு',
    'about.visionText': 'கலாச்சார பாதுகாப்பு, சமூக சேவை மற்றும் உறுப்பினர் ஈடுபாட்டில் சிறப்பிற்கு அங்கீகரிக்கப்பட்ட, கிரேட்டர் டொரன்டோ பகுதியில் முதன்மையான தமிழ் சமூக அமைப்பாக இருப்பது.',
    'about.leadership': 'எங்கள் தலைமை',
    'about.learnMore': 'மேலும் அறிய',

    // Membership Section
    'membership.title': 'உறுப்பினராக சேரவும்',
    'membership.subtitle': 'எங்கள் சமூகத்தில் சேர்ந்து சிறப்பு நன்மைகளை அனுபவியுங்கள்',
    'membership.individual': 'தனிநபர்',
    'membership.familyPlan': 'குடும்பம்',
    'membership.student': 'மாணவர்',
    'membership.senior': 'மூத்தோர்',
    'membership.year': '/ஆண்டு',
    'membership.joinNow': 'இப்போது சேரவும்',
    'membership.benefits': 'உறுப்பினர் நன்மைகள்',
    'membership.benefit1': 'நிகழ்வு பதிவில் முன்னுரிமை',
    'membership.benefit2': 'டிக்கெட் மற்றும் பயிலரங்குகளில் தள்ளுபடி',
    'membership.benefit3': 'தேர்தல்களில் வாக்களிக்கும் உரிமை',
    'membership.benefit4': 'உறுப்பினர்களுக்கான திட்டங்களுக்கு அணுகல்',
    'membership.benefit5': 'சமூக வலைப்பின்னல் வாய்ப்புகள்',
    'membership.benefit6': 'தலைமை மற்றும் தன்னார்வ வாய்ப்புகள்',

    // Info Hub Section
    'infoHub.title': 'தகவல் மையம்',
    'infoHub.subtitle': 'GTA-யில் தமிழ் சமூக தகவல்களுக்கான உங்கள் ஒரே ஆதாரம்',
    'infoHub.businesses': 'தமிழ் வணிகங்கள்',
    'infoHub.businessesDesc': 'மிசிசாகாவில் தமிழர்களுக்கு சொந்தமான வணிகங்களைக் கண்டறியவும்',
    'infoHub.gtaEvents': 'GTA தமிழ் நிகழ்வுகள்',
    'infoHub.gtaEventsDesc': 'கிரேட்டர் டொரன்டோ பகுதி முழுவதும் வரவிருக்கும் நிகழ்வுகள்',
    'infoHub.organizations': 'தமிழ் அமைப்புகள்',
    'infoHub.organizationsDesc': 'GTA-யில் உள்ள தமிழ் சங்கங்களின் அடைவு',
    'infoHub.resources': 'சமூக வளங்கள்',
    'infoHub.resourcesDesc': 'உதவிகரமான சேவைகள் மற்றும் ஆதரவு',
    'infoHub.explore': 'ஆராயுங்கள்',

    // Gallery Section
    'gallery.title': 'புகைப்படத் தொகுப்பு',
    'gallery.subtitle': 'எங்கள் சமூக நிகழ்வுகளின் நினைவுகள்',
    'gallery.viewAll': 'முழு கேலரியை காண்க',

    // Contact Section
    'contact.title': 'எங்களை தொடர்பு கொள்ளுங்கள்',
    'contact.subtitle': 'உங்களிடமிருந்து கேட்க விரும்புகிறோம்',
    'contact.name': 'உங்கள் பெயர்',
    'contact.email': 'மின்னஞ்சல் முகவரி',
    'contact.phone': 'தொலைபேசி எண்',
    'contact.message': 'உங்கள் செய்தி',
    'contact.send': 'செய்தி அனுப்பு',
    'contact.address': 'முகவரி',
    'contact.followUs': 'எங்களை பின்தொடருங்கள்',

    // Footer
    'footer.quickLinks': 'விரைவு இணைப்புகள்',
    'footer.connect': 'எங்களுடன் இணையுங்கள்',
    'footer.newsletter': 'செய்திமடல்',
    'footer.newsletterText': 'நிகழ்வுகள் மற்றும் சமூக செய்திகள் பற்றிய புதுப்பிப்புகளைப் பெற குழுசேரவும்',
    'footer.subscribe': 'குழுசேர்',
    'footer.emailPlaceholder': 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
    'footer.copyright': '© 2026 மிசிசாகா தமிழ் சங்கம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'footer.privacy': 'தனியுரிமை கொள்கை',
    'footer.terms': 'சேவை விதிமுறைகள்',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('mta-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ta')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mta-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
