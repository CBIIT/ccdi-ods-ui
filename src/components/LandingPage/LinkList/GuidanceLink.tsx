import React from "react";

interface GuidanceLinkProps {
  text: string;
  href: string;
}

export const GuidanceLink: React.FC<GuidanceLinkProps> = ({ text, href }) => {
  return (
    <div className="flex items-center p-2.5 group">
      <div className="flex items-center rounded-[30px] border-[1.5px] border-transparent px-[30px] py-[10px] hover:rounded-[30px] hover:border hover:border-[#E5ECEE] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.25)] hover:border-[1.5px]">
        <div className="w-[11px] h-[11px] rounded-full bg-[#009485] mr-[30px]"></div>
        <a 
          href={href}
          className="text-[#3F4244] font-['Poppins'] text-[20px] tracking-[0.02em] underline decoration-[#3F4244] hover:text-[#009485] hover:decoration-[#009485]"
        >
          {text}
        </a>
      </div>
    </div>
  );
};
