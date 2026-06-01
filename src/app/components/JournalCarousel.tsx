
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { createSupabaseAnonClient, JOURNAL_IMAGES_BUCKET } from '@/lib/supabase'
import { getJournalFallbackPosts } from '@/lib/journalFallback'
import { toJournalMedia, type JournalMedia } from '@/lib/journalMedia'

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
  carousel_order?: number | null
  journal_post_images?: Array<{ path: string; sort_order: number }>
}

type CarouselPost = {
  id: string
  category: string
  title: string
  subtitle: string
  body: string
  gradient: 'purple' | 'blue' | 'green'
  carouselOrder: number | null
  media: JournalMedia[]
}

function getFallbackCarouselPosts(): CarouselPost[] {
  return getJournalFallbackPosts(3).map((post) => ({
    id: post.id,
    category: post.category,
    title: post.title,
    subtitle: post.subtitle,
    body: post.body,
    gradient: post.gradient,
    carouselOrder: post.carouselOrder,
    media: post.media,
  }))
}

function MediaTile({
  media,
  className,
  play,
  muted,
  controls,
}: {
  media: JournalMedia
  className: string
  play: boolean
  muted: boolean
  controls: boolean
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (play) {
      void video.play().catch(() => {
        // Browser autoplay policies can still block playback in some contexts.
      })
      return
    }

    video.pause()
  }, [play, media.src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted
  }, [muted, media.src])

  return media.type === 'video' ? (
    <video
      ref={videoRef}
      src={media.src}
      className={className}
      muted={muted}
      controls={controls}
      loop
      playsInline
      preload="metadata"
    />
  ) : (
    <img src={media.src} alt="" className={className} draggable={false} />
  )
}

function getTheme(post: CarouselPost) {
  return post.gradient || 'purple'
}

function truncateWords(text: string, maxWords: number) {
  const parts = text.trim().split(/\s+/)
  if (parts.length <= maxWords) return text
  return `${parts.slice(0, maxWords).join(' ')}…`
}

