'use client';

import { useState } from 'react';
import { useMember } from '@/contexts/MemberContext';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Send, Mail, Users, Bell, Calendar, CheckCircle2, Clock,
  Search, Filter, Eye, MessageSquare
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const { members, notifications, sendEventNotification, getStats } = useMember();
  const { events, currentUser, logActivity } = useAdmin();

  const [selectedEvent, setSelectedEvent] = useState('');
  const [sendTo, setSendTo] = useState<'all' | 'active'>('active');
  const [message, setMessage] = useState('');
  const [messageTamil, setMessageTamil] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const stats = getStats();
  const activeMembers = members.filter(m => m.status === 'active' && m.receiveEventNotifications);
  const allMembers = members.filter(m => m.receiveEventNotifications);

  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= new Date() && e.isActive;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSendNotification = () => {
    if (!selectedEvent || !message) {
      alert('Please select an event and enter a message');
      return;
    }

    const event = events.find(e => e.id === selectedEvent);
    if (!event) return;

    setSending(true);

    try {
      sendEventNotification(
        selectedEvent,
        event.title,
        message,
        messageTamil,
        sendTo,
        currentUser?.name || 'Admin'
      );

      logActivity('Send Notification', `Sent event notification for "${event.title}" to ${sendTo === 'all' ? 'all' : 'active'} members`);

      setSuccess(true);
      setMessage('');
      setMessageTamil('');
      setSelectedEvent('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const generateDefaultMessage = () => {
    const event = events.find(e => e.id === selectedEvent);
    if (!event) return;

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    setMessage(
      `Dear Member,\n\nYou are invited to ${event.title}!\n\nDate: ${formattedDate}\nTime: ${event.time}\nVenue: ${event.venue}\n\n${event.description}\n\nWe look forward to seeing you there!\n\nBest regards,\nMississauga Tamils Association`
    );

    setMessageTamil(
      `அன்பான உறுப்பினரே,\n\n${event.titleTamil} நிகழ்விற்கு நீங்கள் அழைக்கப்படுகிறீர்கள்!\n\nதேதி: ${formattedDate}\nநேரம்: ${event.time}\nஇடம்: ${event.venueTamil}\n\n${event.descriptionTamil}\n\nஉங்களைச் சந்திக்க ஆவலுடன் காத்திருக்கிறோம்!\n\nஅன்புடன்,\nமிசிசாகா தமிழர்கள் சங்கம்`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Notifications</h1>
        <p className="text-gray-600">Send event updates and notifications to members</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{allMembers.length}</p>
              <p className="text-xs text-gray-500">Subscribed Members</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeMembers.length}</p>
              <p className="text-xs text-gray-500">Active Members</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
              <p className="text-xs text-gray-500">Upcoming Events</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-xs text-gray-500">Notifications Sent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose Notification */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2 text-[#8B1538]" />
            Send Event Notification
          </h2>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Notification sent successfully!
            </div>
          )}

          <div className="space-y-4">
            {/* Select Event */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event *
              </label>
              <select
                value={selectedEvent}
                onChange={e => {
                  setSelectedEvent(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
              >
                <option value="">Choose an event...</option>
                {upcomingEvents.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {selectedEvent && (
              <button
                onClick={generateDefaultMessage}
                className="text-sm text-[#8B1538] hover:underline"
              >
                Generate default message
              </button>
            )}

            {/* Send To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send To
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sendTo"
                    value="active"
                    checked={sendTo === 'active'}
                    onChange={() => setSendTo('active')}
                    className="mr-2 text-[#8B1538] focus:ring-[#8B1538]"
                  />
                  <span className="text-gray-700">Active Members ({activeMembers.length})</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sendTo"
                    value="all"
                    checked={sendTo === 'all'}
                    onChange={() => setSendTo('all')}
                    className="mr-2 text-[#8B1538] focus:ring-[#8B1538]"
                  />
                  <span className="text-gray-700">All Subscribed ({allMembers.length})</span>
                </label>
              </div>
            </div>

            {/* Message (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (English) *
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                rows={6}
                placeholder="Enter your message..."
              />
            </div>

            {/* Message (Tamil) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Tamil)
              </label>
              <textarea
                value={messageTamil}
                onChange={e => setMessageTamil(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent font-tamil"
                rows={6}
                placeholder="தமிழில் உங்கள் செய்தியை உள்ளிடவும்..."
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendNotification}
              disabled={sending || !selectedEvent || !message}
              className="w-full py-3 bg-[#8B1538] text-white rounded-lg font-medium hover:bg-[#6b1028] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {sending ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Notification
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Note: In this demo, notifications are logged but not actually sent via email.
              In production, integrate with an email service like SendGrid or AWS SES.
            </p>
          </div>
        </div>

        {/* Notification History */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-[#8B1538]" />
            Notification History
          </h2>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No notifications sent yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {[...notifications].reverse().map(notif => (
                <div key={notif.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{notif.eventTitle}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(notif.sentAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      Sent to {notif.recipientCount} members
                    </span>
                    <span>by {notif.sentBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
