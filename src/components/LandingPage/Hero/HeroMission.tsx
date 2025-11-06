import React from 'react';

interface HeroMissionProps {
  title: string;
  description: React.ReactNode;
}

export const HeroMission: React.FC<HeroMissionProps> = ({ title, description }) => {
  return (
    <section className="z-10 mt-[5px] font-normal max-md:max-w-full">
      <h2 className="text-black [font-family:Inter] text-[22px] font-semibold leading-[20px] max-md:max-w-full">
        {title}
      </h2>
      <p className="text-black [font-family:Nunito] text-[20px] font-normal leading-[28px] mt-2.5 max-md:max-w-full">
        {description}
      </p>
    </section>
  );
};