'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Sponsor tier types
export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'bronze';

// Sponsor Portal User
export interface SponsorUser {
  id: string;
  sponsorId: string;
  username: string;
  password: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Extended Sponsor Profile
export interface SponsorProfile {
  id: string;
  // Basic Info
  name: string;
  nameTamil: string;
  logo: string;
  website: string;
  tier: SponsorTier;
  isActive: boolean;

  // Portal Access
  portalEnabled: boolean;
  portalUser?: SponsorUser;

  // Business Info
  tagline: string;
  taglineTamil: string;
  description: string;
  descriptionTamil: string;
  category: string;
  yearEstablished?: string;

  // Contact
  email: string;
  phone: string;
  address: string;
  addressTamil: string;

  // Social Media
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;

  // Custom Page Content (Platinum & Gold)
  heroImage?: string;
  galleryImages: string[];
  videoUrl?: string;

  // Analytics
  analytics: SponsorAnalytics;

  createdAt: string;
  updatedAt: string;
}

// Sponsor Content Submission (requires admin approval)
export interface SponsorContent {
  id: string;
  sponsorId: string;
  type: 'promotion' | 'announcement' | 'event' | 'article' | 'video';
  title: string;
  titleTamil: string;
  content: string;
  contentTamil: string;
  image?: string;
  videoUrl?: string;
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  isActive: boolean;
  views: number;
  clicks: number;
}

// Sponsor Analytics
export interface SponsorAnalytics {
  totalPageViews: number;
  uniqueVisitors: number;
  logoClicks: number;
  websiteClicks: number;
  phoneClicks: number;
  emailClicks: number;
  socialClicks: { [key: string]: number };
  contentViews: { [contentId: string]: number };
  dailyViews: { date: string; views: number }[];
  monthlyViews: { month: string; views: number }[];
  referralSources: { source: string; count: number }[];
}

// Tier Features Configuration
export const TIER_FEATURES = {
  platinum: {
    name: 'Platinum',
    color: '#E5E4E2',
    bgColor: 'bg-gradient-to-r from-gray-100 to-gray-300',
    features: {
      customPage: true,
      analytics: 'full', // full, basic, views-only
      maxPromotions: -1, // -1 = unlimited
      maxGalleryImages: 20,
      videoAllowed: true,
      newsletterFeature: true,
      priorityPlacement: true,
      socialIntegration: true,
      dedicatedSupport: true,
      customBranding: true,
      eventSponsorship: true,
      articlePublishing: true,
    },
    analyticsAccess: ['pageViews', 'clicks', 'referrals', 'engagement', 'demographics', 'comparison'],
  },
  gold: {
    name: 'Gold',
    color: '#FFD700',
    bgColor: 'bg-gradient-to-r from-yellow-100 to-yellow-300',
    features: {
      customPage: true,
      analytics: 'basic',
      maxPromotions: 5,
      maxGalleryImages: 10,
      videoAllowed: false,
      newsletterFeature: false,
      priorityPlacement: false,
      socialIntegration: true,
      dedicatedSupport: false,
      customBranding: false,
      eventSponsorship: true,
      articlePublishing: false,
    },
    analyticsAccess: ['pageViews', 'clicks', 'referrals'],
  },
  silver: {
    name: 'Silver',
    color: '#C0C0C0',
    bgColor: 'bg-gradient-to-r from-gray-200 to-gray-400',
    features: {
      customPage: true,
      analytics: 'views-only',
      maxPromotions: 2,
      maxGalleryImages: 5,
      videoAllowed: false,
      newsletterFeature: false,
      priorityPlacement: false,
      socialIntegration: false,
      dedicatedSupport: false,
      customBranding: false,
      eventSponsorship: false,
      articlePublishing: false,
    },
    analyticsAccess: ['pageViews'],
  },
  bronze: {
    name: 'Bronze',
    color: '#CD7F32',
    bgColor: 'bg-gradient-to-r from-orange-100 to-orange-300',
    features: {
      customPage: false,
      analytics: 'none',
      maxPromotions: 0,
      maxGalleryImages: 0,
      videoAllowed: false,
      newsletterFeature: false,
      priorityPlacement: false,
      socialIntegration: false,
      dedicatedSupport: false,
      customBranding: false,
      eventSponsorship: false,
      articlePublishing: false,
    },
    analyticsAccess: [],
  },
};

interface SponsorContextType {
  // Auth
  isSponsorAuthenticated: boolean;
  currentSponsor: SponsorProfile | null;
  sponsorLogin: (username: string, password: string) => boolean;
  sponsorLogout: () => void;

