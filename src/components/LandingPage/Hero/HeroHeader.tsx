import React from 'react';

interface HeroHeaderProps {
  title: string;
  subtitle: string;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="flex w-full flex-col mb-5">
      <h1 className="text-black text-[45px] font-extrabold leading-10 tracking-[0.05px] w-[500px] max-md:max-w-full max-md:text-[40px] max-md:leading-[39px]">
        {title}
      </h1>
      <p className="text-[rgba(105,105,105,1)] text-xl font-normal leading-none mt-3 max-md:max-w-full">
        {subtitle}
      </p>
    </header>
  );
};