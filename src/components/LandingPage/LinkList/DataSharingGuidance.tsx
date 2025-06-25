import React from "react";
import { GuidanceLink } from "./GuidanceLink";

export const DataSharingGuidance: React.FC = () => {
  const linkList = [
    {
      text: "NIH Scientific Data Sharing Guidance",
      href: "#nih-guidance",
    },
    {
      text: "NCI Scientific Data Sharing Guidance",
      href: "#nci-guidance",
    },
    {
      text: "Cancer Moonshot (PADS) Guidance",
      href: "#cancer-moonshot",
    },
    {
      text: "Data Sharing Basics",
      href: "#data-sharing-basics",
    },
    {
      text: "NCI Requirements for GDS Policy",
      href: "#nci-requirements",
    },
    {
      text: "Tips for Writing a DMS Plan",
      href: "#dms-plan-tips",
    },
  ];

  // Split the linkList into rows of 2 items each
  const rows = [];
  for (let i = 0; i < linkList.length; i += 2) {
    rows.push(linkList.slice(i, i + 2));
  }

  return (
    <section className="flex flex-col items-stretch items-center px-20 py-14 max-md:px-5 max-w-[1444px] mx-auto" >
      <h2 className="text-[32px] font-semibold text-[#7B3D7D] mb-[38px] max-md:text-[28px] max-sm:text-2xl">
        Data Sharing Guidance
      </h2>
      <div className="flex flex-col gap-5 ml-2.5 mb-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-5 w-full">
            {row.map((link, colIndex) => (
              <div key={colIndex} className="w-1/2">
                <GuidanceLink text={link.text} href={link.href} />
              </div>
            ))}
            {/* If the last row has only one item, add an empty div to keep widths consistent */}
            {row.length < 2 && <div className="w-1/2" />}
          </div>
        ))}
      </div>
      <div className="w-full h-px bg-[#D8D8D8] mt-[38px]" />
    </section>
  );
};