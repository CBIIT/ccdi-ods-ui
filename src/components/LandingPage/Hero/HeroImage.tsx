'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export const HeroImage: React.FC<HeroImageProps> = ({ src, alt = "Hero illustration" }) => {
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
  const desktopQuery = window.matchMedia('(min-width: 1024px)');

  const [viewportSize, setViewportSize] = useState<ViewportSize>(() => {
    if (desktopQuery.matches) {
      return 'desktop';
    } else if (tabletQuery.matches) {
      return 'tablet';
    } else {
      return 'mobile';
    }
  });

  useEffect(() => {
    const updateViewportSize = () => {
      if (desktopQuery.matches) {
        setViewportSize('desktop');
      } else if (tabletQuery.matches) {
        setViewportSize('tablet');
      } else {
        setViewportSize('mobile');
      }
    };

    // Listen for changes
    mobileQuery.addEventListener('change', updateViewportSize);
    tabletQuery.addEventListener('change', updateViewportSize);
    desktopQuery.addEventListener('change', updateViewportSize);

    return () => {
      mobileQuery.removeEventListener('change', updateViewportSize);
      tabletQuery.removeEventListener('change', updateViewportSize);
      desktopQuery.removeEventListener('change', updateViewportSize);
    };
  }, [desktopQuery, mobileQuery, tabletQuery]);

  // Only render the image that matches the current viewport
  if (viewportSize === 'desktop') {
    return (
      <div className="flex absolute top-[0px] right-[0px] w-full">
        <Image
          src={src}
          alt={alt}
          className="aspect-[1.28] object-contain"
          width={685}
          height={535}
        />
      </div>
    );
  }

  if (viewportSize === 'tablet') {
    return (
      <div className="relative w-[380px] flex-shrink-0">
        <Image
          src="/hero_tablet.svg"
          alt={alt}
          className="aspect-[1.28] object-contain h-[535px] w-[380px]"
          width={380}
          height={297}
        />
      </div>
    );
  }

  // Mobile (default)
  return (
    <div className="flex relative w-full justify-center">
      <Image
        src="/hero_mobile.svg"
        alt={alt}
        className="object-contain w-full h-auto max-w-[358px]"
        width={685}
        height={535}
        priority
      />
    </div>
  );
};