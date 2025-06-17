/**
 * HeroImage component displays the main illustration in the hero section.
 * It supports configurable image source, alt text, and optional className for styling.
 */
import React from 'react';

interface HeroImageProps {
  /** The source URL of the image */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional CSS classes to apply to the image wrapper */
  className?: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({ 
  src, 
  alt = "Hero illustration",
  className 
}) => {
  return (
    <div className={`flex justify-center w-full ${className || ''}`}>
      <img
        loading="eager"
        src={src}
        alt={alt}
        className="aspect-[1.28] object-contain w-[612px] max-w-full mt-8"
      />
    </div>
  );
};