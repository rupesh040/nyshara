"use client";
 
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Jost, Cormorant_Garamond } from "next/font/google";
import contentData from "@/data/content.json";
import { GalleryData } from "@/data/type";
 
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
 
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
 
interface GalleryProps {
  data?: GalleryData;
}
 
interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}
 
interface LightboxState {
  index: number;
  leaving: number | null;
  phase: "opening" | "open" | "closing";
}
 
type ImgSrc = React.ComponentProps<typeof Image>["src"];
 
const TILE_SIZES = "(max-width: 1024px) 50vw, 30vw";
const TILE_DELAYS = [700, 880, 1060, 970, 1150, 1240];
const MAX_TILES = 6;
 
const delayVar = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);
 
const GALLERY_CSS = `
@keyframes nys-g-fade {
  from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes nys-g-line {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes nys-g-rise {
  from { transform: translateY(135%); filter: blur(5px); }
  to   { transform: translateY(0); filter: blur(0); }
}
@keyframes nys-g-bloom {
  from { opacity: 0; transform: scale(0.9); filter: blur(8px); }
  to   { opacity: 1; transform: scale(1); filter: blur(0); }
}
@keyframes nys-g-aperture {
  from { clip-path: inset(50% 50% 50% 50%); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes nys-g-settle {
  from { transform: scale(1.2); }
  to   { transform: scale(1); }
}
@keyframes nys-g-out {
  to { opacity: 0; transform: scale(1.06); }
}
 
.nys-g-l { transform-origin: right center; }
.nys-g-r { transform-origin: left center; }
 
.nys-g[data-in="false"] .nys-g-fade     { opacity: 0; }
.nys-g[data-in="false"] .nys-g-line     { transform: scaleX(0); }
.nys-g[data-in="false"] .nys-g-rise     { transform: translateY(135%); }
.nys-g[data-in="false"] .nys-g-bloom    { opacity: 0; }
.nys-g[data-in="false"] .nys-g-aperture { clip-path: inset(50% 50% 50% 50%); }
.nys-g[data-in="false"] .nys-g-settle   { transform: scale(1.2); }
 
.nys-g[data-in="true"] .nys-g-fade {
  animation: nys-g-fade 0.9s ease var(--d, 0ms) backwards;
}
.nys-g[data-in="true"] .nys-g-line {
  animation: nys-g-line 1.1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards;
}
.nys-g[data-in="true"] .nys-g-rise {
  animation: nys-g-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--w, 0) * 110ms + 350ms);
}
.nys-g[data-in="true"] .nys-g-bloom {
  animation: nys-g-bloom 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards;
}
.nys-g[data-in="true"] .nys-g-aperture {
  animation: nys-g-aperture 1.3s cubic-bezier(0.77, 0, 0.18, 1) var(--d, 0ms) backwards;
}
.nys-g[data-in="true"] .nys-g-settle {
  animation: nys-g-settle 2.2s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) backwards;
}
 
.nys-g-zoom {
  transition: transform 1.4s cubic-bezier(0.22, 1, 0.36, 1);
}
 
.nys-g-frame {
  --c: rgba(255, 255, 255, 0.95);
  --s: clamp(14px, 1.6vw, 26px);
  position: absolute;
  inset: clamp(8px, 1vw, 16px);
  opacity: 0;
  transform: scale(1.07);
  pointer-events: none;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));
  transition: opacity 0.5s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  background:
    linear-gradient(var(--c), var(--c)) top left / var(--s) 1.5px no-repeat,
    linear-gradient(var(--c), var(--c)) top left / 1.5px var(--s) no-repeat,
    linear-gradient(var(--c), var(--c)) top right / var(--s) 1.5px no-repeat,
    linear-gradient(var(--c), var(--c)) top right / 1.5px var(--s) no-repeat,
    linear-gradient(var(--c), var(--c)) bottom left / var(--s) 1.5px no-repeat,
    linear-gradient(var(--c), var(--c)) bottom left / 1.5px var(--s) no-repeat,
    linear-gradient(var(--c), var(--c)) bottom right / var(--s) 1.5px no-repeat,
    linear-gradient(var(--c), var(--c)) bottom right / 1.5px var(--s) no-repeat;
}
 
@media (hover: hover) {
  .nys-g-tile:hover .nys-g-zoom { transform: scale(1.05); }
}
.nys-g-tile:hover .nys-g-frame,
.nys-g-tile:focus-visible .nys-g-frame {
  opacity: 1;
  transform: scale(1);
}
.nys-g-tile:focus-visible {
  outline: 2px solid #C2806D;
  outline-offset: 3px;
}
 
.nys-g-lb {
  --e: cubic-bezier(0.65, 0, 0.35, 1);
  position: fixed;
  inset: 0;
  z-index: 100;
}
.nys-g-lb-bg {
  position: absolute;
  inset: 0;
  background: rgba(11, 17, 34, 0.94);
  backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 0.8s ease;
}
.nys-g-lb[data-phase="open"] .nys-g-lb-bg { opacity: 1; }
 
.nys-g-lb-stage {
  position: fixed;
  overflow: hidden;
  background: #EFE4DA;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  transition:
    left 0.9s var(--e),
    top 0.9s var(--e),
    width 0.9s var(--e),
    height 0.9s var(--e);
}
.nys-g-lb-layer {
  position: absolute;
  inset: 0;
}
.nys-g-lb-out {
  animation: nys-g-out 0.8s ease forwards;
}
 
.nys-g-lb-ui {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, background-color 0.3s ease;
}
.nys-g-lb[data-phase="open"] .nys-g-lb-ui {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.6s ease 0.5s, background-color 0.3s ease;
}
 
.nys-g-lb-btn {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 9999px;
  background: transparent;
  color: #fff;
  cursor: pointer;
}
.nys-g-lb-btn:hover { background: rgba(255, 255, 255, 0.14); }
.nys-g-lb-btn:focus-visible {
  outline: 2px solid #C2806D;
  outline-offset: 3px;
}
.nys-g-lb-close {
  top: clamp(12px, 2vw, 28px);
  right: clamp(12px, 2vw, 28px);
}
.nys-g-lb-prev {
  left: clamp(8px, 2vw, 32px);
  top: 50%;
  margin-top: -23px;
}
.nys-g-lb-next {
  right: clamp(8px, 2vw, 32px);
  top: 50%;
  margin-top: -23px;
}
.nys-g-lb-count {
  position: fixed;
  left: 0;
  right: 0;
  bottom: clamp(18px, 2.4vw, 36px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  letter-spacing: 0.24em;
  pointer-events: none;
}
.nys-g-lb-bar {
  width: 96px;
  height: 1px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.25);
}
.nys-g-lb-fill {
  display: block;
  height: 100%;
  background: #C2806D;
  transform-origin: left center;
  transition: transform 0.8s var(--e);
}
 
@media (max-width: 767px) {
  .nys-g-lb-prev {
    left: calc(50% - 130px);
    top: auto;
    bottom: 14px;
    margin-top: 0;
  }
  .nys-g-lb-next {
    right: calc(50% - 130px);
    top: auto;
    bottom: 14px;
    margin-top: 0;
  }
}
 
@media (prefers-reduced-motion: reduce) {
  .nys-g *, .nys-g *::before, .nys-g *::after,
  .nys-g-lb, .nys-g-lb *, .nys-g-lb *::before, .nys-g-lb *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
 
function LightboxLayer({ src, alt }: { src: ImgSrc; alt: string }) {
  const [ready, setReady] = useState<boolean>(false);
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={TILE_SIZES}
        className="object-cover object-center"
      />
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 92vw, 80vw"
        quality={90}
        loading="eager"
        onLoad={() => setReady(true)}
        className={`object-cover object-center transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
 
