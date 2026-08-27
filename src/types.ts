export interface ArticleImage {
  url: string;
  caption: string;
  credit?: string;
  alt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  subcategory?: string;
  isBreaking?: boolean;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  location: string;
  readTime: string;
  statusBadge: {
    text: string;
    type: 'safe' | 'warning' | 'critical' | 'info';
  };
  featuredImage?: ArticleImage;
  secondaryImage?: ArticleImage;
  galleryImages?: ArticleImage[];
  paragraphs: string[];
  keyHighlights: string[];
  familyStatement: string;
  timeline: {
    time: string;
    title: string;
    description: string;
    tag?: string;
  }[];
  helplineData?: {
    title: string;
    phone: string;
    agency: string;
    note: string;
  }[];
  audioDuration: number; // in seconds
  audioUrl?: string; // Uploaded custom audio file or URL
  audioName?: string; // Name of the uploaded audio file
  tags: string[];
}

export interface Comment {
  id: string;
  author: string;
  location?: string;
  avatarBg: string;
  content: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
}

export interface RelatedStory {
  id: string;
  title: string;
  category: string;
  time: string;
  imageUrl?: string;
  badge?: string;
}

export interface Subscriber {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  topics?: string[];
  subscribedAt: string;
  timestamp: number;
  source: string;
  status: 'active' | 'inactive';
  notes?: string;
}
