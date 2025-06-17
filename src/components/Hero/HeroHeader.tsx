/**
 * HeroHeader component displays the main title and subtitle of the hero section.
 * It uses semantic HTML with proper heading hierarchy and maintains responsive design.
 */
import React from 'react';

interface HeroHeaderProps {
  /** The main title text for the hero section */
  title: string;
  /** The subtitle text providing additional context */
  subtitle: string;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="self-center flex w-[717px] max-w-full flex-col ml-[18px]">
      <h1 className="text-black text-[45px] font-extrabold leading-10 tracking-[0.05px] self-center max-w-[500px] max-md:max-w-full max-md:text-[40px] max-md:leading-[39px]">
        {title}
      </h1>
      <p className="text-[rgba(105,105,105,1)] text-xl font-normal leading-none mt-3 max-md:max-w-full">
        {subtitle}
      </p>
    </header>
  );
};