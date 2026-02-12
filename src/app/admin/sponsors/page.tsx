'use client';

import { useState, useRef } from 'react';
import { useAdmin, Sponsor } from '@/contexts/AdminContext';
import { Plus, Edit2, Trash2, ExternalLink, X, Save, Search, Filter, Download, Eye, EyeOff, Copy, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';

export default function SponsorsPage() {
  const { sponsors, addSponsor, updateSponsor, deleteSponsor, canEdit, canDelete } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Omit<Sponsor, 'id'>>({
    name: '',
    nameTamil: '',
    logo: '',
    website: '',
    tier: 'silver',
    isActive: true,
  });

  const tiers = [
    { value: 'platinum', label: 'Platinum', color: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800' },
    { value: 'gold', label: 'Gold', color: 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900' },
    { value: 'silver', label: 'Silver', color: 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700' },
  ];

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result as string });
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Filter and search sponsors
  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.nameTamil.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || sponsor.tier === filterTier;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && sponsor.isActive) ||
      (filterStatus === 'inactive' && !sponsor.isActive);
    return matchesSearch && matchesTier && matchesStatus;
  });

  const sortedSponsors = [...filteredSponsors].sort((a, b) => {
    const tierOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
    return tierOrder[a.tier] - tierOrder[b.tier];
  });

  const openAddModal = () => {
    if (!canEdit()) return;
    setEditingSponsor(null);
    setFormData({
      name: '',
      nameTamil: '',
      logo: '',
      website: '',
      tier: 'silver',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sponsor: Sponsor) => {
    if (!canEdit()) return;
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      nameTamil: sponsor.nameTamil,
      logo: sponsor.logo,
      website: sponsor.website,
      tier: sponsor.tier,
      isActive: sponsor.isActive,
    });
    setIsModalOpen(true);
  };

  const duplicateSponsor = (sponsor: Sponsor) => {
    if (!canEdit()) return;
    setEditingSponsor(null);
    setFormData({
      name: sponsor.name + ' (Copy)',
      nameTamil: sponsor.nameTamil,
      logo: sponsor.logo,
      website: sponsor.website,
      tier: sponsor.tier,
      isActive: false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSponsor) {
      updateSponsor(editingSponsor.id, formData);
    } else {
      addSponsor(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!canDelete()) return;
    if (confirm('Are you sure you want to delete this sponsor?')) {
      deleteSponsor(id);
    }
  };

  const toggleActive = (sponsor: Sponsor) => {
    if (!canEdit()) return;
    updateSponsor(sponsor.id, { isActive: !sponsor.isActive });
  };

  const exportSponsors = () => {
    const data = sponsors.map(s => ({
      name: s.name,
      nameTamil: s.nameTamil,
      tier: s.tier,
      website: s.website,
      isActive: s.isActive,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sponsors-export.json';
    a.click();
  };

  // Stats
  const stats = {
    total: sponsors.length,
    active: sponsors.filter(s => s.isActive).length,
    platinum: sponsors.filter(s => s.tier === 'platinum').length,
    gold: sponsors.filter(s => s.tier === 'gold').length,
    silver: sponsors.filter(s => s.tier === 'silver').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sponsors Management</h2>
          <p className="text-gray-600">Add, edit, or remove sponsors from your website</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportSponsors}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          {canEdit() && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg font-semibold hover:bg-[#6B1028] transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Sponsor
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-600">{stats.platinum}</p>
          <p className="text-sm text-gray-500">Platinum</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{stats.gold}</p>
          <p className="text-sm text-gray-500">Gold</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-400">{stats.silver}</p>
          <p className="text-sm text-gray-500">Silver</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sponsors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
          >
            <option value="all">All Tiers</option>
            {tiers.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Permission Notice */}
      {!canEdit() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">View Only Mode</p>
            <p className="text-sm text-amber-700">You don&apos;t have permission to edit sponsors. Contact an admin for access.</p>
          </div>
        </div>
      )}

      {/* Sponsors Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedSponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all hover:shadow-md ${
              sponsor.isActive ? 'border-transparent' : 'border-red-200 opacity-60'
            }`}
          >
            {/* Tier Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                tiers.find(t => t.value === sponsor.tier)?.color
              }`}>
                {sponsor.tier}
              </span>
              <button
                onClick={() => toggleActive(sponsor)}
                disabled={!canEdit()}
                className={`p-1.5 rounded-lg transition-colors ${
                  sponsor.isActive
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                } ${!canEdit() ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={sponsor.isActive ? 'Click to deactivate' : 'Click to activate'}
              >
                {sponsor.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Logo */}
            <div className="aspect-[3/2] bg-gray-50 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
              {sponsor.logo ? (
                <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="font-bold text-xl">{sponsor.name.charAt(0)}</span>
                  </div>
                  <p className="text-xs">No logo</p>
                </div>
              )}
            </div>

            {/* Info */}
            <h3 className="font-semibold text-gray-900 truncate">{sponsor.name}</h3>
            <p className="text-sm text-gray-500 truncate mb-3">{sponsor.nameTamil}</p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {canEdit() && (
                <>
                  <button
                    onClick={() => openEditModal(sponsor)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => duplicateSponsor(sponsor)}
                    className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </>
              )}
              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Visit website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {canDelete() && (
                <button
                  onClick={() => handleDelete(sponsor.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add New Card */}
        {canEdit() && (
          <button
            onClick={openAddModal}
            className="min-h-[280px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#8B1538] hover:text-[#8B1538] transition-colors"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-medium">Add Sponsor</span>
          </button>
        )}
      </div>

      {/* No Results */}
      {sortedSponsors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No sponsors found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sponsor Name (English) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  required
                />
              </div>

              {/* Tamil Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sponsor Name (Tamil) *
                </label>
                <input
                  type="text"
                  value={formData.nameTamil}
                  onChange={(e) => setFormData({ ...formData, nameTamil: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  required
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="https://example.com"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sponsor Logo
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {formData.logo ? (
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-center mb-3">
                      <img
                        src={formData.logo}
                        alt="Logo preview"
                        className="max-h-32 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: '' })}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-[#8B1538] hover:bg-gray-50 transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-8 h-8 border-2 border-[#8B1538] border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-sm text-gray-500">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">Click to upload logo</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 2MB</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sponsorship Tier *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {tiers.map((tier) => (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, tier: tier.value as Sponsor['tier'] })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.tier === tier.value
                          ? tier.color + ' ring-2 ring-offset-2 ring-gray-400'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#8B1538] border-gray-300 rounded focus:ring-[#8B1538]"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active (visible on website)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-[#8B1538] text-white rounded-lg hover:bg-[#6B1028] transition-colors font-medium"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingSponsor ? 'Update' : 'Add'} Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
