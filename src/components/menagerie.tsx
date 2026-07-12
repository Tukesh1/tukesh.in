"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { petSfx } from "@/lib/pet-sfx";

type PetKind = "cat" | "dog" | "bird";

type Lines = {
  asleep: string[];
  fed: string[];
  idle: string[];
  full: string[];
  carried: string[];
};

const LINES: Record<PetKind, Lines> = {
  cat: {
    asleep: [
      "shh. soft paws only.",
      "dreaming of green builds",
      "offline until further notice",
      "five more minutes. maybe ten.",
    ],
    fed: [
      "perfection. ship it.",
      "purr approved ✓",
      "finally. quality fish.",
      "you may keep coding.",
    ],
    idle: [
      "I review PRs in silence",
      "whiskers detect bugs",
      "fish only. bones are for dogs.",
      "the deploy can wait. pet me.",
    ],
    full: [
      "full. dignity preserved.",
      "one fish. hourly. policy.",
      "later. I'm busy looking busy.",
    ],
    carried: [
      "put me down. gently.",
      "I allow this. briefly.",
      "unhand the QA lead",
      "this is undignified. continue.",
    ],
  },
  dog: {
    asleep: [
      "*happy snore*",
      "dreaming of long walks",
      "guarding the repo… eyes closed",
      "zzz — fetch me later?",
    ],
    fed: [
      "BEST DAY EVER!!",
      "you. are. the best human.",
      "bone acquired. joy unlocked.",
      "10/10 would wag again",
    ],
    idle: [
      "who's a good engineer? YOU!",
      "wanna go outside? or ship?",
      "I believe in this commit",
      "throw me a bone, literally",
    ],
    full: [
      "already ate! still happy!",
      "*wags anyway*",
      "thank you thank you thank you",
    ],
    carried: [
      "WHEEEE!",
      "flying dog mode!",
      "best walk and I'm not even walking",
      "higher! higher! okay careful!",
    ],
  },
  bird: {
    asleep: [
      "*tucked in*",
      "roosting. do not deploy.",
      "night songs loading…",
      "wings folded. hush.",
    ],
    fed: [
      "seeds! yes!",
      "peck peck — delight!",
      "millet! my favourite PR snack",
      "tiny bird. huge gratitude.",
    ],
    idle: [
      "I see all the PRs from up here",
      "chirp: LGTM",
      "worm-driven development",
      "seeds only, thanks — no bones",
    ],
    full: [
      "crop is full. tweet later.",
      "stuffed. singing tomorrow.",
      "no more seed. still cute though.",
    ],
    carried: [
      "I can fly, you know",
      "cheep — nice view!",
      "gently, I'm mostly feathers",
      "released? I'll allow it.",
    ],
  },
};

const FOOD: Record<PetKind, string[]> = {
  cat: ["🐟", "🍣", "🐠"],
  dog: ["🦴", "🍖", "🥩"],
  bird: ["🌾", "🌰", "🐛"],
};

const PET_ORDER: PetKind[] = ["cat", "dog", "bird"];

const FEED_COOLDOWN_MS = 6000;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function indiaHour(): number {
  return (
    Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false,
      }).format(new Date()),
    ) % 24
  );
}

function isSleepHour(): boolean {
  const h = indiaHour();
  return h >= 23 || h < 7;
}

function spawnFoodBits(el: HTMLElement, kind: PetKind) {
  const foods = FOOD[kind];
  const drop = (jitter: number) => {
    const rect = el.getBoundingClientRect();
    const bit = document.createElement("span");
    bit.className = "food-bit";
    bit.textContent = pick(foods);
    bit.style.left = `${rect.left + rect.width / 2 + jitter}px`;
    bit.style.top = `${rect.top - 4}px`;
    document.body.appendChild(bit);
    requestAnimationFrame(() => bit.classList.add("drop"));
    setTimeout(() => bit.remove(), 720);
  };
  drop(14 * (Math.random() - 0.5));
  setTimeout(() => drop(20 * (Math.random() - 0.5)), 120);
}

