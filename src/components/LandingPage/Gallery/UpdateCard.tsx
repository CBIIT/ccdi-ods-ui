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
    <div className="relative rounded-bl-[20px] rounded-tr-[20px] w-full h-[496px] sm:max-w-[367px]">
      <div className="flex flex-col gap-px items-start overflow-hidden relative rounded-[inherit] w-full h-full">
        <div className="aspect-[367/310] max-h-[310px] relative shrink-0 w-full sm:max-w-[367px]">
          <Image
            src={image}
            alt={title}
            width={367}
            height={310}
            className="absolute inset-0 object-cover object-center pointer-events-none w-full h-full"
          />
        </div>
        <div className="bg-[#323032] box-border flex flex-col flex-1 items-start overflow-hidden pb-[15px] pt-[11px] px-[18px] relative shrink-0 w-full">
          <p className="[font-family:Nunito] font-bold leading-[20px] relative shrink-0 text-[16px] sm:text-[17px] md:text-[18px] text-white w-full mb-[5px] min-h-[40px]">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F6CB0E] cursor-pointer"
            >
              {title}
            </a>
          </p>
          <div className="[font-family:Nunito] font-normal leading-[24px] sm:leading-[26px] md:leading-[28px] text-[16px] sm:text-[17px] md:text-[18px] text-white">
            <span>
              {description.length > 135
                ? `${description.slice(0, 135)}...`
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