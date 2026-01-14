import React from 'react';

interface HeroHeaderProps {
  title: string;
  subtitle: string;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="flex w-full flex-col mb-5">
      <h1 className="text-black [font-family:Inter] text-[45px] font-extrabold leading-[45px] tracking-[0.045px] w-[500px] max-md:max-w-full max-md:text-[40px] max-md:leading-[39px]">
        {title}
      </h1>
      <p className="text-[#1A1A1A] [font-family:Poppins] text-[20px] font-normal leading-[24px] mt-[17px] max-md:max-w-full">
        {subtitle}
      </p>
    </header>
  );
};