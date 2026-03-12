import React from "react";
import Image from "next/image";

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
    <div className="group relative rounded-bl-[20px] rounded-tr-[20px] w-full h-[278px] max-w-[215px] md:h-[278px] md:max-w-[215px] lg:h-[476px] lg:w-[367px] lg:max-w-[367px] lg:shrink-0">
      <div className="flex flex-col gap-0 items-start overflow-hidden relative rounded-[inherit] w-full h-full">
        <div className="h-[181px] md:h-[181px] lg:h-[310px] relative shrink-0 w-full rounded-tr-[20px] overflow-hidden lg:w-full">
          <Image
            src={image}
            alt={title}
            width={367}
            height={310}
            className="absolute inset-0 object-cover object-center pointer-events-none w-full h-full rounded-tr-[20px]"
          />
        </div>
        <div className="bg-[#044249] box-border flex flex-col flex-1 items-start overflow-hidden pb-[14px] pt-[8px] px-[14px] relative shrink-0 w-full md:pb-[14px] md:pt-[8px] md:px-[14px] lg:px-6 lg:pt-[14px] lg:pb-5">
          <p className="font-poppins font-semibold leading-[16px] text-[14px] uppercase tracking-[-0.105px] md:tracking-[0.28px] text-[#72f9fb] text-white w-full lg:mb-2 lg:min-h-0">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins text-[14px] font-semibold not-italic leading-[16px] text-[#72F9FB] hover:text-[#F6CB0E] cursor-pointer md:hover:text-[#72f9fb] lg:hover:text-[#72f9fb]"
            >
              {title}
            </a>
          </p>
          <div className="hidden lg:block">
            <p className="[font-family:Inter] font-normal text-white w-[326px] text-[16px] leading-[22px] mb-2">
              {description.length > 100
                ? `${description.slice(0, 100)}...`
                : description}
            </p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter font-normal not-italic text-[14px] leading-[22px] text-[#aff1ff] underline cursor-pointer hover:text-[#5ef2ff] inline-block mt-auto text-right w-full"
            >
              Read More &gt;
            </a>
          </div>
        </div>
        {/* Tablet/mobile only: hover overlay per Figma 2174-9260 — dark overlay, centered text, teal Read More */}
        <div
          className="absolute inset-0 rounded-[inherit] bg-black/70 flex flex-col justify-center p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-[1] lg:hidden"
          aria-hidden
        >
          <p className="font-inter font-normal text-white text-[14px] leading-[20px] line-clamp-5 mb-3 text-left">
            {description.length > 100
              ? `${description.slice(0, 100)}...`
              : description}
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter font-normal text-[14px] leading-[22px] text-[#4BBFC6] underline decoration-[#4BBFC6] hover:text-[#72f9fb] hover:decoration-[#72f9fb] cursor-pointer w-fit text-left"
          >
            Read More &gt;
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpdateCard;