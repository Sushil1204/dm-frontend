"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { heroItem, heroStagger } from "@/components/motion/tokens";
import { buttonClassName } from "@/components/ui/Button";
import { resolveMedia } from "@/lib/media";
import type { Media } from "@/payload-types";

export type HeroData = {
  eyebrow?: string | null;
  headline?: string | null;
  body?: string | null;
  primaryCta?: { label?: string | null; url?: string | null } | null;
  secondaryCta?: { label?: string | null; url?: string | null } | null;
  video?: Media | number | null;
  mobileVideo?: Media | number | null;
  poster?: Media | number | null;
  videoSettings?: { autoplay?: boolean | null; loop?: boolean | null } | null;
  proofPoints?: { label?: string | null; note?: string | null }[] | null;
};

const FALLBACK_POSTER = "/media/hero-poster.png";

export function HeroVideo({ hero }: { hero: HeroData }) {
  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const video = resolveMedia(hero.video ?? null);
  const mobileVideo = resolveMedia(hero.mobileVideo ?? null);
  const poster = resolveMedia(hero.poster ?? null);
  const posterUrl = poster?.url || FALLBACK_POSTER;

  const shouldPlay =
    !!video && Boolean(hero.videoSettings?.autoplay ?? true) && !prefersReduced && !userPaused;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (shouldPlay) {
      const attempt = el.play();
      if (attempt?.catch) attempt.catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [shouldPlay, video]);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      setUserPaused(false);
      void el.play();
      setPlaying(true);
    } else {
      setUserPaused(true);
      el.pause();
      setPlaying(false);
    }
  };

  const proofPoints = (hero.proofPoints ?? []).filter((p) => p?.label);

  return (
    <section className="relative isolate flex min-h-[640px] flex-col justify-end overflow-hidden bg-primary text-white lg:h-[min(88vh,880px)] lg:min-h-[680px] lg:justify-center">
      {/* Media layer */}
      <div className="absolute inset-0 -z-10">
        {video ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={posterUrl}
            muted
            loop={hero.videoSettings?.loop ?? true}
            playsInline
            autoPlay={false}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            {mobileVideo?.url ? (
              <source src={mobileVideo.url} media="(max-width: 767px)" type={mobileVideo.mimeType || undefined} />
            ) : null}
            <source src={video.url || undefined} type={video.mimeType || undefined} />
          </video>
        ) : (
          <Image
            src={posterUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-drift object-cover"
          />
        )}
        {/* Dark gradient from the text side */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/92 via-primary/70 to-primary/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/20" />
      </div>

      <div className="shell relative pb-14 pt-28 lg:pb-20 lg:pt-32">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {hero.eyebrow ? (
            <motion.p variants={heroItem} className="eyebrow text-accent">
              {hero.eyebrow}
            </motion.p>
          ) : null}

          <motion.h1
            variants={heroItem}
            className="mt-5 text-balance font-display text-h1 font-semibold leading-[1.04] tracking-tight text-white"
          >
            {hero.headline}
          </motion.h1>

          {hero.body ? (
            <motion.p variants={heroItem} className="mt-6 max-w-xl text-lead text-white/80">
              {hero.body}
            </motion.p>
          ) : null}

          <motion.div variants={heroItem} className="mt-9 flex flex-wrap gap-3">
            {hero.primaryCta?.label && hero.primaryCta?.url ? (
              <Link href={hero.primaryCta.url} className={buttonClassName("accent", "md")}>
                {hero.primaryCta.label}
              </Link>
            ) : null}
            {hero.secondaryCta?.label && hero.secondaryCta?.url ? (
              <Link
                href={hero.secondaryCta.url}
                className={buttonClassName("secondary", "md", "border-white/45 text-white hover:border-white hover:bg-white/10")}
              >
                {hero.secondaryCta.label}
              </Link>
            ) : null}
          </motion.div>
        </motion.div>
      </div>

      {/* Proof-point row */}
      {proofPoints.length > 0 ? (
        <div className="shell relative border-t border-white/15 pb-8 pt-6 lg:pb-10">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
            {proofPoints.map((point, index) => (
              <li
                key={`${point.label}-${index}`}
                className="border-l border-white/25 pl-4 first:border-l-0 first:pl-0 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
              >
                <p className="text-sm font-semibold text-white">{point.label}</p>
                {point.note ? (
                  <p className="mt-0.5 text-meta text-white/60">{point.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Pause / play control (only when video exists) */}
      <AnimatePresence>
        {video ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            aria-pressed={!playing}
            aria-label={playing ? "Pause background video" : "Play background video"}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-primary/50 text-white backdrop-blur transition-colors duration-200 hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:right-8 lg:top-8"
          >
            {playing ? (
              <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" fill="currentColor">
                <rect x="0" y="0" width="4" height="14" />
                <rect x="8" y="0" width="4" height="14" />
              </svg>
            ) : (
              <svg width="13" height="15" viewBox="0 0 13 15" aria-hidden="true" fill="currentColor">
                <path d="M0 0l13 7.5L0 15z" />
              </svg>
            )}
          </motion.button>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
