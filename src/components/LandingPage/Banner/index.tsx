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
      className="bg-[#008577] flex flex-col items-center px-20 py-14 pb-[45px] max-md:px-5"
      aria-labelledby="hero-title"
    >
      <h2
        id="hero-title"
        className="text-white text-center [font-family:Inter] text-[32px] font-norma font-[600] leading-[36px] max-md:max-w-full pt-[62px]"
      >
        {config.supportTitle}
      </h2>
      
      <div className="flex items-center gap-[20px] justify-center flex-wrap mt-[20px] max-md:max-w-full max-md:mt-10">
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
      
      <div className="flex gap-[50px] flex-wrap mt-[29px] max-md:max-w-full max-md:mt-10">
        <div className="text-white text-right [font-family:Nunito] text-[18px] font-normal leading-[28px] w-[546px] mt-[6px] max-md:max-w-full">
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