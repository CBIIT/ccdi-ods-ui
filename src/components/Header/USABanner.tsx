import Image from 'next/image';
import { headerData } from '../../config/globalHeaderData';

/**
 * USABanner component
 * Displays the official U.S. government website banner.
 * 
 * @returns {JSX.Element} The rendered banner.
 *
 * Features:
 * - U.S. flag icon
 * - Official website declaration text
 * - Consistent styling with USWDS requirements
 * - Responsive design adjustments
 *
 * Uses headerData from global configuration for asset paths and alt text
 */
const USABanner = () => (
  <aside className="flex-row w-full h-[46px] bg-[#F0F0F0]">
    <div className="flex items-center max-w-[1400px] h-full mx-auto xl:pl-[32px] pl-[16px]">
      <Image className="mr-[14px]" src={headerData.usaFlagSmall} alt={headerData.usaFlagSmallAltText} />
      <div className="font-['Open_Sans'] font-normal text-[12px] leading-[16px] w-fit h-[16px]">
        An official website of the United States government
      </div>
    </div>
  </aside>
);

export default USABanner;
