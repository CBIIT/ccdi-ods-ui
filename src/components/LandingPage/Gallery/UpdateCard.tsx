import React from "react";
import externalLinkIcon from "../../../../assets/icons/external_link_icon.svg";

interface UpdateCardProps {
  image: string;
  title: string;
  description: string;
  link: string
  readMoreColor?: string;
  hasBorder?: boolean;
  className?: string;
}

const UpdateCard: React.FC<UpdateCardProps> = ({
  image,
  title,
  description,
  link,
  readMoreColor,
  hasBorder = false,
  className = "",
}) => {
  return (
    <div
      className={`bg-[rgba(50,48,50,1)] pb-3.5 rounded-[0px_20px_0px_20px] ${
        hasBorder
          ? "shadow-[0px_0px_20px_rgba(0,0,0,0.25)] border border-[rgba(222,234,237,1)] border-solid p-2.5"
          : ""
      } ${className}`}
    >
      <div className="rounded-[0px_0px_0px_20px]">
        <img
          src={image}
          alt={title}
          className="aspect-[1.18] object-contain w-full"
        />
      </div>
      <div className="flex flex-col items-stretch text-lg leading-7 mt-[11px] px-6 max-md:pl-5">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-bold text-[18px] not-italic leading-[20px] [font-family:var(--font-nunito)] hover:text-[#F6CB0E] transition-colors duration-150 cursor-pointer h-[40px]"
        >
          {title}
        </a>
        <div className="text-white font-normal mt-2">{description}</div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm text-${readMoreColor} font-medium text-right uppercase underline z-10 mr-5 max-md:mr-2.5 cursor-pointer`}
        >
          Read More
          <img src={externalLinkIcon.src} alt="external link" className="inline-block w-[14px] h-[14px] ml-2 align-middle" />
        </a>
      </div>
    </div>
  );
};

export default UpdateCard;