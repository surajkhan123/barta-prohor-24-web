import { Subscriber } from '../types';

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub_1724738001',
    name: 'শুভঙ্কর সেনগুপ্ত',
    email: 'shuvankar.sen@gmail.com',
    phone: '+91 98301 44521',
    topics: ['ব্রেকিং নিউজ', 'বিনোদন ও টলিউড', 'রাজনীতি ও রাজ্য'],
    subscribedAt: 'আজ, ০৩:১৫ অপরাহ্ন',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    source: 'সাবস্ক্রিপশন পপআপ',
    status: 'active',
    notes: 'টলিউড ও রাজ্য সংবাদের নিয়মিত পাঠক'
  },
  {
    id: 'sub_1724738002',
    name: 'অনন্যা ব্যানার্জী',
    email: 'ananya.banerjee.kol@gmail.com',
    phone: '+91 94332 87910',
    topics: ['আবহাওয়া ও দুর্যোগ', 'ব্রেকিং নিউজ'],
    subscribedAt: 'আজ, ০১:৪০ অপরাহ্ন',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    source: 'ফলো ও নিউজলেটার বক্স',
    status: 'active',
    notes: 'আবহাওয়া সতর্কবার্তা চান'
  },
  {
    id: 'sub_1724738003',
    name: 'রাহুল মজুমদার',
    email: 'rahul.majumder99@gmail.com',
    phone: '+91 70034 11298',
    topics: ['বিনোদন ও টলিউড', 'দেশ-বিদেশ'],
    subscribedAt: 'গতকাল, ০৯:২০ অপরাহ্ন',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    source: 'সাবস্ক্রিপশন পপআপ',
    status: 'active',
  },
  {
    id: 'sub_1724738004',
    name: 'সৌমেন চক্রবর্তী',
    email: 'soumen.chakraborty.wb@gmail.com',
    phone: '+91 98741 00234',
    topics: ['রাজনীতি ও রাজ্য', 'ব্রেকিং নিউজ', 'বিশেষ সম্পাদকীয়'],
    subscribedAt: 'গতকাল, ০৬:১০ অপরাহ্ন',
    timestamp: Date.now() - 1000 * 60 * 60 * 27,
    source: 'ফলো ও নিউজলেটার বক্স',
    status: 'active',
  },
  {
    id: 'sub_1724738005',
    name: 'পাপিয়া ঘোষ',
    email: 'papiaghosh.media@gmail.com',
    phone: '+91 89100 55642',
    topics: ['ব্রেকিং নিউজ', 'বিনোদন ও টলিউড'],
    subscribedAt: '২৫ আগস্ট ২০২৬',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    source: 'ফুটার লিঙ্ক',
    status: 'active',
  }
];

const STORAGE_KEY = 'bp24_subscribers_db';

export const loadStoredSubscribers = (): Subscriber[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading subscribers from localStorage:', e);
  }
  return INITIAL_SUBSCRIBERS;
};

export const saveSubscribersToStorage = (subscribers: Subscriber[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
  } catch (e) {
    console.error('Error saving subscribers to localStorage:', e);
  }
};

export const exportSubscribersToCSV = (subscribers: Subscriber[]): void => {
  const headers = ['ID', 'নাম', 'ইমেল (Gmail/Email)', 'ফোন / হোয়াটসঅ্যাপ', 'পছন্দের বিষয়', 'সাবস্ক্রিপশনের সময়', 'উৎস (Source)', 'স্ট্যাটাস', 'মন্তব্য'];
  
  const rows = subscribers.map((sub, idx) => [
    `"${sub.id}"`,
    `"${sub.name || `গ্রাহক #${idx + 1}`}"`,
    `"${sub.email || 'নাই'}"`,
    `"${sub.phone || 'নাই'}"`,
    `"${(sub.topics || []).join(', ')}"`,
    `"${sub.subscribedAt}"`,
    `"${sub.source}"`,
    `"${sub.status === 'active' ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}"`,
    `"${sub.notes || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `BartaProhor24_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
