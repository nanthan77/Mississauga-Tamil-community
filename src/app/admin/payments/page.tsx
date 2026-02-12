'use client';

import { useState, useMemo } from 'react';
import { useMember, PaymentRecord, PaymentStatus, Member } from '@/contexts/MemberContext';
import { useAdmin } from '@/contexts/AdminContext';
import {
  DollarSign, Search, CheckCircle2, Clock, XCircle,
  CreditCard, Eye, Check, X, UserPlus, Hash
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { payments, members, verifyPayment, rejectPayment, getMember, addPayment, updateMember, generateMembershipNumber } = useMember();
  const { currentUser, logActivity, membershipTiers } = useAdmin();

  const [activeTab, setActiveTab] = useState<'pending-members' | 'payments'>('pending-members');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    etransferEmail: '',
    etransferReference: '',
    amount: 0,
  });

  // Get pending members (registered but awaiting payment)
  const pendingMembers = useMemo(() => {
    return members.filter(m => m.status === 'pending').sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [members]);

  // Filter pending members by search
  const filteredPendingMembers = useMemo(() => {
    if (!searchQuery) return pendingMembers;
    const query = searchQuery.toLowerCase();
    return pendingMembers.filter(m =>
      m.firstName.toLowerCase().includes(query) ||
      m.lastName.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.registrationReference.toLowerCase().includes(query)
    );
  }, [pendingMembers, searchQuery]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => {
        const member = getMember(p.memberId);
        return (
          member?.firstName.toLowerCase().includes(query) ||
          member?.lastName.toLowerCase().includes(query) ||
          member?.email.toLowerCase().includes(query) ||
          member?.registrationReference.toLowerCase().includes(query) ||
          p.etransferEmail?.toLowerCase().includes(query) ||
          p.etransferReference?.toLowerCase().includes(query)
        );
      });
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [payments, statusFilter, searchQuery, getMember]);

  const pendingCount = pendingMembers.length;
  const verifiedPaymentsCount = payments.filter(p => p.status === 'verified').length;
  const totalCollected = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center w-fit">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium flex items-center w-fit">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium flex items-center w-fit">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getMembershipPrice = (membershipType: string) => {
    const tier = membershipTiers.find(t =>
      t.name.toLowerCase().includes(membershipType) ||
      membershipType.includes(t.name.toLowerCase())
    );
    return tier?.price || 25;
  };

  const handleRecordPayment = () => {
    if (!selectedMember) return;

    const now = new Date();
    const yearEnd = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const amount = paymentForm.amount || getMembershipPrice(selectedMember.membershipType);

    // Create payment record
    addPayment({
      memberId: selectedMember.id,
      amount,
      paymentMethod: 'etransfer',
      paymentDate: now.toISOString(),
      etransferEmail: paymentForm.etransferEmail,
      etransferReference: paymentForm.etransferReference,
      status: 'verified',
      verifiedBy: currentUser?.name,
      verifiedAt: now.toISOString(),
      periodStart: now.toISOString(),
      periodEnd: yearEnd.toISOString(),
    });

    // Activate member
    const membershipNumber = generateMembershipNumber();
    updateMember(selectedMember.id, {
      status: 'active',
      membershipNumber,
      membershipStartDate: now.toISOString(),
      membershipEndDate: yearEnd.toISOString(),
    });

    logActivity('Record Payment', `Recorded payment of $${amount} for ${selectedMember.firstName} ${selectedMember.lastName} (${selectedMember.registrationReference})`);

    // Reset form
    setShowRecordPaymentModal(false);
    setSelectedMember(null);
    setPaymentForm({ etransferEmail: '', etransferReference: '', amount: 0 });
  };

  const handleVerifyPayment = (payment: PaymentRecord) => {
    verifyPayment(payment.id, currentUser?.name || 'Admin');
    logActivity('Verify Payment', `Verified payment of $${payment.amount} for member`);
    setShowPaymentDetailModal(false);
    setSelectedPayment(null);
  };

  const handleRejectPayment = (payment: PaymentRecord) => {
    if (!rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    rejectPayment(payment.id, rejectionReason);
    logActivity('Reject Payment', `Rejected payment - Reason: ${rejectionReason}`);
    setShowPaymentDetailModal(false);
    setSelectedPayment(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600">Record payments and verify member registrations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-700">{pendingCount}</p>
              <p className="text-sm text-yellow-600">Awaiting Payment</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-700">{verifiedPaymentsCount}</p>
              <p className="text-sm text-green-600">Completed Payments</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700">${totalCollected}</p>
              <p className="text-sm text-blue-600">Total Collected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending-members')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending-members'
                ? 'border-[#8B1538] text-[#8B1538]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Members ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-[#8B1538] text-[#8B1538]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment History
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or reference number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            />
          </div>
          {activeTab === 'payments' && (
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as PaymentStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>

      {/* Pending Members Tab */}
      {activeTab === 'pending-members' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membership Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Due
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
                {filteredPendingMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No pending members</p>
                      <p className="text-sm">All registered members have completed payment</p>
                    </td>
                  </tr>
                ) : (
                  filteredPendingMembers.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#8B1538]/10 text-[#8B1538] font-mono font-bold text-sm">
                          <Hash className="w-4 h-4 mr-1" />
                          {member.registrationReference}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <p className="text-sm text-gray-500">{member.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-sm bg-gray-100 px-2 py-1 rounded">
                          {member.membershipType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-green-600">
                          ${getMembershipPrice(member.membershipType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(member.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setPaymentForm({
                              etransferEmail: '',
                              etransferReference: '',
                              amount: getMembershipPrice(member.membershipType),
                            });
                            setShowRecordPaymentModal(true);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
                        >
                          <Check className="w-4 h-4" />
                          Record Payment
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    e-Transfer Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No payments found</p>
                      <p className="text-sm">Payments will appear here when recorded</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map(payment => {
                    const member = getMember(payment.memberId);
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {member?.firstName} {member?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{member?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-gray-600">
                            {member?.registrationReference}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-gray-900">${payment.amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          {payment.paymentMethod === 'etransfer' && payment.etransferEmail ? (
                            <div className="text-sm">
                              <p className="text-gray-900">{payment.etransferEmail}</p>
                              {payment.etransferReference && (
                                <p className="text-gray-500">Ref: {payment.etransferReference}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(payment.status)}
                          {payment.status === 'verified' && payment.verifiedBy && (
                            <p className="text-xs text-gray-500 mt-1">by {payment.verifiedBy}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowPaymentDetailModal(true);
                            }}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showRecordPaymentModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                <button
                  onClick={() => {
                    setShowRecordPaymentModal(false);
                    setSelectedMember(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Member Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{selectedMember.email}</p>
                    <p className="text-sm text-gray-500 capitalize mt-1">
                      {selectedMember.membershipType} Membership
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#8B1538]/10 text-[#8B1538] font-mono font-bold">
                      {selectedMember.registrationReference}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Received *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={paymentForm.amount}
                      onChange={e => setPaymentForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    e-Transfer Sender Email
                  </label>
                  <input
                    type="email"
                    value={paymentForm.etransferEmail}
                    onChange={e => setPaymentForm(prev => ({ ...prev, etransferEmail: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    placeholder="sender@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    e-Transfer Reference/Confirmation Number
                  </label>
                  <input
                    type="text"
                    value={paymentForm.etransferReference}
                    onChange={e => setPaymentForm(prev => ({ ...prev, etransferReference: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    placeholder="Bank reference number"
                  />
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-green-700">
                  <strong>Note:</strong> Recording this payment will immediately activate the membership and generate a membership number.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRecordPaymentModal(false);
                  setSelectedMember(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm & Activate Membership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Detail Modal */}
      {showPaymentDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => {
                    setShowPaymentDetailModal(false);
                    setSelectedPayment(null);
                    setRejectionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {(() => {
                const member = getMember(selectedPayment.memberId);
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Member</label>
                        <p className="font-medium text-gray-900">
                          {member?.firstName} {member?.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Reference #</label>
                        <p className="font-mono text-gray-900">{member?.registrationReference}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Amount</label>
                        <p className="text-2xl font-bold text-green-600">${selectedPayment.amount}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Payment Date</label>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedPayment.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {selectedPayment.paymentMethod === 'etransfer' && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          e-Transfer Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          {selectedPayment.etransferEmail && (
                            <p>
                              <span className="text-blue-600">Sender Email:</span>{' '}
                              <span className="font-medium text-blue-900">{selectedPayment.etransferEmail}</span>
                            </p>
                          )}
                          {selectedPayment.etransferReference && (
                            <p>
                              <span className="text-blue-600">Reference:</span>{' '}
                              <span className="font-medium text-blue-900">{selectedPayment.etransferReference}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm text-gray-500">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                    </div>

                    {selectedPayment.status === 'rejected' && selectedPayment.rejectionReason && (
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <p className="text-sm text-red-600">
                          <strong>Rejection Reason:</strong> {selectedPayment.rejectionReason}
                        </p>
                      </div>
                    )}

                    {selectedPayment.status === 'pending' && (
                      <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={e => setRejectionReason(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                          rows={2}
                          placeholder="Enter reason if rejecting payment..."
                        />
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPaymentDetailModal(false);
                  setSelectedPayment(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedPayment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleRejectPayment(selectedPayment)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerifyPayment(selectedPayment)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Verify Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