export default function Gallery({ data: customData }: GalleryProps) {
  const galleryData: GalleryData =
    customData ||
    (contentData.Nyshara.sections.Gallery.variants
      .NysharaGallery1 as GalleryData);
 
  const items = galleryData.items;
  const count = Math.min(items.length, MAX_TILES);
 
  const sectionRef = useRef<HTMLElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lbRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
 
  const [inView, setInView] = useState<boolean>(false);
  const [lb, setLb] = useState<LightboxState | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
 
  const isOpen = lb !== null;
  const phase = lb?.phase;
  const index = lb?.index;
  const leaving = lb?.leaving ?? null;
 
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
 
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setInView(true);
      return;
    }
 
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
 
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);
 
  const getTileRect = useCallback((i: number): Rect => {
    const el = tileRefs.current[i];
    if (!el) {
      return {
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
        width: 0,
        height: 0,
      };
    }
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }, []);
 
  const getTargetRect = useCallback((i: number): Rect => {
    const img = tileRefs.current[i]?.querySelector("img");
    const ratio =
      img && img.naturalWidth && img.naturalHeight
        ? img.naturalWidth / img.naturalHeight
        : 4 / 5;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const small = vw < 768;
    const maxW = vw * (small ? 0.92 : 0.8);
    const maxH = vh * (small ? 0.72 : 0.82);
    let width = maxW;
    let height = width / ratio;
    if (height > maxH) {
      height = maxH;
      width = height * ratio;
    }
    return {
      left: (vw - width) / 2,
      top: (vh - height) / 2 - (small ? 20 : 14),
      width,
      height,
    };
  }, []);
 
  const openAt = (i: number) => {
    if (lb) return;
    const source = getTileRect(i);
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbar > 0 ? `${scrollbar}px` : "";
    document.body.style.overflow = "hidden";
    setRect(source);
    setLb({ index: i, leaving: null, phase: "opening" });
  };
 
  const closeLightbox = useCallback(() => {
    setLb((s) => (s && s.phase === "open" ? { ...s, phase: "closing" } : s));
  }, []);
 
  const go = useCallback(
    (dir: 1 | -1) => {
      setLb((s) => {
        if (!s || s.phase !== "open" || count < 2) return s;
        const next = (s.index + dir + count) % count;
        return { index: next, leaving: s.index, phase: "open" };
      });
    },
    [count]
  );
 
  useEffect(() => {
    if (phase !== "opening" || index === undefined) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        setRect(getTargetRect(index));
        setLb((s) => (s ? { ...s, phase: "open" } : s));
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [phase, index, getTargetRect]);
 
  useEffect(() => {
    if (phase !== "open" || index === undefined) return;
    setRect(getTargetRect(index));
  }, [phase, index, getTargetRect]);
 
  useEffect(() => {
    if (phase !== "open") return;
    closeBtnRef.current?.focus({ preventScroll: true });
  }, [phase]);
 
  useEffect(() => {
    if (phase !== "closing" || index === undefined) return;
    setRect(getTileRect(index));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(
      () => {
        setLb(null);
        setRect(null);
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        tileRefs.current[index]?.focus({ preventScroll: true });
      },
      reduce ? 0 : 900
    );
    return () => clearTimeout(timer);
  }, [phase, index, getTileRect]);
 
  useEffect(() => {
    if (leaving === null) return;
    const timer = setTimeout(() => {
      setLb((s) => (s ? { ...s, leaving: null } : s));
    }, 800);
    return () => clearTimeout(timer);
  }, [leaving, index]);
 
  useEffect(() => {
    if (!isOpen) return;
 
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        go(1);
      } else if (e.key === "ArrowLeft") {
        go(-1);
      } else if (e.key === "Tab" && lbRef.current) {
        const focusable = Array.from(
          lbRef.current.querySelectorAll<HTMLElement>("button")
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (!active || !focusable.includes(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
 
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeLightbox, go]);
 
  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => {
      if (phase === "open" && index !== undefined) {
        setRect(getTargetRect(index));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen, phase, index, getTargetRect]);
 
  const headingWords = galleryData.heading.split(" ");
 
  const renderTile = (i: number, layoutClass: string) => {
    const item = items[i];
    if (!item) return null;
    return (
      <button
        key={i}
        ref={(el) => {
          tileRefs.current[i] = el;
        }}
        type="button"
        onClick={() => openAt(i)}
        aria-label={`View image: ${item.imageAlt}`}
        aria-haspopup="dialog"
        style={{
          ...delayVar(TILE_DELAYS[i]),
          visibility: index === i ? "hidden" : undefined,
        }}
        className={`nys-g-tile nys-g-aperture relative block w-full cursor-zoom-in overflow-hidden bg-[#F3EADF] ${layoutClass}`}
      >
        <div className="nys-g-settle absolute inset-0">
          <div className="nys-g-zoom absolute inset-0">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes={TILE_SIZES}
              className="object-cover object-center"
            />
          </div>
        </div>
        <div aria-hidden="true" className="nys-g-frame" />
      </button>
    );
  };
 
  return (
    <section
      id="gallery"
      ref={sectionRef}
      data-in={inView ? "true" : "false"}
      className={`${jost.className} nys-g relative w-full mx-auto max-w-[1280px] select-none overflow-hidden bg-white pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-10 lg:pb-14 scroll-mt-20`}
    >
      <style dangerouslySetInnerHTML={{ __html: GALLERY_CSS }} />
 
      <div className="mx-auto w-full max-w-[1920px] px-[clamp(0.75rem,1.3vw,2rem)]">
        <div className="relative mb-[clamp(1.75rem,3.85vw,5rem)] text-center">
          {galleryData.watermarkImage && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            >
              <div className="nys-g-bloom w-[clamp(11rem,14.5vw,20rem)]">
                <Image
                  src={galleryData.watermarkImage}
                  alt={galleryData.watermarkAlt || ""}
                  width={360}
                  height={204}
                  className="mx-auto h-auto w-full object-contain opacity-25"
                />
              </div>
            </div>
          )}
 
          <div className="relative z-10">
            <div className="mb-[clamp(0.9rem,1.8vw,2.5rem)] flex items-center justify-center gap-[clamp(0.75rem,2.1vw,3rem)]">
              <span
                aria-hidden="true"
                style={delayVar(250)}
                className="nys-g-line nys-g-l h-[1.5px] w-[clamp(2.5rem,5.5vw,7rem)] rounded-full bg-[#C2806D] md:h-[2px]"
              />
              <span
                style={delayVar(100)}
                className="nys-g-fade text-[clamp(0.75rem,0.35rem+1vw,1.5rem)] font-medium uppercase leading-none tracking-[0.4em] text-[#1F2A48]"
              >
                {galleryData.tagline}
              </span>
              <span
                aria-hidden="true"
                style={delayVar(250)}
                className="nys-g-line nys-g-r h-[1.5px] w-[clamp(2.5rem,5.5vw,7rem)] rounded-full bg-[#C2806D] md:h-[2px]"
              />
            </div>
 
            <h2
              className={`${cormorant.className} text-[clamp(1.9rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-[#0F1B33]`}
            >
              <span className="-mb-[0.24em] -mt-[0.12em] block overflow-hidden pb-[0.24em] pt-[0.12em]">
                {headingWords.map((word, i) => (
                  <React.Fragment key={`${word}-${i}`}>
                    <span
                      className="nys-g-rise inline-block"
                      style={{ "--w": i } as React.CSSProperties}
                    >
                      {word}
                    </span>
                    {i < headingWords.length - 1 ? " " : null}
                  </React.Fragment>
                ))}
              </span>
            </h2>
          </div>
        </div>
 
        <div className="grid grid-cols-2 gap-[clamp(0.5rem,0.55vw,0.9rem)] lg:aspect-[1457/511] lg:grid-cols-[415fr_671fr_354fr] lg:grid-rows-[minmax(0,1fr)]">
          {renderTile(
            0,
            "col-span-2 aspect-[5/6] lg:col-span-1 lg:aspect-auto lg:h-full"
          )}
 
          <div className="contents lg:grid lg:grid-rows-2 lg:gap-[clamp(0.5rem,0.55vw,0.9rem)]">
            <div className="contents lg:grid lg:grid-cols-[333fr_330fr] lg:gap-[clamp(0.5rem,0.55vw,0.9rem)]">
              {renderTile(1, "aspect-[4/3] lg:aspect-auto lg:h-full")}
              {renderTile(2, "aspect-[4/3] lg:aspect-auto lg:h-full")}
            </div>
            <div className="contents lg:grid lg:grid-cols-[353fr_309fr] lg:gap-[clamp(0.5rem,0.55vw,0.9rem)]">
              {renderTile(3, "aspect-[4/3] lg:aspect-auto lg:h-full")}
              {renderTile(4, "aspect-[4/3] lg:aspect-auto lg:h-full")}
            </div>
          </div>
 
          {renderTile(
            5,
            "col-span-2 aspect-[5/6] lg:col-span-1 lg:aspect-auto lg:h-full"
          )}
        </div>
      </div>
 
      {lb &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={lbRef}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            data-phase={lb.phase}
            className={`${jost.className} nys-g-lb`}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
          >
            <div className="nys-g-lb-bg" onClick={closeLightbox} />
 
            <div
              className="nys-g-lb-stage"
              style={
                rect
                  ? {
                      left: rect.left,
                      top: rect.top,
                      width: rect.width,
                      height: rect.height,
                    }
                  : undefined
              }
            >
              {items[lb.index] && (
                <div key={`in-${lb.index}`} className="nys-g-lb-layer">
                  <LightboxLayer
                    src={items[lb.index].image}
                    alt={items[lb.index].imageAlt}
                  />
                </div>
              )}
              {lb.leaving !== null && items[lb.leaving] && (
                <div
                  key={`out-${lb.leaving}`}
                  className="nys-g-lb-layer nys-g-lb-out"
                >
                  <Image
                    src={items[lb.leaving].image}
                    alt=""
                    fill
                    sizes={TILE_SIZES}
                    className="object-cover object-center"
                  />
                </div>
              )}
            </div>
 
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Close image viewer"
              className="nys-g-lb-btn nys-g-lb-ui nys-g-lb-close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
 
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="nys-g-lb-btn nys-g-lb-ui nys-g-lb-prev"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="nys-g-lb-btn nys-g-lb-ui nys-g-lb-next"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
 
            <div className="nys-g-lb-count nys-g-lb-ui" aria-live="polite">
              <span>
                {String(lb.index + 1).padStart(2, "0")} /{" "}
                {String(count).padStart(2, "0")}
              </span>
              <span className="nys-g-lb-bar">
                <span
                  className="nys-g-lb-fill"
                  style={{ transform: `scaleX(${(lb.index + 1) / count})` }}
                />
              </span>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
 