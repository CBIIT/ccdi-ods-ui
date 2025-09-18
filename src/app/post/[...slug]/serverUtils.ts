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
import type { Element } from 'hast';

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
  group1: '#345D85', // color for group 1
  group2: '#7B3D7C', // color for group 2
  group3: '#6656A1', // color for group 3
}

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
          'text-3xl md:text-4xl',
          'font-bold',
          'my-[15px] md:my-[15px]',
          'ml-[-20px]',
          'text-[#FFFFFF]',
          '[font-family:Inter]',
          'p-[20px]'
        ];
        node.properties.style = `background: ${ThemeColor.group1};`;
      }
      if (node.tagName === 'h2') {
        node.properties = node.properties || {};
        node.properties.className = [
          'text-2xl md:text-3xl',
          'font-semibold',
          'my-4 md:my-5',
          '[font-family:Inter]',
          'text-[32px]',
          'font-[600]'
        ];
        node.properties.style = `color: ${ThemeColor.group1};`;
      }
      if (node.tagName === 'h3') {
        node.properties = node.properties || {};
        node.properties.className = [
          'my-3 md:my-4',
          'scroll-mt-20',
          'text-[20px]',
          'font-[400]',
          'leading-[20px]',
          '[font-family:Poppins]',
        ];
        node.properties.style = `color: ${ThemeColor.group1};`;
      }
      if (node.tagName === 'h4') {
        node.properties = node.properties || {};
        node.properties.className = ['text-[16px]', 'font-semibold', 'my-2 md:my-3', 'text-[#000000]'];
      }
      if (node.tagName === 'h5') {
        node.properties = node.properties || {};
        node.properties.className = ['text-[14px]', 'font-semibold', 'my-2 md:my-3', 'text-[#000000]'];
      }
      if (node.tagName === 'h6') {
        node.properties = node.properties || {};
        node.properties.className = ['text-[12px]', 'font-semibold', 'my-2 md:my-3', 'text-[#000000]'];
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
          'min-w-full',
          'border-collapse',
          'my-4',
          'block',
          'md:table',
          'overflow-x-auto',
        ];
        node.properties.style = `border-top: 2px solid ${ThemeColor.group1};`;
      }
      if (node.tagName === 'th') {
        node.properties = node.properties || {};
        node.properties.className = [
          'px-4',
          'py-2',
          '[font-family:Inter]',
          'text-[16px]',
          'text-[#767676]',
          'uppercase',
          'text-left',
        ];
        node.properties.style = `border-bottom: 2px solid ${ThemeColor.group1};`;
      }
      if (node.tagName === 'td') {
        node.properties = node.properties || {};
        node.properties.className = [
          'px-4',
          'py-2',
          'whitespace-normal',
          '[font-family:Inter]',
          'text-[16px]',
          'text-[#000000]',
          'leading-[16px]'
        ];
        node.properties.style = 'border-bottom: 1px solid #B8B8B8';
      }
    });
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

export async function fetchContent(slug: string): Promise<{ metadata: PostMetadata; content: string }> {
  const response = await fetch(
    `${PAGES_URL}/${slug}.md`,
    {
        headers: {
        'Accept': 'application/json',
      }
    }
  );

  if (!response.ok) {
    console.log('Failed to fetch content');
    return { metadata: {}, content: '' };
  }
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
    .use(sanitizeIframe)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return result.toString();
}
