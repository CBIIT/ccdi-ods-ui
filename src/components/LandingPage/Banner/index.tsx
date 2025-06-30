"use client";
import React from "react";
import HeroCard from "./Card";
import ContactLink from "./ContactLink";
import banner1 from "../../../../assets/landing/banner_1.svg";
import banner2 from "../../../../assets/landing/banner_2.svg";
import banner3 from "../../../../assets/landing/banner_3.svg";

interface BannerProps {
  data: any;
}

const banners = [banner1, banner2, banner3];

const Banner: React.FC<BannerProps> = ({ data }) => {
  const config = data?.banner;

  if (!config) {
    return null; // or a loading spinner/message
  }

  return (
    <section 
      className="bg-[rgba(0,148,133,1)] flex flex-col items-center px-20 py-14 max-md:px-5"
      aria-labelledby="hero-title"
    >
      <h2
        id="hero-title"
        className="text-white text-xl font-normal leading-[1.4] text-center max-md:max-w-full pt-[100px]"
      >
        {config.supportTitle}
      </h2>
      
      <div className="flex items-center gap-[25px] justify-center flex-wrap mt-[49px] max-md:max-w-full max-md:mt-10">
        {config.textFrame.map((desc: any, idx: number) => (
          <HeroCard
            key={idx}
            imageSrc={banners[idx]?.src}
            description={desc}
            imageWidth="w-[74px]"
            imageAspect="aspect-[0.8]"
          />
        ))}
      </div>
      
      <div className="flex gap-3 flex-wrap mt-[68px] max-md:max-w-full max-md:mt-10">
        <div className="text-white text-lg font-normal leading-loose text-right w-[546px] max-md:max-w-full">
          {config.questionText}
        </div>
        <ContactLink 
          text={config.homepageButton.text}
          href={config.homepageButton.link}
          arrowSrc="https://cdn.builder.io/api/v1/image/assets/4ccc52d59fb54340b43b3652db0442b6/daae2bf7b8f93fdfa46d0689475cd9e9b5c3aa27?placeholderIfAbsent=true"
        />
      </div>
    </section>
  );
};

export default Banner;