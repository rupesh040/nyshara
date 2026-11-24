"use client";
 
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost, Cormorant_Garamond } from "next/font/google";
import contentData from "@/data/content.json";
import { CollectionsData } from "@/data/type";
 
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
 
interface CollectionsProps {
  data?: CollectionsData;
}
 
const delayVar = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);
 
const COLLECTIONS_CSS = `
@keyframes nys-c-fade {
  from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes nys-c-line {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes nys-c-rise {
  from { transform: translateY(135%); filter: blur(5px); }
  to   { transform: translateY(0); filter: blur(0); }
}
@keyframes nys-c-gem {
  from { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
  to   { clip-path: polygon(50% -60%, 160% 50%, 50% 160%, -60% 50%); }
}
@keyframes nys-c-settle {
  from { transform: scale(1.22); }
  to   { transform: scale(1); }
}
 
.nys-c-line { transform-origin: center; }
.nys-c-l    { transform-origin: right center; }
.nys-c-r    { transform-origin: left center; }
 
.nys-c[data-in="false"] .nys-c-fade   { opacity: 0; }
.nys-c[data-in="false"] .nys-c-label  { opacity: 0; }
.nys-c[data-in="false"] .nys-c-line   { transform: scaleX(0); }
.nys-c[data-in="false"] .nys-c-rise   { transform: translateY(135%); }
.nys-c[data-in="false"] .nys-c-gem    { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
.nys-c[data-in="false"] .nys-c-settle { transform: scale(1.22); }
 
.nys-c[data-in="true"] .nys-c-fade {
  animation: nys-c-fade 0.9s ease var(--d, 0ms) backwards;
}
.nys-c[data-in="true"] .nys-c-line {
  animation: nys-c-line 1.1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards;
}
.nys-c[data-in="true"] .nys-c-rise {
  animation: nys-c-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--w, 0) * 110ms + 350ms);
}
.nys-c[data-in="true"] .nys-c-gem {
  animation: nys-c-gem 1.5s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards;
}
.nys-c[data-in="true"] .nys-c-settle {
  animation: nys-c-settle 2.4s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) backwards;
}
.nys-c[data-in="true"] .nys-c-label {
  animation: nys-c-fade 0.9s ease calc(var(--d, 0ms) + 900ms) backwards;
}
.nys-c[data-in="true"] .nys-c-cardline {
  animation-delay: calc(var(--d, 0ms) + 1200ms);
}
 
.nys-c-card {
  transition: opacity 0.6s ease, filter 0.6s ease;
}
.nys-c-zoom {
  transition: transform 1.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.nys-c-frame {
  position: absolute;
  inset: clamp(8px, 1.1vw, 16px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  opacity: 0;
  transform: scale(1.06);
  pointer-events: none;
  transition: opacity 0.6s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
 
@media (hover: hover) {
  .nys-c-grid:hover .nys-c-card:not(:hover) {
    opacity: 0.55;
    filter: saturate(0.7);
  }
  .nys-c-card:hover .nys-c-zoom {
    transform: scale(1.06);
  }
}
.nys-c-card:hover .nys-c-frame,
.nys-c-card:focus-visible .nys-c-frame {
  opacity: 1;
  transform: scale(1);
}
.nys-c-card:focus-visible {
  outline: 2px solid #C2806D;
  outline-offset: 3px;
}
 
@media (prefers-reduced-motion: reduce) {
  .nys-c *, .nys-c *::before, .nys-c *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
 
export default function Collections({ data: customData }: CollectionsProps) {
  const collectionsData: CollectionsData =
    customData ||
    (contentData.Nyshara.sections.Collections.variants
      .NysharaCollections1 as CollectionsData);
 
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState<boolean>(false);
 
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
 
  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      const targetElement = document.getElementById(href.slice(1));
      if (targetElement) {
        e.preventDefault();
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        window.scrollTo({
          top: elementRect - bodyRect - offset,
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    }
  };
 
  const headingWords = collectionsData.heading.split(" ");
 
  return (
    <section
      id="collections"
      ref={sectionRef}
      data-in={inView ? "true" : "false"}
      className={`${jost.className} nys-c relative w-full select-none overflow-hidden bg-white py-[clamp(3rem,6vw,8rem)] scroll-mt-20`}
    >
      <style dangerouslySetInnerHTML={{ __html: COLLECTIONS_CSS }} />
 
      <div className="mx-auto w-full max-w-[1600px] px-[clamp(1rem,3.5vw,5rem)]">
        <div className="mb-[clamp(1.75rem,4vw,5rem)] text-center">
          <div className="mb-[clamp(0.9rem,2.5vw,3rem)] flex items-center justify-center gap-[clamp(0.6rem,2vw,2.5rem)]">
            <span
              aria-hidden="true"
              style={delayVar(250)}
              className="nys-c-line nys-c-l h-[1.5px] w-[clamp(2.5rem,15vw,15rem)] rounded-full bg-[#C2806D] md:h-[2px]"
            />
            <span
              style={delayVar(100)}
              className="nys-c-fade text-[clamp(0.7rem,0.3rem+0.75vw,1rem)] font-medium uppercase tracking-[0.3em] text-[#1F2A48]"
            >
              {collectionsData.tagline}
            </span>
            <span
              aria-hidden="true"
              style={delayVar(250)}
              className="nys-c-line nys-c-r h-[1.5px] w-[clamp(2.5rem,15vw,15rem)] rounded-full bg-[#C2806D] md:h-[2px]"
            />
          </div>
 
          <h2
            className={`${cormorant.className} text-[clamp(2rem,5.5vw,7rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-[#101A33]`}
          >
            <span className="-mb-[0.24em] -mt-[0.12em] block overflow-hidden pb-[0.24em] pt-[0.12em]">
              {headingWords.map((word, i) => (
                <React.Fragment key={`${word}-${i}`}>
                  <span
                    className="nys-c-rise inline-block"
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
 
        <div className="nys-c-grid mx-auto grid max-w-[440px] grid-cols-1 items-start gap-[clamp(0.75rem,2.3vw,3rem)] md:max-w-none md:grid-cols-3">
          {collectionsData.items.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleCardClick(e, item.href)}
              style={delayVar(500 + i * 160)}
              className="nys-c-card nys-c-gem group relative block aspect-[84/122] w-full overflow-hidden bg-[#FAF9FB]"
            >
              <div className="nys-c-settle absolute inset-0">
                <div className="nys-c-zoom absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
 
              <div
                className="nys-c-label pointer-events-none absolute inset-x-0 bottom-0 flex h-[38%] flex-col items-center justify-end bg-gradient-to-t from-white/95 via-white/55 to-transparent px-4 pb-[clamp(1rem,3.4vw,4.5rem)]"
              >
                <h3
                  className={`${cormorant.className} text-[clamp(1.25rem,2.5vw,3.25rem)] font-semibold leading-none tracking-[-0.01em] text-[#101A33] transition-colors duration-500 group-hover:text-[#C2806D]`}
                >
                  {item.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="nys-c-line nys-c-cardline mt-[clamp(0.5rem,0.8vw,1rem)] h-[1.5px] w-[clamp(1.5rem,3.2vw,3.5rem)] rounded-full bg-[#C2806D] transition-[width] duration-500 group-hover:w-[clamp(2.25rem,4.8vw,5.25rem)]"
                />
              </div>
 
              <div aria-hidden="true" className="nys-c-frame" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
 