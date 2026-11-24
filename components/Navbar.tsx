"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import contentData from "@/data/content.json";
import { HeaderData, NavLink } from "@/data/type";

/* Geometric sans that matches the luxury letterforms */
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const DESKTOP_BREAKPOINT = 1024; // Tailwind `lg`
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

interface NavbarProps {
  data?: HeaderData;
}

interface Indicator {
  left: number;
  right: number;
  top: number;
  dir: "left" | "right";
}

/* Stagger index consumed by .nys-in */
const stagger = (i: number) => ({ "--i": i } as React.CSSProperties);

/* All motion lives here so the component stays a single drop-in file */
const NAV_CSS = `
@keyframes nys-drop {
  from { opacity: 0; transform: translateY(-10px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0);     filter: blur(0); }
}
@keyframes nys-fade  { from { opacity: 0; } to { opacity: 1; } }
@keyframes nys-glint { from { transform: translateX(-130%); } to { transform: translateX(130%); } }

/* 1. Page-load: items surface outward from the logo */
.nys-in {
  animation: nys-drop 0.9s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  animation-delay: calc(var(--i, 0) * 80ms + 120ms);
}

/* 2. Active underline fades in once the links have settled */
.nys-indicator { animation: nys-fade 0.6s ease 0.9s backwards; }

/* 3. Logo glint: a light streak crosses the mark, like light on a gem */
.nys-logo::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.9) 50%, transparent 62%);
  transform: translateX(-130%);
  animation: nys-glint 1.3s ease 1.1s backwards;
}
.nys-logo:hover::after {
  transform: translateX(130%);
  transition: transform 0.9s ease;
}

/* 4. CTA: soft radial highlight follows the cursor across the button */
.nys-cta::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
  background: radial-gradient(110px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.32), transparent 65%);
}
.nys-cta:hover::before { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .nys-header *, .nys-header *::before, .nys-header *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0s !important;
  }
}
`;

