"use client";
import React from "react";
import UpdateCard from "./UpdateCard";
import greenTriangle from '../../../../assets/landing/green_triangle.svg';

export interface GalleryUpdate {
  image: string;
  title: string;
  description: string;
  link: string;
  readMoreColor?: string;
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
  data: any;
}

const Gallery: React.FC<GalleryProps> = ({ data }) => {
  const config = data?.gallery;
  
  if (!config) return null;
  
  return (
    <section className="flex flex-col items-stretch items-center px-20 py-14 max-md:px-5 max-w-[1444px] mx-auto" aria-labelledby="latest-updates-heading">
      <h2 
        id="latest-updates-heading"
        className="text-[rgba(52,93,133,1)] text-[32px] font-semibold leading-none ml-2.5"
      >
        {config.title}
      </h2>
      <div className="w-full mt-12 max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-full max-md:w-full max-md:ml-0">
            <div className="w-full max-md:max-w-full max-md:mt-8">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                {config.updates.map((update: GalleryUpdate, idx: number) => (
                  <div className="w-full max-md:w-full max-md:ml-0" key={idx}>
                    <div className="bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.25)] border flex grow items-center gap-2.5 w-full rounded-[0px_28px_0px_28px] border-[rgba(222,234,237,1)] border-solid max-md:mt-3">
                      <div className="self-stretch min-w-60  my-auto">
                        <UpdateCard
                          image={update.image}
                          title={update.title}
                          description={update.description}
                          readMoreColor={update.readMoreColor}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Button below the cards */}
              <div className="flex justify-end mt-8 w-full">
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
                  <span className="relative inline-block">
                    {config.newsletterButtonText}
                    <img src={greenTriangle.src} alt="green triangle" className="inline-block align-middle w-[10px] h-[10px] ml-[35px] -mt-[3px] relative" />
                    <span
                      style={{
                        display: "block",
                        height: "2px",
                        width: "100%",
                        background: "#3E8283",
                        position: "absolute",
                        right: 0,
                        left: 0,
                        bottom: "-14px",
                        borderRadius: "1px",
                      }}
                    />
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