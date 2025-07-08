import React from "react";
import externalLinkIcon from "../../../../assets/icons/external_link_icon.svg";

interface UpdateCardProps {
  image: string;
  title: string;
  description: string;
  link: string
  readMoreColor?: string;
}

const UpdateCard: React.FC<UpdateCardProps> = ({
  image,
  title,
  description,
  link,
  readMoreColor,
}) => {
  return (
    <div
      className={`bg-[rgba(50,48,50,1)] pb-3.5 rounded-[0px_25px_0px_20px]`}
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
        <div className="text-white font-normal text-[18px] [font-family:var(--font-nunito)] mt-2 h-[112px]">
          <span>
            {description.length > 163
            ? `${description.slice(0, 163)}...`
            : description}
          </span>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-[15px] text-sm text-${readMoreColor} font-medium text-right uppercase underline z-10 mr-5 max-md:mr-2.5 cursor-pointer`}
          >
            Read More
            <img src={externalLinkIcon.src} alt="external link" className="inline-block w-[14px] h-[14px] ml-2 align-middle" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpdateCard;