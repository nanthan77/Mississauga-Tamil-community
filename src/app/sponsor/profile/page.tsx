'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSponsor } from '@/contexts/SponsorContext';
import {
  ArrowLeft, Save, Building2, Globe, Mail, Phone, MapPin,
  Facebook, Instagram, Youtube, Linkedin, Twitter, Image as ImageIcon,
  Plus, X, CheckCircle, Upload
} from 'lucide-react';

export default function SponsorProfilePage() {
  const router = useRouter();
  const { isSponsorAuthenticated, currentSponsor, updateSponsorProfile, getTierFeatures, canAccessFeature } = useSponsor();

  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    tagline: '',
    taglineTamil: '',
    description: '',
    descriptionTamil: '',
    category: '',
    yearEstablished: '',
    email: '',
    phone: '',
    address: '',
    addressTamil: '',
    website: '',
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    twitter: '',
    logo: '',
    heroImage: '',
    galleryImages: [] as string[],
  });
  const [newGalleryImage, setNewGalleryImage] = useState('');

  useEffect(() => {
    if (!isSponsorAuthenticated || !currentSponsor) {
      router.push('/sponsor');
      return;
    }

    setFormData({
      tagline: currentSponsor.tagline || '',
      taglineTamil: currentSponsor.taglineTamil || '',
      description: currentSponsor.description || '',
      descriptionTamil: currentSponsor.descriptionTamil || '',
      category: currentSponsor.category || '',
      yearEstablished: currentSponsor.yearEstablished || '',
      email: currentSponsor.email || '',
      phone: currentSponsor.phone || '',
      address: currentSponsor.address || '',
      addressTamil: currentSponsor.addressTamil || '',
      website: currentSponsor.website || '',
      facebook: currentSponsor.facebook || '',
      instagram: currentSponsor.instagram || '',
      youtube: currentSponsor.youtube || '',
      linkedin: currentSponsor.linkedin || '',
      twitter: currentSponsor.twitter || '',
      logo: currentSponsor.logo || '',
      heroImage: currentSponsor.heroImage || '',
      galleryImages: currentSponsor.galleryImages || [],
    });
  }, [isSponsorAuthenticated, currentSponsor, router]);

  if (!currentSponsor) return null;

  const tierFeatures = getTierFeatures(currentSponsor.tier);
  const maxGalleryImages = tierFeatures.features.maxGalleryImages;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSponsorProfile(currentSponsor.id, formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addGalleryImage = () => {
    if (newGalleryImage && formData.galleryImages.length < maxGalleryImages) {
      setFormData({
        ...formData,
        galleryImages: [...formData.galleryImages, newGalleryImage],
      });
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      galleryImages: formData.galleryImages.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/sponsor/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-sm text-gray-500">Update your business information</p>
            </div>
          </div>
          {saved && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Saved!</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo & Hero Image */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#8B1538]" />
              Branding
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="https://example.com/logo.png"
                />
                {formData.logo && (
                  <div className="mt-3 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden border">
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              {/* Hero Image (Platinum/Gold only) */}
              {canAccessFeature(currentSponsor.tier, 'customPage') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="https://example.com/hero.jpg"
                  />
                  {formData.heroImage && (
                    <div className="mt-3 w-full h-24 bg-gray-100 rounded-xl overflow-hidden border">
                      <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#8B1538]" />
              Business Information
            </h3>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline (English)</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="Your business tagline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline (Tamil)</label>
                  <input
                    type="text"
                    value={formData.taglineTamil}
                    onChange={(e) => setFormData({ ...formData, taglineTamil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="உங்கள் வணிக குறிப்புரை"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900"
                    placeholder="Tell us about your business..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Tamil)</label>
                  <textarea
                    value={formData.descriptionTamil}
                    onChange={(e) => setFormData({ ...formData, descriptionTamil: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900"
                    placeholder="உங்கள் வணிகத்தைப் பற்றி..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  >
                    <option value="">Select category</option>
                    <option value="Banking & Finance">Banking & Finance</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Technology">Technology</option>
                    <option value="Retail">Retail</option>
                    <option value="Food & Restaurant">Food & Restaurant</option>
                    <option value="Education">Education</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                  <input
                    type="text"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="e.g., 1990"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#8B1538]" />
              Contact Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          {canAccessFeature(currentSponsor.tier, 'socialIntegration') && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Facebook className="w-4 h-4 inline mr-1 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Instagram className="w-4 h-4 inline mr-1 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Linkedin className="w-4 h-4 inline mr-1 text-blue-700" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Twitter className="w-4 h-4 inline mr-1 text-sky-500" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gallery Images */}
          {maxGalleryImages > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#8B1538]" />
                  Gallery Images
                </h3>
                <span className="text-sm text-gray-500">
                  {formData.galleryImages.length} / {maxGalleryImages}
                </span>
              </div>

              {/* Add Image */}
              {formData.galleryImages.length < maxGalleryImages && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    value={newGalleryImage}
                    onChange={(e) => setNewGalleryImage(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    disabled={!newGalleryImage}
                    className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6B1028] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Gallery Grid */}
              {formData.galleryImages.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {formData.galleryImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No gallery images added yet</p>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-[#8B1538] text-white rounded-xl font-semibold hover:bg-[#6B1028] transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
