'use client';

import { useState, useMemo } from 'react';
import { useSponsor, SponsorContent, TIER_FEATURES } from '@/contexts/SponsorContext';
import { useAdmin } from '@/contexts/AdminContext';
import {
  CheckCircle, XCircle, Clock, Eye, Search, Filter, AlertCircle,
  Building2, Calendar, Megaphone, FileText, Crown, Award, Medal,
  ExternalLink, X
} from 'lucide-react';

export default function SponsorApprovalsPage() {
  const { currentUser, canEdit } = useAdmin();
  const {
    sponsorContents,
    sponsors,
    approveContent,
    rejectContent,
    getSponsorById
  } = useSponsor();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState<SponsorContent | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Stats
  const stats = useMemo(() => ({
    pending: sponsorContents.filter(c => c.status === 'pending').length,
    approved: sponsorContents.filter(c => c.status === 'approved').length,
    rejected: sponsorContents.filter(c => c.status === 'rejected').length,
    total: sponsorContents.length,
  }), [sponsorContents]);

  // Filtered content
  const filteredContent = useMemo(() => {
    return sponsorContents.filter(content => {
      const sponsor = getSponsorById(content.sponsorId);
      const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
      const matchesSearch = searchTerm === '' ||
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor?.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [sponsorContents, filterStatus, searchTerm, getSponsorById]);

  const handleApprove = (contentId: string) => {
    if (!currentUser) return;
    approveContent(contentId, currentUser.name);
  };

  const handleReject = () => {
    if (!selectedContent || !currentUser || !rejectionReason.trim()) return;
    rejectContent(selectedContent.id, rejectionReason, currentUser.name);
    setShowRejectModal(false);
    setSelectedContent(null);
    setRejectionReason('');
  };

  const openRejectModal = (content: SponsorContent) => {
    setSelectedContent(content);
    setShowRejectModal(true);
  };

  const tierIcons = {
    platinum: <Crown className="w-4 h-4" />,
    gold: <Award className="w-4 h-4" />,
    silver: <Medal className="w-4 h-4" />,
    bronze: <Crown className="w-4 h-4" />,
  };

  const contentTypeIcons = {
    promotion: <Megaphone className="w-4 h-4" />,
    announcement: <FileText className="w-4 h-4" />,
    event: <Calendar className="w-4 h-4" />,
    article: <FileText className="w-4 h-4" />,
    video: <FileText className="w-4 h-4" />,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sponsor Content Approvals</h2>
        <p className="text-gray-600">Review and approve sponsor-submitted content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              <p className="text-sm text-gray-500">Rejected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or sponsor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none bg-white text-gray-900"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterStatus === status
                    ? 'bg-[#8B1538] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content List */}
      {filteredContent.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filterStatus === 'pending' ? 'No Pending Content' : 'No Content Found'}
          </h3>
          <p className="text-gray-600">
            {filterStatus === 'pending'
              ? 'All sponsor content has been reviewed.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContent.map((content) => {
            const sponsor = getSponsorById(content.sponsorId);
            if (!sponsor) return null;

            const tierConfig = TIER_FEATURES[sponsor.tier];

            return (
              <div key={content.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  {/* Sponsor Logo */}
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {sponsor.logo ? (
                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {getStatusBadge(content.status)}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tierConfig.bgColor}`}>
                        {tierIcons[sponsor.tier]}
                        {tierConfig.name}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize">
                        {contentTypeIcons[content.type]}
                        {content.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{content.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      by <span className="font-medium">{sponsor.name}</span>
                    </p>
                    <p className="text-gray-600 line-clamp-2 mb-3">{content.content}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Submitted {new Date(content.submittedAt).toLocaleDateString()}
                      </span>
                      {content.startDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(content.startDate).toLocaleDateString()}
                          {content.endDate && ` - ${new Date(content.endDate).toLocaleDateString()}`}
                        </span>
                      )}
                    </div>

                    {content.status === 'rejected' && content.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>Rejection reason:</strong> {content.rejectionReason}
                        </p>
                        {content.reviewedBy && (
                          <p className="text-xs text-red-500 mt-1">
                            Reviewed by {content.reviewedBy} on {new Date(content.reviewedAt || '').toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {content.status === 'approved' && content.reviewedBy && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          Approved by {content.reviewedBy} on {new Date(content.reviewedAt || '').toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Image Preview */}
                  {content.image && (
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={content.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                {content.status === 'pending' && canEdit() && (
                  <div className="mt-4 pt-4 border-t flex justify-end gap-3">
                    <button
                      onClick={() => openRejectModal(content)}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(content.id)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Reject Content</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedContent(null);
                  setRejectionReason('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting <strong>{selectedContent.title}</strong>.
                This will be visible to the sponsor.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none bg-white text-gray-900"
                  placeholder="Explain why this content is being rejected..."
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedContent(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
