'use client';

import { useState, useMemo } from 'react';
import { useMember, Member, MemberStatus } from '@/contexts/MemberContext';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Users, Search, Filter, Download, Mail, Phone, Calendar, CheckCircle2,
  Clock, XCircle, AlertCircle, Eye, Edit, Trash2, Send, RefreshCw,
  UserPlus, DollarSign, TrendingUp, UserCheck
} from 'lucide-react';

export default function AdminMembersPage() {
  const { members, payments, getStats, updateMember, deleteMember, searchMembers } = useMember();
  const { membershipTiers, logActivity } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const stats = getStats();

  // Filter members
  const filteredMembers = useMemo(() => {
    let result = searchQuery ? searchMembers(searchQuery) : members;

    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(m => m.membershipType === typeFilter);
    }

    // Sort by date (newest first)
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [members, searchQuery, statusFilter, typeFilter, searchMembers]);

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-medium flex items-center w-fit">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-400 text-xs font-medium flex items-center w-fit">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'payment_pending':
        return (
          <span className="px-2 py-1 rounded-full bg-orange-900/30 text-orange-400 text-xs font-medium flex items-center w-fit">
            <DollarSign className="w-3 h-3 mr-1" /> Payment Pending
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-1 rounded-full bg-red-900/30 text-red-400 text-xs font-medium flex items-center w-fit">
            <XCircle className="w-3 h-3 mr-1" /> Expired
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 rounded-full bg-gray-700 text-gray-400 text-xs font-medium flex items-center w-fit">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getMemberPayments = (memberId: string) => {
    return payments.filter(p => p.memberId === memberId);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Membership Type', 'Status', 'Membership Number', 'Registration Date'];
    const rows = filteredMembers.map(m => [
      `${m.firstName} ${m.lastName}`,
      m.email,
      m.phone,
      m.membershipType,
      m.status,
      m.membershipNumber || '',
      new Date(m.registrationDate).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    logActivity('Export', `Exported ${filteredMembers.length} members to CSV`);
  };

  const handleDeleteMember = (member: Member) => {
    if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
      deleteMember(member.id);
      logActivity('Delete Member', `Deleted member: ${member.email}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members CRM</h1>
          <p className="text-gray-600">Manage member registrations and payments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              <p className="text-xs text-gray-500">Total Members</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
              <p className="text-xs text-gray-500">Payment Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringThisMonth}</p>
              <p className="text-xs text-gray-500">Expiring Soon</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.revenueThisYear}</p>
              <p className="text-xs text-gray-500">Revenue YTD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or membership number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as MemberStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="family">Family</option>
            <option value="student">Student</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No members found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        {member.membershipNumber && (
                          <p className="text-sm text-gray-500">{member.membershipNumber}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="w-3 h-3 mr-2" />
                          {member.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          {member.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {member.membershipType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(member.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowMemberModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Detail Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Member Details</h2>
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Member Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium text-gray-900">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Membership Number</label>
                  <p className="font-medium text-gray-900">
                    {selectedMember.membershipNumber || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{selectedMember.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium text-gray-900">{selectedMember.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="font-medium text-gray-900">
                    {selectedMember.address}, {selectedMember.city} {selectedMember.postalCode}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Membership Type</label>
                  <p className="font-medium text-gray-900 capitalize">{selectedMember.membershipType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  {getStatusBadge(selectedMember.status)}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Registration Date</label>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedMember.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                {selectedMember.membershipEndDate && (
                  <div>
                    <label className="text-sm text-gray-500">Expires</label>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedMember.membershipEndDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Family Members */}
              {selectedMember.familyMembers && selectedMember.familyMembers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Family Members</h4>
                  <div className="space-y-2">
                    {selectedMember.familyMembers.map((fm, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 flex justify-between">
                        <span>{fm.firstName} {fm.lastName}</span>
                        <span className="text-gray-500 capitalize">{fm.relationship}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment History */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                {getMemberPayments(selectedMember.id).length === 0 ? (
                  <p className="text-gray-500 text-sm">No payment records</p>
                ) : (
                  <div className="space-y-2">
                    {getMemberPayments(selectedMember.id).map(payment => (
                      <div key={payment.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">${payment.amount}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.paymentDate).toLocaleDateString()} via {payment.paymentMethod}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preferences */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
                <div className="flex gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedMember.receiveNewsletter ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    Newsletter: {selectedMember.receiveNewsletter ? 'Yes' : 'No'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedMember.receiveEventNotifications ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    Events: {selectedMember.receiveEventNotifications ? 'Yes' : 'No'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedMember.receiveSMS ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    SMS: {selectedMember.receiveSMS ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowMemberModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedMember.email}`}
                className="px-4 py-2 bg-[#8B1538] text-white rounded-lg hover:bg-[#6b1028] flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
