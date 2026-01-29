"use client";
import React from 'react';
import Image from 'next/image';
import { HeroHeader } from './HeroHeader';
import { HeroImage } from './HeroImage';
import { HeroMission } from './HeroMission';

interface HeroProps {
  data: { hero: HeroConfig };
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  mission: {
    title: string;
    description: string;
  };
  image: {
    src: string;
    alt: string;
  };
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const config = data?.hero;

  if (!config) return null;

  return (
    <section className="text-center max-md:m-0 max-md:text-left">
      <div className="bg-white w-full max-md:max-w-full max-md:bg-transparent">
        <div className="flex flex-col relative min-h-[500px] mb-[-42px] items-center pt-15 pb-10 px-35 max-md:max-w-full max-md:mb-0 max-md:px-5 max-md:pb-6 max-md:pt-8 max-md:min-h-auto md:px-8 lg:px-8 xl:px-20 2xl:px-35">
          <Image
            src="/bg.png"
            alt="Background image"
            fill
            style={{ objectFit: "cover" }}
            className="absolute h-full w-full object-cover inset-0"
          />
          <div className="relative flex w-[1100px] max-w-full flex-row items-start justify-between gap-8 max-md:flex-col max-md:items-start max-md:gap-6 md:flex-row md:gap-6 lg:items-start lg:justify-between lg:gap-[20px] xl:gap-[40px] 2xl:gap-[60px]">
            {/* Left Side: Header and Mission */}
            <div className="flex-1 w-auto flex flex-col items-start text-left max-md:w-full max-md:items-start max-md:text-left mt-[41px] md:mt-[41px] md:flex-1 md:items-start md:text-left lg:w-[500px] lg:flex-shrink-0 xl:w-[500px] 2xl:w-[500px]">
              <HeroHeader 
                title={config.title}
                subtitle={config.subtitle}
              />
              <div className="mt-5 w-full">
                <HeroMission 
                  title={config.mission.title}
                  description={config.mission.description}
                />
              </div>
            </div>
            {/* Right Side: Hero Image */}
            <div className="w-[645px] flex-shrink-0 relative flex max-md:w-full max-md:mt-6 md:w-auto md:flex-1 lg:w-auto lg:flex-1 xl:w-[645px] xl:flex-shrink-0">
              <HeroImage 
                src={config.image.src}
                alt={config.image.alt}
                className="w-full max-w-[400px] mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;