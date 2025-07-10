import React from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({ src, alt = "Hero illustration" }) => {
  return (
    <div className="absolute top-[0px] right-[0px] flex w-full">
      <img
        src={src}
        alt={alt}
        className="aspect-[1.28] object-contain h-[535px] max-w-full"
      />
    </div>
  );
};