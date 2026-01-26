import Link from 'next/link';
import Image from 'next/image';

export type BreadcrumbSegment = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  paths: BreadcrumbSegment[];
};

/**
 * Breadcrumb navigation component
 * Displays the current page location in the site hierarchy.
 * 
 * @example
 * <Breadcrumbs paths={[{ label: "Documentation" }, { label: "Getting Started" }]} />
 * 
 * @param props Component props
 * @returns The rendered breadcrumb navigation element.
 */
export const Breadcrumbs = ({ paths = [] }: BreadcrumbsProps) => (
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
    >
      Home
    </Link>
    {paths.map(({ label, href }, index) => (
      <span key={index} className="flex items-center" data-testid={`breadcrumb-segment-${index}`}>
        <span>
          <Image src="/arrow_right.svg" alt="arrow" className="mx-3 mt-1.5" width={6} height={10} />
        </span>
        {href ? (
          <Link 
            href={href} 
            className="text-[#005EA2] text-[16px] font-normal [font-family:'Public Sans'] underline"
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationSkipInk: 'none',
              textDecorationThickness: 'auto',
              textUnderlineOffset: 'auto',
              textUnderlinePosition: 'from-font',
            }}
            >
              {label}
            </Link>
        ) : (
          <span className="text-[#1B1B1B] text-[16px] font-normal [font-family:'Public Sans']">{label}</span>
        )}
      </span>
    ))}
  </div>
);
