import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Send, 
  MessageCircle, 
  Filter, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  AlertCircle
} from 'lucide-react';
import { Subscriber } from '../types';
import { exportSubscribersToCSV } from '../data/subscriberStore';

interface SubscriberManagerProps {
  subscribers: Subscriber[];
  onAddSubscriber: (subscriber: Omit<Subscriber, 'id' | 'subscribedAt' | 'timestamp'>) => void;
  onDeleteSubscriber: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const SubscriberManager: React.FC<SubscriberManagerProps> = ({
  subscribers,
  onAddSubscriber,
  onDeleteSubscriber,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'email' | 'phone' | 'active' | 'inactive'>('all');
  const [copiedType, setCopiedType] = useState<'emails' | 'phones' | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // New subscriber form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTopics, setNewTopics] = useState<string[]>(['ব্রেকিং নিউজ', 'সারাদিনের হেডলাইন্স']);
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Quick broadcast simulator
  const [broadcastMessage, setBroadcastMessage] = useState('🔴 [BARTA PROHOR 24 ব্রেকিং অ্যালার্ট] ');
  const [broadcastCopied, setBroadcastCopied] = useState(false);

  // Calculations & stats
  const totalCount = subscribers.length;
  const emailCount = subscribers.filter(s => s.email && s.email.trim() !== '').length;
  const phoneCount = subscribers.filter(s => s.phone && s.phone.trim() !== '').length;
  const activeCount = subscribers.filter(s => s.status === 'active').length;

  // Filtered subscribers
  const filteredSubscribers = subscribers.filter(sub => {
    // Search match
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (sub.name && sub.name.toLowerCase().includes(searchLower)) ||
      (sub.email && sub.email.toLowerCase().includes(searchLower)) ||
      (sub.phone && sub.phone.includes(searchTerm)) ||
      (sub.topics && sub.topics.some(t => t.toLowerCase().includes(searchLower))) ||
      (sub.source && sub.source.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    // Filter type
    if (filterType === 'email') return !!sub.email;
    if (filterType === 'phone') return !!sub.phone;
    if (filterType === 'active') return sub.status === 'active';
    if (filterType === 'inactive') return sub.status === 'inactive';
    return true;
  });

  // Copy all emails
  const handleCopyEmails = () => {
    const emails = subscribers
      .filter(s => s.email && s.email.trim() !== '' && s.status === 'active')
      .map(s => s.email)
      .join(', ');
    
    if (emails) {
      navigator.clipboard.writeText(emails);
      setCopiedType('emails');
      setTimeout(() => setCopiedType(null), 3000);
    }
  };

  // Copy all phone numbers
  const handleCopyPhones = () => {
    const phones = subscribers
      .filter(s => s.phone && s.phone.trim() !== '' && s.status === 'active')
      .map(s => s.phone?.replace(/[^0-9+]/g, ''))
      .filter(Boolean)
      .join(', ');
    
    if (phones) {
      navigator.clipboard.writeText(phones);
      setCopiedType('phones');
      setTimeout(() => setCopiedType(null), 3000);
    }
  };

  const handleCreateSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() && !newPhone.trim()) {
      setFormError('অনুগ্রহ করে অন্তত একটি ইমেল অথবা মোবাইল নম্বর লিখুন।');
      return;
    }

    onAddSubscriber({
      name: newName.trim() || undefined,
      email: newEmail.trim() || undefined,
      phone: newPhone.trim() || undefined,
      topics: newTopics,
      source: 'অ্যাডমিন ম্যানুয়াল এন্ট্রি',
      status: 'active',
      notes: newNotes.trim() || undefined
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    setFormError('');
    setIsAddModalOpen(false);
  };

  const handleCopyBroadcast = () => {
    if (!broadcastMessage) return;
    navigator.clipboard.writeText(broadcastMessage);
    setBroadcastCopied(true);
    setTimeout(() => setBroadcastCopied(false), 3000);
  };

  const availableTopics = [
    'ব্রেকিং নিউজ',
    'বিনোদন ও টলিউড',
    'আবহাওয়া ও দুর্যোগ',
    'রাজনীতি ও রাজ্য',
    'দেশ-বিদেশ',
    'খেলাধুলা',
    'সারাদিনের হেডলাইন্স'
  ];

  const toggleNewTopic = (topic: string) => {
    if (newTopics.includes(topic)) {
      setNewTopics(newTopics.filter(t => t !== topic));
    } else {
      setNewTopics([...newTopics, topic]);
    }
  };

  return (
    <div className="space-y-5 font-['Noto_Serif_Bengali']">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xs border border-[#ded8cb] shadow-2xs">
          <div className="flex items-center justify-between text-[#737373] text-xs">
            <span>মোট গ্রাহক</span>
            <Users className="w-4 h-4 text-[#b91c1c]" />
          </div>
          <p className="text-2xl font-black text-[#1a1a1a] mt-1 font-sans">{totalCount}</p>
          <p className="text-[11px] text-[#059669] mt-0.5 font-bold">সক্রিয় ডেটাবেস</p>
        </div>

        <div className="bg-white p-3.5 rounded-xs border border-[#ded8cb] shadow-2xs">
          <div className="flex items-center justify-between text-[#737373] text-xs">
            <span>Gmail / ইমেল আইডি</span>
            <Mail className="w-4 h-4 text-[#2563eb]" />
          </div>
          <p className="text-2xl font-black text-[#1a1a1a] mt-1 font-sans">{emailCount}</p>
          <p className="text-[11px] text-[#2563eb] mt-0.5 font-medium">নিউজলেটার লিস্ট</p>
        </div>

        <div className="bg-white p-3.5 rounded-xs border border-[#ded8cb] shadow-2xs">
          <div className="flex items-center justify-between text-[#737373] text-xs">
            <span>হোয়াটসঅ্যাপ / মোবাইল</span>
            <Phone className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="text-2xl font-black text-[#1a1a1a] mt-1 font-sans">{phoneCount}</p>
          <p className="text-[11px] text-[#059669] mt-0.5 font-medium">SMS ও চ্যাট অ্যালার্ট</p>
        </div>

        <div className="bg-white p-3.5 rounded-xs border border-[#ded8cb] shadow-2xs">
          <div className="flex items-center justify-between text-[#737373] text-xs">
            <span>সক্রিয় স্ট্যাটাস</span>
            <ShieldCheck className="w-4 h-4 text-[#d97706]" />
          </div>
          <p className="text-2xl font-black text-[#1a1a1a] mt-1 font-sans">{activeCount}</p>
          <p className="text-[11px] text-[#525252] mt-0.5 font-medium">ডেলিভারি উপযোগী</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white p-4 rounded-xs border border-[#ded8cb] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#737373] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম, Gmail/ইমেল, ফোন নম্বর বা বিষয় দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#fbf9f4] border border-[#ded8cb] rounded-xs text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-[#a3a3a3] hover:text-[#1a1a1a] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Buttons: Export & Add */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold px-3 py-2 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#7f1d1d]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন গ্রাহক যোগ</span>
            </button>

            <button
              onClick={() => exportSubscribersToCSV(subscribers)}
              className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold px-3 py-2 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#047857]"
              title="এক্সেল বা সিএসভি ফাইল হিসেবে সম্পূর্ণ তালিকা ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Quick Copy Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#f3efe6]">
          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[#737373] text-[11px] font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> ফিল্টার:
            </span>
            {[
              { id: 'all', label: `সকল (${subscribers.length})` },
              { id: 'email', label: `ইমেল (${emailCount})` },
              { id: 'phone', label: `মোবাইল (${phoneCount})` },
              { id: 'active', label: `সক্রিয় (${activeCount})` },
              { id: 'inactive', label: `নিষ্ক্রিয় (${subscribers.length - activeCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-2.5 py-1 rounded-xs border text-xs cursor-pointer transition-colors whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] font-bold'
                    : 'bg-[#f8f7f2] text-[#525252] border-[#ded8cb] hover:bg-[#eae5db]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Copy buttons */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleCopyEmails}
              className="bg-[#f0f9ff] text-[#0369a1] hover:bg-[#e0f2fe] border border-[#bae6fd] px-2.5 py-1 rounded-xs flex items-center gap-1 cursor-pointer font-bold"
              title="সকল জিমেইল/ইমেল আইডি ক্লিপবোর্ডে কপি করুন"
            >
              {copiedType === 'emails' ? (
                <>
                  <Check className="w-3 h-3 text-[#059669]" />
                  <span>ইমেল কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>সকল ইমেল কপি</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyPhones}
              className="bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5] border border-[#a7f3d0] px-2.5 py-1 rounded-xs flex items-center gap-1 cursor-pointer font-bold"
              title="সকল ফোন নম্বর ক্লিপবোর্ডে কপি করুন"
            >
              {copiedType === 'phones' ? (
                <>
                  <Check className="w-3 h-3 text-[#059669]" />
                  <span>নম্বর কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>সকল নম্বর কপি</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subscriber List Table */}
      <div className="bg-white rounded-xs border border-[#ded8cb] overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-[#f8f7f2] border-b border-[#ded8cb] flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#1a1a1a] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#b91c1c]" />
            <span>পাঠক তালিকা ও ডাটাবেস ({filteredSubscribers.length} জন)</span>
          </h4>
          <span className="text-[11px] text-[#737373]">
            যেকোনো সময় এডিট, মেসেজ ও পরিচালনা করুন
          </span>
        </div>

        {filteredSubscribers.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Users className="w-10 h-10 text-[#d4d4d4] mx-auto" />
            <p className="text-sm font-bold text-[#525252]">কোনো গ্রাহক পাওয়া যায়নি</p>
            <p className="text-xs text-[#a3a3a3]">
              {searchTerm ? 'অন্য কোনো নাম বা নম্বর দিয়ে সন্ধান করুন।' : 'এখনও কোনো পাঠক সাবস্ক্রাইব করেনি।'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f3efe6] border-b border-[#ded8cb] text-[#525252] text-[11px] uppercase tracking-wider font-bold">
                  <th className="p-3">ক্রমিক ও নাম</th>
                  <th className="p-3">যোগাযোগের তথ্য (Gmail / Phone)</th>
                  <th className="p-3">পছন্দের বিষয়</th>
                  <th className="p-3">তারিখ ও উৎস</th>
                  <th className="p-3 text-center">স্ট্যাটাস</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ded8cb]">
                {filteredSubscribers.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-[#fbf9f4] transition-colors">
                    {/* Name & Avatar */}
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {sub.name ? sub.name.slice(0, 1) : sub.email ? sub.email.slice(0, 1).toUpperCase() : '#'}
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1a1a] text-xs sm:text-sm leading-snug">
                            {sub.name || `গ্রাহক #${idx + 1}`}
                          </p>
                          <p className="text-[10px] text-[#737373] font-mono mt-0.5">
                            ID: {sub.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="p-3 align-top space-y-1">
                      {sub.email ? (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                          <a 
                            href={`mailto:${sub.email}`} 
                            className="text-[#2563eb] hover:underline font-mono text-xs"
                            title="সরাসরি ইমেল পাঠান"
                          >
                            {sub.email}
                          </a>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#a3a3a3] italic">ইমেল যুক্ত নেই</span>
                      )}

                      {sub.phone ? (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <Phone className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                          <span className="font-mono text-xs text-[#1a1a1a]">{sub.phone}</span>
                          <a
                            href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0] px-1.5 py-0.5 rounded-xs font-bold flex items-center gap-0.5"
                            title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                          >
                            <MessageCircle className="w-2.5 h-2.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#a3a3a3] italic block">ফোন যুক্ত নেই</span>
                      )}
                    </td>

                    {/* Topics */}
                    <td className="p-3 align-top">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {sub.topics && sub.topics.length > 0 ? (
                          sub.topics.map((t, i) => (
                            <span 
                              key={i}
                              className="text-[10px] bg-[#f3efe6] text-[#525252] px-1.5 py-0.5 rounded-xs border border-[#ded8cb]"
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#a3a3a3]">সকল খবর</span>
                        )}
                      </div>
                      {sub.notes && (
                        <p className="text-[10px] text-[#737373] mt-1 italic">
                          নোট: {sub.notes}
                        </p>
                      )}
                    </td>

                    {/* Date & Source */}
                    <td className="p-3 align-top text-xs space-y-0.5">
                      <p className="text-[#1a1a1a]">{sub.subscribedAt}</p>
                      <span className="inline-block text-[10px] bg-[#f1f5f9] text-[#475569] px-1.5 py-0.2 rounded-xs border border-[#cbd5e1]">
                        {sub.source}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3 align-top text-center">
                      <button
                        onClick={() => onToggleStatus(sub.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-xs cursor-pointer border transition-colors ${
                          sub.status === 'active'
                            ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0] hover:bg-[#d1fae5]'
                            : 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca] hover:bg-[#fee2e2]'
                        }`}
                        title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-[#059669]' : 'bg-[#dc2626]'}`} />
                        <span>{sub.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="p-3 align-top text-right">
                      {deleteConfirmId === sub.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-[10px] text-[#b91c1c] font-bold">মুছবেন?</span>
                          <button
                            onClick={() => {
                              onDeleteSubscriber(sub.id);
                              setDeleteConfirmId(null);
                            }}
                            className="bg-[#b91c1c] text-white p-1 rounded-xs text-[10px] font-bold hover:bg-[#991b1b]"
                          >
                            হ্যাঁ
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="bg-[#ded8cb] text-[#1a1a1a] p-1 rounded-xs text-[10px]"
                          >
                            না
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(sub.id)}
                          className="p-1.5 text-[#a3a3a3] hover:text-[#b91c1c] hover:bg-[#fef2f2] rounded-xs transition-colors cursor-pointer"
                          title="গ্রাহক ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Broadcast Simulator Tool */}
      <div className="bg-[#1a1a1a] text-white p-4 sm:p-5 rounded-xs border border-[#333333] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#fbbf24]" />
            <h4 className="font-bold text-sm text-white">
              ব্রেকিং নিউজ ও ইনস্ট্যান্ট অ্যালার্ট ব্রডকাস্টার
            </h4>
          </div>
          <span className="text-[11px] text-[#a3a3a3]">
            {activeCount} জন সক্রিয় গ্রাহকের জন্য প্রস্তুত
          </span>
        </div>

        <p className="text-xs text-[#d4d4d4] leading-relaxed">
          গ্রাহকদের হোয়াটসঅ্যাপ বা ইমেল গ্রুপে জরুরি খবর এক ক্লিকে পাঠাতে নিচের মেসেজটি কাস্টমাইজ করে কপি করুন:
        </p>

        <div className="space-y-2">
          <textarea
            rows={2}
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="w-full bg-[#262626] border border-[#404040] rounded-xs p-2.5 text-xs text-white placeholder-[#737373] focus:outline-hidden focus:border-[#b91c1c]"
            placeholder="ব্রেকিং নিউজ বা সতর্কবার্তা লিখুন..."
          />

          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] text-[#a3a3a3]">
              টিপস: মেসেজটি কপি করে আপনার অফিশিয়াল WhatsApp চ্যানেল বা ইমেল ব্রডকাস্টে পেস্ট করুন।
            </div>

            <button
              onClick={handleCopyBroadcast}
              className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold px-3 py-1.5 rounded-xs text-xs flex items-center gap-1.5 cursor-pointer border border-[#7f1d1d]"
            >
              {broadcastCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>মেসেজ কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>ব্রডকাস্ট মেসেজ কপি</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add New Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div 
            className="bg-[#f8f7f2] rounded-none sm:rounded-xs max-w-md w-full overflow-hidden shadow-2xl border border-[#ded8cb] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#1a1a1a] text-white p-4 flex items-center justify-between border-b-2 border-b-[#b91c1c]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#b91c1c]" />
                <h4 className="font-bold text-sm text-white">নতুন পাঠক / গ্রাহক যুক্ত করুন</h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xs bg-[#262626] hover:bg-[#b91c1c] text-[#a3a3a3] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubscriber} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                  পাঠকের নাম (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: অনির্বাণ চক্রবর্তী"
                  className="w-full bg-white border border-[#ded8cb] rounded-xs px-3 py-1.5 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                  ইমেল আইডি / Gmail:
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-white border border-[#ded8cb] rounded-xs px-3 py-1.5 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                  মোবাইল নম্বর / WhatsApp:
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98300 XXXXX"
                  className="w-full bg-white border border-[#ded8cb] rounded-xs px-3 py-1.5 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                  পছন্দের বিষয়সমূহ:
                </label>
                <div className="flex flex-wrap gap-1">
                  {availableTopics.map((topic) => {
                    const isSelected = newTopics.includes(topic);
                    return (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => toggleNewTopic(topic)}
                        className={`text-[11px] px-2 py-0.5 rounded-xs border cursor-pointer ${
                          isSelected
                            ? 'bg-[#b91c1c] text-white border-[#b91c1c] font-bold'
                            : 'bg-white text-[#525252] border-[#ded8cb] hover:bg-[#f3efe6]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                  নোট বা মন্তব্য (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="যেমন: অফলাইন রিডার / নিয়মিত ভিজিটর"
                  className="w-full bg-white border border-[#ded8cb] rounded-xs px-3 py-1.5 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                />
              </div>

              {formError && (
                <div className="text-xs text-[#b91c1c] font-bold bg-[#fef2f2] p-2 rounded-xs border border-[#fca5a5]">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#525252] hover:bg-[#eae5db] rounded-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold px-4 py-1.5 rounded-xs text-xs cursor-pointer border border-[#7f1d1d]"
                >
                  ডাটাবেসে সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
