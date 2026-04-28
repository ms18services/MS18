'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import servicesData from '@/data/services.json';
import journalData from '@/data/journal-fallback.json';

interface SearchResult {
  type: 'service' | 'journal';
  id: string;
  title: string;
  description: string;
  href: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target as Node | null;
      if (!targetNode) return;
      if (!modalRef.current) return;
      if (!modalRef.current.contains(targetNode)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('touchstart', handlePointerDown, true);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const foundResults: SearchResult[] = [];

    // Search services
    servicesData.forEach((service) => {
      if (
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.details?.toLowerCase().includes(searchTerm)
      ) {
        foundResults.push({
          type: 'service',
          id: service.id,
          title: service.title,
          description: service.description,
          href: `/?service=${encodeURIComponent(service.id)}#services`,
        });
      }
    });

    // Search journal posts
    journalData.forEach((post) => {
      if (
        post.title.toLowerCase().includes(searchTerm) ||
        post.body?.toLowerCase().includes(searchTerm) ||
        post.category?.toLowerCase().includes(searchTerm)
      ) {
        foundResults.push({
          type: 'journal',
          id: post.id,
          title: post.title,
          description: post.body?.substring(0, 100) || post.category || '',
          href: `/journal?post=${post.id}`,
        });
      }
    });

    setResults(foundResults.slice(0, 8));
  }, [query]);

  const handleResultClick = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center px-4 pt-20"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-sm rounded-xl translate-x-[320px] bg-white shadow-2xl "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-2 bg-slate-50 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-slate-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search MS18"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-slate-900 placeholder-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {(query || results.length > 0) && (
          <div className="border-t border-slate-100 bg-white max-h-64 overflow-y-auto">
            {results.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result.href)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0">
                        {result.type === 'service' ? (
                          <svg
                            className="h-3.5 w-3.5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-3.5 w-3.5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate text-xs">
                          {result.title}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1">
                          {result.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="px-4 py-4 text-center text-xs text-slate-500">
                No results found for "{query}"
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
