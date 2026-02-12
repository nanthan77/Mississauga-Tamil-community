'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Contact() {
  const { language, t } = useLanguage();
  const { siteSettings } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert(language === 'en' ? 'Thank you for your message!' : 'உங்கள் செய்திக்கு நன்றி!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: language === 'en' ? 'Email' : 'மின்னஞ்சல்',
      value: siteSettings.email,
      href: `mailto:${siteSettings.email}`,
    },
    {
      icon: Phone,
      label: language === 'en' ? 'Phone' : 'தொலைபேசி',
      value: siteSettings.phone,
      href: `tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`,
    },
    {
      icon: MapPin,
      label: t('contact.address'),
      value: language === 'en' ? siteSettings.address : siteSettings.addressTamil,
      href: 'https://maps.google.com',
    },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: siteSettings.facebook || '#', color: 'hover:bg-blue-600' },
    { icon: Instagram, label: 'Instagram', href: siteSettings.instagram || '#', color: 'hover:bg-pink-600' },
    { icon: Youtube, label: 'YouTube', href: siteSettings.youtube || '#', color: 'hover:bg-red-600' },
    { icon: MessageCircle, label: 'WhatsApp', href: siteSettings.whatsapp || '#', color: 'hover:bg-green-600' },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 relative">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-[var(--accent-gold)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {language === 'en' ? 'Contact Us' : 'எங்களை தொடர்பு கொள்ளுங்கள்'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
            {language === 'en' ? 'We want to hear from you' : 'உங்களிடமிருந்து கேட்க விரும்புகிறோம்'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="glass-panel rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-[var(--glass-border)]">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-300 mb-2">
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                  placeholder={language === 'en' ? 'Enter your name' : 'உங்கள் பெயரை உள்ளிடவும்'}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-300 mb-2">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                  placeholder={language === 'en' ? 'Enter your email' : 'உங்கள் மின்னஞ்சலை உள்ளிடவும்'}
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-slate-300 mb-2">
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                  placeholder={language === 'en' ? 'Enter your phone (optional)' : 'உங்கள் தொலைபேசி (விருப்பத்திற்கு)'}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-300 mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-[var(--glass-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent outline-none transition-all resize-none text-white placeholder-slate-500"
                  placeholder={language === 'en' ? 'Write your message here...' : 'உங்கள் செய்தியை இங்கே எழுதுங்கள்...'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[var(--accent-red)] text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center shadow-lg shadow-red-900/20 uppercase tracking-wide"
              >
                <Send className="w-5 h-5 mr-2" />
                {t('contact.send')}
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid gap-4">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  target={info.icon === MapPin ? '_blank' : undefined}
                  rel={info.icon === MapPin ? 'noopener noreferrer' : undefined}
                  className="flex items-center p-4 glass-panel rounded-xl hover:bg-[var(--glass-highlight)] transition-colors group border border-[var(--glass-border)]"
                >
                  <div className="w-12 h-12 bg-[var(--glass-highlight)] rounded-lg flex items-center justify-center mr-4 group-hover:bg-[var(--accent-gold)] transition-colors">
                    <info.icon className="w-6 h-6 text-[var(--accent-gold)] group-hover:text-[var(--bg-primary)] transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{info.label}</p>
                    <p className="font-bold text-white">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="glass-panel rounded-xl p-6 border border-[var(--glass-border)]">
              <h3 className="font-bold text-white mb-4">{t('contact.followUs')}</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-[var(--glass-bg)] rounded-lg flex items-center justify-center transition-colors hover:text-white border border-[var(--glass-border)] ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6 text-slate-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="glass-panel rounded-xl overflow-hidden shadow-lg border border-[var(--glass-border)] h-[300px] relative">
              <iframe
                width="100%"
                height="100%"
                id="gmap_canvas"
                src="https://maps.google.com/maps?q=2090+Hurontario+St,+Mississauga,+ON&t=&z=15&ie=UTF8&iwloc=&output=embed"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                title="MTA Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
