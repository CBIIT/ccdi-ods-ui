"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import UpdateCard from "./UpdateCard";
import startIcon from '../../../../assets/icons/Start_Icon.svg'
import pauseIcon from '../../../../assets/icons/Pause_Icon.svg'

const AUTO_ROTATE_INTERVAL_MS = 5000;

/** Pause icon (two vertical bars) */
const CarouselPauseIcon = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-current" aria-hidden>
    <rect x="1" y="0" width="3" height="14" rx="1" fill="currentColor" />
    <rect x="8" y="0" width="3" height="14" rx="1" fill="currentColor" />
  </svg>
);

/** Play icon (triangle) for when carousel is paused */
const CarouselPlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-current ml-0.5" aria-hidden>
    <path d="M2 1v12l10-6L2 1z" fill="currentColor" />
  </svg>
);

export interface GalleryUpdate {
  image: string;
  title: string;
  description: string;
  link: string;
}

export interface GalleryConfig {
  title: string;
  viewLatestButtonText: string;
  viewLatestButtonLink: string;
  newsletterButtonText: string;
  newsletterButtonLink: string;
  updates: GalleryUpdate[];
}

interface GalleryProps {
  data: { gallery: GalleryConfig };
}

const CARD_WIDTH_MOBILE = 214;
const CARD_GAP_MOBILE = 28;
const SLIDE_STEP = CARD_WIDTH_MOBILE + CARD_GAP_MOBILE; // 242
const MOBILE_VIEWPORT_OFFSET = -SLIDE_STEP; // -242: show indices 1,2,3

/** Build initial mobile list [c, a, b, c, a, b] from updates [a, b, c] so visible indices 1,2,3 show a,b,c */
function buildMobileRotatingList(updates: GalleryUpdate[] | undefined): GalleryUpdate[] {
  if (!updates || updates.length < 3) return [];
  const [a, b, c] = updates;
  return [c, a, b, c, a, b];
}