function Dreams({ z1, z2 }: { z1: string; z2: string }) {
  return (
    <g className="dreams" strokeLinecap="round" stroke="currentColor" fill="none" strokeLinejoin="round">
      <g className="z z-1" strokeWidth="1.5">
        <path d={z1} />
      </g>
      <g className="z z-2" strokeWidth="1.3">
        <path d={z2} />
      </g>
    </g>
  );
}

function CatSvg() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 32" className="pet__svg" fill="none">
      <Dreams z1="M34 1 L38 1 L34 5 L38 5" z2="M37 -1.2 L40 -1.2 L37 1.8 L40 1.8" />
      <g className="body">
        <g className="cat-whiskers" strokeWidth="1.1" stroke="currentColor" strokeLinecap="round" fill="none">
          <path d="M8.5 10.5 L2 8.6" />
          <path d="M8 12.8 L1.2 12.6" />
          <path d="M8.5 15 L2.2 16.8" />
          <path d="M25.5 10.5 L32 8.6" />
          <path d="M26 12.8 L32.8 12.6" />
          <path d="M25.5 15 L31.8 16.8" />
        </g>
        <path
          d="M26.8 26 C30.2 25 32 21 31.2 16.8"
          fill="none"
          className="wag cat-tail"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.7"
        />
        <path
          d="M10.3 9 L8.6 2.8 L13.6 5 C15.6 4.3 18.4 4.3 20.4 5 L25.4 2.8 L23.7 9 C24.6 10.8 24.9 13 24.2 15 C26.3 17.2 27.4 20.4 27.3 23.6 C27.3 25.8 26 27.6 23.5 28.3 C19.5 29.3 14.5 29.3 11.5 28.2 C8.9 27 7.8 24 8.2 21 C8.5 18.5 9.3 16.4 10.6 14.9 C9.6 12.9 9.7 10.9 10.3 9 Z"
          fill="currentColor"
        />
        <g className="eyes">
          <circle cx="13.9" cy="11.6" r="2.1" fill="var(--pet-paper)" className="eye" />
          <circle cx="20.1" cy="11.6" r="2.1" fill="var(--pet-paper)" className="eye" />
        </g>
      </g>
    </svg>
  );
}

function DogSvg() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 38" className="pet__svg" fill="none">
      <Dreams z1="M32 3 L36 3 L32 7 L36 7" z2="M35 0.4 L38 0.4 L35 3.4 L38 3.4" />
      <g className="body">
        <path
          d="M31 30 C37 30 38 24 35 21"
          className="wag dog-tail"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path d="M11 36 C9 26 14 22 20 22 C26 22 31 26 29 36 Z" fill="currentColor" />
        <circle cx="20" cy="14" r="11" fill="currentColor" />
        <path d="M11 8 C6 9 6 18 10 21 C13 18 13.5 11 11 8 Z" fill="currentColor" className="dog-ear" />
        <path d="M29 8 C34 9 34 18 30 21 C27 18 26.5 11 29 8 Z" fill="currentColor" className="dog-ear" />
        <ellipse cx="20" cy="18.5" fill="currentColor" rx="5" ry="4" />
        <path
          d="M18.3 20.5 C18.3 25.5 21.7 25.5 21.7 20.5 Z"
          fill="var(--pet-tongue)"
          className="dog-tongue"
        />
        <circle cx="20" cy="16" r="1.5" fill="var(--pet-paper)" />
        <g className="eyes">
          <circle cx="15" cy="12" r="2" fill="var(--pet-paper)" className="eye" />
          <circle cx="25" cy="12" r="2" fill="var(--pet-paper)" className="eye" />
        </g>
      </g>
    </svg>
  );
}

