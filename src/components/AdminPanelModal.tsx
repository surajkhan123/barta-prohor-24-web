import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Image as ImageIcon, 
  Key, 
  Lock, 
  LogOut, 
  ShieldAlert, 
  FileText, 
  QrCode, 
  Sparkles, 
  Globe, 
  ExternalLink,
  Flame,
  Radio,
  Share2,
  Download,
  Upload,
  Layers,
  Plus,
  Mic,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  StopCircle,
  Music,
  Headphones,
  Users,
  Video,
  Eye,
  EyeOff,
  Database,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { NewsArticle, ArticleImage, Subscriber } from '../types';
import { SubscriberManager } from './SubscriberManager';
import { compressImageFile } from '../utils/imageCompressor';
import { parseVideoUrl } from '../utils/videoHelper';
import { 
  getStoredAdminPassword, 
  verifyAdminPassword, 
  updateStoredAdminPassword, 
  getPasswordLastUpdated,
  getRecoveryEmail,
  setRecoveryEmail
} from '../data/authStore';
import { ForgotPasswordView } from './ForgotPasswordView';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  currentArticleId: string;
  onSelectArticle: (article: NewsArticle) => void;
  onSaveArticle: (article: NewsArticle) => void;
  onDeleteArticle: (id: string) => void;
  onOpenQRModal: () => void;
  subscribers?: Subscriber[];
  onAddSubscriber?: (subscriber: Omit<Subscriber, 'id' | 'subscribedAt' | 'timestamp'>) => void;
  onDeleteSubscriber?: (id: string) => void;
  onToggleSubscriberStatus?: (id: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  articles,
  currentArticleId,
  onSelectArticle,
  onSaveArticle,
  onDeleteArticle,
  onOpenQRModal,
  subscribers = [],
  onAddSubscriber = () => {},
  onDeleteSubscriber = () => {},
  onToggleSubscriberStatus = () => {},
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'subscribers' | 'guide' | 'settings'>('create');
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('বিনোদন');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [additionalImages, setAdditionalImages] = useState<ArticleImage[]>([]);
  const [newAddImageUrl, setNewAddImageUrl] = useState('');
  const [newAddImageCaption, setNewAddImageCaption] = useState('');
  
  // Audio Voice News State
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioName, setAudioName] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioCustomUrlInput, setAudioCustomUrlInput] = useState<string>('');
  
  // Video News State (YouTube, Facebook, Vimeo, MP4 direct)
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoCaption, setVideoCaption] = useState<string>('');
  const [videoCustomUrlInput, setVideoCustomUrlInput] = useState<string>('');
  const [isProcessingMedia, setIsProcessingMedia] = useState<boolean>(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  
  // Live Voice Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Audio Preview Player in Form
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const formAudioRef = useRef<HTMLAudioElement | null>(null);

  const [location, setLocation] = useState('কলকাতা / কাঠমান্ডু');
  const [authorName, setAuthorName] = useState('বার্তা প্রহর ২৪ ডিজিটাল ডেস্ক');
  const [paragraphsText, setParagraphsText] = useState('');
  const [isBreaking, setIsBreaking] = useState(true);
  const [statusBadgeText, setStatusBadgeText] = useState('আপডেট: তথ্য যাচাইকৃত');
  const [statusBadgeType, setStatusBadgeType] = useState<'safe' | 'warning' | 'critical' | 'info'>('safe');
  const [successToast, setSuccessToast] = useState('');

  // File input refs
  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Admin Password configuration from persistent database/storage
  const [adminPin, setAdminPin] = useState<string>(() => {
    return getStoredAdminPassword();
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPinCheck, setCurrentPinCheck] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [lastPasswordUpdated, setLastPasswordUpdated] = useState<string | null>(() => {
    return getPasswordLastUpdated();
  });

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetNotification, setResetNotification] = useState('');

  // Recovery Config in Settings
  const [recoveryEmailState, setRecoveryEmailState] = useState<string>(() => getRecoveryEmail());
  const [recoverySaveSuccess, setRecoverySaveSuccess] = useState('');

  useEffect(() => {
    // Check if session authenticated
    if (sessionStorage.getItem('bp24_admin_logged') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(pinInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bp24_admin_logged', 'true');
      setAuthError('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! পাসওয়ার্ড মনে না থাকলে নিচে "পাসওয়ার্ড ভুলে গেছেন?" এ ক্লিক করুন।');
    }
  };

  const handleSaveRecoverySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySaveSuccess('');
    if (recoveryEmailState.trim()) {
      setRecoveryEmail(recoveryEmailState.trim());
      setRecoverySaveSuccess('রিকভারি জিমেইল সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে!');
      setTimeout(() => setRecoverySaveSuccess(''), 4000);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError('');
    setPinChangeSuccess('');

    // Check if new password is at least 4 characters
    if (newPinInput.trim().length < 4) {
      setPinChangeError('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের বা সংখ্যার হতে হবে!');
      return;
    }

    // Check if confirm password matches
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinChangeError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!');
      return;
    }

    const result = updateStoredAdminPassword(newPinInput.trim());
    if (result.success) {
      setAdminPin(newPinInput.trim());
      setPinChangeSuccess('নতুন পাসওয়ার্ড সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে! পরবর্তী লগইনের জন্য এই নতুন পাসওয়ার্ডটি মনে রাখুন।');
      setLastPasswordUpdated(getPasswordLastUpdated());
      setNewPinInput('');
      setConfirmPinInput('');
      setCurrentPinCheck('');
      setTimeout(() => setPinChangeSuccess(''), 6000);
    } else {
      setPinChangeError(result.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bp24_admin_logged');
    setPinInput('');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setCategory('বিনোদন');
    setImageUrl('');
    setImageCaption('');
    setAdditionalImages([]);
    setNewAddImageUrl('');
    setNewAddImageCaption('');
    setAudioUrl('');
    setAudioName('');
    setAudioDuration(0);
    setAudioCustomUrlInput('');
    setVideoUrl('');
    setVideoCaption('');
    setVideoCustomUrlInput('');
    setIsPreviewPlaying(false);
    if (audioFileInputRef.current) {
      audioFileInputRef.current.value = '';
    }
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
    setLocation('কলকাতা');
    setAuthorName('বার্তা প্রহর ২৪ ডিজিটাল ডেস্ক');
    setParagraphsText('');
    setIsBreaking(false);
    setStatusBadgeText('আপডেট: তথ্য যাচাইকৃত');
    setStatusBadgeType('safe');
  };

  const handleEditSelect = (art: NewsArticle) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle || '');
    setCategory(art.category || 'বিনোদন');
    setImageUrl(art.featuredImage?.url || '');
    setImageCaption(art.featuredImage?.caption || '');
    setAdditionalImages(art.galleryImages || (art.secondaryImage ? [art.secondaryImage] : []));
    setAudioUrl(art.audioUrl || '');
    setAudioName(art.audioName || '');
    setAudioDuration(art.audioDuration || 0);
    setAudioCustomUrlInput(art.audioUrl && !art.audioUrl.startsWith('data:') ? art.audioUrl : '');
    setVideoUrl(art.videoUrl || '');
    setVideoCaption(art.videoCaption || '');
    setVideoCustomUrlInput(art.videoUrl && !art.videoUrl.startsWith('data:') ? art.videoUrl : '');
    setLocation(art.location || 'কলকাতা');
    setAuthorName(art.author?.name || 'বার্তা প্রহর ২৪ ডিজিটাল ডেস্ক');
    setParagraphsText(art.paragraphs ? art.paragraphs.join('\n\n') : '');
    setIsBreaking(!!art.isBreaking);
    setStatusBadgeText(art.statusBadge?.text || 'আপডেট: তথ্য যাচাইকৃত');
    setStatusBadgeType(art.statusBadge?.type || 'safe');
    setActiveTab('create');
  };

  // Handle local file upload for primary image with automatic smart compression
  const handlePrimaryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingMedia(true);
      try {
        const compressedBase64 = await compressImageFile(file, 1200, 0.82);
        setImageUrl(compressedBase64);
        if (!imageCaption) {
          setImageCaption(file.name.replace(/\.[^/.]+$/, ''));
        }
      } catch (err) {
        console.error('Image compression error:', err);
        // Fallback to FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsProcessingMedia(false);
      }
    }
  };

  // Handle local file upload for multiple gallery images with smart compression
  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsProcessingMedia(true);
      try {
        const fileList: File[] = Array.from(files);
        for (const file of fileList) {
          const compressed = await compressImageFile(file, 1000, 0.8);
          setAdditionalImages(prev => [
            ...prev,
            {
              url: compressed,
              caption: file.name.replace(/\.[^/.]+$/, ''),
              alt: file.name.replace(/\.[^/.]+$/, ''),
              credit: 'সংগৃহীত চিত্র'
            }
          ]);
        }
      } catch (err) {
        console.error('Gallery compression error:', err);
      } finally {
        setIsProcessingMedia(false);
        if (galleryFileInputRef.current) {
          galleryFileInputRef.current.value = '';
        }
      }
    }
  };

  const handleAddGalleryUrlImage = () => {
    if (newAddImageUrl.trim()) {
      setAdditionalImages(prev => [
        ...prev,
        {
          url: newAddImageUrl.trim(),
          caption: newAddImageCaption.trim() || 'সংবাদের অতিরিক্ত চিত্র',
          alt: newAddImageCaption.trim() || 'সংবাদের অতিরিক্ত চিত্র',
          credit: 'ফাইল চিত্র / BARTA PROHOR 24'
        }
      ]);
      setNewAddImageUrl('');
      setNewAddImageCaption('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, idx) => idx !== index));
  };

  // --- VIDEO MANAGEMENT HANDLERS ---
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (recommend under 40MB for direct file)
      if (file.size > 50 * 1024 * 1024) {
        alert('ভিডিও ফাইলের সাইজ ৫০MB-র চেয়ে বড়! দ্রুত লোডিংয়ের জন্য YouTube বা অনলাইন লিঙ্ক ব্যবহার করার পরামর্শ দেওয়া হচ্ছে।');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setVideoUrl(reader.result);
          if (!videoCaption) {
            setVideoCaption(file.name.replace(/\.[^/.]+$/, ''));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyVideoUrl = () => {
    if (videoCustomUrlInput.trim()) {
      setVideoUrl(videoCustomUrlInput.trim());
      if (!videoCaption) {
        setVideoCaption('সংবাদের এক্সক্লুসিভ ভিডিও রিপোর্ট');
      }
    }
  };

  const handleDeleteVideo = () => {
    setVideoUrl('');
    setVideoCaption('');
    setVideoCustomUrlInput('');
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
  };

  // --- AUDIO VOICE MANAGEMENT HANDLERS ---
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          setAudioUrl(dataUrl);
          setAudioName(file.name);
          
          // Calculate audio duration from file
          const tempAudio = new Audio(dataUrl);
          tempAudio.onloadedmetadata = () => {
            if (tempAudio.duration && !isNaN(tempAudio.duration)) {
              setAudioDuration(Math.floor(tempAudio.duration));
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAudioUrl = () => {
    if (audioCustomUrlInput.trim()) {
      setAudioUrl(audioCustomUrlInput.trim());
      setAudioName('ওয়েব অডিও ফাইল / পডকাস্ট');
      const tempAudio = new Audio(audioCustomUrlInput.trim());
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          setAudioDuration(Math.floor(tempAudio.duration));
        }
      };
    }
  };

  const handleDeleteAudio = () => {
    if (formAudioRef.current) {
      formAudioRef.current.pause();
    }
    setAudioUrl('');
    setAudioName('');
    setAudioDuration(0);
    setAudioCustomUrlInput('');
    setIsPreviewPlaying(false);
    if (audioFileInputRef.current) {
      audioFileInputRef.current.value = '';
    }
  };

  // Live Voice Recording with Microphone
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setAudioUrl(reader.result);
            setAudioName(`লাইভ ভয়েস রেকর্ড (${recordingSeconds}s)`);
            setAudioDuration(recordingSeconds || 30);
          }
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('মাইক্রোফোন চালু করা যায়নি! অনুগ্রহ করে ব্রাউজারের মাইক্রোফোন পারমিশন চেক করুন।');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  // Toggle preview player inside form
  const toggleFormAudioPreview = () => {
    if (!formAudioRef.current) return;
    if (isPreviewPlaying) {
      formAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      formAudioRef.current.play().then(() => {
        setIsPreviewPlaying(true);
      }).catch(err => {
        console.error('Preview error:', err);
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const rawParagraphs = paragraphsText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const paragraphs = rawParagraphs.length > 0 
      ? rawParagraphs 
      : [subtitle || title];

    const newOrUpdatedArticle: NewsArticle = {
      id: editingId || `art_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || title.trim(),
      category: category,
      isBreaking: isBreaking,
      publishedAt: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'এইমাত্র আপডেট করা হয়েছে',
      author: {
        name: authorName || 'বার্তা প্রহর ২৪ ডিজিটাল ডেস্ক',
        role: 'চিফ করেসপন্ডেন্ট',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      location: location || 'কলকাতা',
      readTime: '২ মিনিট পাঠ',
      statusBadge: {
        text: statusBadgeText,
        type: statusBadgeType,
      },
      featuredImage: imageUrl.trim() ? {
        url: imageUrl.trim(),
        caption: imageCaption.trim() || title.trim(),
        credit: 'ফাইল চিত্র / BARTA PROHOR 24 ডিজিটাল ডেস্ক',
        alt: title.trim(),
      } : undefined,
      secondaryImage: additionalImages.length > 0 ? additionalImages[0] : undefined,
      galleryImages: additionalImages.length > 0 ? additionalImages : undefined,
      audioUrl: audioUrl.trim() || undefined,
      audioName: audioName.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      videoCaption: videoCaption.trim() || undefined,
      paragraphs: paragraphs,
      keyHighlights: [
        'তাৎক্ষণিক সংবাদ আপডেট বার্তা প্রহর ২৪ ডিজিটালে প্রকাশিত।',
        'উৎস ও প্রশাসনের দেওয়া খবরের ভিত্তিতে প্রতিবেদন তৈরি করা হয়েছে।',
        'আরও তথ্যের জন্য চোখ রাখুন বার্তা প্রহর ২৪ লাইভ নিউজডেস্কে।'
      ],
      familyStatement: '“আমরা পরিস্থিতির ওপর সজাগ নজর রাখছি এবং পাঠকদের সব খবর সবার আগে পৌঁছে দিতে দায়বদ্ধ।” — বার্তা প্রহর ২৪ সম্পাদকীয় বিভাগ',
      timeline: [
        {
          time: 'এইমাত্র',
          title: 'সংবাদ প্রকাশনা সম্পন্ন',
          description: 'বার্তা প্রহর ২৪ পোর্টালে সরাসরি লাইভ করা হলো।',
          tag: 'পাবলিশড'
        }
      ],
      helplineData: [
        {
          title: 'বার্তা প্রহর ২৪ সেন্ট্রাল নিউজডেস্ক',
          phone: '+91 98300 24240',
          agency: 'BARTA PROHOR 24 হেল্পলাইন',
          note: 'যেকোনো তাজা খবর বা মতামত জানাতে সরাসরি কল বা হোয়াটসঅ্যাপ করুন।'
        }
      ],
      audioDuration: audioDuration > 0 ? audioDuration : Math.max(45, paragraphs.length * 20),
      tags: [category, 'ব্রেকিং', 'তাজা খবর', 'BartaProhor24'],
    };

    onSaveArticle(newOrUpdatedArticle);
    setSuccessToast(editingId ? 'সংবাদটি সফলভাবে আপডেট করা হয়েছে!' : 'নতুন খবর সফলভাবে প্রকাশিত হয়েছে!');
    setTimeout(() => setSuccessToast(''), 3500);

    resetForm();
    onSelectArticle(newOrUpdatedArticle);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[#f8f7f2] rounded-none sm:rounded-xs max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-2 border-[#1a1a1a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white p-4 sm:p-5 flex items-center justify-between border-b-3 border-b-[#b91c1c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#b91c1c] flex items-center justify-center text-white font-black text-sm font-['Playfair_Display',serif]">
              BP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-['Noto_Serif_Bengali']">
                  বার্তা প্রহর ২৪ • সেন্ট্রাল নিউজডেস্ক কন্ট্রোল প্যানেল
                </h3>
                <span className="bg-[#064e3b] text-[#6ee7b7] text-[10px] font-bold px-2 py-0.5 rounded-xs border border-[#059669]">
                  Live Admin
                </span>
              </div>
              <p className="text-xs text-[#a3a3a3] font-['Noto_Serif_Bengali']">
                খবর প্রকাশ, ভিডিও, অডিও ভয়েস বুলেটিন আপলোড, এডিট ও বিনামূল্যে হোস্টিং গাইড
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xs bg-[#262626] hover:bg-[#b91c1c] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer border border-[#404040]"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          isForgotPassword ? (
            /* Forgot Password / Recovery Flow */
            <ForgotPasswordView
              onBackToLogin={() => setIsForgotPassword(false)}
              onResetSuccess={(newPass) => {
                setAdminPin(newPass);
                setIsAuthenticated(true);
                sessionStorage.setItem('bp24_admin_logged', 'true');
                setIsForgotPassword(false);
                setResetNotification('আপনার নতুন পাসওয়ার্ড সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে এবং আপনি স্বয়ংক্রিয়ভাবে লগইন হয়েছেন!');
                setTimeout(() => setResetNotification(''), 6000);
              }}
            />
          ) : (
            /* Login Screen */
            <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-5 flex-1">
              <div className="w-16 h-16 rounded-full bg-[#fef2f2] border-2 border-[#f87171] text-[#b91c1c] flex items-center justify-center shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-lg font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">
                  নিউজ এডিটর পাসওয়ার্ড প্রবেশ করান
                </h4>
                <p className="text-xs text-[#525252] font-['Noto_Serif_Bengali']">
                  সুরক্ষার জন্য শুধুমাত্র অনুমোদিত সম্পাদকদের জন্য এই ড্যাশবোর্ডটি সংরক্ষিত।
                </p>
              </div>

              {resetNotification && (
                <div className="p-3 max-w-xs w-full bg-[#ecfdf5] border border-[#a7f3d0] rounded-xs text-[#065f46] text-xs font-bold font-['Noto_Serif_Bengali'] flex items-center gap-1.5 justify-center text-left">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>{resetNotification}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    maxLength={30}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full text-center tracking-widest text-base font-mono bg-white border-2 border-[#ded8cb] focus:border-[#b91c1c] p-2.5 pr-10 rounded-xs focus:outline-hidden text-[#1a1a1a]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1a1a1a] p-1 cursor-pointer"
                    title={showLoginPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <div className="p-2.5 bg-[#fef2f2] border border-[#fca5a5] rounded-xs text-[#b91c1c] text-xs font-bold font-['Noto_Serif_Bengali'] flex items-start gap-1.5 text-left">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-2.5 px-4 rounded-xs font-bold text-xs cursor-pointer border border-[#7f1d1d] font-['Noto_Serif_Bengali'] flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>নিউজডেস্কে প্রবেশ করুন</span>
                </button>

                {/* Forgot Password Link Button */}
                <div className="pt-2 border-t border-[#ded8cb] flex flex-col items-center gap-1.5 font-['Noto_Serif_Bengali']">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setAuthError('');
                    }}
                    className="text-xs text-[#b91c1c] hover:text-[#991b1b] font-bold hover:underline cursor-pointer flex items-center gap-1.5 py-1 px-2 rounded-xs hover:bg-[#fef2f2]"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>পাসওয়ার্ড ভুলে গেছেন? (Forgot Password / Reset)</span>
                  </button>

                  <div className="text-[11px] text-[#737373] flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                    <span>ডেটাবেজ সংরক্ষিত অ্যাডমিন সিস্টেম</span>
                  </div>
                </div>
              </form>
            </div>
          )
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="bg-[#f3efe6] border-b border-[#ded8cb] px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] cursor-pointer ${
                    activeTab === 'create'
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-white text-[#525252] border border-[#ded8cb] hover:bg-[#eae5db]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{editingId ? 'সংবাদ এডিট করুন' : '+ নতুন খবর লিখুন'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('list')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] cursor-pointer ${
                    activeTab === 'list'
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-white text-[#525252] border border-[#ded8cb] hover:bg-[#eae5db]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>সকল প্রকাশিত খবর ({articles.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('subscribers')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] cursor-pointer ${
                    activeTab === 'subscribers'
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-white text-[#525252] border border-[#ded8cb] hover:bg-[#eae5db]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#059669]" />
                  <span>পাঠক ডাটাবেস ({subscribers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('guide')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] cursor-pointer ${
                    activeTab === 'guide'
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-white text-[#525252] border border-[#ded8cb] hover:bg-[#eae5db]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#2563eb]" />
                  <span>ফ্রি হোস্টিং ও লাইভ গাইড</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-white text-[#525252] border border-[#ded8cb] hover:bg-[#eae5db]'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>পিন পরিবর্তন</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenQRModal}
                  className="bg-[#1a1a1a] hover:bg-[#333333] text-[#fbbf24] px-2.5 py-1 rounded-xs text-xs font-bold flex items-center gap-1 cursor-pointer border border-[#333333] font-['Noto_Serif_Bengali']"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR কোড দেখুন</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="text-xs text-[#525252] hover:text-[#b91c1c] p-1.5 flex items-center gap-1 cursor-pointer font-['Noto_Serif_Bengali']"
                  title="লগ আউট"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগ আউট</span>
                </button>
              </div>
            </div>

            {/* Success Toast Banner */}
            {successToast && (
              <div className="bg-[#ecfdf5] border-b border-[#a7f3d0] text-[#065f46] px-4 py-2 text-xs font-bold flex items-center gap-2 shrink-0 font-['Noto_Serif_Bengali']">
                <Check className="w-4 h-4 text-[#059669]" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Tab 1: Create / Edit News Form */}
            {activeTab === 'create' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Title & Subtitle */}
                  <div className="space-y-3 bg-white p-4 rounded-xs border border-[#ded8cb]">
                    <h4 className="text-xs font-black uppercase text-[#b91c1c] tracking-wider font-['Noto_Serif_Bengali']">
                      ১. খবরের মূল শিরোনাম ও বিবরণ
                    </h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                        মূল শিরোনাম (Headline) <span className="text-[#b91c1c]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="উদাঃ নেপালে শুটিংয়ে গিয়ে বন্যায় আটকে টলিউড অভিনেতা খরাজ মুখোপাধ্যায়..."
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs sm:text-sm font-bold text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                        উপ-শিরোনাম / সংক্ষিপ্ত ভূমিকা (Subtitle)
                      </label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="উদাঃ ভারী বর্ষণে পাহাড়ি পথ অবরুদ্ধ, স্ত্রী প্রতিভা মুখোপাধ্যায় সহ নিরাপদে রয়েছেন অভিনেতা"
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#262626] focus:outline-hidden focus:border-[#b91c1c]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                          বিভাগ (Category)
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                        >
                          <option value="বিনোদন">বিনোদন ও সিনেমা</option>
                          <option value="দেশ-বিদেশ">দেশ-বিদেশ</option>
                          <option value="রাজ্য">রাজ্য সংবাদ</option>
                          <option value="রাজনীতি">রাজনীতি</option>
                          <option value="আবহাওয়া ও দুর্যোগ">আবহাওয়া ও দুর্যোগ</option>
                          <option value="খেলাধুলা">খেলাধুলা</option>
                          <option value="ভিডিও ও লাইভ">ভিডিও ও লাইভ</option>
                          <option value="বিশেষ সম্পাদকীয়">বিশেষ সম্পাদকীয়</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                          স্থান (Location)
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="উদাঃ কলকাতা / কাঠমান্ডু"
                          className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                          প্রতিবেদক / ব্যুরো
                        </label>
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="উদাঃ বিশেষ সংবাদদাতা"
                          className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image & Photo Upload Section */}
                  <div className="space-y-4 bg-white p-4 sm:p-5 rounded-xs border border-[#ded8cb]">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ded8cb] pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-xs bg-[#fef2f2] text-[#b91c1c]">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-[#b91c1c] tracking-wider font-['Noto_Serif_Bengali']">
                            ২. খবরের প্রধান ও একাধিক ছবি (Photo Upload & Gallery)
                          </h4>
                          <p className="text-[11px] text-[#737373]">
                            ডিভাইস থেকে ছবি আপলোড করুন অথবা সরাসরি ওয়েব লিংক ব্যবহার করুন
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-[#f3efe6] text-[#525252] font-mono px-2 py-0.5 rounded-xs border border-[#ded8cb]">
                        JPG / PNG / WEBP
                      </span>
                    </div>

                    {/* Primary Photo Section */}
                    <div className="space-y-3 p-3.5 bg-[#fbf9f4] rounded-xs border border-[#ded8cb]">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5 font-['Noto_Serif_Bengali']">
                          <span>প্রধান ছবি (Main Featured Image)</span>
                          <span className="text-[#b91c1c]">*</span>
                        </label>
                        {imageUrl && (
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="text-[11px] text-[#b91c1c] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>ছবি মুছুন</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#525252] font-['Noto_Serif_Bengali']">
                            ডিভাইস থেকে ছবি আপলোড করুন:
                          </span>
                          <input
                            ref={primaryFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePrimaryFileChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => primaryFileInputRef.current?.click()}
                            className="w-full py-2.5 px-3 bg-white hover:bg-[#f3efe6] border-2 border-dashed border-[#ded8cb] hover:border-[#b91c1c] rounded-xs text-xs font-bold text-[#1a1a1a] flex items-center justify-center gap-2 transition-colors cursor-pointer font-['Noto_Serif_Bengali']"
                          >
                            <Upload className="w-4 h-4 text-[#b91c1c]" />
                            <span>ফোন/পিসি থেকে ছবি বাছুন</span>
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#525252] font-['Noto_Serif_Bengali']">
                            অথবা ছবির ওয়েব লিংক দিন:
                          </span>
                          <input
                            type="url"
                            value={imageUrl.startsWith('data:') ? '' : imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] font-mono focus:outline-hidden focus:border-[#b91c1c]"
                          />
                        </div>
                      </div>

                      {imageUrl && (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-xs border border-[#ded8cb]">
                          <img
                            src={imageUrl}
                            alt="Primary Preview"
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xs border border-[#ded8cb] shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                              <Check className="w-3.5 h-3.5" />
                              <span>প্রধান ছবি সংযুক্ত হয়েছে</span>
                            </div>
                            <input
                              type="text"
                              value={imageCaption}
                              onChange={(e) => setImageCaption(e.target.value)}
                              placeholder="ছবির ক্যাপশন লিখুন..."
                              className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-2.5 py-1 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Multiple Additional Photos Section */}
                    <div className="space-y-3 p-3.5 bg-[#fbf9f4] rounded-xs border border-[#ded8cb]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-[#1d4ed8]" />
                          <label className="text-xs font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">
                            অতিরিক্ত ছবি ও গ্যালারি (Multiple Additional Photos)
                          </label>
                        </div>
                        <span className="text-[11px] font-bold text-[#1d4ed8] font-mono">
                          {additionalImages.length} টি ছবি যুক্ত
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            ref={galleryFileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryFileChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => galleryFileInputRef.current?.click()}
                            className="w-full py-2 px-3 bg-white hover:bg-[#f3efe6] border border-[#ded8cb] hover:border-[#1d4ed8] rounded-xs text-xs font-bold text-[#1a1a1a] flex items-center justify-center gap-2 transition-colors cursor-pointer font-['Noto_Serif_Bengali']"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#1d4ed8]" />
                            <span>একাধিক ছবি আপলোড করুন</span>
                          </button>
                        </div>

                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            value={newAddImageUrl}
                            onChange={(e) => setNewAddImageUrl(e.target.value)}
                            placeholder="ছবির লিংক দিন (URL)"
                            className="flex-1 bg-white border border-[#ded8cb] rounded-xs px-2.5 py-1.5 text-xs text-[#1a1a1a] font-mono focus:outline-hidden focus:border-[#1d4ed8]"
                          />
                          <button
                            type="button"
                            onClick={handleAddGalleryUrlImage}
                            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-3 py-1.5 rounded-xs text-xs font-bold cursor-pointer shrink-0"
                          >
                            যোগ করুন
                          </button>
                        </div>
                      </div>

                      {additionalImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
                          {additionalImages.map((img, idx) => (
                            <div key={idx} className="relative group bg-white border border-[#ded8cb] rounded-xs p-1.5 shadow-2xs space-y-1">
                              <img
                                src={img.url}
                                alt={img.alt || `Gallery Image ${idx + 1}`}
                                className="w-full h-20 object-cover rounded-xs border border-[#ded8cb]"
                              />
                              <input
                                type="text"
                                value={img.caption}
                                onChange={(e) => {
                                  const updated = [...additionalImages];
                                  updated[idx] = { ...updated[idx], caption: e.target.value, alt: e.target.value };
                                  setAdditionalImages(updated);
                                }}
                                placeholder="ক্যাপশন দিন"
                                className="w-full text-[10px] bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-1.5 py-0.5 focus:outline-hidden"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                                title="ছবি মুছুন"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- NEW SECTION 3: AUDIO VOICE NEWS UPLOAD, RECORD & DELETE --- */}
                  <div className="space-y-4 bg-white p-4 sm:p-5 rounded-xs border border-[#ded8cb]">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ded8cb] pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xs bg-[#ecfdf5] text-[#059669]">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-[#059669] tracking-wider font-['Noto_Serif_Bengali'] flex items-center gap-1.5">
                            <span>৩. অডিও / ভয়েস সংবাদ বুলেটিন (Audio Voice Bulletin)</span>
                            <span className="text-[10px] bg-[#dcfce7] text-[#15803d] px-1.5 py-0.2 rounded-xs font-bold">
                              নতুন ফিচার
                            </span>
                          </h4>
                          <p className="text-[11px] text-[#737373]">
                            সংবাদের অডিও ভয়েস ফাইল আপলোড করুন, সরাসরি রেকর্ড করুন অথবা মুছে ফেলুন
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-[#f3efe6] text-[#525252] font-mono px-2 py-0.5 rounded-xs border border-[#ded8cb]">
                        MP3 / WAV / M4A / WEBM / OGG
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#fbf9f4] rounded-xs border border-[#ded8cb] space-y-3.5">
                      {/* Hidden File Input for Audio */}
                      <input
                        ref={audioFileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="hidden"
                      />

                      {/* 3 Upload/Record Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Option 1: Upload from Device */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#525252] font-['Noto_Serif_Bengali'] block">
                            ১. ডিভাইস থেকে অডিও ফাইল আপলোড:
                          </span>
                          <button
                            type="button"
                            onClick={() => audioFileInputRef.current?.click()}
                            className="w-full py-2.5 px-3 bg-white hover:bg-[#ecfdf5] border-2 border-dashed border-[#a7f3d0] hover:border-[#059669] rounded-xs text-xs font-bold text-[#065f46] flex items-center justify-center gap-2 transition-colors cursor-pointer font-['Noto_Serif_Bengali']"
                          >
                            <Upload className="w-4 h-4 text-[#059669]" />
                            <span>ফোন/পিসি থেকে অডিও বাছুন</span>
                          </button>
                        </div>

                        {/* Option 2: Live Voice Recording via Microphone */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#525252] font-['Noto_Serif_Bengali'] block">
                            ২. সরাসরি ভয়েস রেকর্ড করুন:
                          </span>
                          {isRecording ? (
                            <button
                              type="button"
                              onClick={stopVoiceRecording}
                              className="w-full py-2.5 px-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xs text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer animate-pulse font-['Noto_Serif_Bengali'] shadow-xs"
                            >
                              <StopCircle className="w-4 h-4" />
                              <span>রেকর্ড বন্ধ করুন ({recordingSeconds}s)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={startVoiceRecording}
                              className="w-full py-2.5 px-3 bg-white hover:bg-[#fef2f2] border-2 border-dashed border-[#fca5a5] hover:border-[#b91c1c] rounded-xs text-xs font-bold text-[#b91c1c] flex items-center justify-center gap-2 transition-colors cursor-pointer font-['Noto_Serif_Bengali']"
                            >
                              <Mic className="w-4 h-4 text-[#b91c1c]" />
                              <span>মাইক্রোফোনে রেকর্ড শুরু</span>
                            </button>
                          )}
                        </div>

                        {/* Option 3: External Audio URL */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#525252] font-['Noto_Serif_Bengali'] block">
                            ৩. অথবা অডিও ওয়েব লিঙ্ক দিন:
                          </span>
                          <div className="flex gap-1">
                            <input
                              type="url"
                              value={audioCustomUrlInput}
                              onChange={(e) => setAudioCustomUrlInput(e.target.value)}
                              placeholder="https://...audio.mp3"
                              className="flex-1 bg-white border border-[#ded8cb] rounded-xs px-2 py-1 text-xs text-[#1a1a1a] font-mono focus:outline-hidden focus:border-[#059669]"
                            />
                            <button
                              type="button"
                              onClick={handleAddAudioUrl}
                              className="bg-[#059669] hover:bg-[#047857] text-white px-2.5 py-1 rounded-xs text-xs font-bold cursor-pointer shrink-0"
                            >
                              যোগ
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Audio Player Preview & DELETE Section */}
                      {audioUrl ? (
                        <div className="bg-white border-2 border-[#a7f3d0] rounded-xs p-3.5 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e7eb] pb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xs bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                                <Headphones className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[#065f46] font-['Noto_Serif_Bengali'] flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-[#059669]" />
                                  <span>ভয়েস সংবাদ বুলেটিন সংযুক্ত হয়েছে</span>
                                </div>
                                <div className="text-[11px] text-[#6b7280] font-mono">
                                  {audioName || 'অডিও ফাইল'} {audioDuration > 0 ? `(${audioDuration} সেকেন্ড)` : ''}
                                </div>
                              </div>
                            </div>

                            {/* DELETE AUDIO BUTTON */}
                            <button
                              type="button"
                              onClick={handleDeleteAudio}
                              className="bg-[#fef2f2] hover:bg-[#b91c1c] text-[#b91c1c] hover:text-white border border-[#fca5a5] hover:border-[#b91c1c] px-3 py-1.5 rounded-xs text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer font-['Noto_Serif_Bengali'] shadow-2xs"
                              title="সংযুক্ত অডিও ফাইলটি ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>অডিও মুছুন / ডিলিট করুন</span>
                            </button>
                          </div>

                          {/* Interactive Preview Player */}
                          <div className="flex items-center gap-3 bg-[#f8f7f2] p-2.5 rounded-xs border border-[#ded8cb]">
                            <audio
                              ref={formAudioRef}
                              src={audioUrl}
                              onEnded={() => setIsPreviewPlaying(false)}
                            />

                            <button
                              type="button"
                              onClick={toggleFormAudioPreview}
                              className="p-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xs cursor-pointer flex items-center gap-1 text-xs font-bold shadow-xs shrink-0"
                            >
                              {isPreviewPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" />
                                  <span>থামুন</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5" />
                                  <span>প্লে করে শুনুন</span>
                                </>
                              )}
                            </button>

                            <div className="flex-1 text-[11px] text-[#525252] font-['Noto_Serif_Bengali']">
                              {isPreviewPlaying ? 'অডিও প্রিভিউ চলছে...' : 'প্রকাশ করার পূর্বে অডিওটি প্লে করে যাচাই করে নিন।'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#6b7280] font-['Noto_Serif_Bengali'] bg-white p-2.5 rounded-xs border border-dashed border-[#ded8cb] flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-[#9ca3af]" />
                          <span>(ঐচ্ছিক) কোনো অডিও ফাইল যোগ না করলে সিস্টেম স্বয়ংক্রিয় এআই ভয়েস রিডার ব্যবহার করবে।</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- NEW SECTION 4: VIDEO NEWS (YouTube, Facebook, Vimeo, MP4 direct) --- */}
                  <div className="space-y-4 bg-white p-4 sm:p-5 rounded-xs border border-[#ded8cb]">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ded8cb] pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xs bg-[#fef2f2] text-[#b91c1c]">
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-[#b91c1c] tracking-wider font-['Noto_Serif_Bengali'] flex items-center gap-1.5">
                            <span>৪. ভিডিও সংবাদ যুক্ত করুন (Video News / YouTube / Direct MP4)</span>
                            <span className="text-[10px] bg-[#fee2e2] text-[#b91c1c] px-1.5 py-0.2 rounded-xs font-bold">
                              নতুন
                            </span>
                          </h4>
                          <p className="text-[11px] text-[#737373]">
                            YouTube লিংক, Facebook ভিডিও, অথবা সরাসরি ভিডিও ফাইল যুক্ত করুন
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-[#f3efe6] text-[#525252] font-mono px-2 py-0.5 rounded-xs border border-[#ded8cb]">
                        YouTube / MP4 / FB / Vimeo
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#fbf9f4] rounded-xs border border-[#ded8cb] space-y-3.5">
                      {/* Hidden Video File Input */}
                      <input
                        ref={videoFileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />

                      {/* Video Link and Upload inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8 flex gap-1.5">
                          <input
                            type="text"
                            value={videoCustomUrlInput}
                            onChange={(e) => setVideoCustomUrlInput(e.target.value)}
                            placeholder="ইউটিউব বা ভিডিও লিঙ্ক দিন (উদাঃ https://youtu.be/... বা mp4 লিঙ্ক)"
                            className="flex-1 bg-white border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] font-mono focus:outline-hidden focus:border-[#b91c1c]"
                          />
                          <button
                            type="button"
                            onClick={handleApplyVideoUrl}
                            className="bg-[#b91c1c] hover:bg-[#991b1b] text-white px-3.5 py-2 rounded-xs text-xs font-bold cursor-pointer shrink-0 font-['Noto_Serif_Bengali']"
                          >
                            যুক্ত করুন
                          </button>
                        </div>

                        <div className="sm:col-span-4">
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="w-full py-2 px-3 bg-white hover:bg-[#f3efe6] border border-[#ded8cb] hover:border-[#b91c1c] rounded-xs text-xs font-bold text-[#1a1a1a] flex items-center justify-center gap-2 transition-colors cursor-pointer font-['Noto_Serif_Bengali']"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#b91c1c]" />
                            <span>ডিভাইস থেকে ভিডিও আপলোড</span>
                          </button>
                        </div>
                      </div>

                      {/* Live Video Preview Box if videoUrl is set */}
                      {videoUrl ? (
                        <div className="space-y-3 p-3 bg-white rounded-xs border-2 border-[#b91c1c]/40">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
                              <span className="text-xs font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">
                                ভিডিও সফলভাবে সংযুক্ত হয়েছে
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={handleDeleteVideo}
                              className="text-xs bg-[#fef2f2] hover:bg-[#b91c1c] text-[#b91c1c] hover:text-white px-2.5 py-1 rounded-xs border border-[#fca5a5] flex items-center gap-1 transition-colors cursor-pointer font-['Noto_Serif_Bengali']"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>ভিডিও মুছুন</span>
                            </button>
                          </div>

                          {/* Responsive 16:9 Live Preview */}
                          <div className="relative w-full aspect-video max-h-72 bg-black rounded-xs overflow-hidden border border-[#ded8cb] flex items-center justify-center">
                            {parseVideoUrl(videoUrl)?.isIframe ? (
                              <iframe
                                src={parseVideoUrl(videoUrl)?.embedUrl}
                                title="Video Preview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            ) : (
                              <video
                                src={videoUrl}
                                controls
                                playsInline
                                className="w-full h-full object-contain"
                              >
                                আপনার ব্রাউজার ভিডিও প্লে করতে পারছে না।
                              </video>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                              ভিডিও বিবরণ বা ক্যাপশন (Video Caption)
                            </label>
                            <input
                              type="text"
                              value={videoCaption}
                              onChange={(e) => setVideoCaption(e.target.value)}
                              placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত বিবরণ বা ক্রেডিট লিখুন..."
                              className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-1.5 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#6b7280] font-['Noto_Serif_Bengali'] bg-white p-2.5 rounded-xs border border-dashed border-[#ded8cb] flex items-center gap-2">
                          <Video className="w-4 h-4 text-[#9ca3af]" />
                          <span>(ঐচ্ছিক) সংবাদে কোনো ভিডিও থাকলে এখানে YouTube লিংক বা MP4 যুক্ত করুন, যা সরাসরি আর্টিকেলে মোবাইল-রেসপন্সিভ প্লেয়ারে চলবে।</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="space-y-3 bg-white p-4 rounded-xs border border-[#ded8cb]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-[#b91c1c] tracking-wider font-['Noto_Serif_Bengali']">
                        ৫. খবরের বিস্তারিত বিষয়বস্তু (প্রতিটি প্যারাগ্রাফ নতুন লাইনে লিখুন)
                      </h4>
                      <span className="text-[11px] text-[#737373]">Enter দিয়ে প্যারা আলাদা করুন</span>
                    </div>

                    <textarea
                      rows={6}
                      required
                      value={paragraphsText}
                      onChange={(e) => setParagraphsText(e.target.value)}
                      placeholder="এখানে খবরের বিস্তারিত লিখুন...&#10;&#10;দ্বিতীয় প্যারাগ্রাফ এখানে লিখুন...&#10;&#10;তৃতীয় প্যারাগ্রাফ এখানে লিখুন..."
                      className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs p-3 text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c] leading-relaxed"
                    />
                  </div>

                  {/* Settings & Flags */}
                  <div className="space-y-3 bg-white p-4 rounded-xs border border-[#ded8cb] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#1a1a1a] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBreaking}
                          onChange={(e) => setIsBreaking(e.target.checked)}
                          className="accent-[#b91c1c] w-4 h-4"
                        />
                        <span className="font-['Noto_Serif_Bengali']">ব্রেকিং নিউজ হিসেবে টিকার-এ দেখান</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-white border border-[#ded8cb] text-[#525252] hover:text-[#1a1a1a] text-xs font-bold rounded-xs cursor-pointer font-['Noto_Serif_Bengali']"
                      >
                        ফর্ম ক্লিয়ার করুন
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-bold rounded-xs cursor-pointer border border-[#7f1d1d] flex items-center gap-1.5 shadow-xs font-['Noto_Serif_Bengali']"
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingId ? 'আপডেট সম্পন্ন করুন' : 'সরাসরি খবর প্রকাশ করুন'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Manage Articles List */}
            {activeTab === 'list' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#ded8cb]">
                  <h4 className="font-bold text-sm font-['Noto_Serif_Bengali']">
                    আপনার প্রকাশিত সব খবর ({articles.length})
                  </h4>
                  <button
                    onClick={() => { setActiveTab('create'); resetForm(); }}
                    className="bg-[#b91c1c] text-white text-xs font-bold px-3 py-1.5 rounded-xs flex items-center gap-1 cursor-pointer font-['Noto_Serif_Bengali']"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>নতুন খবর লিখুন</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {articles.map((art) => {
                    const isCurrent = art.id === currentArticleId;
                    return (
                      <div
                        key={art.id}
                        className={`p-3.5 bg-white rounded-xs border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isCurrent ? 'border-2 border-[#b91c1c] bg-[#fffbfb]' : 'border-[#ded8cb]'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {art.featuredImage?.url ? (
                            <img
                              src={art.featuredImage.url}
                              alt={art.title}
                              className="w-16 h-12 object-cover rounded-xs border border-[#ded8cb] shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-[#f3efe6] rounded-xs border border-[#ded8cb] flex items-center justify-center text-xs text-[#737373] shrink-0">
                              ছবি নেই
                            </div>
                          )}

                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-[#fef2f2] text-[#991b1b] text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-[#fca5a5]">
                                {art.category}
                              </span>
                              <span className="text-[11px] text-[#737373]">{art.publishedAt}</span>
                              {art.audioUrl && (
                                <span className="bg-[#ecfdf5] text-[#065f46] text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-[#a7f3d0] flex items-center gap-1">
                                  <Mic className="w-2.5 h-2.5" />
                                  <span>অডিও আছে</span>
                                </span>
                              )}
                              {art.videoUrl && (
                                <span className="bg-[#eff6ff] text-[#1e40af] text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-[#bfdbfe] flex items-center gap-1">
                                  <Video className="w-2.5 h-2.5" />
                                  <span>ভিডিও আছে</span>
                                </span>
                              )}
                              {isCurrent && (
                                <span className="bg-[#1a1a1a] text-[#fbbf24] text-[10px] font-bold px-2 py-0.2 rounded-xs">
                                  ★ বর্তমানে প্রদর্শিত
                                </span>
                              )}
                            </div>
                            <h5 className="font-bold text-xs sm:text-sm text-[#1a1a1a] font-['Noto_Serif_Bengali'] line-clamp-1">
                              {art.title}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              onSelectArticle(art);
                              onClose();
                            }}
                            className="bg-[#1a1a1a] hover:bg-[#333333] text-white text-xs px-3 py-1.5 rounded-xs cursor-pointer font-['Noto_Serif_Bengali']"
                          >
                            ওয়েবসাইটে খুলুন
                          </button>
                          <button
                            onClick={() => handleEditSelect(art)}
                            className="bg-white border border-[#ded8cb] hover:border-[#b91c1c] text-[#1a1a1a] text-xs p-1.5 rounded-xs cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {articles.length > 1 && (
                            <button
                              onClick={() => onDeleteArticle(art.id)}
                              className="bg-white border border-[#fca5a5] text-[#b91c1c] hover:bg-[#fef2f2] text-xs p-1.5 rounded-xs cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Subscriber Database Management */}
            {activeTab === 'subscribers' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <SubscriberManager
                  subscribers={subscribers}
                  onAddSubscriber={onAddSubscriber}
                  onDeleteSubscriber={onDeleteSubscriber}
                  onToggleStatus={onToggleSubscriberStatus}
                />
              </div>
            )}

            {/* Tab 3: Free Hosting & Custom Domain Guide */}
            {activeTab === 'guide' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 font-['Noto_Serif_Bengali']">
                <div className="bg-[#fbf9f4] p-4 rounded-xs border border-[#ded8cb] space-y-2">
                  <h4 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#b91c1c]" />
                    <span>বিনামূল্যে ১ পয়সাও খরচ না করে ওয়েবসাইট লাইভ করার উপায় (Free Hosting):</span>
                  </h4>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    আপনার এই ওয়েবসাইটটি সম্পূর্ণ স্ট্যাটিক ও ক্লাউড-বান্ধব। আপনি কোনো টাকা না দিয়েই নিম্নলিখিত সার্ভারগুলোতে লাইভ চালাতে পারেন:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-2">
                    <div className="font-bold text-xs text-[#1a1a1a] flex items-center justify-between">
                      <span>১. Vercel (আপনার ওয়েবসাইট লাইভ রয়েছে)</span>
                      <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] px-1.5 py-0.5 rounded-xs font-bold">100% Free Live</span>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      আপনার লাইভ পোর্টাল লিংক: <strong className="text-[#b91c1c] font-mono text-[11px] block mt-0.5">https://barta-prohor-24-web.vercel.app/</strong>
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-2">
                    <div className="font-bold text-xs text-[#1a1a1a] flex items-center justify-between">
                      <span>২. Netlify</span>
                      <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] px-1.5 py-0.5 rounded-xs font-bold">100% Free</span>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      প্রজেক্টের বিল্ড ফোল্ডার বা গিটহাব কানেক্ট করলেই আজীবনের জন্য ফ্রি এসএসএল (HTTPS) সার্টিফিকেট সহ লাইভ চলবে।
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-2">
                    <div className="font-bold text-xs text-[#1a1a1a] flex items-center justify-between">
                      <span>৩. Cloudflare Pages</span>
                      <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] px-1.5 py-0.5 rounded-xs font-bold">100% Free</span>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      সীমাহীন ব্যান্ডউইথ ও অতিদ্রুত স্পিড। লক্ষ লক্ষ ভিজিটর আসলেও কখনো সার্ভার ডাউন হবে না।
                    </p>
                  </div>
                </div>

                {/* Steps to deploy */}
                <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-2.5">
                  <h5 className="font-bold text-xs text-[#1a1a1a]">
                    সহজে লাইভ ও শেয়ার করার ৩টি ধাপ:
                  </h5>
                  <ol className="list-decimal pl-5 text-xs text-[#525252] space-y-1.5 leading-relaxed">
                    <li>
                      <strong>কোড এক্সপোর্ট:</strong> স্ক্রিনের ওপরের মেনু থেকে <strong>Export to GitHub</strong> অথবা <strong>Download ZIP</strong> এ ক্লিক করুন।
                    </li>
                    <li>
                      <strong>Vercel বা Netlify-তে ইমপোর্ট:</strong> vercel.com এ গিয়ে "Add New Project" এ আপনার রিপোসিটরি সিলেক্ট করে Deploy চাপুন।
                    </li>
                    <li>
                      <strong>কিউআর কোড শেয়ার:</strong> আমাদের তৈরি কিউআর কোড জেনারেটর থেকে কিউআর কোডটি ডাউনলোড করে আপনার ফেসবুক, হোয়াটসঅ্যাপ বা ভিজিটিং কার্ডে ছাপিয়ে দিন।
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Tab 4: Password & Security Settings */}
            {activeTab === 'settings' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 font-['Noto_Serif_Bengali']">
                <div className="bg-white p-5 sm:p-6 rounded-xs border border-[#ded8cb] space-y-4 max-w-lg mx-auto shadow-xs">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#ded8cb] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center border border-[#fca5a5]">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-[#1a1a1a]">
                          অ্যাডমিন পাসওয়ার্ড ও নিরাপত্তা সেটিংস
                        </h4>
                        <p className="text-xs text-[#737373]">
                          নতুন পাসওয়ার্ড দিলে তা সরাসরি ডেটাবেজে সংরক্ষিত হয়ে যাবে
                        </p>
                      </div>
                    </div>

                    <span className="bg-[#ecfdf5] text-[#065f46] text-[10px] font-bold px-2.5 py-1 rounded-xs border border-[#a7f3d0] flex items-center gap-1">
                      <Database className="w-3 h-3 text-[#059669]" />
                      <span>ডেটাবেজ সক্রিয়</span>
                    </span>
                  </div>

                  {/* Current Password Info Box */}
                  <div className="bg-[#fcfbf9] p-3.5 rounded-xs border border-[#ded8cb] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-[#737373] block">বর্তমান সক্রিয় পাসওয়ার্ড:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <strong className="font-mono text-[#b91c1c] text-sm tracking-wider">
                          {showNewPassword ? adminPin : '••••••••'}
                        </strong>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-[#737373] hover:text-[#1a1a1a] p-0.5 cursor-pointer"
                          title={showNewPassword ? 'লুকান' : 'দেখুন'}
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#525252]" />}
                        </button>
                      </div>
                    </div>

                    {lastPasswordUpdated && (
                      <div className="text-[11px] text-[#525252] sm:text-right">
                        <span className="text-[#737373]">সর্বশেষ আপডেট:</span>
                        <div className="font-bold text-[#1a1a1a]">{lastPasswordUpdated}</div>
                      </div>
                    )}
                  </div>

                  {/* Success Alert */}
                  {pinChangeSuccess && (
                    <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xs text-[#065f46] text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>{pinChangeSuccess}</span>
                    </div>
                  )}

                  {/* Error Alert */}
                  {pinChangeError && (
                    <div className="p-3 bg-[#fef2f2] border border-[#fca5a5] rounded-xs text-[#b91c1c] text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-[#b91c1c] shrink-0 mt-0.5" />
                      <span>{pinChangeError}</span>
                    </div>
                  )}

                  {/* Password Update Form */}
                  <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                        নতুন পাসওয়ার্ড লিখুন (কমপক্ষে ৪ অক্ষর বা সংখ্যা):
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          maxLength={30}
                          required
                          value={newPinInput}
                          onChange={(e) => setNewPinInput(e.target.value)}
                          placeholder="যেমন: Barta2026 বা 7780"
                          className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 pr-10 text-sm font-mono text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1a1a1a] p-1 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                        নতুন পাসওয়ার্ড পুনরায় লিখুন (নিশ্চিতকরণ):
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        maxLength={30}
                        required
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="একই পাসওয়ার্ড আবার লিখুন"
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-sm font-mono text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold py-2.5 px-4 rounded-xs text-xs cursor-pointer border border-[#7f1d1d] flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>নতুন পাসওয়ার্ড ডেটাবেজে সংরক্ষণ করুন</span>
                    </button>
                  </form>

                  {/* Security Notice */}
                  <div className="bg-[#eff6ff] p-3 rounded-xs border border-[#bfdbfe] text-xs text-[#1e40af] space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                      <span>নিরাপত্তা পরামর্শ:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#1e3a8a]">
                      পাসওয়ার্ড পরিবর্তন করার সাথে সাথেই তা স্বয়ংক্রিয়ভাবে ব্রাউজার ও ডেটাবেজে সংরক্ষিত হয়ে যায়। পরিবর্তন করার পর আপনার নতুন পাসওয়ার্ডটি কোনো নিরাপদ স্থানে লিখে রাখুন।
                    </p>
                  </div>
                </div>

                {/* Card 2: Recovery Gmail Settings */}
                <div className="bg-white p-5 sm:p-6 rounded-xs border border-[#ded8cb] space-y-4 max-w-lg mx-auto shadow-xs">
                  <div className="flex items-center gap-3 border-b border-[#ded8cb] pb-3">
                    <div className="w-10 h-10 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center border border-[#bfdbfe]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#1a1a1a]">
                        অ্যাডমিন রিকভারি জিমেইল সেটিংস
                      </h4>
                      <p className="text-xs text-[#737373]">
                        পাসওয়ার্ড ভুলে গেলে ওটিপি (OTP) কোড এই জিমেইল অ্যাড্রেসে পাঠানো হবে
                      </p>
                    </div>
                  </div>

                  {recoverySaveSuccess && (
                    <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xs text-[#065f46] text-xs font-bold flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>{recoverySaveSuccess}</span>
                    </div>
                  )}

                  {/* Recovery Form */}
                  <form onSubmit={handleSaveRecoverySettings} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
                        নিবন্ধিত রিকভারি জিমেইল অ্যাড্রেস:
                      </label>
                      <input
                        type="email"
                        required
                        value={recoveryEmailState}
                        onChange={(e) => setRecoveryEmailState(e.target.value)}
                        placeholder="surajkhanghatal@gmail.com"
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs font-mono text-[#1a1a1a] focus:outline-hidden focus:border-[#2563eb]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2.5 px-4 rounded-xs text-xs cursor-pointer border border-[#1e40af] flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>রিকভারি জিমেইল সংরক্ষণ করুন</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
