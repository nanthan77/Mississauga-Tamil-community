export interface Sponsor {
  id: string;
  name: string;
  nameTamil: string;
  logo: string;
  website: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

export const sponsors: Sponsor[] = [
  {
    id: '1',
    name: 'RBC Royal Bank',
    nameTamil: 'RBC ராயல் வங்கி',
    logo: '/sponsors/sponsor-placeholder.png',
    website: 'https://www.rbc.com',
    tier: 'platinum'
  },
  {
    id: '2',
    name: 'TD Bank',
    nameTamil: 'TD வங்கி',
    logo: '/sponsors/sponsor-placeholder.png',
    website: 'https://www.td.com',
    tier: 'gold'
  },
  {
    id: '3',
    name: 'Scotiabank',
    nameTamil: 'ஸ்கோடியா வங்கி',
    logo: '/sponsors/sponsor-placeholder.png',
    website: 'https://www.scotiabank.com',
    tier: 'gold'
  },
  {
    id: '4',
    name: 'Sun Life Financial',
    nameTamil: 'சன் லைஃப் நிதி',
    logo: '/sponsors/sponsor-placeholder.png',
    website: 'https://www.sunlife.ca',
    tier: 'silver'
  },
  {
    id: '5',
    name: 'Peel Regional Police',
    nameTamil: 'பீல் மண்டல காவல்துறை',
    logo: '/sponsors/sponsor-placeholder.png',
    website: 'https://www.peelpolice.ca',
    tier: 'silver'
  },
  {
    id: '6',
    name: 'City of Mississauga',
    nameTamil: 'மிசிசாகா நகரம்',
    logo: '/sponsors/sponsor-placeholder.png',
    website: 'https://www.mississauga.ca',
    tier: 'silver'
  },
  {
    id: '7',
    name: 'Tamil Business Network',
    nameTamil: 'தமிழ் வணிக வலைப்பின்னல்',
    logo: '/sponsors/sponsor-placeholder.png',
    website: '#',
    tier: 'bronze'
  },
  {
    id: '8',
    name: 'Saravana Bhavan',
    nameTamil: 'சரவணா பவன்',
    logo: '/sponsors/sponsor-placeholder.png',
    website: '#',
    tier: 'bronze'
  }
];
