export type JournalMediaType = 'image' | 'video';

export type JournalMedia = {
  type: JournalMediaType;
  src: string;
};

const videoExtensions = new Set(['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v']);

function getExtension(src: string) {
  const cleanSrc = src.split('?')[0]?.split('#')[0] ?? src;
  return cleanSrc.split('.').pop()?.toLowerCase() ?? '';
}

export function getJournalMediaType(src: string, explicitType?: string): JournalMediaType {
  if (explicitType === 'video' || explicitType === 'image') return explicitType;
  return videoExtensions.has(getExtension(src)) ? 'video' : 'image';
}

export function toJournalMedia(src: string, explicitType?: string): JournalMedia {
  return {
    type: getJournalMediaType(src, explicitType),
    src,
  };
}