function TiltedCard({
  children,
}: {
  children: React.ReactNode
}) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const glareRef = useRef<HTMLDivElement | null>(null)

  const resetTilt = useCallback(() => {
    if (frameRef.current) {
      frameRef.current.style.transform = 'perspective(1600px) rotateX(0deg) rotateY(0deg) scale(1)'
    }
    if (contentRef.current) {
      contentRef.current.style.transform = 'translateZ(0px)'
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0'
    }
  }, [])

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return

    const frame = frameRef.current
    const content = contentRef.current
    const glare = glareRef.current
    if (!frame || !content || !glare) return

    const rect = frame.getBoundingClientRect()
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1)
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1)
    const rotateY = (x - 0.5) * 16
    const rotateX = (0.5 - y) * 16

    frame.style.transform =
      `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`
    content.style.transform = 'translateZ(16px)'
    glare.style.opacity = '1'
    glare.style.background =
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.28), transparent 58%)`
  }, [])

  return (
    <div
      ref={frameRef}
      className="transform-gpu transition-transform duration-200 ease-out will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <div
        ref={contentRef}
        className="relative transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-200"
        />
      </div>
    </div>
  )
}

function CarouselCard({
  post,
  isActive,
  soundEnabled,
  isExpanded,
  onToggleExpand,
}: {
  post: CarouselPost
  isActive: boolean
  soundEnabled: boolean
  isExpanded: boolean
  onToggleExpand: () => void
}) {
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
      <TiltedCard>
      <div className="relative z-10 w-full min-h-[290px] overflow-hidden rounded-[28px] bg-white shadow-xl ring-1 ring-black/5">
        <Link
          href={`/journal?post=${encodeURIComponent(post.id)}`}
          className={
            theme === 'blue'
              ? 'group absolute bottom-4 right-4 flex items-center justify-center rounded-full border-2 border-[#2767BC] bg-white px-4 py-1 text-[10px] font-semibold shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-[#2767BC] hover:text-medium hover:to-[#142699] md:bottom-8 md:right-8 md:px-7 md:py-1.5 md:text-[13px]'
              : theme === 'green'
              ? 'group absolute bottom-4 right-4 flex items-center justify-center rounded-full border-2 border-[#3CB244] bg-white px-4 py-1 text-[10px] font-semibold shadow-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-[#3CB244] hover:text-medium hover:via-[#2A611C] hover:to-[#142E0D] md:bottom-8 md:right-8 md:px-7 md:py-1.5 md:text-[12px]'
              : 'group absolute bottom-4 right-4 flex items-center justify-center rounded-full border-2 border-[#9A42E6] bg-white px-4 py-1 text-[10px] font-semibold shadow-xl transition-all duration-300 hover:bg-gradient-to-b hover:from-[#9A42E6] hover:text-medium hover:to-[#562580] md:bottom-8 md:right-8 md:px-7 md:py-1.5 md:text-[12px]'
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

        <div className="flex flex-col gap-4 p-4 pb-14 md:flex-row md:items-start md:gap-10 md:p-7 md:pl-6 md:pb-16">
          {post.media.length > 0 ? (
            <div className="flex shrink-0 justify-center md:items-center md:justify-start">
              {(() => {
                const count = post.media.length
                const primary = post.media[0]
                const secondary = post.media[1]
                const tertiary = post.media[2]
                const extra = Math.max(0, count - 3)

                if (!primary) return null

                if (count <= 1) {
                  return (
                    <div className="h-[190px] w-full max-w-[260px] overflow-hidden rounded-[22px] bg-transparent md:translate-y-5 md:h-[280px] md:max-w-[460px] md:w-[460px]">
                      <MediaTile
                        media={primary}
                        className="h-full w-full object-cover"
                        play={isActive}
                        muted={!soundEnabled}
                        controls={soundEnabled}
                      />
                    </div>
                  )
                }

                if (count === 2) {
                  return (
                    <div className="flex h-[170px] w-full max-w-[260px] gap-2 md:translate-y-5 md:h-[260px] md:max-w-[560px] md:gap-3 md:w-[520px]">
                      <div className="relative h-full flex-[3] overflow-hidden rounded-[22px] bg-transparent">
                        <MediaTile
                          media={primary}
                          className="h-full w-full object-cover"
                          play={isActive}
                          muted={!soundEnabled}
                          controls={soundEnabled}
                        />
                      </div>
                      <div className="relative h-full flex-[2] overflow-hidden rounded-[22px] bg-transparent">
                        {secondary ? (
                          <MediaTile
                            media={secondary}
                            className="h-full w-full object-cover"
                            play={isActive}
                            muted={!soundEnabled}
                            controls={soundEnabled}
                          />
                        ) : null}
                      </div>
                    </div>
                  )
                }

                return (
                  <div className="flex h-[170px] w-full max-w-[260px] gap-2 md:translate-y-5 md:h-[250px] md:max-w-[520px] md:gap-3 md:w-[520px]">
                    <div className="relative h-full flex-1 overflow-hidden rounded-[22px] bg-transparent">
                      <MediaTile
                        media={primary}
                        className="h-full w-full object-cover"
                        play={isActive}
                        muted={!soundEnabled}
                        controls={soundEnabled}
                      />
                    </div>
                    <div className="flex h-full w-[82px] flex-col gap-2 md:w-[160px] md:gap-3">
                      <div className="relative flex-1 overflow-hidden rounded-[18px] bg-transparent">
                        {secondary ? (
                          <MediaTile
                            media={secondary}
                            className="h-full w-full object-cover"
                            play={isActive}
                            muted={!soundEnabled}
                            controls={soundEnabled}
                          />
                        ) : null}
                      </div>
                      <div className="relative flex-1 overflow-hidden rounded-[18px] bg-transparent">
                        {tertiary ? (
                          <MediaTile
                            media={tertiary}
                            className="h-full w-full object-cover"
                            play={isActive}
                            muted={!soundEnabled}
                            controls={soundEnabled}
                          />
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

          <div className="min-w-0 w-full pt-1 text-left md:pt-2">
            <div className={`text-[10px] font-bold tracking-tight bg-clip-text text-transparent md:text-[14px] md:-tracking-[1px] ${categoryClass}`}>
              {post.category}
            </div>
            <div className="mt-1 text-[16px] font-bold leading-[1.08] tracking-tight md:text-[20px] md:-tracking-[1px]">
              <span
                className={`block w-full bg-clip-text pb-[0.08em] text-[1.58em] leading-[1.05] tracking-tight text-transparent [overflow-wrap:anywhere] break-words md:text-[2.1em] md:-tracking-[2px] ${titleClass}`}
              >
                {post.title}
              </span>
            </div>
            {post.subtitle && (
              <div className="mt-1 text-[12px] font-bold tracking-tight text-[#616161] md:text-[1.2em] md:-tracking-[1px]">{post.subtitle}</div>
            )}

            <div className="mt-2 text-[9px] font-semibold leading-[1.25] text-slate-500 [overflow-wrap:anywhere] break-words md:text-[11px] md:leading-[1.2]">
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
      </TiltedCard>
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
  const [index, setIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)

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
            <div className="flex flex-col gap-4 p-4 pb-14 md:flex-row md:items-start md:gap-10 md:p-7 md:pb-16">
              <div className="flex shrink-0 items-center gap-6">
                <div className="h-[170px] w-[260px] rounded-[22px] bg-slate-200 animate-pulse md:ml-40 md:translate-y-5 md:h-[190px] md:w-[176px]" />
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
    return posts.map((p, postIndex) => (
      <CarouselCard
        key={p.id}
        post={p}
        isActive={postIndex === index}
        soundEnabled={postIndex === index && isHovered}
        isExpanded={!!expandedBodies[p.id]}
        onToggleExpand={() => toggleExpand(p.id)}
      />
    ))
  }, [loading, posts, expandedBodies, toggleExpand, index, isHovered])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        setLoading(true)
        const supabase = createSupabaseAnonClient()
        const primaryResult = await supabase
          .from('journal_posts')
          .select('id, category, title, subtitle, body, gradient, created_at, carousel_order, journal_post_images(path, sort_order)')
          .order('carousel_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(3)

        let data: unknown = primaryResult.data
        let error = primaryResult.error

        if (error) {
          const fallback = await supabase
            .from('journal_posts')
            .select('id, category, title, subtitle, body, gradient, created_at, journal_post_images(path, sort_order)')
            .order('created_at', { ascending: false })
            .limit(3)

          data = fallback.data
          error = fallback.error
        }

        if (cancelled) return
        if (error || !data) {
          setPosts(getFallbackCarouselPosts())
          return
        }

        const rows = data as unknown as CarouselPostRow[]
        const mapped: CarouselPost[] = rows.map((r) => {
          const imgs = (r.journal_post_images ?? [])
            .slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

          const media = imgs
            .map((img) => supabase.storage.from(JOURNAL_IMAGES_BUCKET).getPublicUrl(img.path).data.publicUrl)
            .filter((src) => !!src)
            .map((src) => toJournalMedia(src))

          return {
            id: r.id,
            category: r.category,
            title: r.title,
            subtitle: r.subtitle || '',
            body: r.body,
            gradient: r.gradient || 'purple',
            carouselOrder: r.carousel_order ?? null,
            media,
          }
        })

        setPosts(mapped)
      } catch {
        if (cancelled) return
        setPosts(getFallbackCarouselPosts())
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
          <div className="pointer-events-auto mb-4 flex justify-center pr-0 md:mb-2 md:justify-end md:pr-1">
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
          <div className="pointer-events-auto absolute right-3 top-3 z-30 flex items-center gap-2 md:right-25 md:top-[58px] md:scale-120">
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
