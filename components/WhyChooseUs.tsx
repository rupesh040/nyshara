"use client";
 
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Inter, Cormorant_Garamond } from "next/font/google";
import contentData from "@/data/content.json";
import { WhyChooseUsData } from "@/data/type";
 
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
 
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
 
interface WhyChooseUsProps {
  data?: WhyChooseUsData;
}
 
const ICON_PATHS: Record<string, string[]> = {
  diamond: [
    "M6 3h12l4 6-10 12L2 9l4-6z",
    "M2 9h20",
    "M10 3l-2 6 4 12 4-12-2-6",
  ],
  design: [
    "M4.5 7.5l3-3L21 18l-3 3z",
    "M7 10l1.2-1.2",
    "M10 13l1.2-1.2",
    "M13 16l1.2-1.2",
    "M16 19l1.2-1.2",
    "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  ],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"],
  support: [
    "M4 15v-3a8 8 0 0 1 16 0v3",
    "M4 14h3v5H5.5A1.5 1.5 0 0 1 4 17.5V14z",
    "M20 14h-3v5h1.5a1.5 1.5 0 0 0 1.5-1.5V14z",
    "M18.5 19v1a2 2 0 0 1-2 2H14",
    "M14 22a1 1 0 1 0-2 0 1 1 0 1 0 2 0z",
  ],
  default: ["M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z", "M12 8v8M8 12h8"],
};
 
function FeatureIcon({ name }: { name: string }) {
  const paths = ICON_PATHS[name] || ICON_PATHS.default;
  return (
    <svg
      className="nys-w-icon h-[58%] w-[58%]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength={1} />
      ))}
    </svg>
  );
}
 
const delayVar = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);
 
