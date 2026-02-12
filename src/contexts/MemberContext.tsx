'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Member status types
export type MemberStatus = 'pending' | 'payment_pending' | 'active' | 'expired' | 'cancelled';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type PaymentMethod = 'etransfer' | 'cash' | 'cheque' | 'other';

// Member interface
export interface Member {
  id: string;

  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;

  // Tamil Language Support
  firstNameTamil?: string;
  lastNameTamil?: string;

  // Membership Details
  membershipType: 'individual' | 'family' | 'student' | 'senior';
  membershipNumber?: string;
  registrationReference: string; // Generated at registration for payment tracking
  status: MemberStatus;

  // Family Members (for family membership)
  familyMembers?: FamilyMember[];

  // Dates
  registrationDate: string;
  membershipStartDate?: string;
  membershipEndDate?: string;

  // Preferences
  preferredLanguage: 'en' | 'ta';
  receiveNewsletter: boolean;
  receiveEventNotifications: boolean;
  receiveSMS: boolean;

  // Additional Info
  howDidYouHear?: string;
  interests?: string[];
  volunteerInterests?: string[];
  notes?: string;

  // System
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: 'spouse' | 'child' | 'parent' | 'other';
  dateOfBirth?: string;
  email?: string;
  phone?: string;
}

// Payment Record
export interface PaymentRecord {
  id: string;
  memberId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;

  // e-Transfer specific
  etransferEmail?: string;
  etransferReference?: string;
  etransferConfirmationNumber?: string;

  // Verification
  status: PaymentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;

  // Period covered
  periodStart: string;
  periodEnd: string;

  notes?: string;
  createdAt: string;
}

// Event Notification
export interface EventNotification {
  id: string;
  eventId: string;
  eventTitle: string;
  sentAt: string;
  sentTo: 'all' | 'active' | 'specific';
  recipientCount: number;
  recipientIds?: string[];
  message: string;
  messageTamil?: string;
  sentBy: string;
}

// Member Registration Form Data
export interface MemberRegistrationData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;

  // Membership
  membershipType: 'individual' | 'family' | 'student' | 'senior';

  // Family Members
  familyMembers?: Omit<FamilyMember, 'id'>[];

  // Preferences
  preferredLanguage: 'en' | 'ta';
  receiveNewsletter: boolean;
  receiveEventNotifications: boolean;
  receiveSMS: boolean;

  // Additional
  howDidYouHear?: string;
  interests?: string[];
  volunteerInterests?: string[];

  // Payment Intent
  paymentMethod: PaymentMethod;
}

// CRM Stats
export interface CRMStats {
  totalMembers: number;
  activeMembers: number;
  pendingApprovals: number;
  pendingPayments: number;
  expiringThisMonth: number;
  newThisMonth: number;
  revenueThisYear: number;
}

interface MemberContextType {
  // Members
  members: Member[];
  addMember: (data: MemberRegistrationData) => Member;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  getMember: (id: string) => Member | undefined;
  getMemberByEmail: (email: string) => Member | undefined;
  approveMember: (id: string, membershipNumber: string) => void;

  // Payments
  payments: PaymentRecord[];
  addPayment: (data: Omit<PaymentRecord, 'id' | 'createdAt'>) => void;
  verifyPayment: (id: string, verifiedBy: string) => void;
  rejectPayment: (id: string, reason: string) => void;
  getMemberPayments: (memberId: string) => PaymentRecord[];

  // Notifications
  notifications: EventNotification[];
  sendEventNotification: (
    eventId: string,
    eventTitle: string,
    message: string,
    messageTamil: string,
    sendTo: 'all' | 'active' | 'specific',
    sentBy: string,
    specificIds?: string[]
  ) => void;

  // Stats
  getStats: () => CRMStats;

