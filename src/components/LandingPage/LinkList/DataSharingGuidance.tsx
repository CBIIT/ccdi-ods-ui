import React from "react";
import { GuidanceLink } from "./GuidanceLink";

export const DataSharingGuidance: React.FC = () => {
  const linkList = [
    {
      title: "Data Sharing Guidance",
      links: [
        { text: "NIH Scientific Data Sharing Guidance", href: "/nih-guidance" },
        { text: "Data Sharing Basics", href: "/data-sharing-basics" },
        { text: "NCI Scientific Data Sharing Guidance", href: "/nci-guidance" },
        { text: "NCI Requirements for GDS Policy", href: "/nci-requirements" },
        { text: "Cancer Moonshot (PADS) Guidance", href: "/cancer-moonshot" },
        { text: "Tips for Writing a DMS Plan", href: "/dms-plan-tips" },
      ],
    },
    {
      title: "Data Sharing Process",
      links: [
        { text: "Submit Non-NIH Funded Study to dbGaP", href: "/submit-dbgap" },
        { text: "Accessing Scientific Data for Re-Use", href: "/accessing-re-use" },
      ],
    },
  ];

  // Helper to split links into chunks of 2
  const chunkLinks = (links: { text: string; href: string }[]) => {
    const chunks = [];
    for (let i = 0; i < links.length; i += 2) {
      chunks.push(links.slice(i, i + 2));
    }
    return chunks;
  };

  return (
    <section className="flex flex-col items-stretch items-center px-20 py-14 max-md:px-5 max-w-[1444px] mx-auto" >
      <div className="flex flex-col gap-8 ml-2.5 mb-4 w-full">
        {linkList.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-2 w-full">
            <h2 className="text-[32px] font-semibold text-[#7B3D7D] mb-2 max-md:text-[28px] max-sm:text-2xl">
              {section.title}
            </h2>
            {chunkLinks(section.links).map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-5 w-full mb-2">
                {row.map((link, colIdx) => (
                  <div key={colIdx} className="w-1/2">
                    <GuidanceLink text={link.text} href={link.href} />
                  </div>
                ))}
                {row.length < 2 && <div className="w-1/2" />} {/* Empty space if only 1 item */}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="w-full h-px bg-[#D8D8D8] mt-[38px]" />
    </section>
  );
};