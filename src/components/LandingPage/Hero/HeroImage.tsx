import React from 'react';
import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({ src, alt = "Hero illustration" }) => {
  return (
    <>
      {/* Desktop Image - shown on lg and above */}
      <div className="hidden lg:block absolute top-[0px] right-[0px] flex w-full">
        <Image
          src={src}
          alt={alt}
          className="aspect-[1.28] object-contain h-[535px] max-w-full"
          width={685}
          height={535}
        />
      </div>
      {/* Tablet Image - shown only on tablet (md to lg) */}
      <div className="hidden md:block lg:hidden relative w-[380px] flex-shrink-0">
        <Image
          src="/hero_tablet.svg"
          alt={alt}
          className="aspect-[1.28] object-contain h-[535px] w-[380px]"
          width={380}
          height={297}
        />
      </div>
      {/* Mobile Image - shown on mobile (below md) */}
      <div className="block md:hidden relative w-full flex justify-center">
        <Image
          src="/hero_mobile.svg"
          alt={alt}
          className="object-contain w-full h-auto max-w-[358px]"
          width={685}
          height={535}
          priority
        />
      </div>
    </>
  );
};