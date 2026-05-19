'use client';

import { useState, useEffect, useRef, JSX } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { extractHeadings } from './serverUtils';

interface ClientPostProps {
  collection: string;
  page: string;
  processedContent: string;
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

/**
 * ClientPost component
 * Handles rendering of a post page with responsive design and dynamic content.
 * 
 * @param {ClientPostProps} props - Component props
 * @param {string} props.collection - The collection name
 * @param {string} props.page - The page name
 * @param {string} props.processedContent - The processed markdown content as HTML
 * @returns The rendered post page.
 */
export default function ClientPost({ collection, page, processedContent }: ClientPostProps): JSX.Element {
  const [isMobile, setIsMobile] = useState(false);
  const [h1Info, setH1Info] = useState<{ text: string; id: string } | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const headings = extractHeadings(processedContent);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    setH1Info(extractH1Info(processedContent));
  }, [processedContent]);

  useEffect(() => {
    const container = articleRef.current;
    if (!container || !isMobile) return;

    const sections = container.querySelectorAll<HTMLElement>('[data-h2-section]');
    const cleanups: (() => void)[] = [];

    sections.forEach((section) => {
      const h2Toggle = section.querySelector<HTMLElement>('h2.post-h2-toggle');
      const body = section.querySelector<HTMLElement>('.post-h2-section-body');
      if (!h2Toggle || !body) return;

      const toggle = () => {
        const isHidden = body.classList.toggle('max-md:hidden');
        h2Toggle.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
        section.classList.toggle('post-h2-section--collapsed', isHidden);
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      };

      h2Toggle.setAttribute('tabindex', '0');
      h2Toggle.addEventListener('click', toggle);
      h2Toggle.addEventListener('keydown', onKeyDown);

      cleanups.push(() => {
        h2Toggle.removeEventListener('click', toggle);
        h2Toggle.removeEventListener('keydown', onKeyDown);
        h2Toggle.removeAttribute('tabindex');
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [isMobile, processedContent]);

  return (
    <div className="mx-auto max-w-[1400px] flex flex-col items-stretch px-4 xl:pl-[33px] xl:pr-8 pb-14 pt-3 min-h-screen">
      <Breadcrumb collection={collection} page={page} />

      <div className="flex flex-col md:flex-row gap-5 lg:gap-8 relative">
        {/* Side navigation: tablet/desktop only (no mobile TOC drawer or FAB) */}
        {headings.length > 0 && (
          <nav
            className="hidden md:block mt-10 mr-[20px] w-[250px] lg:w-[337px] flex-shrink-0 sticky top-10 max-h-[calc(100vh-8rem)] overflow-y-auto"
            aria-label="Table of contents"
          >
            <div className="pt-0">
              <ul className="space-y-3" role="list">
                <li className="mb-[10px]">
                  <a
                    href={h1Info ? `#${h1Info.id}` : '#'}
                    className="text-[#000000] tracking-[0.36px] leading-[20px] border-b-[1.5px] border-[#E3E3E3] [font-family:Poppins] font-semibold pt-0 block transition-colors font-normal py-[16px] text-[18px] hover:text-[#257E7A] hover:font-semibold"
                  >
                    {h1Info ? h1Info.text : ''}
                  </a>
                </li>
                {headings.map((h2) => (
                  <li className="mb-[10px]" key={h2.id}>
                    <a
                      href={`#${h2.id}`}
                      className="text-[#000000] pl-[20px] tracking-[0.16px] leading-[19px] border-b-[1.5px] border-[#E3E3E3] [font-family:Inter] text-sm block transition-colors font-normal pb-[10px] text-[16px] hover:text-[#257E7A] hover:font-semibold"
                    >
                      {h2.text}
                    </a>
                    {h2.children.length > 0 && (
                      <ul className="mt-2 space-y-2" role="list">
                        {h2.children.map((h3) => (
                          <li
                            className="pl-[40px] border-b-[1.5px] border-[#E3E3E3]"
                            key={h3.id}
                          >
                            <a
                              href={`#${h3.id}`}
                              className="text-[#000000] tracking-[0.14px] leading-[16px] [font-family:Inter] font-normal block transition-colors pb-[10px] text-[14px] hover:text-[#257E7A] hover:font-semibold"
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
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full max-w-[977px] p-0 lg:p-6">
          <div 
            ref={articleRef}
            className="prose prose-sm md:prose lg:prose-xl max-w-none min-w-0"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </main>
      </div>
    </div>
  );
}
