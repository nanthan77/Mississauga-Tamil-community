'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User roles
export type UserRole = 'admin' | 'editor' | 'viewer';

// User interface
export interface AdminUser {
  id: string;
  username: string;
  password: string; // In production, use proper hashing
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

// Types for all editable content
export interface SiteSettings {
  siteName: string;
  siteNameTamil: string;
  tagline: string;
  taglineTamil: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  addressTamil: string;
  facebook: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
  showHomepageSponsors: boolean;
  homepageSponsorTitle: string;
  homepageSponsorTitleTamil: string;
  homepageSponsorSubtitle: string;
  homepageSponsorSubtitleTamil: string;
}

export interface Sponsor {
  id: string;
  name: string;
  nameTamil: string;
  logo: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver';
  isActive: boolean;
}

export interface Event {
  id: string;
  title: string;
  titleTamil: string;
  date: string;
  time: string;
  venue: string;
  venueTamil: string;
  address: string;
  description: string;
  descriptionTamil: string;
  highlights: string[];
  highlightsTamil: string[];
  image: string;
  category: 'cultural' | 'religious' | 'sports' | 'youth' | 'seniors' | 'community';
  pricing: {
    members: number | 'FREE';
    nonMembers: number;
    family: number;
  };
  isFeatured: boolean;
  isActive: boolean;
}

export interface MembershipTier {
  id: string;
  name: string;
  nameTamil: string;
  price: number;
  features: string[];
  featuresTamil: string[];
  isPopular: boolean;
  isActive: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  titleTamil: string;
  event: string;
  eventTamil: string;
  year: string;
  image: string;
  isActive: boolean;
}

export interface AboutContent {
  // Intro
  intro: string;
  introTamil: string;
  // Motto
  motto: string;
  mottoTamil: string;
  mottoDescription: string;
  mottoDescriptionTamil: string;
  // Mission
  mission: string;
  missionTamil: string;
  // Vision (kept for compatibility)
  vision: string;
  visionTamil: string;
  // Civic Leadership
  civicTitle: string;
  civicTitleTamil: string;
  civicDescription: string;
  civicDescriptionTamil: string;
  // Social Welfare (Annadhanam)
  socialTitle: string;
  socialTitleTamil: string;
  socialDescription: string;
  socialDescriptionTamil: string;
  // Youth Wing
  youthTitle: string;
  youthTitleTamil: string;
  youthDescription: string;
  youthDescriptionTamil: string;
  // History (kept for compatibility)
  history: string;
  historyTamil: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  nameTamil: string;
  position: string;
  positionTamil: string;
  image: string;
  isActive: boolean;
}

interface AdminContextType {
  // Auth
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // User Management
  users: AdminUser[];
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
  canEdit: () => boolean;
  canDelete: () => boolean;
  isAdmin: () => boolean;

  // Activity Logs
  activityLogs: ActivityLog[];
  logActivity: (action: string, details: string) => void;

  // Site Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Sponsors
  sponsors: Sponsor[];
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => void;
  updateSponsor: (id: string, sponsor: Partial<Sponsor>) => void;
  deleteSponsor: (id: string) => void;

  // Events
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  // Membership
  membershipTiers: MembershipTier[];
  updateMembershipTier: (id: string, tier: Partial<MembershipTier>) => void;

  // Gallery
  galleryImages: GalleryImage[];
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => void;
  updateGalleryImage: (id: string, image: Partial<GalleryImage>) => void;
  deleteGalleryImage: (id: string) => void;

  // About
  aboutContent: AboutContent;
  updateAboutContent: (content: Partial<AboutContent>) => void;

