import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import matter from 'gray-matter';
import { getGithubBranch } from '@/config/config';
import type { Node } from 'unist';
import type { Element, ElementContent, Root, RootContent } from 'hast';
import externalLinkIcon from '../../../../assets/icons/external_link_icon_info.svg';
import h2AccordionChevron from '../../../../assets/icons/h2_accordion_chevron.svg';
import h2AccordionMinus from '../../../../assets/icons/h2_accordion_minus.svg';

const branch = getGithubBranch();
const PAGES_URL = `https://raw.githubusercontent.com/CBIIT/ccdi-ods-content/refs/heads/${branch}/pages/`;


/**
 * Utility functions for processing markdown content.
 * Includes parsing, highlighting, and extracting metadata.
 * 
 * @module serverUtils
 */

/**
 * List of allowed iframe domains for security.
 * Used to sanitize embedded content.
 */
const ALLOWED_IFRAME_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'www.google.com',
];

const ThemeColor = {
  group1: '#335D85', // color for group 1
  group2: '#7B3D7C', // color for group 2
  group3: '#6656A1', // color for group 3
}

const FontColor = '#345D85';

export interface PostMetadata {
  title?: string;
  author?: string;
  date?: string;
  [key: string]: unknown;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
  children: Heading[];
}

/**
 * Wraps each <table> in a div so overflow-x applies (unreliable on <table> alone)
 * and so layout can use table-layout: fixed via .post-md-table-wrap in globals.css.
 */
function rehypeWrapMarkdownTables() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element, index: number | undefined, parent: Element | undefined) => {
      if (node.tagName !== 'table' || parent == null || index === undefined) return;

      const cls = parent.properties?.className;
      const classes = Array.isArray(cls) ? cls.map(String) : cls ? [String(cls)] : [];
      if (classes.some((c) => c.includes('post-md-table-wrap'))) return;

      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['post-md-table-wrap'],
        },
        children: [node],
      };
      (parent.children as ElementContent[])[index] = wrapper;
    });
  };
}

function sanitizeIframe() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'iframe') {
        const src = node.properties?.src as string | undefined;
        if (!src) {
          (node as unknown as Element).tagName = 'div';
          node.children = [{ type: 'text', value: 'Invalid iframe: missing source' }];
          return;
        }

        try {
          const url = new URL(src);
          const isDomainAllowed = ALLOWED_IFRAME_DOMAINS.some(domain => 
            url.hostname === domain || url.hostname.endsWith(`.${domain}`));

          if (!isDomainAllowed) {
            (node as unknown as Element).tagName = 'div';
            node.children = [{ type: 'text', value: 'Iframe from untrusted domain not allowed' }];
            return;
          }

          node.properties = {
            ...node.properties,
            class: 'w-full aspect-video rounded-lg border-0 my-4',
            loading: 'lazy',
            allowFullscreen: true,
            referrerPolicy: 'no-referrer',
          };
        } catch {
          (node as unknown as Element).tagName = 'div';
          node.children = [{ type: 'text', value: 'Invalid iframe: malformed URL' }];
        }
      }
    });
  };
}

