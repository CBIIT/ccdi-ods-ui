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
    <div className="relative rounded-bl-[20px] rounded-tr-[20px] w-full h-full">
      <div className="flex flex-col gap-px items-start overflow-hidden relative rounded-[inherit] w-full h-full">
        <div className="h-[310px] relative shrink-0 w-[367px]">
          <Image
            src={image}
            alt={title}
            width={367}
            height={310}
            className="absolute inset-0 max-w-none object-cover object-center pointer-events-none w-full h-full"
          />
        </div>
        <div className="bg-[#323032] box-border flex flex-col h-[186px] items-start justify-between overflow-hidden pb-[15px] pt-[11px] px-[18px] relative shrink-0 w-[367px]">
          <p className="[font-family:Nunito] font-bold leading-[20px] min-w-full relative shrink-0 text-[18px] text-white w-[min-content] mb-[5px]">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F6CB0E] cursor-pointer"
            >
              {title}
            </a>
          </p>
          <div className="[font-family:Nunito] font-normal leading-[28px] text-[18px] text-white">
            <span>
              {description.length > 138
                ? `${description.slice(0, 138)}...`
                : description}
            </span>
            <span className="gap-[8px] items-center ml-1 inline-flex">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid [font-family:Nunito] font-medium leading-[28px] text-[#76e7dd] text-[14px] underline uppercase cursor-pointer whitespace-nowrap"
              >
                Read More
              </a>
              <div className="h-[11.915px] relative shrink-0 w-[11.295px]">
                <Image src={externalLinkIcon} alt="external link" className="block max-w-none w-full h-full" width={12} height={12} />
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCard;