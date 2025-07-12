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
    <div className="text-sm text-gray-600 mb-4">
      <Link href="/" className="hover:text-blue-500">Home</Link>
      <span className="mx-2">/</span>
      {collection}
      <span className="mx-2">/</span>
      <span className="text-gray-900">{page}</span>
    </div>
  );
}
