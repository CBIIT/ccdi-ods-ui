import React from "react";
import Image from "next/image";
import arrowWhite from "../../../../assets/icons/right_arrow_white.svg";

interface ContactLinkProps {
  text: string;
  href: string;
  arrowSrc: string;
}

export const ContactLink: React.FC<ContactLinkProps> = ({ text, href, arrowSrc }) => {
  return (
    <a 
      href={href}
      className="inline-flex items-center gap-[40px_60px] text-sm text-[#C2FFF1] font-bold uppercase tracking-[0.7px] leading-[36px] border-b border-[rgba(194,255,241,1)] cursor-pointer w-auto hover:text-white hover:border-b-white group"
    >
      <span className="flex items-center">
        {text}
        <Image
          src={arrowSrc}
          alt=""
          width={7}
          height={7}
          className="aspect-[1] object-contain w-[10px] shrink-0 my-auto ml-12 group-hover:hidden"
        />
        <Image
          src={arrowWhite}
          alt=""
          width={7}
          height={7}
          className="aspect-[1] object-contain w-[10px] shrink-0 my-auto ml-12 hidden group-hover:inline"
        />
      </span>
    </a>
  );
};

export default ContactLink;