const WHY_CSS = `
@keyframes nys-w-fade {
  from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes nys-w-line {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes nys-w-vline {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
@keyframes nys-w-rise {
  from { transform: translateY(135%); filter: blur(5px); }
  to   { transform: translateY(0); filter: blur(0); }
}
@keyframes nys-w-wipe {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes nys-w-settle {
  from { transform: scale(1.15); }
  to   { transform: scale(1); }
}
@keyframes nys-w-plate {
  from { opacity: 0; transform: translate(-48%, 12%); }
  to   { opacity: 1; transform: translate(0, 0); }
}
@keyframes nys-w-draw {
  0%   { stroke-dashoffset: 1; opacity: 0; }
  2%   { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 1; }
}
 
.nys-w-line  { transform-origin: left center; }
.nys-w-vline { transform-origin: center top; }
 
.nys-w-icon * { stroke-dasharray: 1; stroke-dashoffset: 0; }
 
.nys-w[data-in="false"] .nys-w-fade   { opacity: 0; }
.nys-w[data-in="false"] .nys-w-line   { transform: scaleX(0); }
.nys-w[data-in="false"] .nys-w-vline  { transform: scaleY(0); }
.nys-w[data-in="false"] .nys-w-rise   { transform: translateY(135%); }
.nys-w[data-in="false"] .nys-w-wipe   { clip-path: inset(0 100% 0 0); }
.nys-w[data-in="false"] .nys-w-settle { transform: scale(1.15); }
.nys-w[data-in="false"] .nys-w-plate  { opacity: 0; transform: translate(-48%, 12%); }
.nys-w[data-in="false"] .nys-w-box    { opacity: 0; }
.nys-w[data-in="false"] .nys-w-text   { opacity: 0; }
.nys-w[data-in="false"] .nys-w-icon * { stroke-dashoffset: 1; opacity: 0; }
 
.nys-w[data-in="true"] .nys-w-fade {
  animation: nys-w-fade 0.9s ease var(--d, 0ms) backwards;
}
.nys-w[data-in="true"] .nys-w-line {
  animation: nys-w-line 1.1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards;
}
.nys-w[data-in="true"] .nys-w-rise {
  animation: nys-w-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--w, 0) * 110ms + 350ms);
}
.nys-w[data-in="true"] .nys-w-wipe {
  animation: nys-w-wipe 1.4s cubic-bezier(0.77, 0, 0.18, 1) var(--d, 0ms) backwards;
}
.nys-w[data-in="true"] .nys-w-settle {
  animation: nys-w-settle 2.4s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) backwards;
}
.nys-w[data-in="true"] .nys-w-plate {
  animation: nys-w-plate 1.4s cubic-bezier(0.22, 1, 0.36, 1) 1.5s backwards;
}
.nys-w[data-in="true"] .nys-w-box {
  animation: nys-w-fade 0.9s ease var(--d, 0ms) backwards;
}
.nys-w[data-in="true"] .nys-w-icon * {
  animation: nys-w-draw 1.3s cubic-bezier(0.65, 0, 0.35, 1) calc(var(--d, 0ms) + 250ms) backwards;
}
.nys-w[data-in="true"] .nys-w-vline {
  animation: nys-w-vline 0.9s cubic-bezier(0.65, 0, 0.35, 1) calc(var(--d, 0ms) + 350ms) backwards;
}
.nys-w[data-in="true"] .nys-w-text {
  animation: nys-w-fade 0.9s ease calc(var(--d, 0ms) + 450ms) backwards;
}
 
.nys-w-box {
  position: relative;
  overflow: hidden;
  transition: color 0.4s ease 0.1s;
}
.nys-w-box::before {
  content: "";
  position: absolute;
  inset: 0;
  background: #B35F40;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.nys-w-icon {
  position: relative;
  z-index: 1;
}
.nys-w-feature:hover .nys-w-box { color: #fff; }
.nys-w-feature:hover .nys-w-box::before { transform: scaleY(1); }
 
.nys-w-plate {
  transition: translate 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.nys-w-zoom {
  transition: transform 1.4s cubic-bezier(0.22, 1, 0.36, 1);
}
 
@media (hover: hover) {
  .nys-w-wrap:hover .nys-w-plate { translate: 0.8vw -0.8vw; }
  .nys-w-wrap:hover .nys-w-zoom  { transform: scale(1.04); }
}
 
@media (prefers-reduced-motion: reduce) {
  .nys-w *, .nys-w *::before, .nys-w *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
 
export default function WhyChooseUs({ data: customData }: WhyChooseUsProps) {
  const whyData: WhyChooseUsData =
    customData ||
    (contentData.Nyshara.sections.WhyChooseUs.variants
      .NysharaWhyChooseUs1 as WhyChooseUsData);
 
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
 
  const headingLines = [whyData.headingLine1, whyData.headingLine2];
  let wordIndex = 0;
 
  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      data-in={inView ? "true" : "false"}
      className={`${inter.className} nys-w relative w-full mx-auto max-w-[1280px] select-none overflow-hidden bg-[#FEFDFC] py-[clamp(3rem,5vw,7rem)] scroll-mt-20`}
    >
      <style dangerouslySetInnerHTML={{ __html: WHY_CSS }} />
 
      <div className="mx-auto w-full max-w-[1600px] px-[clamp(1rem,3.5vw,5rem)]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,647fr)_minmax(0,729fr)] lg:gap-x-[clamp(1rem,1.75vw,3rem)] lg:gap-y-0">
          {/* Left column is a size container so the heading scales with its width (cqw) */}
          <div className="flex w-full flex-col justify-start [container-type:inline-size]">
            <div className="mb-[clamp(1rem,1.7vw,2.5rem)] flex items-center gap-[clamp(0.75rem,2vw,3rem)]">
              <span
                style={delayVar(100)}
                className="nys-w-fade text-[clamp(0.75rem,0.35rem+1vw,1.4rem)] font-semibold uppercase leading-none tracking-[0.25em] text-[#B35F40]"
              >
                {whyData.tagline}
              </span>
              <span
                aria-hidden="true"
                style={delayVar(250)}
                className="nys-w-line h-[1.5px] w-[clamp(2.5rem,5.9vw,7rem)] rounded-full bg-[#B35F40] md:h-[2px]"
              />
            </div>
 
            {/* Heading: always exactly two lines (one per headingLine) */}
            <h2
              className={`${cormorant.className} mb-[clamp(1rem,1.7vw,2.5rem)] text-[clamp(1.75rem,9cqw,6.5rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-[#0F1B33]`}
            >
              {headingLines.map((line, lineIndex) => (
                <span
                  key={lineIndex}
                  className="-mb-[0.24em] -mt-[0.12em] block overflow-hidden whitespace-nowrap pb-[0.24em] pt-[0.12em]"
                >
                  {line.split(" ").map((word, i, words) => {
                    const idx = wordIndex++;
                    return (
                      <React.Fragment key={`${word}-${i}`}>
                        <span
                          className="nys-w-rise inline-block"
                          style={{ "--w": idx } as React.CSSProperties}
                        >
                          {word}
                        </span>
                        {i < words.length - 1 ? " " : null}
                      </React.Fragment>
                    );
                  })}
                </span>
              ))}
            </h2>
 
            <p
              style={delayVar(1000)}
              className="nys-w-fade mb-[clamp(1.75rem,3.9vw,5rem)] max-w-[28em] text-[clamp(0.95rem,1.41vw,1.6rem)] font-normal leading-[1.6] text-[#565D6B]"
            >
              {whyData.description}
            </p>
 
            {/* Feature cards */}
            <div className="grid grid-cols-1 gap-x-[clamp(1rem,1.5vw,2rem)] gap-y-[clamp(1.25rem,2.6vw,3rem)] sm:grid-cols-2">
              {whyData.features.map((feature, i) => (
                <div
                  key={feature.id}
                  style={delayVar(1150 + i * 200)}
                  className="nys-w-feature flex items-stretch gap-[clamp(0.6rem,1vw,1.25rem)]"
                >
                  <div className="nys-w-box flex aspect-square w-[clamp(2.75rem,4vw,4.5rem)] shrink-0 items-center justify-center self-start bg-[#FCEFE6] text-[#B35F40]">
                    <FeatureIcon name={feature.icon} />
                  </div>
 
                  <span
                    aria-hidden="true"
                    className="nys-w-vline w-[1.5px] shrink-0 self-stretch bg-[#B35F40]/70"
                  />
 
                  <div className="nys-w-text min-w-0 flex-1">
                    <h3 className="mb-[0.15em] break-words text-[clamp(0.9rem,1.15vw,1.35rem)] font-bold leading-[1.3] text-[#0F1B33]">
                      {feature.title}
                    </h3>
                    <p className="break-words text-[clamp(0.8rem,1vw,1.1rem)] leading-[1.5] text-[#5B6370]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          <div className="nys-w-wrap relative w-full pr-[clamp(0.75rem,2.35vw,3rem)] pt-[clamp(1rem,2.2vw,3rem)]">
            <div
              aria-hidden="true"
              className="nys-w-plate absolute right-0 top-0 z-0 h-[87.7%] w-[52.4%] bg-[#F9EAE5]"
            />
 
            <div
              style={delayVar(300)}
              className="nys-w-wipe relative z-10 aspect-[694/587] w-full overflow-hidden bg-white"
            >
              <div className="nys-w-settle absolute inset-0">
                <div className="nys-w-zoom absolute inset-0">
                  <Image
                    src={whyData.image}
                    alt={whyData.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 