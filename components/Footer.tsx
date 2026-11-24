"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import contentData from "@/data/content.json";
import { FooterData } from "@/data/type";

interface FooterProps {
  data?: FooterData;
}

const styles = `
.ft-root{--ease:cubic-bezier(.16,1,.3,1)}
.ft-root:not(.ft-live) .ft-a{animation-play-state:paused!important}
 
.ft-photo{animation:ft-photo 1.8s var(--ease) backwards}
.ft-curves{animation:ft-fade 2s ease .2s backwards}
.ft-live .ft-float{animation:ft-float 11s ease-in-out infinite alternate}
.ft-live .ft-drift{animation:ft-drift 22s ease-in-out infinite alternate}
 
.ft-vline{transform-origin:top center;animation:ft-vline 1.4s var(--ease) .3s backwards}
.ft-draw{transform-origin:left center;animation:ft-draw 1s var(--ease) backwards}
.ft-rise{animation:ft-rise 1.1s var(--ease) backwards}
.ft-blur{animation:ft-blur 1.1s var(--ease) backwards}
.ft-up{animation:ft-up .9s var(--ease) backwards}
.ft-slide{animation:ft-slide .9s var(--ease) backwards}
.ft-pop{animation:ft-pop .8s var(--ease) backwards}
.ft-fade{animation:ft-fade 1.4s ease backwards}
 
.ft-ul{background:linear-gradient(currentColor,currentColor) left bottom/0 1px no-repeat;padding-bottom:2px;transition:background-size .6s var(--ease)}
.ft-link:hover .ft-ul{background-size:100% 1px}
 
.ft-sheen{position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.2) 50%,transparent 65%);transform:translateX(-120%);transition:transform .9s var(--ease);pointer-events:none}
.ft-btn:hover .ft-sheen{transform:translateX(120%)}
 
.ft-rot{animation:ft-rot .7s linear infinite}
.ft-note{animation:ft-note .7s var(--ease) backwards}
.ft-check{stroke-dasharray:24;animation:ft-check .6s ease .15s backwards}
 
.ft-mask{
-webkit-mask-image:linear-gradient(to left,#000 30%,transparent 100%),linear-gradient(to top,transparent 0%,#000 55%);
-webkit-mask-composite:source-in;
mask-image:linear-gradient(to left,#000 30%,transparent 100%),linear-gradient(to top,transparent 0%,#000 55%);
mask-composite:intersect
}
 
@keyframes ft-photo{from{opacity:0;transform:scale(1.07)}}
@keyframes ft-fade{from{opacity:0}}
@keyframes ft-float{to{transform:translate3d(-6px,-10px,0) rotate(.6deg)}}
@keyframes ft-drift{to{transform:translate3d(28px,6px,0)}}
@keyframes ft-vline{from{transform:scaleY(0)}}
@keyframes ft-draw{from{transform:scaleX(0)}}
@keyframes ft-rise{from{transform:translateY(110%)}}
@keyframes ft-blur{from{opacity:0;filter:blur(8px);transform:translateY(8px)}}
@keyframes ft-up{from{opacity:0;transform:translateY(18px)}}
@keyframes ft-slide{from{opacity:0;transform:translateX(-16px)}}
@keyframes ft-pop{from{opacity:0;transform:scale(.5)}}
@keyframes ft-rot{to{transform:rotate(360deg)}}
@keyframes ft-note{from{opacity:0;transform:translateX(-10px)}}
@keyframes ft-check{from{stroke-dashoffset:24}}
 
@media (prefers-reduced-motion:reduce){
.ft-a,.ft-note,.ft-check,.ft-live .ft-float,.ft-live .ft-drift{animation:none!important}
.ft-sheen{transition:none}
}
`;

const delay = (ms: number): React.CSSProperties => ({
  animationDelay: `${ms}ms`,
});

