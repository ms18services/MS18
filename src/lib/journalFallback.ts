import fallbackPosts from '@/data/journal-fallback.json';
import { toJournalMedia, type JournalMedia } from '@/lib/journalMedia';

export type JournalGradient = 'purple' | 'blue' | 'green';

export type JournalFallbackPost = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  body: string;
  gradient: JournalGradient;
  createdAt: Date;
  media: JournalMedia[];
};

type JournalFallbackJsonPost = {
  id?: string;
  category?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  gradient?: string;
  createdAt?: string;
  created_at?: string;
  minutesAgo?: number;
  imageSrcs?: string[];
  media?: Array<{ type?: string; src?: string }>;
};

function normalizeGradient(gradient: string | undefined): JournalGradient {
  if (gradient === 'blue' || gradient === 'green' || gradient === 'purple') {
    return gradient;
  }

  return 'purple';
}

function getCreatedAt(post: JournalFallbackJsonPost) {
  if (typeof post.minutesAgo === 'number') {
    return new Date(Date.now() - Math.max(0, post.minutesAgo) * 60 * 1000);
  }

  const timestamp = post.createdAt ?? post.created_at;
  if (timestamp) {
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) return date;
  }

  return new Date();
}

export function getJournalFallbackPosts(limit?: number): JournalFallbackPost[] {
  const posts = (fallbackPosts as JournalFallbackJsonPost[]).map((post, index) => ({
    id: post.id || `fallback-post-${index + 1}`,
    category: post.category || 'Journal',
    title: post.title || 'Untitled post',
    subtitle: post.subtitle || '',
    body: post.body || '',
    gradient: normalizeGradient(post.gradient),
    createdAt: getCreatedAt(post),
    media: Array.isArray(post.media)
      ? post.media
          .filter((item) => !!item.src)
          .map((item) => toJournalMedia(item.src as string, item.type))
      : Array.isArray(post.imageSrcs)
      ? post.imageSrcs.filter(Boolean).map((src) => toJournalMedia(src))
      : [],
  }));

  return typeof limit === 'number' ? posts.slice(0, limit) : posts;
}
