'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SponsorProvider, useSponsor, TIER_FEATURES } from '@/contexts/SponsorContext';
import {
  Building2, Crown, Award, Medal, ExternalLink, Globe, Phone, Mail,
  MapPin, Search, Filter, ArrowRight
} from 'lucide-react';

function SponsorsContent() {
  const { sponsors, sponsorContents, trackPageView } = useSponsor();
  const [filterTier, setFilterTier] = useState<'all' | 'platinum' | 'gold' | 'silver' | 'bronze'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tierIcons = {
    platinum: <Crown className="w-5 h-5" />,
    gold: <Award className="w-5 h-5" />,
    silver: <Medal className="w-5 h-5" />,
    bronze: <Crown className="w-5 h-5" />,
  };

  const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];

  const filteredSponsors = useMemo(() => {
    return sponsors
      .filter(sponsor => sponsor.isActive)
      .filter(sponsor => {
        const matchesTier = filterTier === 'all' || sponsor.tier === filterTier;
        const matchesSearch = searchTerm === '' ||
          sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sponsor.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTier && matchesSearch;
      })
      .sort((a, b) => {
        // Sort by tier first, then alphabetically
        const tierDiff = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
        if (tierDiff !== 0) return tierDiff;
        return a.name.localeCompare(b.name);
      });
  }, [sponsors, filterTier, searchTerm]);

  const getApprovedContent = (sponsorId: string) => {
    return sponsorContents.filter(
      content => content.sponsorId === sponsorId && content.status === 'approved'
    );
  };

  // Group sponsors by tier
  const sponsorsByTier = useMemo(() => {
    const grouped: Record<string, typeof filteredSponsors> = {};
    filteredSponsors.forEach(sponsor => {
      if (!grouped[sponsor.tier]) {
        grouped[sponsor.tier] = [];
      }
      grouped[sponsor.tier].push(sponsor);
    });
    return grouped;
  }, [filteredSponsors]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Sponsors</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            We are grateful to our sponsors who support the Mississauga Tamil community.
            Their generosity helps us organize events and programs that bring our community together.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sponsors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'platinum', 'gold', 'silver', 'bronze'] as const).map((tier) => {
                const config = tier === 'all' ? null : TIER_FEATURES[tier];
                return (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      filterTier === tier
                        ? 'bg-[#8B1538] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tier === 'all' ? 'All Sponsors' : config?.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sponsors Grid */}
        {filteredSponsors.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sponsors Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        ) : filterTier === 'all' ? (
          // Show grouped by tier
          tierOrder.map(tier => {
            const tierSponsors = sponsorsByTier[tier];
            if (!tierSponsors || tierSponsors.length === 0) return null;
            const config = TIER_FEATURES[tier as keyof typeof TIER_FEATURES];

            return (
              <div key={tier} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    {tierIcons[tier as keyof typeof tierIcons]}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{config.name} Sponsors</h2>
                  <span className="text-sm text-gray-500">({tierSponsors.length})</span>
                </div>

                <div className={`grid gap-6 ${
                  tier === 'platinum' ? 'grid-cols-1 lg:grid-cols-2' :
                  tier === 'gold' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                  'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {tierSponsors.map(sponsor => (
                    <SponsorCard
                      key={sponsor.id}
                      sponsor={sponsor}
                      tier={tier}
                      approvedContentCount={getApprovedContent(sponsor.id).length}
                      trackPageView={trackPageView}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Show filtered results
          <div className={`grid gap-6 ${
            filterTier === 'platinum' ? 'grid-cols-1 lg:grid-cols-2' :
            filterTier === 'gold' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {filteredSponsors.map(sponsor => (
              <SponsorCard
                key={sponsor.id}
                sponsor={sponsor}
                tier={sponsor.tier}
                approvedContentCount={getApprovedContent(sponsor.id).length}
                trackPageView={trackPageView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Become a Sponsor CTA */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#C19B26] py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Become a Sponsor</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of supporters and help us make a difference.
            Contact us to learn more about sponsorship opportunities and benefits.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-[#8B1538] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SponsorCard({
  sponsor,
  tier,
  approvedContentCount,
  trackPageView
}: {
  sponsor: any;
  tier: string;
  approvedContentCount: number;
  trackPageView: (sponsorId: string, source?: string) => void;
}) {
  const config = TIER_FEATURES[tier as keyof typeof TIER_FEATURES];
  const isPremium = tier === 'platinum' || tier === 'gold';

  const handleClick = () => {
    trackPageView(sponsor.id, 'sponsors_page');
  };

  if (tier === 'bronze') {
    // Bronze tier - logo only, no link
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-center">
        {sponsor.logo ? (
          <img src={sponsor.logo} alt={sponsor.name} className="h-12 object-contain" />
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <Building2 className="w-6 h-6" />
            <span className="text-sm font-medium">{sponsor.name}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/sponsors/${sponsor.id}`}
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
        isPremium ? 'border-2' : ''
      }`}
      style={isPremium ? { borderColor: tier === 'platinum' ? '#9ca3af' : '#D4AF37' } : {}}
    >
      {/* Hero/Logo Section */}
      <div className={`relative ${tier === 'platinum' ? 'h-48' : 'h-32'} bg-gray-100`}>
        {sponsor.heroImage ? (
          <img
            src={sponsor.heroImage}
            alt={sponsor.name}
            className="w-full h-full object-cover"
          />
        ) : sponsor.logo ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Tier Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor}`}>
          {config.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={`font-bold text-gray-900 mb-1 ${tier === 'platinum' ? 'text-xl' : 'text-lg'}`}>
          {sponsor.name}
        </h3>

        {sponsor.tagline && (
          <p className="text-sm text-gray-500 mb-2">{sponsor.tagline}</p>
        )}

        {isPremium && sponsor.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {sponsor.description}
          </p>
        )}

        {/* Contact Info for Platinum */}
        {tier === 'platinum' && sponsor.email && (
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span className="truncate">{sponsor.email}</span>
            </span>
          </div>
        )}

        {/* Approved Content Count */}
        {approvedContentCount > 0 && isPremium && (
          <div className="text-sm text-[#8B1538] font-medium">
            {approvedContentCount} promotion{approvedContentCount > 1 ? 's' : ''} & update{approvedContentCount > 1 ? 's' : ''}
          </div>
        )}

        {/* View Link */}
        <div className="flex items-center gap-1 text-[#8B1538] font-medium text-sm mt-3">
          View Details
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default function SponsorsPage() {
  return (
    <SponsorProvider>
      <SponsorsContent />
    </SponsorProvider>
  );
}
