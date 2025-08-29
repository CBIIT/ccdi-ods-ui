import React from "react";
import Image from "next/image";
import externalLinkIcon from "../../../../assets/icons/external_link_icon.svg";

interface UpdateCardProps {
  image: string;
  title: string;
  description: string;
  link: string
}

const UpdateCard: React.FC<UpdateCardProps> = ({
  image,
  title,
  description,
  link,
}) => {
  return (
    <div
      className="h-[496px] bg-[rgba(50,48,50,1)] pb-3.5 rounded-[0px_25px_0px_20px]"
    >
      <div className="h-[310px] rounded-[0px_0px_0px_20px]">
        <Image
          src={image}
          alt={title}
          width={367}
          height={310}
          className="object-contain"
        />
      </div>
      <div className="h-[186px] flex flex-col items-stretch text-lg leading-7 mt-[11px] px-6 max-md:pl-5">
        <div className="h-[50px]">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-bold text-[18px] not-italic leading-[20px] [font-family:var(--font-nunito)] hover:text-[#F6CB0E] cursor-pointer"
        >
          {title}
        </a>
        </div>
        <div className="text-white font-normal text-[18px] [font-family:var(--font-nunito)] mt-2 min-h-[112px]">
          <span>
            {description.length > 123
              ? `${description.slice(0, 123)}...`
              : description}
          </span>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-[5px] text-sm text-[#76E7DD] font-medium text-right uppercase underline z-10 cursor-pointer whitespace-nowrap"
          >
            Read More
            <Image src={externalLinkIcon} alt="external link" className="inline-block w-[14px] h-[14px] ml-2 align-middle" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpdateCard;