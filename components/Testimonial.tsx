"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import contentData from "@/data/content.json";
import { TestimonialData } from "@/data/type";

interface TestimonialProps {
  data?: TestimonialData;
}

const styles = `
.tm-root{--ease:cubic-bezier(.16,1,.3,1)}
.tm-root:not(.tm-live) .tm-a{animation-play-state:paused!important}
 
.tm-line-l{transform-origin:right center;animation:tm-line 1s var(--ease) .1s backwards}
.tm-line-r{transform-origin:left center;animation:tm-line 1s var(--ease) .1s backwards}
.tm-eyebrow{animation:tm-blur 1s var(--ease) .15s backwards}
.tm-title{animation:tm-rise 1.1s var(--ease) .25s backwards}
.tm-mark{animation:tm-fade 1.8s ease .1s backwards}
.tm-live .tm-spin{animation:tm-spin 140s linear infinite}
.tm-card{animation:tm-card 1.1s var(--ease) .15s backwards}
.tm-flank{transform-origin:center;animation:tm-flank 1.1s var(--ease) .35s backwards}
.tm-pop{animation:tm-pop .9s var(--ease) .8s backwards}
.tm-img{animation:tm-img 1.3s var(--ease) backwards}
.tm-word{display:inline-block;animation:tm-word .9s var(--ease) backwards}
.tm-glyph{animation:tm-glyph .9s var(--ease) .1s backwards}
.tm-draw{transform-origin:left center;animation:tm-draw .9s var(--ease) backwards}
.tm-avatar{animation:tm-avatar .9s var(--ease) backwards}
.tm-up{animation:tm-up .9s var(--ease) backwards}
.tm-ping{animation:tm-ping 1s ease-out both}
 
.tm-ex{transition:opacity .32s ease,transform .32s ease,filter .32s ease}
.tm-exi{transition:opacity .32s ease,transform .32s ease}
.tm-card[data-leaving="true"] .tm-ex{opacity:0;filter:blur(6px);transform:translateX(calc(var(--dir) * -18px))}
.tm-card[data-leaving="true"] .tm-exi{opacity:0;transform:translateX(calc(var(--dir) * -24px)) scale(1.04)}
 
.tm-mask{-webkit-mask-image:linear-gradient(to bottom,#000 60%,transparent);mask-image:linear-gradient(to bottom,#000 60%,transparent)}
@media (min-width:768px){
.tm-mask{-webkit-mask-image:linear-gradient(to right,transparent 0%,#000 46%);mask-image:linear-gradient(to right,transparent 0%,#000 46%)}
}
 
@keyframes tm-line{from{transform:scaleX(0)}}
@keyframes tm-blur{from{opacity:0;filter:blur(6px)}}
@keyframes tm-rise{from{transform:translateY(110%)}}
@keyframes tm-fade{from{opacity:0}}
@keyframes tm-card{from{opacity:0;transform:translateY(28px)}}
@keyframes tm-flank{from{transform:scaleY(0)}}
@keyframes tm-pop{from{opacity:0;transform:scale(.6)}}
@keyframes tm-img{from{opacity:0;filter:blur(12px);transform:translateX(calc(var(--dir) * 40px)) scale(1.12)}}
@keyframes tm-word{from{opacity:0;filter:blur(6px);transform:translateY(.55em)}}
@keyframes tm-glyph{from{opacity:0;transform:translateY(10px) scale(.8)}}
@keyframes tm-draw{from{transform:scaleX(0)}}
@keyframes tm-avatar{from{opacity:0;transform:scale(.7) rotate(-10deg)}}
@keyframes tm-up{from{opacity:0;transform:translateY(14px)}}
@keyframes tm-ping{from{opacity:.8;transform:scale(1)}to{opacity:0;transform:scale(3)}}
@keyframes tm-spin{to{transform:rotate(360deg)}}
 
@media (prefers-reduced-motion:reduce){
.tm-a,.tm-live .tm-spin{animation:none!important}
.tm-ex,.tm-exi{transition:none}
}
`;

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      {direction === "left" ? (
        <path d="M19 12H5M11 6l-6 6 6 6" />
      ) : (
        <path d="M5 12h14M13 6l6 6-6 6" />
      )}
    </svg>
  );
}