function rehypeCustomTheme() {
  return (tree: Node) => {
    visitParents(tree, 'element', (node: Element, ancestors: Node[]) => {
      if (node.tagName === 'h1') {
        node.properties = node.properties || {};
        node.properties.className = [
          'font-extrabold',
          'text-[45px]',
          'my-[20px] md:my-[20px]',
          'ml-[-20px]',
          'mr-[-20px] md:mr-0',
          'text-[#FFFFFF]',
          '[font-family:Inter]',
          'p-[20px]',
          'py-[15px]',
          'tracking-[0.045px]',
          'leading-[45px]'
        ];
        node.properties.style = `background: ${ThemeColor.group1};`;
      }
      if (node.tagName === 'h2') {
        node.properties = node.properties || {};
        node.properties.className = [
          'text-2xl md:text-3xl',
          'font-semibold',
          'my-4 md:my-5',
          'mt-[35px] md:mt-[35px]',
          'px-[10px] md:px-0',
          'py-[14px] md:py-0',
          '[font-family:Inter]',
          'text-[24px] md:text-[32px]',
          'font-[600]',
          'leading-[24px] md:leading-[35px]',
          'text-white md:text-[#345D85]',
          'bg-[#187C85] md:bg-transparent'
        ];
      }
      if (node.tagName === 'h3') {
        node.properties = node.properties || {};
        node.properties.className = [
          'my-3 md:my-4',
          'scroll-mt-20',
          'text-[22px] md:text-[28px]',
          'font-[400]',
          'leading-[24px] md:leading-[30px]',
          '[font-family:Inter]',
        ];
        node.properties.style = `color: ${FontColor};`;
      }
      if (node.tagName === 'h4') {
        node.properties = node.properties || {};
        node.properties.className = [
          'text-[20px]',
          'font-semibold',
          'leading-[20px]',
          '[font-family:Inter]',
          'my-3',
        ];
        node.properties.style = `color: ${FontColor};`;
      }
      if (node.tagName === 'h5') {
        node.properties = node.properties || {};
        node.properties.className = [
          'text-[19px]',
          'font-normal',
          'leading-[20px]',
          '[font-family:Inter]',
          'my-3',
        ];
        node.properties.style = `color: ${FontColor};`;
      }
      if (node.tagName === 'h6') {
        node.properties = node.properties || {};
        node.properties.className = [
          'text-[16px]',
          'font-extrabold',
          'leading-[22px]',
          '[font-family:Inter]',
          'text-[#194A7A]',
          'uppercase',
          'my-3',
        ];
      }
      if (node.tagName === 'p') {
        node.properties = node.properties || {};
        node.properties.className = [
          '[font-family:Nunito]',
          'text-[18px]',
          'text-[#000000]',
          'leading-[28px]',
          'mb-4',
        ];
      }
      if (node.tagName === 'a') {
        node.properties = node.properties || {};
        node.properties.className = [
          '[font-family:Nunito]',
          'text-[18px]',
          'text-[#1C8278]',
          'font-medium',
          'leading-[28px]',
          'underline',
        ];
        node.properties.style = 'font-weight: 500; text-decoration-style: solid; text-decoration-skip-ink: none; text-decoration-thickness: 1px; text-underline-offset: auto; text-underline-position: from-font;';
        const href = node.properties.href as string | undefined;
        if (href && href.trim().toLowerCase().startsWith('http')) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
          node.children = [
            ...(node.children || []),
            {
              type: 'element',
              tagName: 'img',
              properties: {
                src: externalLinkIcon.src,
                alt: 'External link',
                className: 'external-link-icon inline-block ml-[5px] mb-1 w-[1em] h-[1em] align-text-bottom',
                'aria-hidden': 'true',
              },
              children: [],
            },
          ];
        }
        const isInTd = ancestors.some(
          ancestor => (ancestor as Element).tagName === 'td'
        );
        if (isInTd) {
          // <a> is inside a <td>
          node.properties.className = [
            '[font-family:Nunito]',
            'text-[16px]',
            'text-[#1C8278]',
            'font-medium',
            'leading-[28px]',
            'underline',
          ];
        }
      }
      if (node.tagName === 'img') {
        if (node.properties && node.properties.className?.toString().includes('external-link-icon')) {
          return;
        }
        node.properties = node.properties || {};
        node.properties.className = ['max-w-full', 'h-auto', 'my-4', 'mx-auto', 'shadow-md'];
        node.properties.loading = 'lazy';
      }
      if (node.tagName === 'figure') {
        node.properties = node.properties || {};
        node.properties.className = ['my-6 md:my-8', 'text-center'];
      }
      if (node.tagName === 'figcaption') {
        node.properties = node.properties || {};
        node.properties.className = ['text-sm', 'text-gray-600', 'mt-2', 'italic'];
      }
      if (node.tagName === 'ul') {
        node.properties = node.properties || {};
        node.properties.className = ['list-disc', 'ml-4 md:ml-6', 'my-4', 'space-y-2'];
      }
      if (node.tagName === 'ol') {
        node.properties = node.properties || {};
        node.properties.className = ['list-decimal', 'ml-4 md:ml-6', 'my-4', 'space-y-2'];
      }
      if (node.tagName === 'li') {
        node.properties = node.properties || {};
        node.properties.className = [
          '[font-family:Nunito]',
          'text-[18px]',
          'text-[#000000]',
          'leading-[28px]',
          'mb-4',
        ];
      }
      if (node.tagName === 'blockquote') {
        node.properties = node.properties || {};
        node.properties.className = ['border-l-4', 'border-gray-300', 'pl-4', 'my-4', 'italic', 'text-gray-700'];
      }
      if (node.tagName === 'code') {
        node.properties = node.properties || {};
        node.properties.className = ['bg-gray-100', 'rounded', 'px-1', 'py-0.5', 'font-mono', 'text-sm'];
      }
      if (node.tagName === 'pre') {
        node.properties = node.properties || {};
        node.properties.className = ['bg-gray-100', 'rounded-lg', 'p-4', 'my-4', 'overflow-x-auto', 'text-sm md:text-base'];
      }
      if (node.tagName === 'table') {
        node.properties = node.properties || {};
        node.properties.className = [
          'table',
          'border-collapse',
          'my-4',
        ];
        node.properties.style = `border-top: 2px solid ${FontColor};`;
      }
      if (node.tagName === 'th') {
        node.properties = node.properties || {};
        node.properties.className = [
          'px-4',
          'py-2',
          'align-top',
          'whitespace-normal',
          'break-words',
          '[font-family:Inter]',
          'font-medium',
          'text-[16px]',
          'text-[#767676]',
          'leading-[18px]',
          'uppercase',
          'text-left',
        ];
        node.properties.style = `border-bottom: 2px solid ${FontColor};`;
        // If the header cell has zero children, collapse its height and remove vertical padding
        const hasNoChildren = !node.children || node.children.length === 0;
        if (hasNoChildren) {
          const baseStyle = typeof node.properties.style === 'string' ? node.properties.style : '';
          node.properties.style = `${baseStyle} height: 0; padding-top: 0; padding-bottom: 0; line-height: 0; border-bottom: 0px`;
        }
      }
      if (node.tagName === 'td') {
        node.properties = node.properties || {};
        node.properties.className = [
          'px-4',
          'py-2',
          'align-top',
          'whitespace-normal',
          'break-words',
          '[font-family:Inter]',
          'text-[16px]',
          'text-[#000000]',
          'leading-[17px]'
        ];
        node.properties.style = 'border-bottom: 1px solid #B8B8B8';
      }
    });
  };
}

