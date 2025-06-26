"use client";
import React from 'react';
import { HeroHeader } from './HeroHeader';
import { HeroImage } from './HeroImage';
import { HeroMission } from './HeroMission';
// import heroImage from '/hero.png';
import { useHeroConfig } from './HeroController';

const Hero: React.FC = () => {
  const config = useHeroConfig();
  if (!config) return null;

  return (
    <section className="text-center">
      <div className="bg-white w-full max-md:max-w-full max-md:pb-[100px]">
        <div className="flex flex-col relative min-h-[500px] mb-[-42px] items-center pt-10 pb-10 px-20 max-md:max-w-full max-md:mb-2.5 max-md:px-5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3706c3c5cb18fa36a17251cf4caa2ff9ce4826ee?placeholderIfAbsent=true"
            alt="Background image"
            className="absolute h-full w-full object-cover inset-0"
          />
          <div className="relative flex w-[908px] max-w-full flex-row items-center justify-between gap-8 max-md:flex-col max-md:items-stretch">
            {/* Left Side: Header and Mission */}
            <div className="w-1/2 flex flex-col items-start text-left max-md:w-full">
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
            <div className="w-1/2 flex justify-center items-center max-md:w-full">
              <HeroImage 
                src={config.image.src}
                alt={config.image.alt}
                className="w-full max-w-[400px] mx-auto my-8"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;