const inputClass =
  "block w-full bg-white/60 border border-[#E6C9BC] focus:border-[#C07A5F] rounded-md px-5 py-3 text-[15px] text-[#1E2330] placeholder-[#434958] focus:outline-none transition-colors duration-300";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Field({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className="ft-a ft-up group relative overflow-hidden rounded-md"
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#C07A5F] origin-center scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100"
      />
    </div>
  );
}

function Heading({ title, delayMs }: { title: string; delayMs: number }) {
  return (
    <>
      <div className="overflow-hidden pb-1.5">
        <h3
          className="ft-a ft-rise text-[26px] sm:text-[30px] lg:text-[32px] font-normal font-serif text-[#0F2237] leading-tight"
          style={delay(delayMs)}
        >
          {title}
        </h3>
      </div>
      <div
        aria-hidden="true"
        className="ft-a ft-draw w-14 h-[2px] bg-[#C07A5F] rounded-full mt-2 mb-8"
        style={delay(delayMs + 200)}
      />
    </>
  );
}

export default function Footer({ data: customData }: FooterProps) {
  const footerData: FooterData =
    customData ||
    (contentData.Nyshara.sections.Footer.variants.NysharaFooter1 as FooterData);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 600);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    }
  };

  const contactItems = [
    {
      key: "address",
      icon: <PinIcon />,
      content: <span>{footerData.contactInfo.address}</span>,
    },
    {
      key: "phone",
      icon: <PhoneIcon />,
      content: (
        <a
          href={`tel:${footerData.contactInfo.phone.replace(/\s+/g, "")}`}
          className="ft-link hover:text-[#C07A5F] transition-colors duration-300"
        >
          <span className="ft-ul">{footerData.contactInfo.phone}</span>
        </a>
      ),
    },
    {
      key: "email",
      icon: <MailIcon />,
      content: (
        <a
          href={`mailto:${footerData.contactInfo.email}`}
          className="ft-link hover:text-[#C07A5F] transition-colors duration-300"
        >
          <span className="ft-ul">{footerData.contactInfo.email}</span>
        </a>
      ),
    },
  ];

  return (
    <footer
      ref={footerRef}
      id="contact"
      className={`ft-root ${
        isLoaded ? "ft-live" : ""
      } relative w-full overflow-hidden pt-16 sm:pt-20 lg:pt-28 pb-8 scroll-mt-20 bg-[linear-gradient(110deg,#FDF9F7_0%,#FCF4EF_60%,#FAEBE3_100%)]`}
    >
      <style>{styles}</style>

      <div
        aria-hidden="true"
        className="ft-mask absolute right-0 top-0 w-full md:w-1/2 h-full pointer-events-none select-none z-0 overflow-hidden opacity-50 md:opacity-100"
      >
        <div className="ft-a ft-photo absolute inset-0">
          <div className="ft-float absolute inset-0">
            <Image
              src={footerData.backgroundImage}
              alt=""
              fill
              className="object-cover object-right-top"
              priority
            />
          </div>
        </div>
      </div>

      {footerData.bgCurves && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 w-full md:w-1/2 h-full pointer-events-none select-none z-0 overflow-hidden opacity-40"
        >
          <div className="ft-a ft-curves absolute inset-0">
            <div className="ft-drift absolute -inset-x-8 inset-y-0">
              <Image
                src={footerData.bgCurves}
                alt=""
                fill
                className="object-cover object-left-top"
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-y-0 items-stretch">
          <div className="relative md:col-span-4 md:pr-10 flex flex-col justify-start">
            <span
              aria-hidden="true"
              style={delay(300)}
              className="ft-a ft-vline hidden md:block absolute right-0 top-4 bottom-1 w-px bg-[#E4C3B5]"
            />

            <Link
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              style={delay(100)}
              className="ft-a ft-blur inline-block self-start transition-opacity duration-300 hover:opacity-90"
            >
              <Image
                src={footerData.logo}
                alt={footerData.logoAlt}
                width={420}
                height={90}
                className="h-14 sm:h-[72px] w-auto max-w-full object-contain"
                priority
              />
            </Link>

            <p
              style={delay(250)}
              className="ft-a ft-up text-[16px] sm:text-[17px] text-[#2B3040] leading-[1.7] font-serif font-normal mt-8 mb-11 max-w-[400px]"
            >
              {footerData.description}
            </p>

            <ul className="space-y-[22px] text-[15px] sm:text-[16px] text-[#1E2330] font-sans">
              {contactItems.map((item, i) => (
                <li
                  key={item.key}
                  style={delay(400 + i * 100)}
                  className="ft-a ft-up group flex items-start gap-4"
                >
                  <span
                    style={delay(450 + i * 100)}
                    className="ft-a ft-pop mt-0.5 shrink-0 text-[#C07A5F]"
                  >
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[3px] group-hover:scale-110">
                      {item.icon}
                    </span>
                  </span>
                  {item.content}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative md:col-span-3 md:pl-12 lg:pl-[52px] md:pr-8 flex flex-col justify-start">
            <span
              aria-hidden="true"
              style={delay(450)}
              className="ft-a ft-vline hidden md:block absolute right-0 top-4 bottom-1 w-px bg-[#E4C3B5]"
            />

            <Heading title={footerData.quickLinksTitle} delayMs={300} />

            <ul className="space-y-[10px] font-sans">
              {footerData.quickLinks.map((link, i) => (
                <li
                  key={link.name}
                  style={delay(550 + i * 70)}
                  className="ft-a ft-slide"
                >
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="ft-link group inline-flex items-center gap-3.5 py-1 text-[16px] sm:text-[17px] text-[#1E2330] hover:text-[#C07A5F] transition-colors duration-300"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="ft-ul">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5 md:pl-12 lg:pl-[63px] flex flex-col justify-start">
            <Heading title={footerData.contactFormTitle} delayMs={450} />

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field style={delay(700)}>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={footerData.formPlaceholders.name}
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <Field style={delay(780)}>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={footerData.formPlaceholders.email}
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field style={delay(860)}>
                <input
                  type="tel"
                  name="phone"
                  placeholder={footerData.formPlaceholders.phone}
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field style={delay(940)}>
                <textarea
                  name="message"
                  required
                  placeholder={footerData.formPlaceholders.message}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} min-h-[104px] sm:min-h-[112px] resize-y`}
                />
              </Field>

              <div
                style={delay(1020)}
                className="ft-a ft-up pt-2 flex flex-wrap items-center gap-x-5 gap-y-3"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ft-btn group relative overflow-hidden inline-flex items-center gap-4 px-8 py-3.5 text-[16px] font-serif tracking-[0.01em] text-white bg-[#0B1D33] hover:bg-[#12294A] active:scale-[0.98] rounded-md transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C07A5F]/60 disabled:opacity-80 cursor-pointer"
                >
                  <span className="ft-sheen" aria-hidden="true" />
                  <span className="relative">
                    {isSubmitting
                      ? "Sending..."
                      : footerData.formPlaceholders.buttonText}
                  </span>
                  <span className="relative block w-5 h-5 overflow-hidden">
                    {isSubmitting ? (
                      <span className="ft-rot absolute inset-[2px] rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[130%]">
                          <ArrowIcon />
                        </span>
                        <span className="absolute inset-0 -translate-x-[130%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0">
                          <ArrowIcon />
                        </span>
                      </>
                    )}
                  </span>
                </button>

                {isSubmitted && (
                  <span className="ft-note inline-flex items-center gap-2 text-[13px] text-[#2F6B4F] font-medium">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path className="ft-check" d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    Thank you! Message sent.
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="mt-14 sm:mt-16">
          <div
            aria-hidden="true"
            style={delay(1100)}
            className="ft-a ft-draw h-px w-full bg-[#E4C3B5]"
          />
          <p
            style={delay(1300)}
            className="ft-a ft-fade pt-6 text-[14px] sm:text-[15px] text-[#2B3040] font-serif"
          >
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
