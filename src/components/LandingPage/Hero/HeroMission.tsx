import React from 'react';

interface HeroMissionProps {
  title: string;
  description: React.ReactNode;
}

export const HeroMission: React.FC<HeroMissionProps> = ({ title, description }) => {
  return (
    <section className="z-10 mt-[5px] font-normal max-md:max-w-full">
      <h2 className="text-[#1A1A1A] [font-family:Poppins] text-[20px] font-normal leading-[20px] max-md:max-w-full">
        {title}
      </h2>
      <p className="text-black [font-family:Nunito] text-[18px] font-normal leading-[28px] mt-2.5 max-md:max-w-full">
        {description}
      </p>
    </section>
  );
};