"use client";
 
import React from "react";
import Image from "next/image";
import { Jost, Cormorant_Garamond } from "next/font/google";
import contentData from "@/data/content.json";
import { HeroData } from "@/data/type";
 
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
 
interface HeroProps {
  data?: HeroData;
}
 
const HERO_CSS = `
@keyframes nys-line {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes nys-fade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nys-rise {
  from { transform: translateY(135%); filter: blur(5px); }
  to   { transform: translateY(0); filter: blur(0); }
}
@keyframes nys-bloom {
  from { opacity: 0; transform: scale(0.9); filter: blur(8px); }
  to   { opacity: 1; transform: scale(1); filter: blur(0); }
}
@keyframes nys-unveil {
  from { clip-path: inset(0 0 100% 0); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes nys-settle {
  from { transform: scale(1.14); }
  to   { transform: scale(1); }
}
 
.nys-tag    { animation: nys-fade 0.9s ease 0.15s backwards; }
.nys-line   { animation: nys-line 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0.35s backwards; }
.nys-line-l { transform-origin: right center; }
.nys-line-r { transform-origin: left center; }
 
.nys-rise {
  animation: nys-rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--w, 0) * 110ms + 500ms);
}
 
.nys-bloom  { animation: nys-bloom 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards; }
.nys-unveil { animation: nys-unveil 1.5s cubic-bezier(0.77, 0, 0.18, 1) 1s backwards; }
.nys-settle { animation: nys-settle 2.4s cubic-bezier(0.22, 1, 0.36, 1) 1s backwards; }
 
.nys-pan {
  transform: translate3d(calc(var(--px, 0) * -16px), calc(var(--py, 0) * -8px), 0);
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
 
.nys-light {
  opacity: 0;
  mix-blend-mode: soft-light;
  transition: opacity 0.6s ease;
  background: radial-gradient(280px circle at var(--lx, 50%) var(--ly, 50%), rgba(255, 255, 255, 0.85), transparent 70%);
}
.nys-banner:hover .nys-light { opacity: 1; }
 
@media (prefers-reduced-motion: reduce) {
  .nys-hero *, .nys-hero *::before, .nys-hero *::after {
    animation: none !important;
    transition: none !important;
  }
  .nys-pan { transform: none !important; }
}
`;
 
export default function Hero({ data: customData }: HeroProps) {
  const heroData: HeroData =
    customData ||
    (contentData.Nyshara.sections.Hero.variants.NysharaHero1 as HeroData);
 
  const headingLines = [heroData.headingLine1, heroData.headingLine2];
  let wordIndex = 0;
 
  const handleBannerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--lx", `${x * 100}%`);
    el.style.setProperty("--ly", `${y * 100}%`);
    el.style.setProperty("--px", `${(x - 0.5) * 2}`);
    el.style.setProperty("--py", `${(y - 0.5) * 2}`);
  };
 
  const handleBannerLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  };
 
  return (
    <section
      id="home"
      className={`${jost.className} nys-hero relative w-full select-none overflow-hidden bg-[#F8F6F4] pt-[clamp(2.5rem,4.4vw,6rem)] scroll-mt-20`}
    >
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />
 
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[clamp(0.75rem,1.5vw,2.5rem)] z-0 flex justify-center"
      >
        <div className="nys-bloom w-[clamp(15rem,26vw,28rem)]">
          <Image
            src={heroData.watermarkImage}
            alt={heroData.watermarkAlt}
            width={420}
            height={238}
            className="mx-auto h-auto w-full object-contain opacity-45"
            priority
          />
        </div>
      </div>
 
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-[clamp(2rem,4.6vw,6rem)] text-center sm:px-6 lg:px-8">
        <div className="mb-[clamp(0.9rem,1.6vw,2.2rem)] flex items-center justify-center gap-[clamp(0.75rem,2.2vw,2.5rem)]">
          <span
            aria-hidden="true"
            className="nys-line nys-line-l h-[1.5px] w-[clamp(2.5rem,6.8vw,7rem)] rounded-full bg-[#C2806D] md:h-[2px]"
          />
          <span className="nys-tag text-[clamp(0.7rem,0.45rem+1.25vw,1.7rem)] font-medium uppercase tracking-[0.3em] text-[#1F2A48]">
            {heroData.tagline}
          </span>
          <span
            aria-hidden="true"
            className="nys-line nys-line-r h-[1.5px] w-[clamp(2.5rem,6.8vw,7rem)] rounded-full bg-[#C2806D] md:h-[2px]"
          />
        </div>
 
        <h1
          className={`${cormorant.className} text-[clamp(2.75rem,1.2rem+6.4vw,8rem)] font-semibold leading-[0.93] tracking-[-0.01em] text-[#101A33]`}
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
                      className="nys-rise inline-block"
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
        </h1>
      </div>
 
      <div className="w-full overflow-hidden">
        <div
          onMouseMove={handleBannerMove}
          onMouseLeave={handleBannerLeave}
          className="nys-banner nys-unveil relative aspect-[1024/273] min-h-[220px] w-full overflow-hidden sm:min-h-[280px] md:min-h-[340px] lg:min-h-[400px]"
        >
          <div className="nys-pan absolute inset-[-2.5%]">
            <div className="nys-settle absolute inset-0">
              <Image
                src={heroData.heroImage}
                alt={heroData.heroImageAlt}
                fill
                sizes="100vw"
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="nys-light pointer-events-none absolute inset-0"
          />
        </div>
      </div>
    </section>
  );
}
 