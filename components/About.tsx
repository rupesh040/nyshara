"use client";
 
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Jost, Cormorant_Garamond } from "next/font/google";
import contentData from "@/data/content.json";
import { AboutData } from "@/data/type";
 
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
 
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
 
interface AboutProps {
  data?: AboutData;
}
 
interface LoupeFrameProps {
  src: React.ComponentProps<typeof Image>["src"];
  alt: string;
  sizes: string;
  wipe: "up" | "down";
  delay: number;
  className?: string;
}
 
const delayVar = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);
 
const ABOUT_CSS = `
@keyframes nys-a-fade {
  from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes nys-a-line {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes nys-a-rise {
  from { transform: translateY(135%); filter: blur(5px); }
  to   { transform: translateY(0); filter: blur(0); }
}
@keyframes nys-a-up {
  from { clip-path: inset(100% 0 0 0); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes nys-a-down {
  from { clip-path: inset(0 0 100% 0); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes nys-a-thread {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes nys-a-settle {
  from { transform: scale(1.16); }
  to   { transform: scale(1); }
}
 
.nys-a-line { transform-origin: left center; }
 
.nys-about[data-in="false"] .nys-a-fade   { opacity: 0; }
.nys-about[data-in="false"] .nys-a-line   { transform: scaleX(0); }
.nys-about[data-in="false"] .nys-a-rise   { transform: translateY(135%); }
.nys-about[data-in="false"] .nys-a-up     { clip-path: inset(100% 0 0 0); }
.nys-about[data-in="false"] .nys-a-down   { clip-path: inset(0 0 100% 0); }
.nys-about[data-in="false"] .nys-a-thread { clip-path: inset(0 100% 0 0); }
.nys-about[data-in="false"] .nys-a-settle { transform: scale(1.16); }
 
.nys-about[data-in="true"] .nys-a-fade {
  animation: nys-a-fade 0.9s ease var(--d, 0ms) backwards;
}
.nys-about[data-in="true"] .nys-a-line {
  animation: nys-a-line 1.1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards;
}
.nys-about[data-in="true"] .nys-a-rise {
  animation: nys-a-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--w, 0) * 110ms + 350ms);
}
.nys-about[data-in="true"] .nys-a-up {
  animation: nys-a-up 1.5s cubic-bezier(0.77, 0, 0.18, 1) var(--d, 0ms) backwards;
}
.nys-about[data-in="true"] .nys-a-down {
  animation: nys-a-down 1.5s cubic-bezier(0.77, 0, 0.18, 1) var(--d, 0ms) backwards;
}
.nys-about[data-in="true"] .nys-a-thread {
  animation: nys-a-thread 2.6s cubic-bezier(0.65, 0, 0.35, 1) backwards;
}
.nys-about[data-in="true"] .nys-a-settle {
  animation: nys-a-settle 2.4s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) backwards;
}
 
.nys-frame { --d: clamp(104px, 11vw, 168px); }
 
.nys-loupe {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--d);
  height: var(--d);
  margin: calc(var(--d) / -2) 0 0 calc(var(--d) / -2);
  translate: var(--cx, -999px) var(--cy, -999px);
  scale: 0.55;
  opacity: 0;
  overflow: hidden;
  border-radius: 9999px;
  pointer-events: none;
  box-shadow: 0 14px 34px rgba(16, 26, 51, 0.3);
  transition: opacity 0.4s ease, scale 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.nys-loupe::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.9), inset 0 0 28px rgba(0, 0, 0, 0.18);
}
.nys-loupe::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
  border-radius: 9999px;
  background: #C2806D;
}
.nys-loupe-layer {
  position: absolute;
  width: var(--w, 0px);
  height: var(--h, 0px);
  left: calc(var(--d) / 2 - var(--cx, 0px));
  top: calc(var(--d) / 2 - var(--cy, 0px));
  transform-origin: var(--cx, 0px) var(--cy, 0px);
  transform: scale(1.9);
}
 
@media (hover: hover) and (pointer: fine) {
  .nys-frame { cursor: none; }
  .nys-frame:hover .nys-loupe { opacity: 1; scale: 1; }
}
 
@media (prefers-reduced-motion: reduce) {
  .nys-about *, .nys-about *::before, .nys-about *::after {
    animation: none !important;
    transition: none !important;
  }
  .nys-loupe { display: none; }
}
`;
 
