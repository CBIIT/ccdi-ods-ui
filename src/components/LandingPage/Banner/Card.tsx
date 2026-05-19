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
    <div className="bg-transparent self-stretch flex min-w-60 max-w-[370px] items-center text-lg text-white font-normal text-center leading-6 p-2 rounded-[20px] lg:flex-1 lg:min-w-0 xl:flex-initial xl:min-w-60">
      <div className="self-stretch flex items-center gap-2.5 overflow-hidden my-auto px-2.5">
        <Image
          src={imageSrc}
          alt=""
          width={96}
          height={96}
          className={`${imageAspect} object-contain ${imageWidth} self-stretch shrink-0 my-auto`}
        />
      </div>
      <div className="text-white text-left [font-family:Nunito] text-[18px] font-normal leading-[24px] self-stretch min-w-60 w-[270px] my-auto px-[7px] py-2 lg:min-w-[235px] lg:w-auto lg:flex-1 xl:min-w-60 xl:w-[270px]">
        {description}
      </div>
    </div>
  );
};

export default Card;