function BirdSvg() {
  return (
    <svg aria-hidden="true" viewBox="0 0 34 36" className="pet__svg" fill="none">
      <Dreams z1="M27 2 L31 2 L27 6 L31 6" z2="M30 -0.6 L33 -0.6 L30 2.4 L33 2.4" />
      <g className="body">
        <g className="bird-feet" strokeWidth="1.3" stroke="currentColor" strokeLinecap="round">
          <path d="M14 30 L14 33" />
          <path d="M19 30 L19 33" />
        </g>
        <path d="M2 18 L10 15 L9 24 Z" fill="currentColor" />
        <ellipse cx="16" cy="20" fill="currentColor" rx="11" ry="11" />
        <circle cx="24" cy="11" r="6.5" fill="currentColor" />
        <path
          d="M11 17 Q18 21 14 27"
          fill="none"
          className="bird-wing"
          stroke="var(--pet-paper)"
          strokeLinecap="round"
          strokeWidth="1.4"
          opacity="0.5"
        />
        <path d="M29.5 11 L34 12 L29.5 13.6 Z" fill="var(--pet-beak)" className="bird-beak" />
        <circle cx="26" cy="10" r="1.7" fill="var(--pet-paper)" className="eye" />
      </g>
    </svg>
  );
}

const PET_SVGS: Record<PetKind, () => React.JSX.Element> = {
  cat: CatSvg,
  dog: DogSvg,
  bird: BirdSvg,
};