/**
 * Wraps each h2 with following siblings until the next h2 in a section so mobile can
 * collapse/expand "h2 to next h2" blocks. Desktop uses display:contents so layout is unchanged.
 */
function rehypeWrapH2Sections() {
  return (tree: Node) => {
    const root = tree as Root;
    if (!root.children?.length) return;

    const children = root.children as Element[];
    const newChildren: RootContent[] = [];
    let sectionIndex = 0;

    let i = 0;
    while (i < children.length) {
      const node = children[i];
      if (node.type !== 'element' || node.tagName !== 'h2') {
        newChildren.push(node as RootContent);
        i++;
        continue;
      }

      const h2 = node;
      i++;
      const sectionBody: ElementContent[] = [];
      while (i < children.length) {
        const next = children[i];
        if (next.type === 'element' && (next as Element).tagName === 'h2') break;
        sectionBody.push(next as ElementContent);
        i++;
      }

      h2.properties = h2.properties || {};
      const cls = h2.properties.className;
      const classArr = Array.isArray(cls) ? [...cls] : cls ? [String(cls)] : [];
      h2.properties.className = [
        ...classArr,
        'post-h2-toggle',
        'max-md:flex',
        'max-md:items-center',
        'max-md:justify-between',
        'max-md:gap-2',
        'max-md:cursor-pointer',
        'md:cursor-default',
        'select-none',
      ];

      const existingChildren =
        h2.children && h2.children.length ? [...h2.children] : [];
      const h2Id =
        h2.properties.id != null ? String(h2.properties.id) : `h2-section-${sectionIndex}`;
      if (h2.properties.id == null) {
        h2.properties.id = h2Id;
      }
      const bodyId = `${h2Id}-body`;

      h2.properties['aria-expanded'] = 'false';
      h2.properties['aria-controls'] = bodyId;

      h2.children = [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['min-w-0', 'flex-1'] },
          children: existingChildren as ElementContent[],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: [
              'post-h2-toggle-icons',
              'relative',
              'inline-flex',
              'shrink-0',
              'items-center',
              'justify-center',
              'md:hidden',
              'pointer-events-none',
              'w-[18px]',
              'h-[11px]',
            ],
            'aria-hidden': 'true',
          },
          children: [
            {
              type: 'element',
              tagName: 'img',
              properties: {
                src: h2AccordionMinus.src,
                alt: '',
                className: [
                  'post-h2-icon-minus',
                  'absolute',
                  'left-1/2',
                  'top-1/2',
                  'max-h-none',
                  'w-[18px]',
                  'h-[2.571px]',
                  '-translate-x-1/2',
                  '-translate-y-1/2',
                  'max-md:block',
                  'max-md:group-[.post-h2-section--collapsed]/post-h2:hidden',
                ],
              },
              children: [],
            },
            {
              type: 'element',
              tagName: 'img',
              properties: {
                src: h2AccordionChevron.src,
                alt: '',
                className: [
                  'post-h2-icon-chevron',
                  'absolute',
                  'left-1/2',
                  'top-1/2',
                  'max-h-none',
                  'w-[17px]',
                  'h-[9.273px]',
                  '-translate-x-1/2',
                  '-translate-y-1/2',
                  'max-md:hidden',
                  'max-md:group-[.post-h2-section--collapsed]/post-h2:block',
                ],
              },
              children: [],
            },
          ],
        },
      ];

      const section: Element = {
        type: 'element',
        tagName: 'section',
        properties: {
          className: [
            'group/post-h2',
            'post-h2-section',
            'post-h2-section--collapsed',
            'max-md:block',
            'md:contents',
          ],
          'data-h2-section': '',
        },
        children: [
          h2,
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['post-h2-section-body', 'max-md:px-3', 'max-md:hidden', 'md:contents'],
              id: bodyId,
            },
            children: sectionBody,
          },
        ],
      };

      newChildren.push(section);
      sectionIndex++;
    }

    root.children = newChildren;
  };
}

