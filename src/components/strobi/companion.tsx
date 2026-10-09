"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { Strobi, type AnimationName, type AvatarHandle } from "./Strobi"
import {
  firstContentCta,
  hasFinePointer,
  hintForCta,
  hintForPath,
  isAnimationName,
  REACTION_HINT,
  STROBI_CTA,
  STROBI_CTA_SELECTOR,
  STROBI_EVENT,
  type Hint,
  type ReactionName,
} from "./reactions"

const SIZE = 88
const GAP = 16
const PAD = 14
const WHISPER_W = 244
const WHISPER_H = 92
const IDLE_MS = 30_000
const SLEEP_AFTER_DROWSY_MS = 4_000
const LOOP_FALLBACK_MS = 2_000
const ONESHOT = new Set<string>([
  "waking",
  "laughing",
  "celebrate",
  "confused",
  "excited",
])

type Point = { x: number; y: number }
type Side = "left" | "right" | "top" | "bottom"

const SIDES: Side[] = ["right", "left", "top", "bottom"]

let savedPos: Point | null = null

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function spawnPoint(): Point {
  return {
    x: window.innerWidth + 24,
    y: Math.max(96, window.innerHeight * 0.42),
  }
}

function isCompact() {
  return window.innerWidth <= 640
}

function overflowFor(x: number, y: number, side: Side) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const mascot = { x, y, w: SIZE, h: SIZE }
  let whisper = { x: 0, y: 0, w: WHISPER_W, h: WHISPER_H }
  const layout = isCompact() ? "top" : side
  if (layout === "right") {
    whisper = { x: x + SIZE + 12, y: y + 4, w: WHISPER_W, h: WHISPER_H }
  } else if (layout === "left") {
    whisper = { x: x - 12 - WHISPER_W, y: y + 4, w: WHISPER_W, h: WHISPER_H }
  } else if (layout === "bottom") {
    whisper = {
      x: x + SIZE / 2 - WHISPER_W / 2,
      y: y + SIZE + 10,
      w: WHISPER_W,
      h: WHISPER_H,
    }
  } else {
    whisper = {
      x: x + SIZE / 2 - WHISPER_W / 2,
      y: y - 10 - WHISPER_H,
      w: WHISPER_W,
      h: WHISPER_H,
    }
  }
  let overflow = 0
  for (const box of [mascot, whisper]) {
    overflow += Math.max(0, PAD - box.x)
    overflow += Math.max(0, box.x + box.w - (vw - PAD))
    overflow += Math.max(0, PAD - box.y)
    overflow += Math.max(0, box.y + box.h - (vh - PAD))
  }
  return overflow
}

function placeNear(el: Element, from: Point): { point: Point; side: Side } {
  const rect = el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const midY = rect.top + rect.height / 2 - SIZE / 2
  const midX = rect.left + rect.width / 2 - SIZE / 2
  const maxX = vw - SIZE - PAD
  const maxY = vh - SIZE - PAD
  const spots: Point[] = [
    { x: rect.right + GAP, y: midY },
    { x: rect.left - GAP - SIZE, y: midY },
    { x: midX, y: rect.top - GAP - SIZE },
    { x: midX, y: rect.bottom + GAP },
    { x: rect.left, y: rect.top - GAP - SIZE },
    { x: rect.right - SIZE, y: rect.top - GAP - SIZE },
    { x: rect.left, y: rect.bottom + GAP },
    { x: rect.right - SIZE, y: rect.bottom + GAP },
    { x: rect.left + GAP, y: clamp(midY, rect.top + GAP, rect.bottom - SIZE - GAP) },
    { x: rect.right - SIZE - GAP, y: clamp(midY, rect.top + GAP, rect.bottom - SIZE - GAP) },
    { x: rect.left + GAP, y: rect.top + GAP },
    { x: rect.right - SIZE - GAP, y: rect.top + GAP },
  ]

  let best = { x: clamp(midX, PAD, maxX), y: clamp(midY, PAD, maxY), side: "left" as Side }
  let bestScore = Number.POSITIVE_INFINITY
  for (const spot of spots) {
    const x = clamp(spot.x, PAD, maxX)
    const y = clamp(spot.y, PAD, maxY)
    for (const side of SIDES) {
      const overflow = overflowFor(x, y, side)
      const travel = Math.hypot(x - from.x, y - from.y)
      const score = overflow * 1800 + travel
      if (score < bestScore) {
        bestScore = score
        best = { x, y, side }
      }
    }
  }

  return {
    point: { x: best.x, y: best.y },
    side: isCompact() ? "top" : best.side,
  }
}