  // Sponsors
  sponsors: SponsorProfile[];
  getSponsorById: (id: string) => SponsorProfile | undefined;
  updateSponsorProfile: (id: string, profile: Partial<SponsorProfile>) => void;

  // Content Management
  sponsorContents: SponsorContent[];
  addSponsorContent: (content: Omit<SponsorContent, 'id' | 'submittedAt' | 'status' | 'views' | 'clicks'>) => void;
  updateSponsorContent: (id: string, content: Partial<SponsorContent>) => void;
  deleteSponsorContent: (id: string) => void;
  getSponsorContents: (sponsorId: string) => SponsorContent[];
  getPendingContents: () => SponsorContent[];
  approveContent: (id: string, reviewedBy: string) => void;
  rejectContent: (id: string, reason: string, reviewedBy: string) => void;

  // Analytics
  trackPageView: (sponsorId: string, source?: string) => void;
  trackClick: (sponsorId: string, clickType: 'logo' | 'website' | 'phone' | 'email' | 'social', socialType?: string) => void;
  trackContentView: (sponsorId: string, contentId: string) => void;
  trackContentClick: (contentId: string) => void;

  // Tier Features
  getTierFeatures: (tier: SponsorTier) => typeof TIER_FEATURES.platinum;
  canAccessFeature: (tier: SponsorTier, feature: keyof typeof TIER_FEATURES.platinum.features) => boolean;
}

const SponsorContext = createContext<SponsorContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Default empty analytics
const defaultAnalytics: SponsorAnalytics = {
  totalPageViews: 0,
  uniqueVisitors: 0,
  logoClicks: 0,
  websiteClicks: 0,
  phoneClicks: 0,
  emailClicks: 0,
  socialClicks: {},
  contentViews: {},
  dailyViews: [],
  monthlyViews: [],
  referralSources: [],
};

// Default sponsor profiles with portal access
const defaultSponsorProfiles: SponsorProfile[] = [
  {
    id: 'sponsor-1',
    name: 'RBC Royal Bank',
    nameTamil: 'RBC ராயல் வங்கி',
    logo: '',
    website: 'https://www.rbc.com',
    tier: 'platinum',
    isActive: true,
    portalEnabled: true,
    portalUser: {
      id: 'suser-1',
      sponsorId: 'sponsor-1',
      username: 'rbc',
      password: 'rbc2026',
      name: 'RBC Admin',
      email: 'sponsor@rbc.com',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    tagline: 'Helping you achieve your financial goals',
    taglineTamil: 'உங்கள் நிதி இலக்குகளை அடைய உதவுகிறோம்',
    description: 'RBC Royal Bank is Canada\'s largest bank, offering personal and commercial banking, wealth management, insurance, investor services and capital markets products and services.',
    descriptionTamil: 'RBC ராயல் வங்கி கனடாவின் மிகப்பெரிய வங்கியாகும், தனிப்பட்ட மற்றும் வணிக வங்கி, செல்வ மேலாண்மை, காப்பீடு, முதலீட்டாளர் சேவைகள் மற்றும் மூலதன சந்தை தயாரிப்புகள் மற்றும் சேவைகளை வழங்குகிறது.',
    category: 'Banking & Finance',
    yearEstablished: '1869',
    email: 'info@rbc.com',
    phone: '1-800-769-2511',
    address: 'Toronto, Ontario',
    addressTamil: 'டொரொன்டோ, ஒன்டாரியோ',
    facebook: 'https://facebook.com/rbc',
    instagram: 'https://instagram.com/rbc',
    linkedin: 'https://linkedin.com/company/rbc',
    galleryImages: [],
    analytics: { ...defaultAnalytics, totalPageViews: 1250, logoClicks: 85, websiteClicks: 120 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sponsor-2',
    name: 'TD Bank',
    nameTamil: 'TD வங்கி',
    logo: '',
    website: 'https://www.td.com',
    tier: 'gold',
    isActive: true,
    portalEnabled: true,
    portalUser: {
      id: 'suser-2',
      sponsorId: 'sponsor-2',
      username: 'td',
      password: 'td2026',
      name: 'TD Admin',
      email: 'sponsor@td.com',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    tagline: 'Banking can be this comfortable',
    taglineTamil: 'வங்கி இவ்வளவு வசதியாக இருக்கலாம்',
    description: 'TD Bank Group is a Canadian multinational banking and financial services corporation.',
    descriptionTamil: 'TD வங்கி குழு ஒரு கனேடிய பன்னாட்டு வங்கி மற்றும் நிதிச் சேவைகள் நிறுவனமாகும்.',
    category: 'Banking & Finance',
    email: 'info@td.com',
    phone: '1-866-222-3456',
    address: 'Toronto, Ontario',
    addressTamil: 'டொரொன்டோ, ஒன்டாரியோ',
    galleryImages: [],
    analytics: { ...defaultAnalytics, totalPageViews: 850, logoClicks: 65 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sponsor-3',
    name: 'Sun Life Financial',
    nameTamil: 'சன் லைஃப் நிதி',
    logo: '',
    website: 'https://www.sunlife.ca',
    tier: 'silver',
    isActive: true,
    portalEnabled: true,
    portalUser: {
      id: 'suser-3',
      sponsorId: 'sponsor-3',
      username: 'sunlife',
      password: 'sunlife2026',
      name: 'Sun Life Admin',
      email: 'sponsor@sunlife.ca',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    tagline: 'Life\'s brighter under the sun',
    taglineTamil: 'சூரியனின் கீழ் வாழ்க்கை பிரகாசமானது',
    description: 'Sun Life is a leading international financial services organization.',
    descriptionTamil: 'சன் லைஃப் ஒரு முன்னணி சர்வதேச நிதிச் சேவை நிறுவனமாகும்.',
    category: 'Insurance',
    email: 'info@sunlife.ca',
    phone: '1-877-786-5433',
    address: 'Toronto, Ontario',
    addressTamil: 'டொரொன்டோ, ஒன்டாரியோ',
    galleryImages: [],
    analytics: { ...defaultAnalytics, totalPageViews: 320 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function SponsorProvider({ children }: { children: ReactNode }) {
  const [isSponsorAuthenticated, setIsSponsorAuthenticated] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<SponsorProfile | null>(null);
  const [sponsors, setSponsors] = useState<SponsorProfile[]>(defaultSponsorProfiles);
  const [sponsorContents, setSponsorContents] = useState<SponsorContent[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedSponsor = localStorage.getItem('mta-current-sponsor');
      if (savedSponsor) {
        const sponsor = JSON.parse(savedSponsor);
        setCurrentSponsor(sponsor);
        setIsSponsorAuthenticated(true);
      }

      const savedSponsors = localStorage.getItem('mta-sponsor-profiles');
      if (savedSponsors) setSponsors(JSON.parse(savedSponsors));

      const savedContents = localStorage.getItem('mta-sponsor-contents');
      if (savedContents) setSponsorContents(JSON.parse(savedContents));
    } catch (error) {
      console.error('Error loading sponsor data:', error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mta-sponsor-profiles', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem('mta-sponsor-contents', JSON.stringify(sponsorContents));
  }, [sponsorContents]);

  // Auth functions
  const sponsorLogin = (username: string, password: string): boolean => {
    const sponsor = sponsors.find(s =>
      s.portalEnabled &&
      s.portalUser?.username === username &&
      s.portalUser?.password === password &&
      s.portalUser?.isActive &&
      s.isActive
    );

    if (sponsor) {
      const updatedSponsor = {
        ...sponsor,
        portalUser: sponsor.portalUser ? {
          ...sponsor.portalUser,
          lastLogin: new Date().toISOString()
        } : undefined
      };
      setCurrentSponsor(updatedSponsor);
      setIsSponsorAuthenticated(true);
      localStorage.setItem('mta-current-sponsor', JSON.stringify(updatedSponsor));

      // Update in sponsors array
      setSponsors(prev => prev.map(s => s.id === sponsor.id ? updatedSponsor : s));
      return true;
    }
    return false;
  };

  const sponsorLogout = () => {
    setIsSponsorAuthenticated(false);
    setCurrentSponsor(null);
    localStorage.removeItem('mta-current-sponsor');
  };

  // Sponsor functions
  const getSponsorById = (id: string) => sponsors.find(s => s.id === id);

  const updateSponsorProfile = (id: string, profile: Partial<SponsorProfile>) => {
    setSponsors(prev => prev.map(s =>
      s.id === id ? { ...s, ...profile, updatedAt: new Date().toISOString() } : s
    ));

    // Update current sponsor if it's the same
    if (currentSponsor?.id === id) {
      setCurrentSponsor(prev => prev ? { ...prev, ...profile, updatedAt: new Date().toISOString() } : null);
    }
  };

  // Content Management
  const addSponsorContent = (content: Omit<SponsorContent, 'id' | 'submittedAt' | 'status' | 'views' | 'clicks'>) => {
    const newContent: SponsorContent = {
      ...content,
      id: generateId(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      views: 0,
      clicks: 0,
      isActive: true,
    };
    setSponsorContents(prev => [...prev, newContent]);
  };

  const updateSponsorContent = (id: string, content: Partial<SponsorContent>) => {
    setSponsorContents(prev => prev.map(c => c.id === id ? { ...c, ...content } : c));
  };

  const deleteSponsorContent = (id: string) => {
    setSponsorContents(prev => prev.filter(c => c.id !== id));
  };

  const getSponsorContents = (sponsorId: string) => {
    return sponsorContents.filter(c => c.sponsorId === sponsorId);
  };

  const getPendingContents = () => {
    return sponsorContents.filter(c => c.status === 'pending');
  };

  const approveContent = (id: string, reviewedBy: string) => {
    setSponsorContents(prev => prev.map(c =>
      c.id === id ? {
        ...c,
        status: 'approved' as const,
        reviewedAt: new Date().toISOString(),
        reviewedBy
      } : c
    ));
  };

  const rejectContent = (id: string, reason: string, reviewedBy: string) => {
    setSponsorContents(prev => prev.map(c =>
      c.id === id ? {
        ...c,
        status: 'rejected' as const,
        rejectionReason: reason,
        reviewedAt: new Date().toISOString(),
        reviewedBy
      } : c
    ));
  };

  // Analytics Tracking
  const trackPageView = (sponsorId: string, source?: string) => {
    const today = new Date().toISOString().split('T')[0];

    setSponsors(prev => prev.map(s => {
      if (s.id !== sponsorId) return s;

      const analytics = { ...s.analytics };
      analytics.totalPageViews += 1;
      analytics.uniqueVisitors += 1; // In production, track unique IPs

      // Update daily views
      const dailyIndex = analytics.dailyViews.findIndex(d => d.date === today);
      if (dailyIndex >= 0) {
        analytics.dailyViews[dailyIndex].views += 1;
      } else {
        analytics.dailyViews.push({ date: today, views: 1 });
      }

      // Update referral sources
      if (source) {
        const sourceIndex = analytics.referralSources.findIndex(r => r.source === source);
        if (sourceIndex >= 0) {
          analytics.referralSources[sourceIndex].count += 1;
        } else {
          analytics.referralSources.push({ source, count: 1 });
        }
      }

      return { ...s, analytics };
    }));
  };

  const trackClick = (sponsorId: string, clickType: 'logo' | 'website' | 'phone' | 'email' | 'social', socialType?: string) => {
    setSponsors(prev => prev.map(s => {
      if (s.id !== sponsorId) return s;

      const analytics = { ...s.analytics };

      switch (clickType) {
        case 'logo':
          analytics.logoClicks += 1;
          break;
        case 'website':
          analytics.websiteClicks += 1;
          break;
        case 'phone':
          analytics.phoneClicks += 1;
          break;
        case 'email':
          analytics.emailClicks += 1;
          break;
        case 'social':
          if (socialType) {
            analytics.socialClicks[socialType] = (analytics.socialClicks[socialType] || 0) + 1;
          }
          break;
      }

      return { ...s, analytics };
    }));
  };

  const trackContentView = (sponsorId: string, contentId: string) => {
    // Update sponsor analytics
    setSponsors(prev => prev.map(s => {
      if (s.id !== sponsorId) return s;
      const analytics = { ...s.analytics };
      analytics.contentViews[contentId] = (analytics.contentViews[contentId] || 0) + 1;
      return { ...s, analytics };
    }));

    // Update content views
    setSponsorContents(prev => prev.map(c =>
      c.id === contentId ? { ...c, views: c.views + 1 } : c
    ));
  };

  const trackContentClick = (contentId: string) => {
    setSponsorContents(prev => prev.map(c =>
      c.id === contentId ? { ...c, clicks: c.clicks + 1 } : c
    ));
  };

  // Tier Features
  const getTierFeatures = (tier: SponsorTier) => TIER_FEATURES[tier];

  const canAccessFeature = (tier: SponsorTier, feature: keyof typeof TIER_FEATURES.platinum.features): boolean => {
    const features = TIER_FEATURES[tier].features;
    const value = features[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value !== 'none';
    return false;
  };

  return (
    <SponsorContext.Provider value={{
      isSponsorAuthenticated,
      currentSponsor,
      sponsorLogin,
      sponsorLogout,
      sponsors,
      getSponsorById,
      updateSponsorProfile,
      sponsorContents,
      addSponsorContent,
      updateSponsorContent,
      deleteSponsorContent,
      getSponsorContents,
      getPendingContents,
      approveContent,
      rejectContent,
      trackPageView,
      trackClick,
      trackContentView,
      trackContentClick,
      getTierFeatures,
      canAccessFeature,
    }}>
      {children}
    </SponsorContext.Provider>
  );
}

export function useSponsor() {
  const context = useContext(SponsorContext);
  if (context === undefined) {
    throw new Error('useSponsor must be used within a SponsorProvider');
  }
  return context;
}