/**
 * Extracts headings from markdown content.
 * 
 * @param {string} markdown - The markdown content
 * @returns {Heading[]} The extracted headings.
 */
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /<h([23])[^>]*?id="([^"]+)"[^>]*>((?:(?!<\/h[23]>).)*)<\/h[23]>/gs;
  let match;
  let currentH2: Heading | null = null;
  
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    
    if (level === 2) {
      currentH2 = { id, text, level, children: [] };
      headings.push(currentH2);
    } else if (level === 3 && currentH2) {
      currentH2.children.push({ id, text, level, children: [] });
    }
  }
  
  return headings;
}

export async function fetchContent(
  slug: string
): Promise<{ metadata: PostMetadata; content: string } | null> {
  const response = await fetch(
    `${PAGES_URL}/${slug}.md`,
    {
        headers: {
        'Accept': 'application/json',
      }
    }
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to fetch content (${response.status})`);

  const content = await response.text();
  const { data: metadata, content: markdownContent } = matter(content);
  
  return { 
    metadata: metadata as PostMetadata, 
    content: markdownContent 
  };
}

export async function processMarkdown(content: string, slug: string) {
  const theme = slug.split('/')[0] === 'program' ? rehypeCustomTheme : rehypeCustomTheme;
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      footnoteLabel: 'Footnotes',
      footnoteBackLabel: 'Back to content',
    })
    .use(theme)
    .use(rehypeWrapMarkdownTables)
    .use(sanitizeIframe)
    .use(rehypeSlug)
    .use(rehypeWrapH2Sections)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return result.toString();
}
