import React from "react";

interface ContactLinkProps {
  text: string;
  href: string;
  arrowSrc: string;
}

export const ContactLink: React.FC<ContactLinkProps> = ({ text, href }) => {
  return (
    <a 
      href={href}
      className="bg-[#FFFFFF] flex h-[41px] py-[12px] px-[30px] justify-center items-center gap-[40px_60px] text-sm font-bold uppercase tracking-[0.7px] leading-[36px] cursor-pointer w-auto rounded-[5px]"
    >
      <span className="text-[#054255] text-center [font-family:Poppins] text-[12px] font-semibold leading-[16px] tracking-[0.24px] uppercase flex items-center">
        {text}
      </span>
    </a>
  );
};

export default ContactLink;