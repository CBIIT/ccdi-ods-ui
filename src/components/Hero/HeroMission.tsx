/**
 * HeroMission component displays the mission statement section of the hero.
 * It supports both plain text and React node content for the description.
 */
import React from 'react';

interface HeroMissionProps {
  /** The title of the mission statement section */
  title: string;
  /** The mission description content, supports both string and ReactNode */
  description: React.ReactNode;
}

export const HeroMission: React.FC<HeroMissionProps> = ({ title, description }) => {
  return (
    <section className="z-10 mt-[-7px] font-normal max-md:max-w-full">
      <h2 className="text-[rgba(105,105,105,1)] text-xl leading-none max-md:max-w-full">
        {title}
      </h2>
      <div className="text-black text-lg leading-7 mt-2.5 max-md:max-w-full">
        {description}
      </div>
    </section>
  );
};