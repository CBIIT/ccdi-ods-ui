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
    <section className="text-center">
      <div className="bg-white w-full max-md:max-w-full max-md:pb-[100px]">
        <div className="flex flex-col relative min-h-[500px] mb-[-42px] items-center pt-10 pb-10 px-35 max-md:max-w-full max-md:mb-2.5 max-md:px-5">
          <Image
            src="/bg.png"
            alt="Background image"
            fill
            style={{ objectFit: "cover" }}
            className="absolute h-full w-full object-cover inset-0"
          />
          <div className="relative flex w-[1100px] max-w-full flex-row items-start justify-between gap-8 max-md:flex-col max-md:items-stretch">
            {/* Left Side: Header and Mission */}
            <div className="flex-1 w-auto flex flex-col items-start text-left max-md:w-full mt-8">
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
            <div className="w-[645px] flex-shrink-0 relative flex max-md:w-full">
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