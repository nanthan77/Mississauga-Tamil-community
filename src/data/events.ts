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
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Tamil Heritage Month & Thai Pongal 2026',
    titleTamil: 'தமிழ் மரபுத் திங்கள் மற்றும் தைப் பொங்கல் 2026',
    date: '2026-01-24',
    time: '5:00 PM - 9:30 PM',
    venue: 'Glenforest Secondary School',
    venueTamil: 'கிளென்பாரெஸ்ட் மேல்நிலைப் பள்ளி',
    address: '3575 Fieldgate Dr, Mississauga',
    description: 'Join us for the grand Tamil Heritage Month & Thai Pongal celebration. A festival of heritage celebrating the harvest, art (Iyal, Isai, Nadagam), and community unity. Featuring traditional boiling of milk, cultural performances, and more.',
    descriptionTamil: 'தமிழ் மரபுத் திங்கள் மற்றும் தைப் பொங்கல் கொண்டாட்டத்தில் எங்களுடன் இணையுங்கள். அறுவடை, கலை (இயல், இசை, நாடகம்) மற்றும் சமூக ஒற்றுமையை கொண்டாடும் பாரம்பரிய விழா.',
    highlights: [
      'Traditional Pongal Ritual (Boiling of Milk)',
      'Cultural Performances (Iyal, Isai, Nadagam)',
      'High-profile Dignitary Addresses',
      'Free Admission for All',
      'Community Unity Celebration'
    ],
    highlightsTamil: [
      'பாரம்பரிய பொங்கல் சடங்கு (பால் பொங்குதல்)',
      'கலாச்சார நிகழ்ச்சிகள் (இயல், இசை, நாடகம்)',
      'உயர் அதிகாரிகள் உரை',
      'அனைவருக்கும் இலவச அனுமதி',
      'சமூக ஒற்றுமை கொண்டாட்டம்'
    ],
    image: '/Upcoming Events/tamil-heritage-pongal-2026.jpeg',
    category: 'cultural',
    pricing: {
      members: 'FREE',
      nonMembers: 0,
      family: 0
    },
    isFeatured: true
  },
  {
    id: '2',
    title: 'Tamil New Year Celebration',
    titleTamil: 'தமிழ் புத்தாண்டு விழா',
    date: '2026-04-14',
    time: '5:00 PM - 11:00 PM',
    venue: 'Hershey Centre',
    venueTamil: 'ஹெர்ஷி மையம்',
    address: '5500 Rose Cherry Place, Mississauga, ON',
    description: 'Celebrate the Tamil New Year with grand cultural performances, traditional food, and community fellowship. A night of music, dance, and celebration!',
    descriptionTamil: 'பெரிய கலாச்சார நிகழ்ச்சிகள், பாரம்பரிய உணவு மற்றும் சமூக நட்புடன் தமிழ் புத்தாண்டைக் கொண்டாடுங்கள். இசை, நடனம் மற்றும் கொண்டாட்டத்தின் இரவு!',
    highlights: [
      'Grand cultural program',
      'Traditional Tamil feast',
      'Youth talent showcase',
      'Award ceremony for community leaders',
      'Live orchestra performance'
    ],
    highlightsTamil: [
      'பெரிய கலாச்சார நிகழ்ச்சி',
      'பாரம்பரிய தமிழ் விருந்து',
      'இளைஞர் திறமை காட்சி',
      'சமூக தலைவர்களுக்கான விருது வழங்கும் விழா',
      'நேரடி இசைக்குழு நிகழ்ச்சி'
    ],
    image: '/events/newyear.png',
    category: 'cultural',
    pricing: {
      members: 25,
      nonMembers: 35,
      family: 80
    },
    isFeatured: true
  },
  {
    id: '3',
    title: 'Youth Cricket Tournament',
    titleTamil: 'இளைஞர் கிரிக்கெட் போட்டி',
    date: '2026-06-20',
    time: '9:00 AM - 6:00 PM',
    venue: 'Mississauga Valley Park',
    venueTamil: 'மிசிசாகா பள்ளத்தாக்கு பூங்கா',
    address: '1275 Mississauga Valley Blvd, Mississauga, ON',
    description: 'Annual youth cricket tournament for ages 12-18. Form your teams and compete for the MTA Youth Cricket Championship trophy!',
    descriptionTamil: '12-18 வயது இளைஞர்களுக்கான வருடாந்திர கிரிக்கெட் போட்டி. உங்கள் அணிகளை உருவாக்கி MTA இளைஞர் கிரிக்கெட் சாம்பியன்ஷிப் கோப்பைக்காக போட்டியிடுங்கள்!',
    highlights: [
      'Teams of 8-11 players',
      'T20 format matches',
      'Trophies and medals',
      'Free lunch for participants',
      'Professional umpires'
    ],
    highlightsTamil: [
      '8-11 வீரர்கள் கொண்ட அணிகள்',
      'T20 வடிவ போட்டிகள்',
      'கோப்பைகள் மற்றும் பதக்கங்கள்',
      'பங்கேற்பாளர்களுக்கு இலவச மதிய உணவு',
      'தொழில்முறை நடுவர்கள்'
    ],
    image: '/events/cricket.png',
    category: 'sports',
    pricing: {
      members: 10,
      nonMembers: 15,
      family: 30
    },
    isFeatured: false
  },
  {
    id: '4',
    title: 'Seniors Wellness Day',
    titleTamil: 'மூத்தோர் நலவாழ்வு நாள்',
    date: '2026-02-15',
    time: '10:00 AM - 3:00 PM',
    venue: 'MTA Community Hall',
    venueTamil: 'MTA சமூக மண்டபம்',
    address: '2090 Hurontario St, Mississauga, ON',
    description: 'A day dedicated to our seniors with health screenings, yoga sessions, Tamil classical music, and lunch. Co-hosted with Senior Tamils Society of Peel.',
    descriptionTamil: 'சுகாதார பரிசோதனைகள், யோகா அமர்வுகள், தமிழ் செவ்வியல் இசை மற்றும் மதிய உணவுடன் எங்கள் மூத்தவர்களுக்காக அர்ப்பணிக்கப்பட்ட ஒரு நாள். பீல் மூத்த தமிழர் சங்கத்துடன் இணைந்து நடத்தப்படுகிறது.',
    highlights: [
      'Free health screenings',
      'Gentle yoga and meditation',
      'Tamil classical music performance',
      'Nutritious lunch provided',
      'Social activities and games'
    ],
    highlightsTamil: [
      'இலவச சுகாதார பரிசோதனைகள்',
      'மென்மையான யோகா மற்றும் தியானம்',
      'தமிழ் செவ்வியல் இசை நிகழ்ச்சி',
      'சத்தான மதிய உணவு வழங்கப்படும்',
      'சமூக செயல்பாடுகள் மற்றும் விளையாட்டுகள்'
    ],
    image: '/events/seniors.png',
    category: 'seniors',
    pricing: {
      members: 'FREE',
      nonMembers: 10,
      family: 20
    },
    isFeatured: false
  },
  {
    id: '5',
    title: 'Tamils Got Talent 2026',
    titleTamil: 'தமிழர்களுக்கு திறமை உண்டு 2026',
    date: '2026-08-22',
    time: '6:00 PM - 10:00 PM',
    venue: 'Living Arts Centre',
    venueTamil: 'லிவிங் ஆர்ட்ஸ் மையம்',
    address: '4141 Living Arts Dr, Mississauga, ON',
    description: 'The biggest youth talent showcase in the Tamil community! Singing, dancing, instrumental, comedy - all talents welcome. Compete for $5,000 in prizes!',
    descriptionTamil: 'தமிழ் சமூகத்தில் மிகப்பெரிய இளைஞர் திறமை காட்சி! பாடல், நடனம், கருவி, நகைச்சுவை - அனைத்து திறமைகளும் வரவேற்கப்படுகின்றன. $5,000 பரிசுகளுக்காக போட்டியிடுங்கள்!',
    highlights: [
      '$5,000 in total prizes',
      'Professional judges panel',
      'Categories: Singing, Dance, Instrumental, Comedy',
      'Ages 8-25 eligible',
      'Live audience voting'
    ],
    highlightsTamil: [
      'மொத்தம் $5,000 பரிசுகள்',
      'தொழில்முறை நடுவர் குழு',
      'பிரிவுகள்: பாடல், நடனம், கருவி, நகைச்சுவை',
      '8-25 வயது தகுதியானவர்கள்',
      'நேரடி பார்வையாளர் வாக்களிப்பு'
    ],
    image: '/events/talent.png',
    category: 'youth',
    pricing: {
      members: 15,
      nonMembers: 25,
      family: 60
    },
    isFeatured: true
  },
  {
    id: '6',
    title: 'Deepavali Gala Night',
    titleTamil: 'தீபாவளி விழா இரவு',
    date: '2026-10-31',
    time: '6:00 PM - 12:00 AM',
    venue: 'Mississauga Convention Centre',
    venueTamil: 'மிசிசாகா மாநாட்டு மையம்',
    address: '75 Derry Road West, Mississauga, ON',
    description: 'Grand Deepavali celebration with traditional lamp lighting, cultural performances, gourmet dinner, and fireworks display!',
    descriptionTamil: 'பாரம்பரிய விளக்கு ஏற்றுதல், கலாச்சார நிகழ்ச்சிகள், சிறந்த விருந்து மற்றும் பட்டாசு காட்சியுடன் கூடிய பெரிய தீபாவளி கொண்டாட்டம்!',
    highlights: [
      'Traditional lamp lighting ceremony',
      'Grand cultural program',
      'Gourmet Indian dinner',
      'Fireworks display',
      'Best dressed competition'
    ],
    highlightsTamil: [
      'பாரம்பரிய விளக்கு ஏற்றும் விழா',
      'பெரிய கலாச்சார நிகழ்ச்சி',
      'சிறந்த இந்திய விருந்து',
      'பட்டாசு காட்சி',
      'சிறந்த உடை போட்டி'
    ],
    image: '/events/deepavali.png',
    category: 'cultural',
    pricing: {
      members: 40,
      nonMembers: 55,
      family: 120
    },
    isFeatured: true
  }
];

export const getNextEvent = () => {
  const now = new Date();
  return events
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
};

export const getFeaturedEvents = () => {
  return events.filter(event => event.isFeatured);
};
