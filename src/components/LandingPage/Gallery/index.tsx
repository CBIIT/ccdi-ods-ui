"use client";
import React from "react";
import UpdateCard from "./UpdateCard";

export interface GalleryUpdate {
  image: string;
  title: string;
  description: string;
  link: string;
}

export interface GalleryConfig {
  title: string;
  viewLatestButtonText: string;
  viewLatestButtonLink: string;
  newsletterButtonText: string;
  newsletterButtonLink: string;
  updates: GalleryUpdate[];
}

interface GalleryProps {
  data: { gallery: GalleryConfig};
}

const Gallery: React.FC<GalleryProps> = ({ data }) => {
  const config = data?.gallery;
  
  if (!config) return null;
  
  return (
    <section className="flex flex-col items-center px-3 sm:px-8 xl:px-[136px] pb-[10px] pt-[36px] max-w-[1444px] mx-auto mb-[40px]" aria-labelledby="latest-updates-heading">
      <h2 
        id="latest-updates-heading"
        className="text-[#345D85] text-[24px] sm:text-[28px] md:text-[32px] font-semibold leading-none text-right w-full"
      >
        {config.title}
      </h2>
      <div className="w-full mt-[31px] sm:mt-8 md:mt-[31px]">
        <div className="w-full">
          <div className="flex flex-wrap sm:flex-nowrap justify-center md:justify-end gap-4 lg:gap-[32px]">
            {config.updates.map((update: GalleryUpdate, idx: number) => (
              <div className="w-full sm:flex-1 sm:min-w-0 sm:max-w-[367px]" key={idx}>
                <div className="flex items-center rounded-[0px_28px_0px_28px]">
                  <div className="my-auto w-full">
                    <UpdateCard
                      image={update.image}
                      title={update.title}
                      description={update.description}
                      link={update.link}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Button below the cards */}
          <div className="flex justify-end mt-[22px] w-full">
            <a
              href={config.newsletterButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-none shadow-none px-0 py-0 rounded-none transition text-[14px] font-bold leading-4 uppercase relative flex flex-col items-center md:items-end"
              style={{
                color: "#3E8283",
                fontFamily: "Lato, sans-serif",
                fontStyle: "normal",
                letterSpacing: "0.7px",
                textAlign: "center",
              }}
            >
              <span className="bg-[#06324E] text-white text-center [font-family:Poppins] text-[12px] font-semibold leading-[16px] tracking-[0.24px] uppercase flex h-[41px] py-[12px] px-[30px] justify-center items-center relative pb-[14px]">
                {config.newsletterButtonText}
              </span>
            </a>
            {/* End button */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;