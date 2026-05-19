import React from 'react';

interface HeroMissionProps {
  title: string;
  description: React.ReactNode;
}

export const HeroMission: React.FC<HeroMissionProps> = ({ title, description }) => {
  return (
    <section className="z-10 mt-[5px] font-normal max-md:max-w-full max-md:mt-0 max-md:pt-[3px] max-md:gap-[8px] max-md:flex max-md:flex-col">
      <h2 className="text-[#1A1A1A] [font-family:Poppins] text-[20px] font-normal leading-[24px] max-md:max-w-full">
        {title}
      </h2>
      <p className="text-black [font-family:Nunito] text-[18px] font-normal leading-[28px] mt-2.5 max-md:mt-0 max-md:max-w-full">
        {description}
      </p>
    </section>
  );
};