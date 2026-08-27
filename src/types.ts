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
