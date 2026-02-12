'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useMember, MemberRegistrationData, FamilyMember } from '@/contexts/MemberContext';
import { sendPaymentInstructionsEmail } from '@/lib/emailjs';
import {
  User, Users, GraduationCap, Heart, ArrowLeft, ArrowRight, Check,
  Mail, Phone, MapPin, Home, Plus, Trash2, AlertCircle, CheckCircle2
} from 'lucide-react';

type Step = 'type' | 'personal' | 'family' | 'preferences' | 'confirmation';

export default function RegisterPage() {
  const { language } = useLanguage();
  const { membershipTiers } = useAdmin();
  const { addMember, getMemberByEmail } = useMember();

  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [error, setError] = useState<string>('');
  const [registeredMember, setRegisteredMember] = useState<any>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  // Form data
  const [formData, setFormData] = useState<MemberRegistrationData & {
    apartmentNo?: string;
    homePhone?: string;
    cellPhone?: string;
    spouseName?: string;
    bestWayToReach?: 'phone' | 'email' | 'both';
    childrenNames?: string[];
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartmentNo: '',
    city: 'Mississauga',
    postalCode: '',
    homePhone: '',
    cellPhone: '',
    spouseName: '',
    bestWayToReach: 'email',
    membershipType: 'individual',
    familyMembers: [],
    childrenNames: ['', '', ''],
    preferredLanguage: language as 'en' | 'ta',
    receiveNewsletter: true,
    receiveEventNotifications: true,
    receiveSMS: false,
    howDidYouHear: '',
    interests: [],
    volunteerInterests: [],
    paymentMethod: 'etransfer',
  });


  const membershipTypeIcons: Record<string, typeof User> = {
    individual: User,
    family: Users,
    student: GraduationCap,
    senior: Heart,
  };

  const steps: Step[] = formData.membershipType === 'family'
    ? ['type', 'personal', 'family', 'preferences', 'confirmation']
    : ['type', 'personal', 'preferences', 'confirmation'];

  const stepIndex = steps.indexOf(currentStep);

  const getSelectedTier = () => {
    return membershipTiers.find(t =>
      t.name.toLowerCase() === formData.membershipType ||
      t.name.toLowerCase().includes(formData.membershipType)
    );
  };

  const handleNext = () => {
    setError('');

    // Validation
    if (currentStep === 'personal') {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError(language === 'en' ? 'Please fill in all required fields' : 'அனைத்து தேவையான புலங்களையும் நிரப்பவும்');
        return;
      }
      if (!formData.homePhone && !formData.cellPhone) {
        setError(language === 'en' ? 'Please provide at least one phone number' : 'குறைந்தது ஒரு தொலைபேசி எண்ணை வழங்கவும்');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError(language === 'en' ? 'Please enter a valid email address' : 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்');
        return;
      }
      // Check if email already registered
      const existing = getMemberByEmail(formData.email);
      if (existing) {
        setError(language === 'en' ? 'This email is already registered' : 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது');
        return;
      }
    }

    if (currentStep === 'preferences') {
      if (!consentChecked) {
        setError(language === 'en' ? 'Please accept the terms and conditions' : 'விதிமுறைகளை ஏற்றுக்கொள்ளவும்');
        return;
      }
      handleSubmit();
      return;
    }

    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleSubmit = () => {
    try {
      // Combine phone numbers
      const phone = formData.cellPhone || formData.homePhone || '';

      // Convert children names to family members
      const familyMembers: FamilyMember[] = [];

      // Add spouse if family membership
      if (formData.membershipType === 'family' && formData.spouseName) {
        const [spouseFirst, ...spouseLast] = formData.spouseName.trim().split(' ');
        familyMembers.push({
          id: `spouse-${Date.now()}`,
          firstName: spouseFirst || '',
          lastName: spouseLast.join(' ') || formData.lastName,
          relationship: 'spouse'
        });
      }

      // Add children
      formData.childrenNames?.forEach((name, index) => {
        if (name.trim()) {
          const [childFirst, ...childLast] = name.trim().split(' ');
          familyMembers.push({
            id: `child-${Date.now()}-${index}`,
            firstName: childFirst || '',
            lastName: childLast.join(' ') || formData.lastName,
            relationship: 'child'
          });
        }
      });

      const memberData: MemberRegistrationData = {
        ...formData,
        phone,
        familyMembers,
      };

      const member = addMember(memberData);
      setRegisteredMember(member);
      setCurrentStep('confirmation');

      // Send payment instructions email to the new member
      const tier = getSelectedTier();
      sendPaymentInstructionsEmail({
        to_email: formData.email,
        to_name: `${formData.firstName} ${formData.lastName}`,
        reference: member.registrationReference,
        amount: tier?.price || 25,
        membership: formData.membershipType,
        payment_email: 'mississaugatamils@gmail.com',
      });
    } catch (err) {
      setError(language === 'en' ? 'Registration failed. Please try again.' : 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.');
    }
  };

  const updateChildName = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      childrenNames: prev.childrenNames?.map((name, i) => i === index ? value : name)
    }));
  };

  const tier = getSelectedTier();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-[var(--mta-maroon)] text-white py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-3 sm:mb-4 min-h-[44px] py-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Back to Home' : 'முகப்புக்குத் திரும்பு'}
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {language === 'en' ? 'Membership Registration' : 'அங்கத்துவ விண்ணப்பம்'}
          </h1>
          <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">
            {language === 'en'
              ? 'Mississauga Tamil Association'
              : 'மிசிசாகா தமிழ் ஒன்றியம்'}
          </p>
        </div>
      </div>

      {/* Progress Steps - Mobile responsive */}
      {currentStep !== 'confirmation' && (
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {steps.filter(s => s !== 'confirmation').map((step, index) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                  index < stepIndex ? 'bg-green-500 text-white' :
                  index === stepIndex ? 'bg-[var(--mta-maroon)] text-white' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {index < stepIndex ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : index + 1}
                </div>
                {index < steps.length - 2 && (
                  <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 min-w-[20px] max-w-[80px] sm:max-w-none ${
                    index < stepIndex ? 'bg-green-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] sm:text-xs md:text-sm text-slate-400">
            <span>{language === 'en' ? 'Type' : 'வகை'}</span>
            <span>{language === 'en' ? 'Personal' : 'தனிப்பட்ட'}</span>
            {formData.membershipType === 'family' && (
              <span>{language === 'en' ? 'Family' : 'குடும்பம்'}</span>
            )}
            <span>{language === 'en' ? 'Confirm' : 'உறுதி'}</span>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
        <div className="bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-700">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center text-red-400">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step: Membership Type */}
          {currentStep === 'type' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === 'en' ? 'Select Membership Type' : 'உறுப்பினர் வகையைத் தேர்ந்தெடுக்கவும்'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {membershipTiers.filter(t => t.isActive).map(t => {
                  const typeKey = t.name.toLowerCase().includes('family') ? 'family' :
                    t.name.toLowerCase().includes('student') ? 'student' :
                    t.name.toLowerCase().includes('senior') ? 'senior' : 'individual';
                  const Icon = membershipTypeIcons[typeKey] || User;
                  const isSelected = formData.membershipType === typeKey;

                  return (
                    <button
                      key={t.id}
                      onClick={() => setFormData(prev => ({ ...prev, membershipType: typeKey as any }))}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[var(--mta-maroon)] bg-[var(--mta-maroon)]/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                          isSelected ? 'bg-[var(--mta-maroon)] text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">
                            {language === 'en' ? t.name : t.nameTamil}
                          </h3>
                          <p className="text-2xl font-bold text-[var(--accent-gold)] mt-1">
                            ${t.price}<span className="text-sm text-slate-400">/year</span>
                          </p>
                          <ul className="mt-3 space-y-1">
                            {(language === 'en' ? t.features : t.featuresTamil).slice(0, 3).map((f, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-center">
                                <Check className="w-4 h-4 text-green-500 mr-2" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-[var(--mta-maroon)]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step: Personal Information */}
          {currentStep === 'personal' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === 'en' ? 'Personal Information' : 'தனிப்பட்ட தகவல்'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'en' ? 'First Name' : 'முதல் பெயர்'} *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'en' ? 'Last Name' : 'கடைசி பெயர்'} *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {language === 'en' ? 'Street Address' : 'தெரு முகவரி'}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder={language === 'en' ? 'Street No & Name' : 'தெரு எண் & பெயர்'}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Home className="w-4 h-4 inline mr-1" />
                    {language === 'en' ? 'Apartment No' : 'குடியிருப்பு எண்'}
                  </label>
                  <input
                    type="text"
                    value={formData.apartmentNo}
                    onChange={e => setFormData(prev => ({ ...prev, apartmentNo: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'en' ? 'City' : 'நகரம்'}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'en' ? 'Postal Code' : 'அஞ்சல் குறியீடு'}
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={e => setFormData(prev => ({ ...prev, postalCode: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                    placeholder="L5V 3B8"
                  />
                </div>

                {/* Phone Numbers */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {language === 'en' ? 'Home Phone' : 'வீட்டு தொலைபேசி'}
                  </label>
                  <input
                    type="tel"
                    value={formData.homePhone}
                    onChange={e => setFormData(prev => ({ ...prev, homePhone: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                    placeholder="(905) 555-1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {language === 'en' ? 'Cell Phone' : 'கைபேசி'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.cellPhone}
                    onChange={e => setFormData(prev => ({ ...prev, cellPhone: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                    placeholder="(416) 555-1234"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    {language === 'en' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                    required
                  />
                </div>

                {/* Spouse Name - Only for Family Membership */}
                {formData.membershipType === 'family' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      {language === 'en' ? 'Spouse Name' : 'கணவன் / மனைவி பெயர்'}
                    </label>
                    <input
                      type="text"
                      value={formData.spouseName}
                      onChange={e => setFormData(prev => ({ ...prev, spouseName: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                      placeholder={language === 'en' ? 'Full Name' : 'முழு பெயர்'}
                    />
                  </div>
                )}

                {/* Best Way to Reach */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    {language === 'en' ? 'Best Way to Reach' : 'தொடர்பு கொள்ள சிறந்த வழி'}
                  </label>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <label className="flex items-center cursor-pointer min-h-[44px] py-2">
                      <input
                        type="radio"
                        name="bestWayToReach"
                        checked={formData.bestWayToReach === 'phone'}
                        onChange={() => setFormData(prev => ({ ...prev, bestWayToReach: 'phone' }))}
                        className="w-5 h-5 text-[var(--mta-maroon)] border-slate-600 bg-slate-700 focus:ring-[var(--mta-maroon)]"
                      />
                      <span className="ml-2 text-slate-300 text-sm sm:text-base">{language === 'en' ? 'By Phone' : 'தொலைபேசி'}</span>
                    </label>
                    <label className="flex items-center cursor-pointer min-h-[44px] py-2">
                      <input
                        type="radio"
                        name="bestWayToReach"
                        checked={formData.bestWayToReach === 'email'}
                        onChange={() => setFormData(prev => ({ ...prev, bestWayToReach: 'email' }))}
                        className="w-5 h-5 text-[var(--mta-maroon)] border-slate-600 bg-slate-700 focus:ring-[var(--mta-maroon)]"
                      />
                      <span className="ml-2 text-slate-300 text-sm sm:text-base">{language === 'en' ? 'By Email' : 'மின்னஞ்சல்'}</span>
                    </label>
                    <label className="flex items-center cursor-pointer min-h-[44px] py-2">
                      <input
                        type="radio"
                        name="bestWayToReach"
                        checked={formData.bestWayToReach === 'both'}
                        onChange={() => setFormData(prev => ({ ...prev, bestWayToReach: 'both' }))}
                        className="w-5 h-5 text-[var(--mta-maroon)] border-slate-600 bg-slate-700 focus:ring-[var(--mta-maroon)]"
                      />
                      <span className="ml-2 text-slate-300 text-sm sm:text-base">{language === 'en' ? 'Both' : 'இரண்டும்'}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Family Members (Children under 18) */}
          {currentStep === 'family' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'en' ? 'Other Family Members' : 'ஏனைய குடும்ப உறுப்பினர்கள்'}
              </h2>
              <p className="text-slate-400 mb-6">
                {language === 'en'
                  ? 'Children under 18 years old'
                  : '18 வயதுக்குட்பட்ட குழந்தைகள்'}
              </p>

              <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {language === 'en' ? `Child ${index + 1}` : `குழந்தை ${index + 1}`}
                    </label>
                    <input
                      type="text"
                      value={formData.childrenNames?.[index] || ''}
                      onChange={e => updateChildName(index, e.target.value)}
                      placeholder={language === 'en' ? 'Full Name' : 'முழு பெயர்'}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-[var(--mta-maroon)] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              <p className="text-sm text-slate-500 mt-4">
                {language === 'en'
                  ? 'Leave blank if not applicable'
                  : 'பொருந்தவில்லை என்றால் காலியாக விடவும்'}
              </p>
            </div>
          )}

          {/* Step: Preferences & Consent */}
          {currentStep === 'preferences' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === 'en' ? 'Preferences & Consent' : 'விருப்பங்கள் & ஒப்புதல்'}
              </h2>

              <div className="space-y-6">
                {/* Language Preference */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    {language === 'en' ? 'Preferred Language' : 'விரும்பிய மொழி'}
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, preferredLanguage: 'en' }))}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium ${
                        formData.preferredLanguage === 'en'
                          ? 'border-[var(--mta-maroon)] bg-[var(--mta-maroon)]/10 text-white'
                          : 'border-slate-600 text-slate-400'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, preferredLanguage: 'ta' }))}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium ${
                        formData.preferredLanguage === 'ta'
                          ? 'border-[var(--mta-maroon)] bg-[var(--mta-maroon)]/10 text-white'
                          : 'border-slate-600 text-slate-400'
                      }`}
                    >
                      தமிழ்
                    </button>
                  </div>
                </div>

                {/* Communication Preferences */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    {language === 'en' ? 'Communication Preferences' : 'தொடர்பு விருப்பங்கள்'}
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.receiveNewsletter}
                        onChange={e => setFormData(prev => ({ ...prev, receiveNewsletter: e.target.checked }))}
                        className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-[var(--mta-maroon)] focus:ring-[var(--mta-maroon)]"
                      />
                      <span className="ml-3 text-slate-300">
                        {language === 'en' ? 'Receive newsletter updates' : 'செய்திமடல் புதுப்பிப்புகளைப் பெறுங்கள்'}
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.receiveEventNotifications}
                        onChange={e => setFormData(prev => ({ ...prev, receiveEventNotifications: e.target.checked }))}
                        className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-[var(--mta-maroon)] focus:ring-[var(--mta-maroon)]"
                      />
                      <span className="ml-3 text-slate-300">
                        {language === 'en' ? 'Receive event notifications' : 'நிகழ்வு அறிவிப்புகளைப் பெறுங்கள்'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Consent */}
                <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={e => setConsentChecked(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-[var(--mta-maroon)] focus:ring-[var(--mta-maroon)] mt-1"
                    />
                    <span className="ml-3 text-slate-300 text-sm leading-relaxed">
                      {language === 'en'
                        ? 'I hereby consent to work for the progress of the association and to abide by the rules and regulations governing the members at all times. I confirm that all the information provided above is true and accurate.'
                        : 'மேற்குறிப்பிட்ட விபரங்கள் யாவும் உண்மையானவை என்பதை உறுதிப்படுத்துகின்றேன். சங்கத்தின் முன்னேற்றத்திற்காக பணியாற்றவும், உறுப்பினர்களை நிர்வகிக்கும் விதிமுறைகளுக்கு எப்போதும் இணங்கவும் ஒப்புக்கொள்கிறேன்.'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step: Confirmation */}
          {currentStep === 'confirmation' && registeredMember && (
            <div className="py-4">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {language === 'en' ? 'Registration Successful!' : 'பதிவு வெற்றிகரமாக முடிந்தது!'}
                </h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  {language === 'en'
                    ? 'Please complete your payment to activate your membership.'
                    : 'உங்கள் உறுப்பினரை செயல்படுத்த கட்டணத்தை செலுத்தவும்.'}
                </p>
              </div>

              {/* Reference Number - Highlighted */}
              <div className="bg-[var(--mta-maroon)] rounded-xl p-6 max-w-lg mx-auto mb-8 text-center">
                <p className="text-white/80 text-sm mb-2">
                  {language === 'en' ? 'Your Reference Number' : 'உங்கள் குறிப்பு எண்'}
                </p>
                <p className="text-4xl font-bold text-white tracking-wider">
                  {registeredMember.registrationReference}
                </p>
                <p className="text-white/70 text-sm mt-2">
                  {language === 'en'
                    ? 'Include this number in your e-Transfer message'
                    : 'மின்-பரிமாற்ற செய்தியில் இந்த எண்ணை சேர்க்கவும்'}
                </p>
              </div>

              {/* Payment Instructions */}
              <div className="bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded-xl p-6 max-w-lg mx-auto mb-8">
                <h4 className="font-bold text-[var(--accent-gold)] mb-4 text-center">
                  {language === 'en' ? 'Payment Instructions' : 'கட்டண வழிமுறைகள்'}
                </h4>
                <ol className="space-y-4 text-slate-300">
                  <li className="flex items-start">
                    <span className="w-7 h-7 bg-[var(--accent-gold)] text-black rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                    <div>
                      <span>{language === 'en' ? 'Send e-Transfer to:' : 'மின்-பரிமாற்றம் அனுப்பவும்:'}</span>
                      <strong className="block text-[var(--accent-gold)] text-lg">mississaugatamils@gmail.com</strong>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-7 h-7 bg-[var(--accent-gold)] text-black rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                    <div>
                      <span>{language === 'en' ? 'Amount:' : 'தொகை:'}</span>
                      <strong className="block text-white text-xl">${tier?.price || 20} CAD</strong>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-7 h-7 bg-[var(--accent-gold)] text-black rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</span>
                    <div>
                      <span>{language === 'en' ? 'In the message field, include:' : 'செய்தி புலத்தில் சேர்க்கவும்:'}</span>
                      <strong className="block text-white">
                        {registeredMember.registrationReference} - {registeredMember.firstName} {registeredMember.lastName}
                      </strong>
                    </div>
                  </li>
                </ol>
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400 text-center">
                    {language === 'en'
                      ? 'Once we receive and verify your payment, your membership will be activated and you will receive a confirmation email.'
                      : 'உங்கள் கட்டணத்தை பெற்று சரிபார்த்தவுடன், உங்கள் உறுப்பினர் செயல்படுத்தப்படும் மற்றும் உறுதிப்படுத்தல் மின்னஞ்சல் பெறுவீர்கள்.'}
                  </p>
                </div>
              </div>

              {/* Registration Details */}
              <div className="bg-slate-700/50 rounded-xl p-6 max-w-lg mx-auto mb-8">
                <h4 className="font-bold text-white mb-4">
                  {language === 'en' ? 'Registration Details' : 'பதிவு விவரங்கள்'}
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-slate-400">{language === 'en' ? 'Name:' : 'பெயர்:'}</span>
                    <span className="text-white">{registeredMember.firstName} {registeredMember.lastName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">{language === 'en' ? 'Email:' : 'மின்னஞ்சல்:'}</span>
                    <span className="text-white">{registeredMember.email}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">{language === 'en' ? 'Phone:' : 'தொலைபேசி:'}</span>
                    <span className="text-white">{registeredMember.phone}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">{language === 'en' ? 'Membership Type:' : 'உறுப்பினர் வகை:'}</span>
                    <span className="text-white capitalize">{registeredMember.membershipType}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">{language === 'en' ? 'Status:' : 'நிலை:'}</span>
                    <span className="text-yellow-400">{language === 'en' ? 'Awaiting Payment' : 'கட்டணத்திற்காக காத்திருக்கிறது'}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 bg-[var(--mta-maroon)] text-white rounded-lg font-medium hover:bg-[#6b1028] text-center"
                >
                  {language === 'en' ? 'Return Home' : 'முகப்புக்குத் திரும்பு'}
                </Link>
                <Link
                  href="/#events"
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 text-center"
                >
                  {language === 'en' ? 'View Events' : 'நிகழ்வுகளைக் காண்க'}
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 'confirmation' && (
            <div className="flex flex-col-reverse xs:flex-row justify-between gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700">
              <button
                onClick={handleBack}
                disabled={stepIndex === 0}
                className={`px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center justify-center min-h-[48px] ${
                  stepIndex === 0
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Back' : 'பின்'}
              </button>
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-3 bg-[var(--mta-maroon)] text-white rounded-lg font-medium hover:bg-[#6b1028] flex items-center justify-center min-h-[48px] text-sm sm:text-base"
              >
                {currentStep === 'preferences'
                  ? (language === 'en' ? 'Complete Registration' : 'பதிவை முடிக்கவும்')
                  : (language === 'en' ? 'Continue' : 'தொடர்க')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