function ArrowButton({
  direction,
  label,
  onClick,
}: {
  direction: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="tm-a tm-pop group pointer-events-auto relative w-9 h-9 sm:w-11 sm:h-11 xl:w-[52px] xl:h-[52px] rounded-full bg-white text-[#B76A2E] shadow-[0_6px_20px_rgba(120,70,40,0.12)] flex items-center justify-center transition-colors duration-500 hover:bg-[#B76A2E] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B76A2E]/50 cursor-pointer"
    >
      <span className="relative block w-4 h-4 sm:w-5 sm:h-5 overflow-hidden">
        <span
          className={`absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLeft
              ? "group-hover:-translate-x-[130%]"
              : "group-hover:translate-x-[130%]"
          }`}
        >
          <ArrowIcon direction={direction} />
        </span>
        <span
          className={`absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 ${
            isLeft ? "translate-x-[130%]" : "-translate-x-[130%]"
          }`}
        >
          <ArrowIcon direction={direction} />
        </span>
      </span>
    </button>
  );
}

export default function Testimonial({ data: customData }: TestimonialProps) {
  const testimonialData: TestimonialData =
    customData ||
    (contentData.Nyshara.sections.Testimonial.variants
      .NysharaTestimonial1 as TestimonialData);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [leaving, setLeaving] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const busyRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const items = testimonialData.items;
  const currentItem = items[currentIndex] || items[0];
  const words = currentItem.quote.split(" ");
  const wordsEnd = Math.min(words.length * 28 + 260, 1000);

  const go = (target: number, dir: number) => {
    if (busyRef.current || target === currentIndex) return;
    busyRef.current = true;
    setDirection(dir);
    setLeaving(true);
    timerRef.current = window.setTimeout(() => {
      setCurrentIndex(target);
      setLeaving(false);
      timerRef.current = window.setTimeout(() => {
        busyRef.current = false;
      }, 700);
    }, 320);
  };

  const handlePrev = () =>
    go(currentIndex === 0 ? items.length - 1 : currentIndex - 1, -1);

  const handleNext = () =>
    go(currentIndex === items.length - 1 ? 0 : currentIndex + 1, 1);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`tm-root ${
        isLoaded ? "tm-live" : ""
      } relative w-full bg-white overflow-hidden mx-auto max-w-[1280px] py-16 sm:py-24 lg:py-28 select-none scroll-mt-20`}
    >
      <style>{styles}</style>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="relative text-center mb-12 sm:mb-16">
          {testimonialData.watermarkImage && (
            <div className="tm-a tm-mark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[360px] pointer-events-none select-none opacity-30 z-0">
              <div className="tm-spin">
                <Image
                  src={testimonialData.watermarkImage}
                  alt={testimonialData.watermarkAlt || ""}
                  width={360}
                  height={204}
                  className="w-full h-auto object-contain mx-auto"
                  priority
                />
              </div>
            </div>
          )}

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center gap-3.5 sm:gap-5 mb-4 sm:mb-5">
              <span
                aria-hidden="true"
                className="tm-a tm-line-l w-10 sm:w-14 h-[1.5px] bg-[#B76A2E] rounded-full"
              />
              <span className="tm-a tm-eyebrow text-[12px] sm:text-[13px] md:text-[14px] font-medium tracking-[0.4em] text-[#0F2237] uppercase">
                {testimonialData.tagline}
              </span>
              <span
                aria-hidden="true"
                className="tm-a tm-line-r w-10 sm:w-14 h-[1.5px] bg-[#B76A2E] rounded-full"
              />
            </div>

            <div className="overflow-hidden pb-1">
              <h2 className="tm-a tm-title text-[36px] sm:text-[46px] lg:text-[56px] font-normal tracking-[-0.015em] text-[#0F2237] font-serif leading-[1.15]">
                {testimonialData.heading}
              </h2>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-[1210px] md:px-[56px] xl:px-[93px]">
          <div
            aria-hidden="true"
            className="tm-a tm-flank hidden md:block absolute left-0 w-[56px] xl:w-[93px] top-[13.5%] bottom-[13.5%] bg-[#F9EBE3]"
          />
          <div
            aria-hidden="true"
            className="tm-a tm-flank hidden md:block absolute right-0 w-[56px] xl:w-[93px] top-[13.5%] bottom-[13.5%] bg-[#F9EBE3]"
          />

          {/* Desktop/Tablet side navigation arrows */}
          <div className="hidden md:flex absolute inset-y-0 left-0 z-30 md:w-[56px] xl:w-[93px] items-center justify-center pointer-events-none">
            <ArrowButton
              direction="left"
              label="Previous Testimonial"
              onClick={handlePrev}
            />
          </div>
          <div className="hidden md:flex absolute inset-y-0 right-0 z-30 md:w-[56px] xl:w-[93px] items-center justify-center pointer-events-none">
            <ArrowButton
              direction="right"
              label="Next Testimonial"
              onClick={handleNext}
            />
          </div>

          <div
            data-leaving={leaving}
            style={{ "--dir": direction } as React.CSSProperties}
            className="tm-a tm-card group relative z-10 w-full overflow-hidden flex flex-col md:block bg-[linear-gradient(100deg,#FCF4EF_0%,#FBF1EA_55%,#FAEEE6_100%)]"
          >
            <div className="tm-mask relative h-[230px] md:h-auto md:absolute md:inset-y-0 md:right-0 md:w-[54%] overflow-hidden">
              <div
                key={`img-${currentItem.id}`}
                className="tm-exi absolute inset-0"
              >
                <div className="tm-a tm-img absolute inset-0">
                  <Image
                    src={currentItem.image}
                    alt={currentItem.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 54vw"
                    className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 md:w-[60%] md:min-h-[440px] xl:min-h-[458px] flex flex-col justify-center px-6 py-8 sm:px-10 md:pl-12 md:pr-6 xl:pl-[76px] md:py-10">
              <div key={`txt-${currentItem.id}`} className="tm-ex">
                <div
                  aria-hidden="true"
                  className="tm-a tm-glyph font-serif font-bold text-[#B76A2E] text-[72px] sm:text-[88px] leading-[0.75] h-[40px] sm:h-[50px] mb-3 select-none"
                >
                  “
                </div>

                <blockquote className="font-serif italic text-[20px] sm:text-[22px] xl:text-[26px] text-[#0F2237] leading-[1.55] max-w-[620px]">
                  {words.map((word, i) => (
                    <React.Fragment key={`${currentItem.id}-${i}`}>
                      <span
                        className="tm-a tm-word"
                        style={{ animationDelay: `${i * 28 + 220}ms` }}
                      >
                        {word}
                      </span>{" "}
                    </React.Fragment>
                  ))}
                </blockquote>

                <div
                  aria-hidden="true"
                  className="tm-a tm-draw w-12 sm:w-14 h-[2px] bg-[#B76A2E] rounded-full my-6 sm:my-7"
                  style={{ animationDelay: `${wordsEnd}ms` }}
                />

                <div className="flex items-center gap-4 sm:gap-5">
                  <div
                    className="tm-a tm-avatar relative w-[68px] h-[68px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden border-2 border-[#B76A2E] shrink-0"
                    style={{ animationDelay: `${wordsEnd + 80}ms` }}
                  >
                    <Image
                      src={currentItem.avatar}
                      alt={currentItem.avatarAlt}
                      fill
                      sizes="88px"
                      className="object-cover object-center"
                    />
                  </div>
                  <div>
                    <h3
                      className="tm-a tm-up text-[20px] sm:text-[26px] font-semibold text-[#0F2237] font-serif leading-tight"
                      style={{ animationDelay: `${wordsEnd + 160}ms` }}
                    >
                      {currentItem.author}
                    </h3>
                    <p
                      className="tm-a tm-up text-[11px] sm:text-[13px] font-medium tracking-[0.25em] text-[#6E7480] uppercase mt-1.5"
                      style={{ animationDelay: `${wordsEnd + 240}ms` }}
                    >
                      {currentItem.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation: On small devices (< md), displays arrows on sides with dots in center. On desktop (>= md), shows dots only */}
          <div className="flex items-center justify-center gap-5 sm:gap-6 mt-8 sm:mt-10">
            {/* Small devices (< md): Previous Arrow Button */}
            <div className="md:hidden flex items-center">
              <ArrowButton
                direction="left"
                label="Previous Testimonial"
                onClick={handlePrev}
              />
            </div>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-3">
              {items.map((item, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(index, index > currentIndex ? 1 : -1)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={isActive}
                    className={`relative w-2.5 h-2.5 rounded-full border bg-white transition-colors duration-500 focus:outline-none cursor-pointer ${
                      isActive
                        ? "border-[#B76A2E]"
                        : "border-[#D9A67F] hover:border-[#B76A2E]"
                    }`}
                  >
                    <span
                      className={`absolute -inset-px rounded-full bg-[#B76A2E] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isActive ? "scale-100" : "scale-0"
                      }`}
                    />
                    {isActive && (
                      <span
                        key={currentIndex}
                        className="tm-a tm-ping absolute -inset-px rounded-full border border-[#B76A2E] pointer-events-none"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Small devices (< md): Next Arrow Button */}
            <div className="md:hidden flex items-center">
              <ArrowButton
                direction="right"
                label="Next Testimonial"
                onClick={handleNext}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
