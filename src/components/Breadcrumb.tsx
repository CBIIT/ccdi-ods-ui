import Link from 'next/link';

/**
 * Interface for Breadcrumb component props
 */
interface BreadcrumbProps {
  /** The name of the collection/category */
  collection: string;
  /** The name of the current page */
  page: string;
}

/**
 * Breadcrumb navigation component
 * Displays the current page location in the site hierarchy.
 * 
 * @param {BreadcrumbProps} props - Component props
 * @returns {JSX.Element} The rendered breadcrumb.
 *
 * @example
 * <Breadcrumb collection="Documentation" page="Getting Started" />
 */
export default function Breadcrumb({ collection, page }: BreadcrumbProps) {
  return (
    <div className="text-sm flex text-gray-600 mb-[49px]">
      <Link 
        href="/" 
        className="text-[#005EA2] text-[16px] font-normal [font-family:'Public Sans'] underline"
        style={{
          textDecorationLine: 'underline',
          textDecorationStyle: 'solid',
          textDecorationSkipInk: 'none',
          textDecorationThickness: 'auto',
          textUnderlineOffset: 'auto',
          textUnderlinePosition: 'from-font',
        }}
      >Home</Link>
      <span><img src="/arrow_right.svg" alt="arrow" className="mx-3 mt-1.5" /></span>
      <span 
        // href={`/collection/${collection}`}
        className="text-[#1B1B1B] text-[16px] font-normal [font-family:'Public Sans']"
      >{collection}</span>
      <span><img src="/arrow_right.svg" alt="arrow" className="mx-3 mt-1.5" /></span>
      <span className="text-[#1B1B1B] text-[16px] font-normal [font-family:'Public Sans']">{page}</span>
    </div>
  );
}
