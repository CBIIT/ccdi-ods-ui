"use client";
import React from "react";
import HeroCard from "./Card";
import ContactLink from "./ContactLink";
import banner1 from "../../../../assets/landing/banner_1.svg";
import banner2 from "../../../../assets/landing/banner_2.svg";
import banner3 from "../../../../assets/landing/banner_3.svg";
import arrowGreen from "../../../../assets/icons/right_arrow_green.svg";

export interface BannerConfig {
  supportTitle: string;
  questionText: string;
  homepageButton: {
    text: string;
    link: string;
  };
  textFrame: string[];
}

interface BannerProps {
  data: {
    banner: BannerConfig;
  };
}

const banners = [banner1, banner2, banner3];

const Banner: React.FC<BannerProps> = ({ data }) => {
  const config = data?.banner;
  if (!config) return null;

  return (
    <section 
      className="bg-[#008577] flex flex-col items-center px-20 py-14 pb-[45px] max-md:px-5 md:px-10 lg:px-8 xl:px-16 2xl:px-20"
      aria-labelledby="hero-title"
    >
      <h2
        id="hero-title"
        className="text-white text-center [font-family:Inter] text-[32px] font-normal [font-weight:600] leading-[36px] max-md:max-w-full pt-[62px] max-md:pt-[19px]"
      >
        {config.supportTitle}
      </h2>
      
      <div className="flex items-center gap-[20px] justify-center flex-wrap mt-[20px] max-md:flex-col max-md:items-stretch max-md:max-w-full max-md:mt-10 md:flex-col md:items-stretch md:gap-[20px] md:mt-[20px] md:max-w-[600px] lg:flex-row lg:items-center lg:justify-center lg:flex-nowrap lg:gap-[4px] lg:max-w-none xl:gap-[10px] 2xl:gap-[10px]">
        {config.textFrame.map((desc: string, idx: number) => (
          <HeroCard
            key={idx}
            imageSrc={banners[idx]?.src}
            description={desc}
            imageWidth="w-[74px]"
            imageAspect="aspect-[0.8]"
          />
        ))}
      </div>
      
      <div className="flex gap-[50px] flex-wrap mt-[29px] max-md:flex-col max-md:items-center max-md:text-center max-md:gap-[20px] max-md:max-w-full max-md:mt-10 md:flex-row md:justify-center md:items-center md:gap-[30px] lg:gap-[50px]">
        <div className="text-white text-right [font-family:Nunito] text-[18px] font-normal leading-[28px] w-[546px] mt-[6px] max-md:text-center max-md:w-full max-md:mt-0 md:text-left md:w-auto md:mt-0 lg:text-right lg:w-[546px]">
          {config.questionText}
        </div>
        <ContactLink 
          text={config.homepageButton.text}
          href={config.homepageButton.link}
          arrowSrc={arrowGreen.src}
        />
      </div>
    </section>
  );
};

export default Banner;