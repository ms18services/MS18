
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import JournalCard from './JournalCard'
import JournalCard2 from './JournalCard2'

type JournalCarouselProps = {
  className?: string
}

export default function JournalCarousel({ className }: JournalCarouselProps) {
  const slides = useMemo(() => [<JournalCard2 key="j2" />, <JournalCard key="j1" />], [])
  const [index, setIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)

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
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length)
  }, [slides.length])

  const goTo = useCallback(
    (nextIndex: number) => {
      const normalized = ((nextIndex % slides.length) + slides.length) % slides.length
      setIndex(normalized)
    },
    [slides.length],
  )

  useEffect(() => {
    if (isHovered || isFocused || isDragging) return

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(id)
  }, [isDragging, isFocused, isHovered, slides.length])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
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

  return (
    <div className={className}>
      <div className="relative">
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

        <div className="pointer-events-auto absolute scale-120 right-25 top-[58px] z-30 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/10 ${
                i === index
                  ? activeDotClasses[i % activeDotClasses.length]
                  : 'bg-[#D9D9D9] shadow-[inset_0_2px_2px_rgba(0,0,0,0.28)]'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
