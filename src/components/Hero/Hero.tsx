/**
 * Hero component displays the main hero section of the homepage with configurable content.
 * This component follows the system design specification and supports content updates through configuration.
 */
import React from 'react';
import { HeroHeader } from './HeroHeader';
import { HeroImage } from './HeroImage';
import { HeroMission } from './HeroMission';
interface HeroConfig {
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

interface HeroProps {
  config?: HeroConfig;
}

const defaultConfig: HeroConfig = {
  title: "Discover the NCI Data Sharing Lifecycle",
  subtitle: "NCI's Data Sharing Approach Starts and Ends with the Patient in Mind",
  mission: {
    title: "NCI Office of Data Sharing (ODS) Mission:",
    description: "To direct a comprehensive data sharing vision and strategy for NCI which advocates for proper broad and equitable data sharing and the needs of the cancer research and patience communities."
  },
  image: {
    src: "/assets/hero.png",
    alt: "NCI Data Sharing Lifecycle diagram"
  }
};

const Hero: React.FC<HeroProps> = ({ config = defaultConfig }) => {
  return (
    <section className="text-center" role="banner">
      <div className="bg-white w-full max-md:max-w-full max-md:pb-[100px]">
        <div className="flex flex-col relative min-h-[819px] mb-[-42px] items-center pt-[52px] pb-[55px] px-20 max-md:max-w-full max-md:mb-2.5 max-md:px-5">
          <img
            loading="eager"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3706c3c5cb18fa36a17251cf4caa2ff9ce4826ee?placeholderIfAbsent=true"
            alt="Background illustration"
            className="absolute h-full w-full object-cover inset-0"
            aria-hidden="true"
          />
          <div className="relative flex w-[908px] max-w-full flex-col items-stretch">
            <HeroHeader 
              title={config.title || defaultConfig.title}
              subtitle={config.subtitle || defaultConfig.subtitle}
            />
            <HeroImage 
              src={config.image?.src || defaultConfig.image.src}
              alt={config.image?.alt || defaultConfig.image.alt}
              className="w-full max-w-[800px] mx-auto my-8"
            />
            <HeroMission 
              title={config.mission.title}
              description={config.mission.description}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;