function Pet({
  kind,
  asleep,
  reducedMotion,
  registerFeed,
}: {
  kind: PetKind;
  asleep: boolean;
  reducedMotion: boolean;
  registerFeed: (kind: PetKind, feed: () => void) => () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const lastFed = useRef(0);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkOffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef({
    active: false,
    moved: false,
    spoke: false,
    startX: 0,
    startY: 0,
    baseDx: 0,
    baseDy: 0,
  });
  const [blinking, setBlinking] = useState(false);
  const [eating, setEating] = useState(false);
  const [free, setFree] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);

  const say = useCallback(
    (text: string, ms = 2200) => {
      if (reducedMotion) return;
      setBubble(text);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setBubble(null), ms);
    },
    [reducedMotion],
  );

  const feed = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    spawnFoodBits(el, kind);
    petSfx.play("pop");
    if (asleep) {
      say(pick(LINES[kind].asleep), 1600);
      return;
    }
    if (Date.now() - lastFed.current < FEED_COOLDOWN_MS) {
      say(pick(LINES[kind].full), 1400);
      return;
    }
    lastFed.current = Date.now();
    setEating(true);
    say(pick(LINES[kind].fed), 1800);
    if (eatTimer.current) clearTimeout(eatTimer.current);
    eatTimer.current = setTimeout(() => setEating(false), 760);
  }, [asleep, kind, say]);

  useEffect(() => registerFeed(kind, feed), [kind, feed, registerFeed]);

  useEffect(() => {
    if (asleep || reducedMotion) return;
    const el = ref.current;
    const period = 3600 + Math.floor((el?.offsetLeft ?? 0) % 7) * 220;
    const id = setInterval(() => {
      setBlinking(true);
      if (blinkOffTimer.current) clearTimeout(blinkOffTimer.current);
      blinkOffTimer.current = setTimeout(() => setBlinking(false), 150);
    }, period);
    return () => {
      clearInterval(id);
      if (blinkOffTimer.current) clearTimeout(blinkOffTimer.current);
    };
  }, [asleep, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || asleep) return;
    const id = setInterval(() => {
      if (document.querySelector(".pet__bubble.is-visible")) return;
      if (Math.random() > 0.66) return;
      say(pick(LINES[kind].idle));
    }, 14_000);
    return () => clearInterval(id);
  }, [asleep, kind, reducedMotion, say]);

  useEffect(() => {
    return () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      if (eatTimer.current) clearTimeout(eatTimer.current);
      if (blinkOffTimer.current) clearTimeout(blinkOffTimer.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    const style = getComputedStyle(el);
    drag.current = {
      active: true,
      moved: false,
      spoke: false,
      startX: e.clientX,
      startY: e.clientY,
      baseDx: parseFloat(style.getPropertyValue("--dx")) || 0,
      baseDy: parseFloat(style.getPropertyValue("--dy")) || 0,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const el = ref.current;
    if (!el) return;
    const ox = e.clientX - d.startX;
    const oy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(ox, oy) > 5) {
      d.moved = true;
      setFree(true);
      setDragging(true);
    }
    if (d.moved) {
      el.style.setProperty("--dx", `${d.baseDx + ox}px`);
      el.style.setProperty("--dy", `${d.baseDy + oy}px`);
      if (!d.spoke) {
        d.spoke = true;
        petSfx.play("boop");
        say(pick(asleep ? LINES[kind].asleep : LINES[kind].carried), 1500);
      }
    }
  };

  const endPointer = (e: React.PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setDragging(false);
    try {
      ref.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    if (!d.moved) feed();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      feed();
    }
  };

  const Svg = PET_SVGS[kind];

  return (
    <span
      ref={ref}
      className={[
        "pet",
        `pet--${kind}`,
        asleep ? "is-asleep" : "",
        blinking ? "is-blinking" : "",
        eating ? "is-eating" : "",
        free ? "pet--free" : "",
        dragging ? "is-dragging" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`pet the ${kind}`}
      data-pet={kind}
      role="button"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onKeyDown={onKeyDown}
    >
      <span
        className={`bubble pet__bubble${bubble ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {bubble
          ? [...bubble].map((ch, i) => (
              <span key={`${bubble}-${i}`} style={{ ["--i" as string]: i }}>
                {ch}
              </span>
            ))
          : null}
      </span>
      <Svg />
    </span>
  );
}

export function Menagerie() {
  const pathname = usePathname();
  const showNote = pathname === "/";
  const [asleep, setAsleep] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [feedThrown, setFeedThrown] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const feedFns = useRef(new Map<PetKind, () => void>());
  const feedAllTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const registerFeed = useCallback((kind: PetKind, feed: () => void) => {
    feedFns.current.set(kind, feed);
    return () => {
      feedFns.current.delete(kind);
    };
  }, []);

  useEffect(() => {
    petSfx.init();
    setSoundOn(petSfx.getMode() !== "off");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const sync = () => setAsleep(isSleepHour());
    sync();
    const id = setInterval(sync, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      feedAllTimers.current.forEach(clearTimeout);
    };
  }, []);

  const feedAll = () => {
    setFeedThrown(true);
    petSfx.play("tick");
    feedAllTimers.current.forEach(clearTimeout);
    feedAllTimers.current = [
      setTimeout(() => setFeedThrown(false), 500),
      ...PET_ORDER.map((kind, i) =>
        setTimeout(() => feedFns.current.get(kind)?.(), 260 + 150 * i),
      ),
    ];
  };

  const toggleSound = () => {
    setSoundOn(petSfx.toggle() !== "off");
  };

  return (
    <div className="menagerie-wrap">
      <div className="menagerie" id="menagerie">
        {PET_ORDER.map((kind) => (
          <Pet
            key={kind}
            kind={kind}
            asleep={asleep}
            reducedMotion={reducedMotion}
            registerFeed={registerFeed}
          />
        ))}
        <button
          className={`feed${feedThrown ? " is-thrown" : ""}`}
          type="button"
          aria-label="feed the pets"
          title="feed the pets"
          onClick={feedAll}
        >
          <svg aria-hidden="true" viewBox="0 0 22 12" className="feed__treat" fill="none">
            <g fill="currentColor">
              <rect height="4" width="10" x="6" y="4" rx="1.4" />
              <circle cx="6" cy="4" r="2.4" />
              <circle cx="6" cy="8" r="2.4" />
              <circle cx="16" cy="4" r="2.4" />
              <circle cx="16" cy="8" r="2.4" />
            </g>
          </svg>
        </button>
        <button
          className={`feed-sound${soundOn ? " is-on" : ""}`}
          type="button"
          aria-label={soundOn ? "mute pet sounds" : "unmute pet sounds"}
          aria-pressed={soundOn}
          title={soundOn ? "mute sounds" : "unmute sounds"}
          onClick={toggleSound}
        >
          {soundOn ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="feed-sound__icon">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5 6 9H3v6h3l5 4V5z"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12"
              />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="feed-sound__icon">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5 6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6"
              />
            </svg>
          )}
        </button>
      </div>
      {showNote ? (
        <p className="menagerie-note">
          the office. <b>drag</b> them anywhere, <b>tap</b> to feed fish for the
          cat, a bone for the dog, seed for the bird.
        </p>
      ) : null}
    </div>
  );
}
