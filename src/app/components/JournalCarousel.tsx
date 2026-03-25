
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { createSupabaseAnonClient, JOURNAL_IMAGES_BUCKET } from '@/lib/supabase'

type JournalCarouselProps = {
  className?: string
  dotsPosition?: 'overlay' | 'belowHeader'
}

type CarouselPostRow = {
  id: string
  category: string
  title: string
  subtitle: string
  body: string
  gradient: 'purple' | 'blue' | 'green'
  created_at: string
  journal_post_images?: Array<{ path: string; sort_order: number }>
}

type CarouselPost = {
  id: string
  category: string
  title: string
  subtitle: string
  body: string
  gradient: 'purple' | 'blue' | 'green'
  imageSrcs: string[]
}

function getTheme(post: CarouselPost) {
  return post.gradient || 'purple'
}

function truncateWords(text: string, maxWords: number) {
  const parts = text.trim().split(/\s+/)
  if (parts.length <= maxWords) return text
  return `${parts.slice(0, maxWords).join(' ')}…`
}

function CarouselCard({ post, isExpanded, onToggleExpand }: { post: CarouselPost; isExpanded: boolean; onToggleExpand: () => void }) {
  const theme = getTheme(post)
  const BODY_PREVIEW_CHARS = 150
  const shouldShowSeeMore = post.body.trim().length > BODY_PREVIEW_CHARS
  const previewBody = shouldShowSeeMore ? post.body.slice(0, BODY_PREVIEW_CHARS).trim() : post.body
  const categoryClass =
    theme === 'blue'
      ? 'bg-gradient-to-b from-[#2767BC] to-[#142699] from-20% to-100%'
      : theme === 'green'
      ? 'bg-gradient-to-br from-[#3CB244] via-[#2A611C] to-[#142E0D] from-40% via-100% to-100%'
      : 'bg-gradient-to-br from-[#9A42E6] to-[#562580] from-20% to-90%'

  const titleClass =
    theme === 'blue'
      ? 'bg-gradient-to-b from-[#2767BC] to-[#142699] from-40% to-100%'
      : theme === 'green'
      ? 'bg-gradient-to-br from-[#3CB244] via-[#2A611C] to-[#142E0D] from-40% via-100% to-100%'
      : 'bg-gradient-to-b from-[#9A42E6] to-[#562580] from-20% to-100%'

  return (
    <div className="relative mt-5 mx-auto w-full max-w-4xl overflow-visible">
      <div className="relative z-10 w-full min-h-[290px] overflow-hidden rounded-[28px] shadow-xl ring-1 ring-black/5">
        <Link
          href={`/journal?post=${encodeURIComponent(post.id)}`}
          className={
            theme === 'blue'
              ? 'group absolute bottom-8 right-8 flex items-center justify-center rounded-full border-2 border-[#2767BC] px-7 py-1.5 text-[13px] font-semibold bg-white shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-[#2767BC] hover:text-medium hover:to-[#142699]'
              : theme === 'green'
              ? 'group absolute bottom-8 right-8 flex items-center justify-center rounded-full border-2 border-[#3CB244] px-7 py-1.5 text-[12px] font-semibold bg-white shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-[#3CB244] hover:text-medium hover:via-[#2A611C] hover:to-[#142E0D]'
              : 'group absolute bottom-8 right-8 flex items-center justify-center rounded-full border-2 border-[#9A42E6] bg-white px-7 py-1.5 text-[12px] font-semibold shadow-xl transition-all duration-300 hover:bg-gradient-to-b hover:from-[#9A42E6] hover:text-medium hover:to-[#562580]'
          }
        >
          <p
            className={
              theme === 'blue'
                ? 'bg-gradient-to-br from-[#2767BC] to-[#142699] bg-clip-text text-transparent transition-all duration-300 group-hover:bg-none group-hover:text-white'
                : theme === 'green'
                ? 'bg-gradient-to-br from-[#3CB244] to-[#142E0D] bg-clip-text text-transparent transition-all duration-300 group-hover:bg-none group-hover:text-white'
                : 'bg-gradient-to-br from-[#9A42E6] to-[#562580] bg-clip-text text-transparent transition-all duration-300 group-hover:bg-none group-hover:text-white'
            }
          >
            Find out more
          </p>
        </Link>

        <div className="flex flex-col gap-6 p-5 pl-3 pb-16 md:flex-row md:items-start md:gap-10 md:p-7 md:pl-6 md:pb-16">
          {post.imageSrcs.length > 0 ? (
            <div className="flex shrink-0 justify-center md:items-center md:justify-start">
              {(() => {
                const count = post.imageSrcs.length
                const primary = post.imageSrcs[0]
                const secondary = post.imageSrcs[1]
                const tertiary = post.imageSrcs[2]
                const extra = Math.max(0, count - 3)

                if (!primary) return null

                if (count <= 1) {
                  return (
                    <div className="h-[280px] w-full max-w-[460px] overflow-hidden rounded-[22px] bg-transparent md:translate-y-5 md:h-[280px] md:w-[460px]">
                      <img src={primary} alt="" className="h-full w-full object-cover" draggable={false} />
                    </div>
                  )
                }

                if (count === 2) {
                  return (
                    <div className="flex h-[260px] w-full max-w-[560px] gap-3 md:translate-y-5 md:h-[260px] md:w-[520px]">
                      <div className="relative h-full flex-[3] overflow-hidden rounded-[22px] bg-transparent">
                        <img src={primary} alt="" className="h-full w-full object-cover" draggable={false} />
                      </div>
                      <div className="relative h-full flex-[2] overflow-hidden rounded-[22px] bg-transparent">
                        {secondary ? (
                          <img src={secondary} alt="" className="h-full w-full object-cover" draggable={false} />
                        ) : null}
                      </div>
                    </div>
                  )
                }

                return (
                  <div className="flex h-[250px] w-full max-w-[520px] gap-3 md:translate-y-5 md:h-[250px] md:w-[520px]">
                    <div className="relative h-full flex-1 overflow-hidden rounded-[22px] bg-transparent">
                      <img src={primary} alt="" className="h-full w-full object-cover" draggable={false} />
                    </div>
                    <div className="flex h-full w-[160px] flex-col gap-3">
                      <div className="relative flex-1 overflow-hidden rounded-[18px] bg-transparent">
                        {secondary ? (
                          <img src={secondary} alt="" className="h-full w-full object-cover" draggable={false} />
                        ) : null}
                      </div>
                      <div className="relative flex-1 overflow-hidden rounded-[18px] bg-transparent">
                        {tertiary ? (
                          <img src={tertiary} alt="" className="h-full w-full object-cover" draggable={false} />
                        ) : null}
                        {extra > 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                            <span className="text-2xl font-bold tracking-[-1px] text-white">+{extra}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          ) : null}

          <div className="min-w-0 pt-2 w-full text-left">
            <div
              className={`text-[14px] -tracking-[1px] font-bold bg-clip-text text-transparent ${categoryClass}`}
            >
              {post.category}
            </div>
            <div className="mt-1 text-[20px] font-bold leading-[1] -tracking-[1px]">
              <span
                className={`block bg-clip-text text-transparent w-full text-[2.1em] -tracking-[2px] ${titleClass} [overflow-wrap:anywhere] break-words`}
              >
                {post.title}
              </span>
            </div>
            {post.subtitle && (
              <div className="mt-1 text-[1.2em] font-bold text-[#616161] -tracking-[1px]">{post.subtitle}</div>
            )}

            <div className="mt-4 font-semibold text-[11px] leading-[1.2] text-slate-500 [overflow-wrap:anywhere] break-words">
              {isExpanded ? (
                <p>
                  {post.body}{' '}
                  <button
                    type="button"
                    className="inline text-slate-700 hover:text-slate-900 font-bold"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpand()
                    }}
                  >
                    See less
                  </button>
                </p>
              ) : (
                <p>
                  {shouldShowSeeMore ? previewBody : post.body}
                  {shouldShowSeeMore && (
                    <>
                      ...{' '}
                      <button
                        type="button"
                        className="inline text-slate-700 hover:text-slate-900 font-bold"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleExpand()
                        }}
                      >
                        See more
                      </button>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JournalCarousel({
  className,
  dotsPosition = 'overlay',
}: JournalCarouselProps) {
  const [posts, setPosts] = useState<CarouselPost[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedBodies, setExpandedBodies] = useState<Record<string, boolean>>({})

  const toggleExpand = useCallback((postId: string) => {
    setExpandedBodies((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }, [])

  const slides = useMemo(() => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <div key={`sk-${i}`} className="relative mt-5 mx-auto w-full max-w-4xl overflow-visible">
          <div className="relative w-full min-h-[290px] overflow-hidden rounded-[28px] shadow-xl ring-1 ring-black/5">
            <div className="flex flex-col gap-6 p-5 pb-16 md:flex-row md:items-start md:gap-10 md:p-7 md:pb-16">
              <div className="flex shrink-0 items-center gap-6">
                <div className="ml-40 translate-y-5 h-[200px] w-[160px] rounded-[22px] bg-slate-200 animate-pulse md:h-[190px] md:w-[176px]" />
              </div>
              <div className="min-w-0 pt-2 w-full">
                <div className="h-4 w-32 rounded-full bg-slate-200 animate-pulse" />
                <div className="mt-3 h-10 w-4/5 rounded-2xl bg-slate-200 animate-pulse" />
                <div className="mt-3 h-4 w-2/5 rounded-full bg-slate-200 animate-pulse" />
                <div className="mt-6 grid gap-2">
                  <div className="h-3 w-full rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-3 w-11/12 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-3 w-10/12 rounded-full bg-slate-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    }

    if (posts.length === 0) return []
    return posts.map((p) => (
      <CarouselCard
        key={p.id}
        post={p}
        isExpanded={!!expandedBodies[p.id]}
        onToggleExpand={() => toggleExpand(p.id)}
      />
    ))
  }, [loading, posts, expandedBodies, toggleExpand])
  const [index, setIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        setLoading(true)
        const supabase = createSupabaseAnonClient()
        const { data, error } = await supabase
          .from('journal_posts')
          .select('id, category, title, subtitle, body, gradient, created_at, journal_post_images(path, sort_order)')
          .order('created_at', { ascending: false })
          .limit(3)

        if (cancelled) return
        if (error || !data) {
          setPosts([])
          return
        }

        const rows = data as unknown as CarouselPostRow[]
        const mapped: CarouselPost[] = rows.map((r) => {
          const imgs = (r.journal_post_images ?? [])
            .slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

          const imageSrcs = imgs
            .map((img) => supabase.storage.from(JOURNAL_IMAGES_BUCKET).getPublicUrl(img.path).data.publicUrl)
            .filter((src) => !!src)

          return {
            id: r.id,
            category: r.category,
            title: r.title,
            subtitle: r.subtitle || '',
            body: r.body,
            gradient: r.gradient || 'purple',
            imageSrcs,
          }
        })

        setPosts(mapped)
      } catch {
        if (cancelled) return
        setPosts([])
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  const activeDotClasses = useMemo(
    () => [
      'bg-gradient-to-b from-[#4873FF] to-[#142699]',
      'bg-gradient-to-b from-[#C837D5] to-[#681D6F]',
    
      
    ],
    [],
  )

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const dragStartXRef = useRef<number | null>(null)
  const widthRef = useRef<number>(0)
  const indexRef = useRef<number>(index)

  useEffect(() => {
    indexRef.current = index
  }, [index])

  const goPrev = useCallback(() => {
    if (slides.length === 0) return
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goNext = useCallback(() => {
    if (slides.length === 0) return
    setIndex((i) => (i + 1) % slides.length)
  }, [slides.length])

  const goTo = useCallback(
    (nextIndex: number) => {
      if (slides.length === 0) return
      const normalized = ((nextIndex % slides.length) + slides.length) % slides.length
      setIndex(normalized)
    },
    [slides.length],
  )

  useEffect(() => {
    if (isHovered || isFocused || isDragging) return
    if (slides.length === 0) return

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(id)
  }, [isDragging, isFocused, isHovered, slides.length])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null
    if (target?.closest('a,button,input,textarea,select,label')) return
    if (!viewportRef.current) return
    widthRef.current = viewportRef.current.getBoundingClientRect().width
    dragStartXRef.current = e.clientX
    setIsDragging(true)
    setDragOffsetPx(0)
    try {
      ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    if (dragStartXRef.current == null) return
    const delta = e.clientX - dragStartXRef.current
    setDragOffsetPx(delta)
  }, [isDragging])

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return
      const width = widthRef.current || 1
      const threshold = Math.max(60, width * 0.18)

      const delta = dragOffsetPx
      setIsDragging(false)
      setDragOffsetPx(0)
      dragStartXRef.current = null

      if (Math.abs(delta) > threshold) {
        if (delta < 0) {
          setIndex((i) => (i + 1) % slides.length)
        } else {
          setIndex((i) => (i - 1 + slides.length) % slides.length)
        }
      } else {
        setIndex(indexRef.current)
      }

      try {
        ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    },
    [dragOffsetPx, isDragging, slides.length],
  )

  const baseTranslatePercent = index * 100
  const dragTranslatePercent = widthRef.current ? (dragOffsetPx / widthRef.current) * 100 : 0
  const translatePercent = baseTranslatePercent - dragTranslatePercent

  const getDotClass = (dotIndex: number, isActive: boolean) => {
    const theme = posts[dotIndex] ? getTheme(posts[dotIndex]) : 'purple'
    const activeClass =
      theme === 'blue'
        ? 'bg-[#2767BC]'
        : theme === 'green'
        ? 'bg-[#3CB244]'
        : 'bg-[#9A42E6]'
    return isActive
      ? `${activeClass} shadow-[inset_0_2px_2px_rgba(0,0,0,0.18)]`
      : 'bg-[#D9D9D9] shadow-[inset_0_2px_2px_rgba(0,0,0,0.28)]'
  }

  return (
    <div className={className}>
      <div className="relative">
        {dotsPosition === 'belowHeader' ? (
          <div className="pointer-events-auto mb-2 flex justify-end pr-1">
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/10 ${getDotClass(i, i === index)}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {slides.length === 0 && !loading ? (
          <div className="rounded-3xl bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-[0_14px_40px_rgba(2,6,23,0.12)] ring-1 ring-slate-200/60">
            No posts yet.
          </div>
        ) : (
        <div
          ref={viewportRef}
          className="overflow-x-hidden overflow-y-visible touch-pan-y pb-12"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(e) => {
            if (isDragging) endDrag(e)
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocused(true)}
          onBlurCapture={() => setIsFocused(false)}
        >
          <div
            className={isDragging ? 'flex' : 'flex transition-transform duration-500 ease-out'}
            style={{ transform: `translateX(-${translatePercent}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="flex w-full shrink-0 justify-center">
                {slide}
              </div>
            ))}
          </div>
        </div>
        )}

        {dotsPosition === 'overlay' ? (
          <div className="pointer-events-auto absolute scale-120 right-25 top-[58px] z-30 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/10 ${getDotClass(i, i === index)}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