  // Utilities
  generateMembershipNumber: () => string;
  generateRegistrationReference: () => string;
  getUpcomingRenewals: (days: number) => Member[];
  searchMembers: (query: string) => Member[];
  filterMembers: (filters: MemberFilters) => Member[];
  getMemberByReference: (reference: string) => Member | undefined;
}

export interface MemberFilters {
  status?: MemberStatus;
  membershipType?: string;
  expiringWithinDays?: number;
  hasEmail?: boolean;
  receivesNewsletter?: boolean;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [notifications, setNotifications] = useState<EventNotification[]>([]);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem('mta-members');
      if (savedMembers) setMembers(JSON.parse(savedMembers));

      const savedPayments = localStorage.getItem('mta-payments');
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedNotifications = localStorage.getItem('mta-notifications');
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    } catch (error) {
      console.error('Error loading member data:', error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mta-members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('mta-payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('mta-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Generate membership number (MTA-2024-0001 format)
  const generateMembershipNumber = (): string => {
    const year = new Date().getFullYear();
    const count = members.filter(m => m.membershipNumber?.startsWith(`MTA-${year}`)).length + 1;
    return `MTA-${year}-${String(count).padStart(4, '0')}`;
  };

  // Generate registration reference number (REG-XXXXXX format) for payment tracking
  const generateRegistrationReference = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = 'REG-';
    for (let i = 0; i < 6; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure uniqueness
    while (members.some(m => m.registrationReference === reference)) {
      reference = 'REG-';
      for (let i = 0; i < 6; i++) {
        reference += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return reference;
  };

  const getMemberByReference = (reference: string) =>
    members.find(m => m.registrationReference === reference);

  // Add new member (from registration)
  const addMember = (data: MemberRegistrationData): Member => {
    const now = new Date().toISOString();
    const familyMembers = data.familyMembers?.map(fm => ({
      ...fm,
      id: generateId()
    }));

    const newMember: Member = {
      id: generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      membershipType: data.membershipType,
      registrationReference: generateRegistrationReference(), // For payment tracking
      status: 'pending', // Pending until payment verified
      familyMembers,
      registrationDate: now,
      preferredLanguage: data.preferredLanguage,
      receiveNewsletter: data.receiveNewsletter,
      receiveEventNotifications: data.receiveEventNotifications,
      receiveSMS: data.receiveSMS,
      howDidYouHear: data.howDidYouHear,
      interests: data.interests,
      volunteerInterests: data.volunteerInterests,
      createdAt: now,
      updatedAt: now,
    };

    setMembers(prev => [...prev, newMember]);
    return newMember;
  };

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers(prev => prev.map(m =>
      m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
    ));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const getMember = (id: string) => members.find(m => m.id === id);

  const getMemberByEmail = (email: string) =>
    members.find(m => m.email.toLowerCase() === email.toLowerCase());

  const approveMember = (id: string, membershipNumber: string) => {
    const now = new Date();
    const endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    updateMember(id, {
      status: 'active',
      membershipNumber,
      membershipStartDate: now.toISOString(),
      membershipEndDate: endDate.toISOString(),
    });
  };

  // Payment functions
  const addPayment = (data: Omit<PaymentRecord, 'id' | 'createdAt'>) => {
    const newPayment: PaymentRecord = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setPayments(prev => [...prev, newPayment]);

    // Update member status to payment_pending
    updateMember(data.memberId, { status: 'payment_pending' });
  };

  const verifyPayment = (id: string, verifiedBy: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    setPayments(prev => prev.map(p =>
      p.id === id
        ? { ...p, status: 'verified' as PaymentStatus, verifiedBy, verifiedAt: new Date().toISOString() }
        : p
    ));

    // Activate member
    const member = members.find(m => m.id === payment.memberId);
    if (member) {
      approveMember(payment.memberId, member.membershipNumber || generateMembershipNumber());
    }
  };

  const rejectPayment = (id: string, reason: string) => {
    setPayments(prev => prev.map(p =>
      p.id === id
        ? { ...p, status: 'rejected' as PaymentStatus, rejectionReason: reason }
        : p
    ));
  };

  const getMemberPayments = (memberId: string) =>
    payments.filter(p => p.memberId === memberId);

  // Notification functions
  const sendEventNotification = (
    eventId: string,
    eventTitle: string,
    message: string,
    messageTamil: string,
    sendTo: 'all' | 'active' | 'specific',
    sentBy: string,
    specificIds?: string[]
  ) => {
    let recipientIds: string[] = [];

    if (sendTo === 'all') {
      recipientIds = members.filter(m => m.receiveEventNotifications).map(m => m.id);
    } else if (sendTo === 'active') {
      recipientIds = members.filter(m => m.status === 'active' && m.receiveEventNotifications).map(m => m.id);
    } else if (specificIds) {
      recipientIds = specificIds;
    }

    const notification: EventNotification = {
      id: generateId(),
      eventId,
      eventTitle,
      sentAt: new Date().toISOString(),
      sentTo: sendTo,
      recipientCount: recipientIds.length,
      recipientIds,
      message,
      messageTamil,
      sentBy,
    };

    setNotifications(prev => [...prev, notification]);

    // In a real app, this would send actual emails/SMS
    console.log(`Notification sent to ${recipientIds.length} members`);
  };

  // Stats
  const getStats = (): CRMStats => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      totalMembers: members.length,
      activeMembers: members.filter(m => m.status === 'active').length,
      pendingApprovals: members.filter(m => m.status === 'pending').length,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
      expiringThisMonth: members.filter(m => {
        if (!m.membershipEndDate) return false;
        const endDate = new Date(m.membershipEndDate);
        return endDate <= thirtyDaysFromNow && endDate >= now;
      }).length,
      newThisMonth: members.filter(m => new Date(m.createdAt) >= thisMonth).length,
      revenueThisYear: payments
        .filter(p => p.status === 'verified' && new Date(p.paymentDate) >= thisYear)
        .reduce((sum, p) => sum + p.amount, 0),
    };
  };

  // Utilities
  const getUpcomingRenewals = (days: number) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return members.filter(m => {
      if (!m.membershipEndDate || m.status !== 'active') return false;
      const endDate = new Date(m.membershipEndDate);
      return endDate <= futureDate && endDate >= now;
    });
  };

  const searchMembers = (query: string) => {
    const lower = query.toLowerCase();
    return members.filter(m =>
      m.firstName.toLowerCase().includes(lower) ||
      m.lastName.toLowerCase().includes(lower) ||
      m.email.toLowerCase().includes(lower) ||
      m.phone.includes(query) ||
      m.membershipNumber?.toLowerCase().includes(lower)
    );
  };

  const filterMembers = (filters: MemberFilters) => {
    return members.filter(m => {
      if (filters.status && m.status !== filters.status) return false;
      if (filters.membershipType && m.membershipType !== filters.membershipType) return false;
      if (filters.hasEmail !== undefined && (!!m.email) !== filters.hasEmail) return false;
      if (filters.receivesNewsletter !== undefined && m.receiveNewsletter !== filters.receivesNewsletter) return false;
      if (filters.expiringWithinDays && m.membershipEndDate) {
        const endDate = new Date(m.membershipEndDate);
        const futureDate = new Date(Date.now() + filters.expiringWithinDays * 24 * 60 * 60 * 1000);
        if (endDate > futureDate) return false;
      }
      return true;
    });
  };

  return (
    <MemberContext.Provider value={{
      members,
      addMember,
      updateMember,
      deleteMember,
      getMember,
      getMemberByEmail,
      approveMember,
      payments,
      addPayment,
      verifyPayment,
      rejectPayment,
      getMemberPayments,
      notifications,
      sendEventNotification,
      getStats,
      generateMembershipNumber,
      generateRegistrationReference,
      getUpcomingRenewals,
      searchMembers,
      filterMembers,
      getMemberByReference,
    }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
}
