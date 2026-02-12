'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SponsorProvider, useSponsor, TIER_FEATURES } from '@/contexts/SponsorContext';
import {
  Building2, Crown, Award, Medal, ExternalLink, Globe, Phone, Mail,
  MapPin, ArrowLeft, Calendar, Clock, Megaphone, FileText, Play,
  Facebook, Twitter, Linkedin, Instagram, Image as ImageIcon
} from 'lucide-react';

function SponsorDetailContent({ sponsorId }: { sponsorId: string }) {
  const {
    getSponsorById,
    sponsorContents,
    trackPageView,
    trackClick
  } = useSponsor();

  const sponsor = getSponsorById(sponsorId);

  useEffect(() => {
    if (sponsor) {
      trackPageView(sponsorId, 'direct');
    }
  }, [sponsor, sponsorId, trackPageView]);

  const approvedContents = useMemo(() => {
    return sponsorContents
      .filter(content => content.sponsorId === sponsorId && content.status === 'approved')
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [sponsorContents, sponsorId]);

  if (!sponsor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sponsor Not Found</h1>
          <p className="text-gray-600 mb-6">The sponsor you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/sponsors"
            className="inline-flex items-center text-[#8B1538] font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sponsors
          </Link>
        </div>
      </div>
    );
  }

  const tierConfig = TIER_FEATURES[sponsor.tier];

  const tierIcons: Record<string, React.ReactNode> = {
    platinum: <Crown className="w-5 h-5" />,
    gold: <Award className="w-5 h-5" />,
    silver: <Medal className="w-5 h-5" />,
  };

  const contentTypeIcons: Record<string, React.ReactNode> = {
    promotion: <Megaphone className="w-5 h-5" />,
    announcement: <FileText className="w-5 h-5" />,
    event: <Calendar className="w-5 h-5" />,
    article: <FileText className="w-5 h-5" />,
    video: <Play className="w-5 h-5" />,
  };

  const handleWebsiteClick = () => trackClick(sponsorId, 'website');
  const handlePhoneClick = () => trackClick(sponsorId, 'phone');
  const handleEmailClick = () => trackClick(sponsorId, 'email');
  const handleSocialClick = (socialType: string) => trackClick(sponsorId, 'social', socialType);

  const hasSocialLinks = sponsor.facebook || sponsor.instagram || sponsor.twitter || sponsor.linkedin;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background */}
        <div className="h-64 md:h-80 bg-gradient-to-r from-[#8B1538] to-[#6B1028]">
          {sponsor.heroImage && (
            <img
              src={sponsor.heroImage}
              alt={sponsor.name}
              className="w-full h-full object-cover opacity-30"
            />
          )}
        </div>

        {/* Back Link */}
        <div className="absolute top-4 left-4">
          <Link
            href="/sponsors"
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Sponsors
          </Link>
        </div>

        {/* Sponsor Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 -mt-16 md:-mt-20 border-4 border-white shadow-lg">
                  {sponsor.logo ? (
                    <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${tierConfig.bgColor}`}>
                      {tierIcons[sponsor.tier]}
                      {tierConfig.name} Sponsor
                    </span>
                    {sponsor.category && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {sponsor.category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{sponsor.name}</h1>
                  {sponsor.tagline && (
                    <p className="text-lg text-gray-600">{sponsor.tagline}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-32 md:pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Gallery */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {sponsor.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 whitespace-pre-line">{sponsor.description}</p>
              </div>
            )}

            {/* Promotions & Updates */}
            {approvedContents.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Updates</h2>
                <div className="space-y-6">
                  {approvedContents.map(content => (
                    <div
                      key={content.id}
                      className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        {content.image && (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={content.image}
                              alt={content.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">
                              {contentTypeIcons[content.type]}
                              {content.type}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(content.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{content.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-3">{content.content}</p>

                          {content.startDate && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {new Date(content.startDate).toLocaleDateString()}
                              {content.endDate && ` - ${new Date(content.endDate).toLocaleDateString()}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {sponsor.galleryImages && sponsor.galleryImages.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sponsor.galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${sponsor.name} gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Social */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3">
                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWebsiteClick}
                    className="flex items-center gap-3 text-gray-600 hover:text-[#8B1538] transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="truncate">{sponsor.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {sponsor.phone && (
                  <a
                    href={`tel:${sponsor.phone}`}
                    onClick={handlePhoneClick}
                    className="flex items-center gap-3 text-gray-600 hover:text-[#8B1538] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{sponsor.phone}</span>
                  </a>
                )}
                {sponsor.email && (
                  <a
                    href={`mailto:${sponsor.email}`}
                    onClick={handleEmailClick}
                    className="flex items-center gap-3 text-gray-600 hover:text-[#8B1538] transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="truncate">{sponsor.email}</span>
                  </a>
                )}
                {sponsor.address && (
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{sponsor.address}</span>
                  </div>
                )}
              </div>

              {/* Visit Website Button */}
              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWebsiteClick}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#8B1538] text-white rounded-lg font-medium hover:bg-[#6B1028] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              )}
            </div>

            {/* Social Media */}
            {hasSocialLinks && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h2>
                <div className="flex gap-3">
                  {sponsor.facebook && (
                    <a
                      href={sponsor.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSocialClick('facebook')}
                      className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {sponsor.twitter && (
                    <a
                      href={sponsor.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSocialClick('twitter')}
                      className="p-3 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {sponsor.linkedin && (
                    <a
                      href={sponsor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSocialClick('linkedin')}
                      className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {sponsor.instagram && (
                    <a
                      href={sponsor.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSocialClick('instagram')}
                      className="p-3 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Sponsorship Level */}
            <div className={`rounded-xl p-6 shadow-sm ${tierConfig.bgColor}`}>
              <div className="flex items-center gap-3 mb-3">
                {tierIcons[sponsor.tier]}
                <h2 className="text-lg font-bold">{tierConfig.name} Sponsor</h2>
              </div>
              <p className="text-sm opacity-80">
                {sponsor.name} is a proud {tierConfig.name.toLowerCase()} sponsor of the Mississauga Tamil Association.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SponsorDetailClient({ sponsorId }: { sponsorId: string }) {
  return (
    <SponsorProvider>
      <SponsorDetailContent sponsorId={sponsorId} />
    </SponsorProvider>
  );
}
