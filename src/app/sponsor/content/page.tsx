'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSponsor, SponsorContent, TIER_FEATURES } from '@/contexts/SponsorContext';
import {
  Plus, FileText, Clock, CheckCircle, XCircle, Eye, MousePointer,
  Trash2, Edit2, X, Save, Megaphone, Calendar, Image as ImageIcon,
  Video, AlertCircle, ArrowLeft
} from 'lucide-react';

const contentTypes = [
  { value: 'promotion', label: 'Promotion/Offer', icon: Megaphone },
  { value: 'announcement', label: 'Announcement', icon: FileText },
  { value: 'event', label: 'Event Sponsorship', icon: Calendar },
];

export default function SponsorContentPage() {
  const router = useRouter();
  const {
    isSponsorAuthenticated,
    currentSponsor,
    getSponsorContents,
    addSponsorContent,
    deleteSponsorContent,
    getTierFeatures,
    canAccessFeature
  } = useSponsor();

  const [contents, setContents] = useState<SponsorContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [formData, setFormData] = useState({
    type: 'promotion' as 'promotion' | 'announcement' | 'event' | 'article' | 'video',
    title: '',
    titleTamil: '',
    content: '',
    contentTamil: '',
    image: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (!isSponsorAuthenticated || !currentSponsor) {
      router.push('/sponsor');
      return;
    }
    setContents(getSponsorContents(currentSponsor.id));
  }, [isSponsorAuthenticated, currentSponsor, router, getSponsorContents]);

  if (!currentSponsor) return null;

  const tierFeatures = getTierFeatures(currentSponsor.tier);
  const maxPromotions = tierFeatures.features.maxPromotions;
  const canAddMore = maxPromotions === -1 || contents.length < maxPromotions;

  const filteredContents = contents.filter(c =>
    filterStatus === 'all' ? true : c.status === filterStatus
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSponsorContent({
      sponsorId: currentSponsor.id,
      ...formData,
      isActive: true,
    });
    setIsModalOpen(false);
    setFormData({
      type: 'promotion',
      title: '',
      titleTamil: '',
      content: '',
      contentTamil: '',
      image: '',
      startDate: '',
      endDate: '',
    });
    // Refresh contents
    setContents(getSponsorContents(currentSponsor.id));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteSponsorContent(id);
      setContents(getSponsorContents(currentSponsor.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/sponsor/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Content</h1>
              <p className="text-sm text-gray-500">Manage your promotions and announcements</p>
            </div>
          </div>
          {canAddMore && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-lg font-medium hover:bg-[#6B1028] transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Content
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Usage Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Content limit: {maxPromotions === -1 ? 'Unlimited' : `${contents.length} / ${maxPromotions}`}
              </p>
            </div>
            {!canAddMore && (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Limit reached. Upgrade tier for more.</span>
              </div>
            )}
          </div>
          {maxPromotions !== -1 && (
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B1538] rounded-full transition-all"
                style={{ width: `${(contents.length / maxPromotions) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterStatus === status
                  ? 'bg-[#8B1538] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs">
                ({status === 'all' ? contents.length : contents.filter(c => c.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Content List */}
        {filteredContents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Content Yet</h3>
            <p className="text-gray-600 mb-6">
              Create promotions, announcements, or event sponsorships to engage with the community.
            </p>
            {canAddMore && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-[#8B1538] text-white rounded-lg font-medium hover:bg-[#6B1028] transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Content
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContents.map((content) => (
              <div key={content.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(content.status)}
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                        {content.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{content.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{content.titleTamil}</p>
                    <p className="text-gray-600 line-clamp-2">{content.content}</p>

                    {content.status === 'rejected' && content.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>Rejection reason:</strong> {content.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {content.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointer className="w-4 h-4" />
                        {content.clicks} clicks
                      </span>
                      {content.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(content.startDate).toLocaleDateString()}
                          {content.endDate && ` - ${new Date(content.endDate).toLocaleDateString()}`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 ml-4">
                    {content.image && (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={content.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Content Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Create New Content</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {contentTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as typeof formData.type })}
                      className={`p-4 rounded-xl border-2 transition-all ${formData.type === type.value
                          ? 'border-[#8B1538] bg-[#8B1538]/5'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <type.icon className={`w-6 h-6 mx-auto mb-2 ${formData.type === type.value ? 'text-[#8B1538]' : 'text-gray-400'
                        }`} />
                      <p className={`text-sm font-medium ${formData.type === type.value ? 'text-[#8B1538]' : 'text-gray-600'
                        }`}>
                        {type.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (Tamil) *</label>
                  <input
                    type="text"
                    value={formData.titleTamil}
                    onChange={(e) => setFormData({ ...formData, titleTamil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content (English) *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content (Tamil) *</label>
                  <textarea
                    value={formData.contentTamil}
                    onChange={(e) => setFormData({ ...formData, contentTamil: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none resize-none bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All content submissions require admin approval before being displayed on the website.
                  You will be notified once your content is reviewed.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6B1028] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
