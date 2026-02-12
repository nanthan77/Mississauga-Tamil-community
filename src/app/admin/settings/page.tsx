'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Save, Upload, Globe, Mail, Phone, MapPin, Facebook, Instagram,
  Youtube, MessageCircle, AlertCircle, CheckCircle, Download
} from 'lucide-react';

export default function SettingsPage() {
  const { siteSettings, updateSiteSettings, canEdit, logActivity } = useAdmin();
  const [formData, setFormData] = useState(siteSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(siteSettings);
  }, [siteSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit()) return;
    updateSiteSettings(formData);
    logActivity('Update Settings', 'Updated site settings');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const exportSettings = () => {
    const data = JSON.stringify(formData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
          <p className="text-gray-600">Configure your website name, logo, and contact information</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          {saved && (
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Settings saved!
            </div>
          )}
        </div>
      </div>

      {/* Permission Notice */}
      {!canEdit() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">View Only Mode</p>
            <p className="text-sm text-yellow-700">You don&apos;t have permission to edit site settings. Contact an admin for access.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Identity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-[#8B1538]" />
            Site Identity
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name (English)</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name (Tamil)</label>
              <input
                type="text"
                value={formData.siteNameTamil}
                onChange={(e) => setFormData({ ...formData, siteNameTamil: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline (English)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline (Tamil)</label>
              <input
                type="text"
                value={formData.taglineTamil}
                onChange={(e) => setFormData({ ...formData, taglineTamil: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Home Page Sponsor Showcase */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">✨</span>
              Home Page Sponsor Showcase
            </h3>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showHomepageSponsors ?? true}
                  onChange={(e) => setFormData({ ...formData, showHomepageSponsors: e.target.checked })}
                  disabled={!canEdit()}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Show on Home Page</span>
              </label>
            </div>
          </div>

          <div className={`space-y-4 transition-all duration-300 ${!formData.showHomepageSponsors ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (English)</label>
                <input
                  type="text"
                  value={formData.homepageSponsorTitle || ''}
                  onChange={(e) => setFormData({ ...formData, homepageSponsorTitle: e.target.value })}
                  disabled={!canEdit()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="e.g. A Heartfelt Thank You to Our Sponsors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title (Tamil)</label>
                <input
                  type="text"
                  value={formData.homepageSponsorTitleTamil || ''}
                  onChange={(e) => setFormData({ ...formData, homepageSponsorTitleTamil: e.target.value })}
                  disabled={!canEdit()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="e.g. எங்கள் அனுசரணையாளர்களுக்கு மனமார்ந்த நன்றி"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Message (English)</label>
                <textarea
                  value={formData.homepageSponsorSubtitle || ''}
                  onChange={(e) => setFormData({ ...formData, homepageSponsorSubtitle: e.target.value })}
                  disabled={!canEdit()}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 resize-y"
                  placeholder="Enter your gratitude message here..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Message (Tamil)</label>
                <textarea
                  value={formData.homepageSponsorSubtitleTamil || ''}
                  onChange={(e) => setFormData({ ...formData, homepageSponsorSubtitleTamil: e.target.value })}
                  disabled={!canEdit()}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 resize-y"
                  placeholder="உங்கள் நன்றி செய்தியை இங்கே உள்ளிடவும்..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-[#8B1538]" />
            Logo
          </h3>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Upload className="w-8 h-8 mx-auto mb-1" />
                    <p className="text-xs">No logo</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-2">
                Recommended: PNG or SVG format, square or landscape orientation. Upload your logo to a service like Imgur, Cloudinary, or your hosting provider and paste the URL here.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-[#8B1538]" />
            Contact Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Address (English)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Address (Tamil)
              </label>
              <input
                type="text"
                value={formData.addressTamil}
                onChange={(e) => setFormData({ ...formData, addressTamil: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Facebook className="w-4 h-4 inline mr-1 text-blue-600" />
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Instagram className="w-4 h-4 inline mr-1 text-pink-600" />
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Youtube className="w-4 h-4 inline mr-1 text-red-600" />
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MessageCircle className="w-4 h-4 inline mr-1 text-green-600" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                disabled={!canEdit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            <Globe className="w-5 h-5 inline mr-1" />
            Settings Information
          </h3>
          <p className="text-sm text-blue-800">
            These settings control the core identity and contact information displayed across your website.
            Changes here will affect the header, footer, contact page, and meta information.
            Make sure all URLs are complete (starting with https://).
          </p>
        </div>

        {/* Save Button */}
        {canEdit() && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B1028] transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
