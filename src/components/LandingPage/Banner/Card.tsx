import React from "react";
import Image from "next/image";

interface CardProps {
  imageSrc: string;
  description: string;
  imageWidth?: string;
  imageAspect?: string;
}

export const Card: React.FC<CardProps> = ({
  imageSrc,
  description,
  imageWidth = "w-24",
  imageAspect = "aspect-[1]",
}) => {
  return (
    <div className="bg-transparent border border-[#30D7C6] self-stretch flex min-w-60 max-w-[370px] items-center text-lg text-white font-normal text-center leading-6 p-2.5 rounded-[20px] ">
      <div className="self-stretch flex items-center gap-2.5 overflow-hidden my-auto px-2.5">
        <Image
          src={imageSrc}
          alt=""
          width={96}
          height={96}
          className={`${imageAspect} object-contain ${imageWidth} self-stretch shrink-0 my-auto`}
        />
      </div>
      <div className="text-white [font-family:Nunito] text-[18px] font-normal leading-[24px] self-stretch min-w-60 w-[285px] my-auto px-[7px] py-2">
        {description}
      </div>
    </div>
  );
};

export default Card;