'use client';
import React from 'react';
import Image from 'next/image';
import { headerData } from '../../../config/globalHeaderData';

const Logo = () => (
  <div className="flex">
    <a id="header-logo-home-link" className="mt-[35px]" href={headerData.globalHeaderLogoLink}>
      <Image className="h-[56px] w-fit" src={headerData.globalHeaderLogo} alt={headerData.globalHeaderLogoAltText} />
    </a>
  </div>
);

export default Logo;