export default function Navbar({ data: customData }: NavbarProps) {
  const headerData: HeaderData =
    customData ||
    (contentData.Nyshara.sections.Header.variants.NysharaHeader1 as HeaderData);

  const [activeItem, setActiveItem] = useState<string>(
    headerData.links.find((l) => l.active)?.name || "Home"
  );
  const [visitedSections, setVisitedSections] = useState<Set<string>>(
    () => new Set([headerData.links.find((l) => l.active)?.name || "Home"])
  );
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  const navWrapRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const isManualScroll = useRef<boolean>(false);
  const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Logo left side 3 links and right side 3 links
  const leftLinks: NavLink[] = headerData.links.slice(0, 3);
  const rightLinks: NavLink[] = headerData.links.slice(3, 6);

  // Dynamically map all sections from data
  const sectionList = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    headerData.links.forEach((link) => {
      if (link.href === "/") {
        list.push({ id: "home", name: link.name });
      } else if (link.href.startsWith("#")) {
        list.push({ id: link.href.slice(1), name: link.name });
      }
    });
    if (headerData.buttonHref?.startsWith("#")) {
      list.push({
        id: headerData.buttonHref.slice(1),
        name: headerData.button,
      });
    }
    return list;
  }, [headerData]);

  // Scroll detection for shadow / compact padding
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when entering desktop layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Real-time scrollspy: automatically highlights the section currently visited / viewed
  useEffect(() => {
    const handleScrollSpy = () => {
      if (isManualScroll.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Bottom of page: highlight Contact Us / footer
      if (scrollY + windowHeight >= docHeight - 60) {
        const contactName = headerData.button;
        if (contactName) {
          setActiveItem(contactName);
          setVisitedSections((prev) => new Set(prev).add(contactName));
          return;
        }
      }

      // Top of page: highlight Home
      if (scrollY < 80) {
        const homeName = headerData.links[0]?.name || "Home";
        setActiveItem(homeName);
        setVisitedSections((prev) => new Set(prev).add(homeName));
        return;
      }

      // Reverse search: find the active section in view (nav offset ~140px)
      const navOffset = 140;
      let matchedName = "";

      for (let i = sectionList.length - 1; i >= 0; i--) {
        const s = sectionList[i];
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            matchedName = s.name;
            break;
          }
        }
      }

      if (matchedName) {
        setActiveItem(matchedName);
        setVisitedSections((prev) => new Set(prev).add(matchedName));
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    window.addEventListener("resize", handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
      window.removeEventListener("resize", handleScrollSpy);
      if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    };
  }, [sectionList, headerData]);

  /* Measure the active link using getBoundingClientRect relative to navWrapRef
     to guarantee pixel precision across links on both sides of the centered logo */
  const updateIndicator = useCallback(() => {
    const wrap = navWrapRef.current;
    const el = linkRefs.current[activeItem];
    if (!wrap || !el) {
      setIndicator(null);
      return;
    }
    if (wrap.clientWidth === 0) return; // desktop layout hidden

    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const next = {
      left: Math.round(elRect.left - wrapRect.left - 4),
      right: Math.round(wrapRect.right - elRect.right - 4),
      top: Math.round(elRect.bottom - wrapRect.top + 2),
    };

    setIndicator((prev) => {
      if (
        prev &&
        Math.abs(prev.left - next.left) <= 1 &&
        Math.abs(prev.right - next.right) <= 1 &&
        Math.abs(prev.top - next.top) <= 1
      ) {
        return prev;
      }
      return { ...next, dir: prev && next.left < prev.left ? "left" : "right" };
    });
  }, [activeItem]);

  useEffect(() => {
    updateIndicator();
    const wrap = navWrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(updateIndicator);
    ro.observe(wrap);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) updateIndicator();
    });

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [updateIndicator]);

  // Smooth-scroll navigation
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    name: string
  ) => {
    isManualScroll.current = true;
    setActiveItem(name);
    setVisitedSections((prev) => new Set(prev).add(name));

    if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    manualScrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 900);

    if (isMobileMenuOpen) setIsMobileMenuOpen(false);

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
    } else if (href === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  // CTA highlight follows the pointer
  const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  /* Desktop link with vertical text-roll on hover and active/visited visual highlight */
  const renderDesktopLink = (link: NavLink, order: number) => {
    const isActive = activeItem === link.name;
    const isVisited = visitedSections.has(link.name);

    return (
      <Link
        key={link.name}
        ref={(el) => {
          linkRefs.current[link.name] = el;
        }}
        href={link.href}
        onClick={(e) => handleNavClick(e, link.href, link.name)}
        aria-current={isActive ? "location" : undefined}
        data-visited={isVisited ? "true" : "false"}
        style={stagger(order)}
        className={`nys-in group relative inline-block whitespace-nowrap py-1.5 text-[15px] font-medium transition-colors duration-300 ${
          isActive
            ? "text-[#C2806D]"
            : isVisited
            ? "text-[#1E2229] hover:text-[#C2806D]"
            : "text-[#1E2229] hover:text-[#C2806D]"
        }`}
      >
        <span className="relative block overflow-hidden leading-[1.5]">
          <span
            className={`block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isActive ? "" : "group-hover:-translate-y-full"
            }`}
          >
            {link.name}
          </span>
          {!isActive && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-full block text-[#C2806D] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full"
            >
              {link.name}
            </span>
          )}
        </span>
      </Link>
    );
  };

  const fast = `380ms ${EASE}`;
  const slow = `640ms ${EASE}`;
  const isCtaActive = activeItem === headerData.button;

  return (
    <header
      className={`${jost.className} nys-header sticky top-0 z-50 w-full border-b transition-all duration-500 ${
        isScrolled
          ? "border-transparent bg-white/90 py-2 shadow-[0_4px_24px_rgba(30,34,41,0.07)] backdrop-blur-xl"
          : "border-gray-100/70 bg-white py-3 min-[1400px]:py-3.5"
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />

      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* ───────── Desktop (>= lg) ───────── */}
        <div
          ref={navWrapRef}
          className="relative hidden w-full items-center lg:grid lg:grid-cols-[1fr_auto_1fr]"
        >
          {/* Left links: 3 links */}
          <nav className="flex items-center justify-start gap-5 min-[1140px]:gap-7 min-[1300px]:gap-9">
            {leftLinks.map((link, i) =>
              renderDesktopLink(link, leftLinks.length - i)
            )}
          </nav>

          {/* Centered brand logo */}
          <div
            className="nys-in flex items-center justify-center px-4 sm:px-6"
            style={stagger(0)}
          >
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "/", "Home")}
              className="nys-logo relative block overflow-hidden"
            >
              <Image
                src={headerData.logo}
                alt={headerData.logoAlt}
                width={340}
                height={64}
                className="h-10 sm:h-11 md:h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right links (3 links) + CTA Button */}
          <div className="flex items-center justify-end gap-5 min-[1140px]:gap-7 min-[1300px]:gap-9">
            <nav className="flex items-center gap-5 min-[1140px]:gap-7 min-[1300px]:gap-9">
              {rightLinks.map((link, i) => renderDesktopLink(link, i + 1))}
            </nav>

            <Link
              href={headerData.buttonHref}
              onClick={(e) =>
                handleNavClick(e, headerData.buttonHref, headerData.button)
              }
              onMouseMove={handleCtaMove}
              style={stagger(rightLinks.length + 1)}
              className={`nys-in nys-cta relative ml-2 inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-[#C2806D] px-6 py-2.5 text-[14px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#B87461] hover:shadow-[0_12px_24px_-10px_rgba(194,128,109,0.95)] active:translate-y-0 active:scale-[0.97] ${
                isCtaActive
                  ? "ring-2 ring-[#C2806D] ring-offset-2 shadow-[0_12px_24px_-8px_rgba(194,128,109,0.85)]"
                  : ""
              }`}
            >
              <span className="relative z-10">{headerData.button}</span>
            </Link>
          </div>

          {/* Active underline: smoothly stretches and slides toward active link */}
          {indicator && (
            <span
              aria-hidden="true"
              className="nys-indicator pointer-events-none absolute h-[2px] rounded-full bg-[#C2806D]"
              style={{
                top: indicator.top,
                left: indicator.left,
                right: indicator.right,
                transition:
                  indicator.dir === "right"
                    ? `right ${fast}, left ${slow} 50ms`
                    : `left ${fast}, right ${slow} 50ms`,
              }}
            />
          )}
        </div>

        {/* ───────── Mobile & tablet (< lg) ───────── */}
        <div className="flex w-full items-center justify-between lg:hidden">
          <div className="nys-in" style={stagger(0)}>
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "/", "Home")}
              className="nys-logo relative block overflow-hidden"
            >
              <Image
                src={headerData.logo}
                alt={headerData.logoAlt}
                width={160}
                height={45}
                className="h-9 w-auto object-contain sm:h-10"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={headerData.buttonHref}
              onClick={(e) =>
                handleNavClick(e, headerData.buttonHref, headerData.button)
              }
              style={stagger(1)}
              className="nys-in inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#C2806D] px-4 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:bg-[#B87461] active:scale-95 sm:text-sm"
            >
              {headerData.button}
            </Link>

            {/* Hamburger morphs into a cross */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="nys-in rounded-lg p-2 text-[#1E2229] transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2806D]/50"
              style={stagger(2)}
              aria-label={
                headerData.mobileMenuAriaLabel || "Toggle navigation menu"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="nys-mobile-menu"
            >
              <span className="relative block h-4 w-6">
                <span
                  className={`absolute left-0 h-[2px] w-full rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileMenuOpen
                      ? "top-1/2 -translate-y-1/2 rotate-45"
                      : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "w-0 opacity-0" : "w-full opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-full rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileMenuOpen
                      ? "top-1/2 -translate-y-1/2 -rotate-45"
                      : "top-full -translate-y-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu: height eases open, links follow one by one */}
        <div
          id="nys-mobile-menu"
          className={`grid transition-[grid-template-rows,opacity,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            isMobileMenuOpen
              ? "visible grid-rows-[1fr] opacity-100"
              : "invisible grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-3 flex flex-col gap-1 border-t border-gray-100 pb-4 pt-3">
              {headerData.links.map((link, i) => {
                const isActive = activeItem === link.name;
                const isVisited = visitedSections.has(link.name);
                return (
                  <div
                    key={link.name}
                    className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isMobileMenuOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-3 opacity-0"
                    }`}
                    style={{
                      transitionDelay: isMobileMenuOpen
                        ? `${100 + i * 55}ms`
                        : "0ms",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href, link.name)}
                      className={`block rounded-md px-3.5 py-2.5 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-[#C2806D]/10 text-[#C2806D] font-semibold"
                          : "text-[#1E2229] hover:bg-gray-50 hover:text-[#C2806D]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