  // Leadership
  leadership: LeadershipMember[];
  addLeadershipMember: (member: Omit<LeadershipMember, 'id'>) => void;
  updateLeadershipMember: (id: string, member: Partial<LeadershipMember>) => void;
  deleteLeadershipMember: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Default users
const defaultUsers: AdminUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'mta2026',
    name: 'Super Admin',
    email: 'mississaugatamils@gmail.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Default data
const defaultSiteSettings: SiteSettings = {
  siteName: 'Mississauga Tamils Association',
  siteNameTamil: 'மிசிசாகா தமிழ் சங்கம்',
  tagline: 'Connecting Tamil Community in Mississauga & Peel Region Since 2012',
  taglineTamil: '2012 முதல் மிசிசாகா மற்றும் பீல் பகுதியில் தமிழ் சமூகத்தை இணைக்கிறது',
  logo: '/mta-logo-transparent.png',
  email: 'mississaugatamils@gmail.com',
  phone: '(905) 555-8264',
  address: '2090 Hurontario St, Mississauga, ON',
  addressTamil: '2090 ஹுரொண்டாரியோ வீதி, மிசிசாகா, ON',
  facebook: 'https://facebook.com/mississaugatamils',
  instagram: 'https://instagram.com/mississaugatamils',
  youtube: 'https://youtube.com/mississaugatamils',
  whatsapp: '',
  showHomepageSponsors: true,
  homepageSponsorTitle: '🙏✨ A Heartfelt Thank You to Our Sponsors ✨🙏',
  homepageSponsorTitleTamil: '🙏✨ எங்கள் அனுசரணையாளர்களுக்கு மனமார்ந்த நன்றி ✨🙏',
  homepageSponsorSubtitle: 'We extend our sincere gratitude to all our Platinum, Gold, and Silver Sponsors for your generous support and continued partnership. Your contributions play a vital role in making the Tamil Heritage Month & Thai Pongal Celebration 2026 a meaningful and successful event for our community.',
  homepageSponsorSubtitleTamil: 'எங்கள் பிளாட்டினம், தங்கம் மற்றும் வெள்ளி அனுசரணையாளர்களின் தாராள ஆதரவிற்கும் தொடர்ச்சியான கூட்டாண்மைக்கும் நாங்கள் எங்கள் ஆழ்ந்த நன்றியைத் தெரிவித்துக் கொள்கிறோம். தமிழ் மரபுத் திங்கள் மற்றும் தைப்பொங்கல் கொண்டாட்டம் 2026-ஐ எங்கள் சமூகத்திற்கு ஒரு அர்த்தமுள்ள மற்றும் வெற்றிகரமான நிகழ்வாக மாற்றுவதில் உங்கள் பங்களிப்புகள் முக்கிய பங்கு வகிக்கின்றன.',
};

const defaultSponsors: Sponsor[] = [
  { id: '1', name: 'RBC Royal Bank', nameTamil: 'RBC ராயல் வங்கி', logo: '/rbc-logo.png', website: 'https://www.rbc.com', tier: 'platinum', isActive: true },
  { id: '2', name: 'TD Bank', nameTamil: 'TD வங்கி', logo: '/td-logo.png', website: 'https://www.td.com', tier: 'gold', isActive: true },
  { id: '3', name: 'Scotiabank', nameTamil: 'ஸ்கோடியா வங்கி', logo: '/scotiabank-logo.png', website: 'https://www.scotiabank.com', tier: 'gold', isActive: true },
  { id: '4', name: 'Sun Life Financial', nameTamil: 'சன் லைஃப் நிதி', logo: '/sunlife-logo.png', website: 'https://www.sunlife.ca', tier: 'silver', isActive: true },
  { id: '5', name: 'City of Mississauga', nameTamil: 'மிசிசாகா நகரம்', logo: '/mississauga-logo.png', website: 'https://www.mississauga.ca', tier: 'silver', isActive: true },
];

const defaultMembershipTiers: MembershipTier[] = [
  { id: '1', name: 'Individual', nameTamil: 'தனிநபர்', price: 25, features: ['Full member benefits', '1 voting power', 'Event discounts', 'Newsletter access'], featuresTamil: ['முழு உறுப்பினர் நன்மைகள்', '1 வாக்கு அதிகாரம்', 'நிகழ்வு தள்ளுபடிகள்', 'செய்திமடல் அணுகல்'], isPopular: false, isActive: true },
  { id: '2', name: 'Family', nameTamil: 'குடும்பம்', price: 50, features: ['Full benefits for household', '1 voting power', 'Family event pricing', 'Priority registration'], featuresTamil: ['குடும்பத்திற்கு முழு நன்மைகள்', '1 வாக்கு அதிகாரம்', 'குடும்ப நிகழ்வு விலை', 'முன்னுரிமை பதிவு'], isPopular: true, isActive: true },
  { id: '3', name: 'Student', nameTamil: 'மாணவர்', price: 20, features: ['Full member benefits', 'Volunteer opportunities', 'Student programs', 'Mentorship access'], featuresTamil: ['முழு உறுப்பினர் நன்மைகள்', 'தன்னார்வ வாய்ப்புகள்', 'மாணவர் திட்டங்கள்', 'வழிகாட்டி அணுகல்'], isPopular: false, isActive: true },
  { id: '4', name: 'Senior', nameTamil: 'மூத்தோர்', price: 20, features: ['Full member benefits', 'Senior programs priority', 'Wellness events', 'STSP partnership benefits'], featuresTamil: ['முழு உறுப்பினர் நன்மைகள்', 'மூத்தோர் திட்ட முன்னுரிமை', 'நலவாழ்வு நிகழ்வுகள்', 'STSP கூட்டாண்மை நன்மைகள்'], isPopular: false, isActive: true },
];

const defaultAboutContent: AboutContent = {
  // Intro
  intro: "Established in 2012, the Mississauga Tamil Association (MTA) is a 'second-stage' diasporic institution focused on the localization of cultural heritage, fostering civic responsibility, and integrating Tamil identity into the broader multicultural mosaic of Peel Region.",
  introTamil: "2012 இல் நிறுவப்பட்ட மிசிசாகா தமிழ் சங்கம் (MTA), கலாச்சார பாரம்பரியத்தை உள்ளூர்மயமாக்குதல், குடிமைப் பொறுப்பை வளர்த்தல் மற்றும் பீல் பிராந்தியத்தின் பரந்த பன்முக கலாச்சார அமைப்பில் தமிழ் அடையாளத்தை ஒருங்கிணைப்பதில் கவனம் செலுத்தும் 'இரண்டாம் நிலை' புலம்பெயர் நிறுவனமாகும்.",
  // Motto
  motto: 'Unity is Strength',
  mottoTamil: 'ஒற்றுமையே பலம்',
  mottoDescription: "This guiding principle (Otrumaiye Balam) is essential for coalescing our dispersed population in the Peel Region, moving beyond divisions to build a resilient, unified community.",
  mottoDescriptionTamil: "இந்த வழிகாட்டும் கொள்கை (ஒற்றுமையே பலம்) பீல் பிராந்தியத்தில் உள்ள எங்கள் சிதறிய மக்களை ஒன்றிணைக்கவும், பிளவுகளைத் தாண்டி ஒரு நெகிழ்ச்சியான, ஒருங்கிணைந்த சமூகத்தை உருவாக்கவும் அவசியமாகும்.",
  // Mission
  mission: "To promote Tamil culture, language, and heritage while fostering community unity and youth engagement in the Peel Region. We bridge the duty to remember our origins with the imperative to thrive in our new home.",
  missionTamil: "பீல் பிராந்தியத்தில் சமூக ஒற்றுமை மற்றும் இளைஞர் ஈடுபாட்டை வளர்க்கும் அதே வேளையில் தமிழ் கலாச்சாரம், மொழி மற்றும் பாரம்பரியத்தை மேம்படுத்துதல். எங்கள் வேர்களை நினைவில் கொள்வதற்கான கடமையை எங்கள் புதிய வீட்டில் செழித்து வளர்வதற்கான அவசியத்துடன் இணைக்கிறோம்.",
  // Vision
  vision: 'Heritage & Integration - Preserving Tamil identity while building bridges with the broader Canadian community.',
  visionTamil: 'பாரம்பரியம் & ஒருங்கிணைப்பு - பரந்த கனடிய சமூகத்துடன் பாலங்களை கட்டியெழுப்பும் அதே வேளையில் தமிழ் அடையாளத்தை பாதுகாத்தல்.',
  // Civic Leadership
  civicTitle: 'Civic Leadership: Going Green',
  civicTitleTamil: 'குடிமைத் தலைமை: பசுமைக்கு மாறுதல்',
  civicDescription: "MTA goes beyond cultural celebration to substantive civic engagement. We are a coalition partner with the OSSTF 'Going Green' committee, advocating for Electric Vehicle (EV) charging stations in high schools to reduce greenhouse gas emissions. We view ourselves as permanent stakeholders in the environmental future of Mississauga.",
  civicDescriptionTamil: "MTA கலாச்சார கொண்டாட்டத்திற்கு அப்பால் உண்மையான குடிமை ஈடுபாட்டிற்கு செல்கிறது. பசுமை இல்ல வாயு வெளியேற்றத்தைக் குறைக்க உயர்நிலைப் பள்ளிகளில் மின்சார வாகன (EV) சார்ஜிங் நிலையங்களை ஆதரிக்கும் OSSTF 'பசுமைக்கு மாறுதல்' குழுவுடன் நாங்கள் கூட்டணி பங்காளியாக உள்ளோம். மிசிசாகாவின் சுற்றுச்சூழல் எதிர்காலத்தில் எங்களை நிரந்தர பங்குதாரர்களாகக் கருதுகிறோம்.",
  // Social Welfare
  socialTitle: 'Social Welfare: Annadhanam',
  socialTitleTamil: 'சமூக நலன்: அன்னதானம்',
  socialDescription: "Transitioning from celebration to service, we partner with Sai Dham Food Bank to fight food insecurity. We collect culturally appropriate foods (rice, lentils, flour), secularizing the Tamil concept of 'Annadhanam' (the gift of food) into Canadian volunteerism.",
  socialDescriptionTamil: "கொண்டாட்டத்திலிருந்து சேவைக்கு மாறி, உணவுப் பாதுகாப்பின்மையை எதிர்த்துப் போராட சாய் தாம் உணவு வங்கியுடன் இணைகிறோம். நாங்கள் கலாச்சாரத்திற்கு ஏற்ற உணவுகளை (அரிசி, பருப்பு, மாவு) சேகரிக்கிறோம், 'அன்னதானம்' (உணவுப் பரிசு) என்ற தமிழ் கருத்தை கனடிய தன்னார்வ சேவையாக மாற்றுகிறோம்.",
  // Youth Wing
  youthTitle: 'Peel Youth Wing (PYDC)',
  youthTitleTamil: 'பீல் இளைஞர் பிரிவு (PYDC)',
  youthDescription: "Our semi-autonomous youth body builds the intergenerational pipeline. Leveraging the 'Youth Hub' at Glenforest Secondary School and volunteer hours, we engage students in sports, networking, and cultural organization, ensuring the preservation of identity in the next generation.",
  youthDescriptionTamil: "எங்கள் அரை-தன்னாட்சி இளைஞர் அமைப்பு தலைமுறைகளுக்கு இடையிலான தொடர்பை உருவாக்குகிறது. கிளென்ஃபாரெஸ்ட் மேல்நிலைப் பள்ளியில் உள்ள 'இளைஞர் மையம்' மற்றும் தன்னார்வ நேரங்களைப் பயன்படுத்தி, நாங்கள் மாணவர்களை விளையாட்டு, நெட்வொர்க்கிங் மற்றும் கலாச்சார அமைப்பில் ஈடுபடுத்துகிறோம், அடுத்த தலைமுறையில் அடையாளத்தைப் பாதுகாப்பதை உறுதிசெய்கிறோம்.",
  // History
  history: 'Founded in 2012, MTA has grown from a small community gathering to a significant institution serving the Tamil diaspora in Peel Region.',
  historyTamil: '2012 இல் நிறுவப்பட்ட MTA, ஒரு சிறிய சமூகக் கூட்டத்திலிருந்து பீல் பிராந்தியத்தில் தமிழ் புலம்பெயர்ந்தோருக்கு சேவை செய்யும் முக்கியமான நிறுவனமாக வளர்ந்துள்ளது.',
};

const defaultLeadership: LeadershipMember[] = [
  { id: '1', name: 'To be announced', nameTamil: 'அறிவிக்கப்படும்', position: 'President', positionTamil: 'தலைவர்', image: '', isActive: true },
  { id: '2', name: 'To be announced', nameTamil: 'அறிவிக்கப்படும்', position: 'Vice President', positionTamil: 'துணைத் தலைவர்', image: '', isActive: true },
  { id: '3', name: 'To be announced', nameTamil: 'அறிவிக்கப்படும்', position: 'Secretary', positionTamil: 'செயலாளர்', image: '', isActive: true },
  { id: '4', name: 'To be announced', nameTamil: 'அறிவிக்கப்படும்', position: 'Treasurer', positionTamil: 'பொருளாளர்', image: '', isActive: true },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>(defaultUsers);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [sponsors, setSponsors] = useState<Sponsor[]>(defaultSponsors);
  const [events, setEvents] = useState<Event[]>([]);
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>(defaultMembershipTiers);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);
  const [leadership, setLeadership] = useState<LeadershipMember[]>(defaultLeadership);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedUser = localStorage.getItem('mta-current-user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }

        const savedUsers = localStorage.getItem('mta-users');
        if (savedUsers) setUsers(JSON.parse(savedUsers));

        const savedLogs = localStorage.getItem('mta-activity-logs');
        if (savedLogs) setActivityLogs(JSON.parse(savedLogs));

        const savedSettings = localStorage.getItem('mta-site-settings');
        if (savedSettings) setSiteSettings(JSON.parse(savedSettings));

        const savedSponsors = localStorage.getItem('mta-sponsors');
        if (savedSponsors) setSponsors(JSON.parse(savedSponsors));

        const savedEvents = localStorage.getItem('mta-events');
        if (savedEvents) setEvents(JSON.parse(savedEvents));

        const savedMembership = localStorage.getItem('mta-membership');
        if (savedMembership) setMembershipTiers(JSON.parse(savedMembership));

        const savedGallery = localStorage.getItem('mta-gallery');
        if (savedGallery) setGalleryImages(JSON.parse(savedGallery));

        const savedAbout = localStorage.getItem('mta-about');
        if (savedAbout) setAboutContent(JSON.parse(savedAbout));

        const savedLeadership = localStorage.getItem('mta-leadership');
        if (savedLeadership) setLeadership(JSON.parse(savedLeadership));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mta-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mta-activity-logs', JSON.stringify(activityLogs.slice(0, 100))); // Keep last 100 logs
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('mta-site-settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('mta-sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem('mta-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('mta-membership', JSON.stringify(membershipTiers));
  }, [membershipTiers]);

  useEffect(() => {
    localStorage.setItem('mta-gallery', JSON.stringify(galleryImages));
  }, [galleryImages]);

  useEffect(() => {
    localStorage.setItem('mta-about', JSON.stringify(aboutContent));
  }, [aboutContent]);

  useEffect(() => {
    localStorage.setItem('mta-leadership', JSON.stringify(leadership));
  }, [leadership]);

  // Activity logging
  const logActivity = (action: string, details: string) => {
    if (!currentUser) return;
    const log: ActivityLog = {
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  // Auth functions
  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password && u.isActive);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('mta-current-user', JSON.stringify(updatedUser));

      // Update last login in users array
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

      // Log activity
      setActivityLogs(prev => [{
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: 'Login',
        details: 'User logged in',
        timestamp: new Date().toISOString(),
      }, ...prev]);

      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logActivity('Logout', 'User logged out');
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('mta-current-user');
  };

  // Permission helpers
  const canEdit = (): boolean => {
    return currentUser?.role === 'admin' || currentUser?.role === 'editor';
  };

  const canDelete = (): boolean => {
    return currentUser?.role === 'admin';
  };

  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  // User Management
  const addUser = (user: Omit<AdminUser, 'id' | 'createdAt'>) => {
    if (!isAdmin()) return;
    const newUser: AdminUser = {
      ...user,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    logActivity('Add User', `Added new user: ${user.username} (${user.role})`);
  };

  const updateUser = (id: string, user: Partial<AdminUser>) => {
    if (!isAdmin()) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
    logActivity('Update User', `Updated user: ${user.username || id}`);
  };

  const deleteUser = (id: string) => {
    if (!isAdmin()) return;
    if (id === currentUser?.id) return; // Can't delete yourself
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    logActivity('Delete User', `Deleted user: ${user?.username || id}`);
  };

  // Site Settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    if (!canEdit()) return;
    setSiteSettings(prev => ({ ...prev, ...settings }));
    logActivity('Update Settings', 'Updated site settings');
  };

  // Sponsors CRUD
  const addSponsor = (sponsor: Omit<Sponsor, 'id'>) => {
    if (!canEdit()) return;
    setSponsors(prev => [...prev, { ...sponsor, id: generateId() }]);
    logActivity('Add Sponsor', `Added sponsor: ${sponsor.name}`);
  };

  const updateSponsor = (id: string, sponsor: Partial<Sponsor>) => {
    if (!canEdit()) return;
    setSponsors(prev => prev.map(s => s.id === id ? { ...s, ...sponsor } : s));
    logActivity('Update Sponsor', `Updated sponsor: ${sponsor.name || id}`);
  };

  const deleteSponsor = (id: string) => {
    if (!canDelete()) return;
    const sponsor = sponsors.find(s => s.id === id);
    setSponsors(prev => prev.filter(s => s.id !== id));
    logActivity('Delete Sponsor', `Deleted sponsor: ${sponsor?.name || id}`);
  };

  // Events CRUD
  const addEvent = (event: Omit<Event, 'id'>) => {
    if (!canEdit()) return;
    setEvents(prev => [...prev, { ...event, id: generateId() }]);
    logActivity('Add Event', `Added event: ${event.title}`);
  };

  const updateEvent = (id: string, event: Partial<Event>) => {
    if (!canEdit()) return;
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...event } : e));
    logActivity('Update Event', `Updated event: ${event.title || id}`);
  };

  const deleteEvent = (id: string) => {
    if (!canDelete()) return;
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    logActivity('Delete Event', `Deleted event: ${event?.title || id}`);
  };

  // Membership
  const updateMembershipTier = (id: string, tier: Partial<MembershipTier>) => {
    if (!canEdit()) return;
    setMembershipTiers(prev => prev.map(t => t.id === id ? { ...t, ...tier } : t));
    logActivity('Update Membership', `Updated membership tier: ${tier.name || id}`);
  };

  // Gallery CRUD
  const addGalleryImage = (image: Omit<GalleryImage, 'id'>) => {
    if (!canEdit()) return;
    setGalleryImages(prev => [...prev, { ...image, id: generateId() }]);
    logActivity('Add Gallery', `Added gallery image: ${image.title}`);
  };

  const updateGalleryImage = (id: string, image: Partial<GalleryImage>) => {
    if (!canEdit()) return;
    setGalleryImages(prev => prev.map(i => i.id === id ? { ...i, ...image } : i));
    logActivity('Update Gallery', `Updated gallery image: ${image.title || id}`);
  };

  const deleteGalleryImage = (id: string) => {
    if (!canDelete()) return;
    const image = galleryImages.find(i => i.id === id);
    setGalleryImages(prev => prev.filter(i => i.id !== id));
    logActivity('Delete Gallery', `Deleted gallery image: ${image?.title || id}`);
  };

  // About
  const updateAboutContent = (content: Partial<AboutContent>) => {
    if (!canEdit()) return;
    setAboutContent(prev => ({ ...prev, ...content }));
    logActivity('Update About', 'Updated about content');
  };

  // Leadership CRUD
  const addLeadershipMember = (member: Omit<LeadershipMember, 'id'>) => {
    if (!canEdit()) return;
    setLeadership(prev => [...prev, { ...member, id: generateId() }]);
    logActivity('Add Leadership', `Added leadership member: ${member.name}`);
  };

  const updateLeadershipMember = (id: string, member: Partial<LeadershipMember>) => {
    if (!canEdit()) return;
    setLeadership(prev => prev.map(m => m.id === id ? { ...m, ...member } : m));
    logActivity('Update Leadership', `Updated leadership member: ${member.name || id}`);
  };

  const deleteLeadershipMember = (id: string) => {
    if (!canDelete()) return;
    const member = leadership.find(m => m.id === id);
    setLeadership(prev => prev.filter(m => m.id !== id));
    logActivity('Delete Leadership', `Deleted leadership member: ${member?.name || id}`);
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      currentUser,
      login,
      logout,
      users,
      addUser,
      updateUser,
      deleteUser,
      canEdit,
      canDelete,
      isAdmin,
      activityLogs,
      logActivity,
      siteSettings,
      updateSiteSettings,
      sponsors,
      addSponsor,
      updateSponsor,
      deleteSponsor,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      membershipTiers,
      updateMembershipTier,
      galleryImages,
      addGalleryImage,
      updateGalleryImage,
      deleteGalleryImage,
      aboutContent,
      updateAboutContent,
      leadership,
      addLeadershipMember,
      updateLeadershipMember,
      deleteLeadershipMember,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
