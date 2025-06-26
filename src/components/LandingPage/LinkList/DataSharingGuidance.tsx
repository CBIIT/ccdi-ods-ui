"use client";
import React from "react";
import { GuidanceLink } from "./GuidanceLink";
import { useLinkListConfig } from "./LinklistController";

export const DataSharingGuidance: React.FC = () => {
  const config = useLinkListConfig();

  // Fix: Guard against config being null or links being empty
  if (!config?.links?.length) return null;

  // Helper to split links into chunks of 2
  const chunkLinks = (links: { text: string; link: string }[]) => {
    const chunks = [];
    for (let i = 0; i < links.length; i += 2) {
      chunks.push(links.slice(i, i + 2));
    }
    return chunks;
  };

  return (
    <section className="flex flex-col items-stretch items-center px-20 py-14 max-md:px-5 max-w-[1444px] mx-auto" >
      <div className="flex flex-col gap-8 ml-2.5 mb-4 w-full">
        {config.map((section, sectionIdx) => (
          <React.Fragment key={sectionIdx}>
            <div className="mb-2 w-full">
              <h2
                className="text-[32px] font-semibold mb-2 max-md:text-[28px] max-sm:text-2xl"
                style={{ color: section.titleTextColor }}
              >
                {section.title}
              </h2>
              {chunkLinks(section.links).map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-5 w-full mb-2">
                  {row.map((link, colIdx) => (
                    <div key={colIdx} className="w-1/2">
                      <GuidanceLink text={link.text} href={link.link} />
                    </div>
                  ))}
                  {row.length < 2 && <div className="w-1/2" />}
                </div>
              ))}
            </div>
            {sectionIdx < config.length - 1 && (
              <div className="w-full h-px bg-[#D8D8D8] mt-[38px]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};