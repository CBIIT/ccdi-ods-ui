"use client";
import React from "react";
import Image from "next/image";
import UpdateCard from "./UpdateCard";
import greenTriangle from '../../../../assets/landing/green_triangle.svg';

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
    <section className="flex flex-col items-stretch items-center px-[136px] pb-[10px] pt-[36px] max-md:px-5 max-w-[1444px] mx-auto mb-[40px]" aria-labelledby="latest-updates-heading">
      <h2 
        id="latest-updates-heading"
        className="text-[#345D85] text-[32px] font-semibold leading-none text-right"
      >
        {config.title}
      </h2>
      <div className="w-full mt-[31px] max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-full max-md:w-full max-md:ml-0">
            <div className="w-full max-md:max-w-full max-md:mt-8">
              <div className="flex justify-end gap-[32px] max-md:flex-col max-md:items-stretch">
                {config.updates.map((update: GalleryUpdate, idx: number) => (
                  <div className="w-[367px] max-md:w-full max-md:ml-0" key={idx}>
                    <div className="flex items-center rounded-[0px_28px_0px_28px] max-md:mt-3">
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
                  className="bg-transparent border-none shadow-none px-0 py-0 rounded-none transition text-[14px] font-bold leading-4 uppercase relative flex flex-col items-end"
                  style={{
                    color: "#3E8283",
                    fontFamily: "Lato, sans-serif",
                    fontStyle: "normal",
                    letterSpacing: "0.7px",
                    textAlign: "right",
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
        </div>
      </div>
    </section>
  );
};

export default Gallery;