const Gallery: React.FC<GalleryProps> = ({ data }) => {
  const config = data?.gallery;
  const [rotatingList, setRotatingList] = useState<GalleryUpdate[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [slideOffset, setSlideOffset] = useState(MOBILE_VIEWPORT_OFFSET);
  const [slideTransitionEnabled, setSlideTransitionEnabled] = useState(true);
  const slideDirectionRef = useRef<"next" | "prev" | null>(null);
  const slideTrackRef = useRef<HTMLDivElement>(null);
  const itemCount = config?.updates?.length ?? 0;

  useEffect(() => {
    if (config?.updates && config.updates.length >= 3) {
      setRotatingList(buildMobileRotatingList(config.updates));
    }
  }, [config?.updates]);

  const handleSlideTransitionEnd = useCallback(() => {
    const dir = slideDirectionRef.current;
    if (dir === "next") {
      setRotatingList((prev) =>
        prev.length === 6 ? [...prev.slice(1), prev[0]] : prev
      );
    } else if (dir === "prev") {
      setRotatingList((prev) =>
        prev.length === 6 ? [prev[5], ...prev.slice(0, 5)] : prev
      );
    }
    slideDirectionRef.current = null;
    setSlideTransitionEnabled(false);
    setSlideOffset(MOBILE_VIEWPORT_OFFSET);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSlideTransitionEnabled(true));
    });
  }, []);

  const goToNext = useCallback(() => {
    if (rotatingList.length !== 6 || slideDirectionRef.current) return;
    slideDirectionRef.current = "next";
    setSlideOffset(-2 * SLIDE_STEP); // show indices 2,3,4
  }, [rotatingList.length]);

  const goToPrev = useCallback(() => {
    if (rotatingList.length !== 6 || slideDirectionRef.current) return;
    slideDirectionRef.current = "prev";
    setSlideOffset(0); // show indices 0,1,2
  }, [rotatingList.length]);

  useEffect(() => {
    if (rotatingList.length !== 6 || isPaused) return;
    const id = setInterval(goToNext, AUTO_ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [rotatingList.length, isPaused, goToNext]);

  const activeIndex =
    config && itemCount >= 3 && rotatingList.length === 6
      ? config.updates.findIndex(
          (u) => u.title === rotatingList[2].title && u.link === rotatingList[2].link
        )
      : 0;

  if (!config) return null;

  return (
    <section
      className="flex flex-col items-center px-4 pt-[24px] pb-[45px] sm:pt-[36px] sm:pb-[10px] md:pt-[30px] md:pb-[10px] gallery-lg:px-0 max-w-[1440px] mx-auto mb-[40px]"
      aria-labelledby="latest-updates-heading"
    >
      <div className="w-full gallery-lg:max-w-[1165px] gallery-lg:mx-auto">
        <h2
          id="latest-updates-heading"
          className="text-[#345D85] text-[24px] sm:text-[28px] md:text-[32px] [font-family:Inter] font-semibold leading-[38px] w-full"
        >
          {config.title}
        </h2>
        <div className="w-full mt-6 sm:mt-8 md:mt-[24px] gallery-lg:mt-[31px]">
        <div className="w-full flex flex-col">
          {/* Mobile: 6-item sliding track; viewport shows 3 cards; smooth slide then reset for infinite */}
          <div className="md:hidden w-full">
            <div
              className="overflow-hidden mx-auto"
              style={{ width: 3 * CARD_WIDTH_MOBILE + 2 * CARD_GAP_MOBILE }}
            >
              <div
                ref={slideTrackRef}
                className="flex gap-[28px] py-1"
                style={{
                  width: 6 * CARD_WIDTH_MOBILE + 5 * CARD_GAP_MOBILE,
                  transform: `translateX(${slideOffset}px)`,
                  transition: slideTransitionEnabled
                    ? "transform 0.45s ease-in-out"
                    : "none",
                }}
                onTransitionEnd={handleSlideTransitionEnd}
                role="region"
                aria-label="Latest updates carousel"
              >
                {rotatingList.map((update: GalleryUpdate, idx: number) => (
                  <div
                    key={`${idx}-${update.title}-${update.link}`}
                    className="flex-shrink-0 w-[214px] rounded-[0px_28px_0px_28px]"
                  >
                    <UpdateCard
                      image={update.image}
                      title={update.title}
                      description={update.description}
                      link={update.link}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Pagination: Left | Pause | Right — infinite, no disabled */}
            <div className="flex gap-[18px] items-center justify-center shrink-0 w-full mt-[30px]">
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Previous slide"
                className="group flex items-center justify-center rounded-full border border-[#4BBFC6] bg-transparent w-[39.158px] h-[39.158px] text-[#6B7280] touch-manipulation cursor-pointer"
              >
                <div
                  className="mr-[3px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[11px] border-b-[#C9C9C9] group-hover:border-b-[#8D9096] border-t-0 border-t-transparent -rotate-90"
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                className="flex items-center justify-center rounded-full border border-[#4BBFC6] bg-transparent w-[39.158px] h-[39.158px] text-[#6B7280] touch-manipulation cursor-pointer shadow-[0px_2.49px_9.32px_0px_#00000073]"
              >
                <img src={isPaused ? startIcon.src : pauseIcon.src} alt="Pause" className={isPaused ? "w-[20px] h-[22px] pl-[4px]" : "w-[18px] h-[18px]"} />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next slide"
                className="group flex items-center justify-center rounded-full border border-[#4BBFC6] bg-transparent w-[39.158px] h-[39.158px] text-[#6B7280] touch-manipulation cursor-pointer"
              >
                <div
                  className="ml-[3px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[11px] border-t-[#C9C9C9] group-hover:border-t-[#8D9096] border-b-0 border-b-transparent -rotate-90"
                  aria-hidden
                />
              </button>
            </div>
          </div>

          {/* Tablet + Desktop: row of cards; desktop only title and cards left-aligned */}
          <div className="hidden md:flex flex-wrap sm:flex-nowrap justify-center md:justify-center gallery-lg:justify-start gap-4 md:gap-[33px] gallery-lg:gap-[32px]">
            {config.updates.map((update: GalleryUpdate, idx: number) => (
              <div
                className="w-full sm:flex-1 sm:min-w-0 sm:max-w-[367px] md:w-[215px] md:min-w-0 md:max-w-[215px] md:shrink-0 gallery-lg:flex-1 gallery-lg:max-w-[367px]"
                key={idx}
              >
                <div className="flex items-center rounded-[0px_28px_0px_28px]">
                  <div className="my-auto w-full">
                    <UpdateCard
                      image={update.image}
                      title={update.title}
                      description={update.description}
                      link={update.link}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button: centered on mobile, right-aligned on tablet+ (Figma) */}
          <div className="flex justify-center mt-[24px] w-full md:justify-end">
            <a
              href={config.newsletterButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-none shadow-none px-0 py-0 rounded-none transition text-[14px] font-bold leading-4 uppercase relative flex flex-col items-center md:items-end"
              style={{
                color: "#3E8283",
                fontFamily: "Lato, sans-serif",
                fontStyle: "normal",
                letterSpacing: "0.7px",
                textAlign: "center",
              }}
            >
              <span className="bg-[#06324E] text-white text-center [font-family:Poppins] text-[12px] font-semibold leading-[16px] tracking-[0.24px] uppercase flex h-[41px] py-[12px] px-[30px] justify-center items-center rounded-[5px]">
                {config.newsletterButtonText}
              </span>
            </a>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;