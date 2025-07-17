import React from 'react';
import Image from 'next/image';
import { headerData } from '../../../config/globalHeaderData';

const Logo = () => (
  <div className="flex">
    <a id="header-logo-home-link" className="mt-[32px]" href={headerData.globalHeaderLogoLink}>
      <Image className="h-[50px] max-w-[350px]" src={headerData.globalHeaderLogoSmall} alt={headerData.globalHeaderLogoAltText} />
    </a>
  </div>
);

export default Logo;
