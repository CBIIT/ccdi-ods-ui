'use client';

/**
 * ClientPost component
 * Handles rendering of a post page with responsive design and dynamic content.
 * 
 * @param {ClientPostProps} props - Component props
 * @param {string} props.collection - The collection name
 * @param {string} props.page - The page name
 * @param {string} props.processedContent - The processed markdown content
 * 
 * @returns {JSX.Element} The rendered post page.
 */

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { extractHeadings } from './serverUtils';

interface ClientPostProps {
  collection: string;
  page: string;
  processedContent: string;
}

const ThemeColor = {
  group1: '#4385C5', // color for group 1
  group2: '#AB53AC', // color for group 2
  group3: '#755AD8', // color for group 2
}

function extractH1Info(html: string) {
  if (typeof window === 'undefined') return null;
  const doc = new window.DOMParser().parseFromString(html, 'text/html');
  const h1 = doc.querySelector('h1');
  if (!h1) return null;
  return {
    text: h1.textContent || '',
    id: h1.getAttribute('id') || '',
  };
}

export default function ClientPost({ collection, page, processedContent }: ClientPostProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [h1Info, setH1Info] = useState<{ text: string; id: string } | null>(null);
  const headings = extractHeadings(processedContent);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close mobile menu when clicking anchor links
  useEffect(() => {
    const handleHashChange = () => {
      if (isMobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isMobile, isMobileMenuOpen]);

  useEffect(() => {
    setH1Info(extractH1Info(processedContent));
  }, [processedContent]);

  return (
    <div className="flex flex-col items-stretch px-4 md:px-8 lg:px-20 pb-14 pt-3 max-w-[1444px] mx-auto min-h-screen">
      <Breadcrumb collection={collection} page={page} />
      
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed bottom-4 right-4 z-50 bg-[#49B5B1] text-white p-3 rounded-full shadow-lg hover:bg-[#3a8f8c] focus:outline-none focus:ring-2 focus:ring-[#49B5B1] focus:ring-offset-2"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      )}

      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Side Navigation */}
        <nav 
          className={`
            ${isMobile ? 
              `fixed inset-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
               transition-transform duration-300 ease-in-out bg-white shadow-lg w-3/4 h-full overflow-y-auto` 
              : 'mt-10 w-64 flex-shrink-0 sticky top-10 max-h-[calc(100vh-8rem)] overflow-y-auto'}
          `}
          aria-label="Table of contents"
        >
          <div className="border-l-[2.25px] p-4 pt-0" style={{ borderLeftColor: ThemeColor.group1 }}>
            {isMobile && (
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-lg font-semibold text-gray-800">Contents</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <ul className="space-y-3 pl-4" role="list">
              <li>
                <a
                  href={h1Info ? `#${h1Info.id}` : "#"}
                  className="text-[#6C777A] [font-family:Inter] font-semibold pt-0 block transition-colors font-normal py-1 rounded text-[18px] hover:text-[#257E7A] hover:font-semibold"
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                >
                  {h1Info ? h1Info.text : ""}
                </a>
              </li>
              {headings.map((h2) => (
                <li key={h2.id}>
                  <a
                    href={`#${h2.id}`}
                    className="text-[#464A4C] [font-family:Inter] text-sm block transition-colors font-normal py-1 rounded text-[16px] hover:text-[#257E7A] hover:font-semibold"
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  >
                    {h2.text}
                  </a>
                  {h2.children.length > 0 && (
                    <ul className="ml-4 mt-2 space-y-2" role="list">
                      {h2.children.map((h3) => (
                        <li key={h3.id}>
                          <a
                            href={`#${h3.id}`}
                            className="text-[#464A4C] [font-family:Inter] font-normal text-xs block transition-colors py-1 rounded text-[14px] hover:text-[#257E7A] hover:font-semibold"
                            onClick={() => isMobile && setIsMobileMenuOpen(false)}
                          >
                            {h3.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Overlay for mobile menu */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full max-w-4xl p-2 md:p-6">
          <div 
            className="prose prose-sm md:prose lg:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </main>
      </div>
    </div>
  );
}