function LoupeFrame({
  src,
  alt,
  sizes,
  wipe,
  delay,
  className = "",
}: LoupeFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState<boolean>(false);
 
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--cx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--cy", `${e.clientY - rect.top}px`);
    el.style.setProperty("--w", `${rect.width}px`);
    el.style.setProperty("--h", `${rect.height}px`);
  };
 
  return (
    <div
      ref={frameRef}
      onMouseEnter={() => setArmed(true)}
      onMouseMove={handleMove}
      style={delayVar(delay)}
      className={`nys-frame nys-a-${wipe} relative overflow-hidden ${className}`}
    >
      <div className="nys-a-settle absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-center"
        />
      </div>
 
      <div aria-hidden="true" className="nys-loupe">
        <div className="nys-loupe-layer">
          {armed && (
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              quality={90}
              className="object-cover object-center"
            />
          )}
        </div>
      </div>
    </div>
  );
}
 
export default function About({ data: customData }: AboutProps) {
  const aboutData: AboutData =
    customData ||
    (contentData.Nyshara.sections.About.variants.NysharaAbout1 as AboutData);
 
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
 
  const headingLines = [aboutData.headingLine1, aboutData.headingLine2];
  let wordIndex = 0;
 
  return (
    <section
      id="about-us"
      ref={sectionRef}
      data-in={inView ? "true" : "false"}
      className={`${jost.className} nys-about relative w-full select-none overflow-hidden bg-[#FAF9FB] py-[clamp(3rem,5vw,7rem)] scroll-mt-20`}
    >
      <style dangerouslySetInnerHTML={{ __html: ABOUT_CSS }} />
 
      {aboutData.bgCurves && (
        <div
          aria-hidden="true"
          className="nys-a-thread pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
        >
          <Image
            src={aboutData.bgCurves}
            alt=""
            fill
            className="object-cover object-left opacity-70"
          />
        </div>
      )}
 
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-[clamp(1rem,3.5vw,5rem)]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-[clamp(2.5rem,4.7vw,6rem)]">
          <div className="flex w-full flex-col items-start justify-start lg:pt-[1.1vw]">
            <div className="mb-[clamp(1rem,2.8vw,3.5rem)] flex items-center gap-[clamp(0.75rem,1.6vw,2rem)]">
              <span
                style={delayVar(100)}
                className="nys-a-fade text-[clamp(0.75rem,0.35rem+1vw,1.3rem)] font-semibold uppercase leading-none tracking-[0.25em] text-[#C2806D]"
              >
                {aboutData.tagline}
              </span>
              <span
                aria-hidden="true"
                style={delayVar(250)}
                className="nys-a-line h-[1.5px] w-[clamp(2.5rem,7.3vw,7rem)] rounded-full bg-[#C2806D] md:h-[2px]"
              />
            </div>
 
            <h2
              className={`${cormorant.className} mb-[clamp(2rem,4vw,5rem)] text-[clamp(2.5rem,6.6vw,8rem)] font-semibold leading-[0.98] tracking-[-0.01em] text-[#101A33]`}
            >
              {headingLines.map((line, lineIndex) => (
                <span
                  key={lineIndex}
                  className="-mb-[0.24em] -mt-[0.12em] block overflow-hidden pb-[0.24em] pt-[0.12em]"
                >
                  {line.split(" ").map((word, i, words) => {
                    const idx = wordIndex++;
                    return (
                      <React.Fragment key={`${word}-${i}`}>
                        <span
                          className="nys-a-rise inline-block"
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
 
            <LoupeFrame
              src={aboutData.secondaryImage}
              alt={aboutData.secondaryImageAlt}
              sizes="(max-width: 1024px) 100vw, 40vw"
              wipe="up"
              delay={700}
              className="aspect-[457/558] w-full max-w-[457px] lg:ml-[28%] lg:w-[76.7%] lg:max-w-none"
            />
          </div>
 
          <div className="flex w-full flex-col items-start justify-start lg:items-end">
            <LoupeFrame
              src={aboutData.primaryImage}
              alt={aboutData.primaryImageAlt}
              sizes="(max-width: 1024px) 100vw, 45vw"
              wipe="down"
              delay={250}
              className="mb-[clamp(2rem,5.3vw,6rem)] aspect-[528/636] w-full max-w-[528px] lg:w-[88.6%] lg:max-w-none"
            />
 
            <div className="w-full max-w-[528px] lg:w-[88.6%] lg:max-w-none">
              <div
                aria-hidden="true"
                style={delayVar(1300)}
                className="nys-a-line mb-[clamp(1rem,2.2vw,2.5rem)] h-[1.5px] w-[clamp(2.5rem,8vw,8rem)] rounded-full bg-[#C2806D] md:h-[2px]"
              />
              <p
                style={delayVar(1450)}
                className="nys-a-fade text-[clamp(0.95rem,1.38vw,1.6rem)] font-normal leading-[1.5] text-[#2D3240]"
              >
                {aboutData.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 