export function StrobiCompanion() {
  const pathname = usePathname() || "/"
  const avatarRef = useRef<AvatarHandle>(null)
  const rootRef = useRef<HTMLElement>(null)
  const moodRef = useRef<AnimationName>("waking")
  const pos = useRef<Point>(savedPos ?? { x: 0, y: 0 })
  const target = useRef<Point>(savedPos ?? { x: 0, y: 0 })
  const following = useRef(false)
  const currentCta = useRef<Element | null>(null)
  const lastPath = useRef(pathname)
  const booted = useRef(false)
  const fallbackTimer = useRef(0)
  const idleTimer = useRef(0)
  const sleepTimer = useRef(0)
  const raf = useRef(0)

  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mood, setMood] = useState<AnimationName>("waking")
  const [hint, setHint] = useState<Hint>(REACTION_HINT.waking)
  const [showHint, setShowHint] = useState(true)
  const [side, setSide] = useState<Side>("left")

  const play = useCallback(
    (name: AnimationName, options?: { loop?: boolean }) => {
      if (reducedMotion) return
      if (!isAnimationName(name)) return
      moodRef.current = name
      setMood(name)
      avatarRef.current?.play(name, options)
    },
    [reducedMotion]
  )

  const speak = useCallback((next: Hint, visible = true) => {
    setHint(next)
    setShowHint(visible)
  }, [])

  const stay = useCallback(() => {
    following.current = false
    currentCta.current = null
    target.current = { ...pos.current }
    savedPos = { ...pos.current }
    rootRef.current?.classList.remove("is-following")
  }, [])

  const goIdle = useCallback(() => {
    stay()
    play("idle", { loop: true })
    setShowHint(false)
  }, [play, stay])

  const playOneShot = useCallback(
    (name: ReactionName) => {
      window.clearTimeout(fallbackTimer.current)
      play(name, { loop: false })
      speak(REACTION_HINT[name])
      fallbackTimer.current = window.setTimeout(goIdle, LOOP_FALLBACK_MS)
    },
    [goIdle, play, speak]
  )

  const armIdle = useCallback(() => {
    window.clearTimeout(idleTimer.current)
    window.clearTimeout(sleepTimer.current)
    idleTimer.current = window.setTimeout(() => {
      if (reducedMotion || following.current) return
      play("drowsy", { loop: true })
      speak(REACTION_HINT.drowsy)
      sleepTimer.current = window.setTimeout(() => {
        if (moodRef.current === "drowsy") {
          play("sleeping", { loop: true })
          setShowHint(false)
        }
      }, SLEEP_AFTER_DROWSY_MS)
    }, IDLE_MS)
  }, [play, reducedMotion, speak])

  const walkTo = useCallback(
    (el: Element, cta: string | null, eager: boolean) => {
      const hint = hintForCta(cta)
      const next = placeNear(el, pos.current)
      following.current = true
      currentCta.current = el
      target.current = next.point
      setSide(next.side)
      window.clearTimeout(fallbackTimer.current)
      play(eager ? "excited" : hint.mood, { loop: true })
      speak(hint)
      rootRef.current?.classList.add("is-following")
    },
    [play, speak]
  )

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const onMotion = () => setReducedMotion(media.matches)
    media.addEventListener("change", onMotion)
    const start = savedPos ?? spawnPoint()
    pos.current = start
    target.current = start
    setReady(true)
    return () => media.removeEventListener("change", onMotion)
  }, [])

  useEffect(() => {
    if (!ready || reducedMotion) return
    let cancelled = false
    const boot = () => {
      if (cancelled) return
      if (!avatarRef.current?.getState()) {
        requestAnimationFrame(boot)
        return
      }
      if (booted.current) return
      booted.current = true
      play("waking", { loop: false })
      speak(hintForPath(pathname))
      const first = firstContentCta()
      if (first) {
        const next = placeNear(first, pos.current)
        target.current = next.point
        setSide(next.side)
      } else {
        target.current = {
          x: clamp(window.innerWidth - SIZE - 120, PAD, window.innerWidth - SIZE - PAD),
          y: clamp(window.innerHeight * 0.38, PAD, window.innerHeight - SIZE - PAD),
        }
        setSide("left")
      }
      fallbackTimer.current = window.setTimeout(() => {
        play("idle", { loop: true })
      }, LOOP_FALLBACK_MS)
      armIdle()
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [armIdle, play, ready, reducedMotion, speak])

  useEffect(() => {
    if (!ready || !booted.current) return
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    play("curious", { loop: true })
    speak(hintForPath(pathname))
    const first = firstContentCta()
    if (first) {
      const next = placeNear(first, pos.current)
      target.current = next.point
      setSide(next.side)
    }
    window.clearTimeout(fallbackTimer.current)
    fallbackTimer.current = window.setTimeout(() => {
      play("idle", { loop: true })
    }, 3200)
    armIdle()
  }, [armIdle, pathname, play, ready, speak])

  useEffect(() => {
    if (!ready) return
    const root = rootRef.current
    if (!root) return

    const tick = (now: number) => {
      const ease = following.current ? 0.09 : 0.06
      pos.current.x += (target.current.x - pos.current.x) * ease
      pos.current.y += (target.current.y - pos.current.y) * ease
      savedPos = { ...pos.current }
      const bob =
        reducedMotion || following.current ? 0 : Math.sin(now / 720) * 5
      root.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y + bob}px, 0)`
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [ready, reducedMotion])

  useEffect(() => {
    if (!ready || reducedMotion) return

    const ctaFrom = (event: Event) => {
      const targetEl = event.target
      return targetEl instanceof Element
        ? targetEl.closest<HTMLElement>(STROBI_CTA_SELECTOR)
        : null
    }

    const onOver = (event: Event) => {
      if (!hasFinePointer()) return
      const el = ctaFrom(event)
      if (!el) return
      if (following.current && currentCta.current === el) return
      walkTo(el, el.getAttribute(STROBI_CTA), false)
      armIdle()
    }

    const onOut = (event: MouseEvent) => {
      if (!hasFinePointer()) return
      const left = event.target
      const next = event.relatedTarget
      const fromCta =
        left instanceof Element && left.closest(STROBI_CTA_SELECTOR)
      const toCta =
        next instanceof Element && next.closest(STROBI_CTA_SELECTOR)
      if (!fromCta || toCta) return
      stay()
      if (moodRef.current === "curious" || moodRef.current === "excited") {
        play("idle", { loop: true })
      }
      armIdle()
    }

    const onClick = (event: MouseEvent) => {
      if (hasFinePointer()) return
      const el = ctaFrom(event)
      if (!el) return
      walkTo(el, el.getAttribute(STROBI_CTA), true)
      window.clearTimeout(fallbackTimer.current)
      fallbackTimer.current = window.setTimeout(goIdle, 2800)
    }

    const onActivity = () => {
      if (following.current) return
      if (moodRef.current === "sleeping") {
        play("waking", { loop: false })
        speak(REACTION_HINT.waking)
        fallbackTimer.current = window.setTimeout(() => play("idle", { loop: true }), LOOP_FALLBACK_MS)
      } else if (moodRef.current === "drowsy") {
        play("idle", { loop: true })
        setShowHint(false)
      }
      armIdle()
    }

    const onReact = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail
      if (detail === "celebrate" || detail === "confused") {
        playOneShot(detail)
      }
    }

    const onResize = () => {
      pos.current = {
        x: clamp(pos.current.x, PAD, window.innerWidth - SIZE - PAD),
        y: clamp(pos.current.y, PAD, window.innerHeight - SIZE - PAD),
      }
      if (following.current && currentCta.current) {
        const next = placeNear(currentCta.current, pos.current)
        target.current = next.point
        setSide(next.side)
      } else {
        target.current = { ...pos.current }
      }
      savedPos = { ...pos.current }
    }

    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseout", onOut)
    document.addEventListener("click", onClick)
    window.addEventListener("pointermove", onActivity, { passive: true })
    const onScroll = () => {
      if (following.current && currentCta.current) {
        const next = placeNear(currentCta.current, pos.current)
        target.current = next.point
        setSide(next.side)
        return
      }
      onActivity()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("keydown", onActivity)
    window.addEventListener(STROBI_EVENT, onReact)
    window.addEventListener("resize", onResize)

    return () => {
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
      document.removeEventListener("click", onClick)
      window.removeEventListener("pointermove", onActivity)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("keydown", onActivity)
      window.removeEventListener(STROBI_EVENT, onReact)
      window.removeEventListener("resize", onResize)
      window.clearTimeout(fallbackTimer.current)
      window.clearTimeout(idleTimer.current)
      window.clearTimeout(sleepTimer.current)
    }
  }, [armIdle, goIdle, play, playOneShot, ready, reducedMotion, speak, stay, walkTo])

  const poke = useCallback(() => {
    if (reducedMotion || following.current) return
    playOneShot("laughing")
    armIdle()
  }, [armIdle, playOneShot, reducedMotion])

  const onAnimationEnd = useCallback(
    (ended: AnimationName) => {
      if (!ONESHOT.has(ended as ReactionName)) return
      if (moodRef.current !== ended) return
      window.clearTimeout(fallbackTimer.current)
      play("idle", { loop: true })
    },
    [play]
  )

  if (!ready) return null

  return (
    <aside
      ref={rootRef}
      className="strobi-dock"
      aria-label="Strobi, site mascot"
      style={{
        transform: `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`,
      }}
    >
      {showHint && (
        <div
          className={`strobi-whisper strobi-whisper--${side}`}
          role="status"
        >
          <p className="strobi-whisper__kicker">{hint.kicker}</p>
          <p className="strobi-whisper__text">{hint.text}</p>
        </div>
      )}
      <button
        type="button"
        onClick={poke}
        className="strobi-dock__face"
        aria-label={
          reducedMotion
            ? "Strobi, site mascot"
            : `Strobi is ${mood}. Click to make it laugh.`
        }
      >
        <Strobi
          ref={avatarRef}
          animation="idle"
          playing={false}
          size={SIZE}
          className="strobi-dock__avatar"
          onAnimationEnd={onAnimationEnd}
        />
      </button>
    </aside>
  )
}
