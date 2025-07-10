/* eslint-disable */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import Breadcrumb from '@/components/Breadcrumb';
import matter from 'gray-matter';

// List of allowed iframe domains for security
const ALLOWED_IFRAME_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'www.google.com',
  // Add other trusted domains as needed
];

const PAGES_URL = 'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages';

// Add this function before the Post component
export async function generateStaticParams() {
  const pagesUrl = `${PAGES_URL}?ts=${new Date().getTime()}`;
  // Fetch all markdown files from GitHub at build time
  const response = await fetch(
    pagesUrl,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch directory structure');
  }

  const data = await response.json();
  const paths: { slug: string[] }[] = [];

  // Recursively fetch all .md files
  async function fetchMarkdownFiles(items: any[], currentPath: string[] = []) {
    for (const item of items) {
      if (item.type === 'file' && item.name.endsWith('.md')) {
        // Add path for markdown file (without .md extension)
        paths.push({
          slug: [...currentPath, item.name.replace('.md', '')]
        });
      } else if (item.type === 'dir') {
        // Fetch contents of subdirectory
        const dirResponse = await fetch(item.url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        });
        if (dirResponse.ok) {
          const dirData = await dirResponse.json();
          await fetchMarkdownFiles(dirData, [...currentPath, item.name]);
        }
      }
    }
  }

  await fetchMarkdownFiles(data);
  return paths;
}


function sanitizeIframe() {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'iframe') {
        const src = node.properties?.src;
        if (!src) {
          // Remove iframes without src
          node.tagName = 'div';
          node.children = [{ type: 'text', value: 'Invalid iframe: missing source' }];
          return;
        }

        try {
          const url = new URL(src);
          const isDomainAllowed = ALLOWED_IFRAME_DOMAINS.some(domain => 
            url.hostname === domain || url.hostname.endsWith(`.${domain}`));

          if (!isDomainAllowed) {
            // Replace unsafe iframes with a warning message
            node.tagName = 'div';
            node.children = [{ type: 'text', value: 'Iframe from untrusted domain not allowed' }];
            return;
          }

          // Add default styling and security attributes for safe iframes
          node.properties = {
            ...node.properties,
            class: 'w-full aspect-video rounded-lg border-0 my-4',
            loading: 'lazy',
            allowFullscreen: true,
            referrerPolicy: 'no-referrer',
          };
        } catch (e) {
          // Replace iframes with invalid URLs
          node.tagName = 'div';
          node.children = [{ type: 'text', value: 'Invalid iframe: malformed URL' }];
        }
      }
    });
  };
}

function rehypeCustomTheme() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1') {
        node.properties = node.properties || {};
        node.properties.className = ['text-4xl', 'font-bold', 'my-6', 'text-[#49B5B1]'];
      }
      if (node.tagName === 'p') {
        node.properties = node.properties || {};
        node.properties.className = ['text-base', 'leading-7', 'mb-4'];
      }
      if (node.tagName === 'a') {
        node.properties = node.properties || {};
        node.properties.className = ['text-blue-500', 'hover:underline'];
      }
      if (node.tagName === 'img') {
        node.properties = node.properties || {};
        node.properties.className = ['max-w-full', 'h-auto', 'rounded-lg', 'my-4', 'mx-auto', 'shadow-md'];
        // Add loading lazy for better performance
        node.properties.loading = 'lazy';
      }
      // Handle figure and figcaption for image containers
      if (node.tagName === 'figure') {
        node.properties = node.properties || {};
        node.properties.className = ['my-8', 'text-center'];
      }
      if (node.tagName === 'figcaption') {
        node.properties = node.properties || {};
        node.properties.className = ['text-sm', 'text-gray-600', 'mt-2', 'italic'];
      }

      // Basic text elements
      if (node.tagName === 'h2') {
        node.properties = node.properties || {};
        node.properties.className = ['text-3xl', 'font-semibold', 'my-5', 'text-gray-800'];
      }
      if (node.tagName === 'h3') {
        node.properties = node.properties || {};
        node.properties.className = ['text-2xl', 'font-semibold', 'my-4', 'text-gray-700'];
      }
      if (node.tagName === 'h4') {
        node.properties = node.properties || {};
        node.properties.className = ['text-xl', 'font-semibold', 'my-3', 'text-gray-700'];
      }

      // Lists
      if (node.tagName === 'ul') {
        node.properties = node.properties || {};
        node.properties.className = ['list-disc', 'ml-6', 'my-4', 'space-y-2'];
      }
      if (node.tagName === 'ol') {
        node.properties = node.properties || {};
        node.properties.className = ['list-decimal', 'ml-6', 'my-4', 'space-y-2'];
      }
      if (node.tagName === 'li') {
        node.properties = node.properties || {};
        node.properties.className = ['text-base', 'leading-7'];
      }

      // Inline elements
      if (node.tagName === 'strong' || node.tagName === 'b') {
        node.properties = node.properties || {};
        node.properties.className = ['font-semibold'];
      }
      if (node.tagName === 'em' || node.tagName === 'i') {
        node.properties = node.properties || {};
        node.properties.className = ['italic'];
      }

      // Block elements
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
        node.properties.className = ['bg-gray-100', 'rounded-lg', 'p-4', 'my-4', 'overflow-x-auto'];
      }

      // Tables
      if (node.tagName === 'table') {
        node.properties = node.properties || {};
        node.properties.className = ['min-w-full', 'border-collapse', 'my-4'];
      }
      if (node.tagName === 'th') {
        node.properties = node.properties || {};
        node.properties.className = ['border', 'border-gray-300', 'px-4', 'py-2', 'bg-gray-50', 'font-semibold'];
      }
      if (node.tagName === 'td') {
        node.properties = node.properties || {};
        node.properties.className = ['border', 'border-gray-300', 'px-4', 'py-2'];
      }
    });
  };
}



function rehypeCustomTheme2() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1') {
        node.properties = node.properties || {};
        node.properties.className = ['text-4xl', 'font-bold', 'my-6', 'text-[#49B5B1]'];
      }
      if (node.tagName === 'p') {
        node.properties = node.properties || {};
        node.properties.className = ['text-base', 'leading-7', 'mb-4'];
      }
      if (node.tagName === 'a') {
        node.properties = node.properties || {};
        node.properties.className = ['text-blue-500', 'hover:underline'];
      }
      if (node.tagName === 'img') {
        node.properties = node.properties || {};
        node.properties.className = ['max-w-full', 'h-auto', 'rounded-lg', 'my-4', 'mx-auto', 'shadow-md'];
        // Add loading lazy for better performance
        node.properties.loading = 'lazy';
      }
      // Handle figure and figcaption for image containers
      if (node.tagName === 'figure') {
        node.properties = node.properties || {};
        node.properties.className = ['my-8', 'text-center'];
      }
      if (node.tagName === 'figcaption') {
        node.properties = node.properties || {};
        node.properties.className = ['text-sm', 'text-gray-600', 'mt-2', 'italic'];
      }

      // Basic text elements
      if (node.tagName === 'h2') {
        node.properties = node.properties || {};
        node.properties.className = ['text-3xl', 'font-semibold', 'my-5', 'text-gray-800'];
      }
      if (node.tagName === 'h3') {
        node.properties = node.properties || {};
        node.properties.className = ['text-2xl', 'font-semibold', 'my-4', 'text-gray-700'];
      }
      if (node.tagName === 'h4') {
        node.properties = node.properties || {};
        node.properties.className = ['text-xl', 'font-semibold', 'my-3', 'text-gray-700'];
      }


      // Lists
      if (node.tagName === 'ul') {
        node.properties = node.properties || {};
        node.properties.className = ['list-disc', 'ml-6', 'my-4', 'space-y-2'];
      }
      if (node.tagName === 'ol') {
        node.properties = node.properties || {};
        node.properties.className = ['list-decimal', 'ml-6', 'my-4', 'space-y-2'];
      }
      if (node.tagName === 'li') {
        node.properties = node.properties || {};
        node.properties.className = ['text-base', 'leading-7'];
      }

      // Inline elements
      if (node.tagName === 'strong' || node.tagName === 'b') {
        node.properties = node.properties || {};
        node.properties.className = ['font-semibold'];
      }
      if (node.tagName === 'em' || node.tagName === 'i') {
        node.properties = node.properties || {};
        node.properties.className = ['italic'];
      }

      // Block elements
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
        node.properties.className = ['bg-gray-100', 'rounded-lg', 'p-4', 'my-4', 'overflow-x-auto'];
      }

      // Tables
      if (node.tagName === 'table') {
        node.properties = node.properties || {};
        node.properties.className = ['min-w-full', 'border-collapse', 'my-4'];
      }
      if (node.tagName === 'th') {
        node.properties = node.properties || {};
        node.properties.className = ['border', 'border-gray-300', 'px-4', 'py-2', 'bg-gray-50', 'font-semibold'];
      }
      if (node.tagName === 'td') {
        node.properties = node.properties || {};
        node.properties.className = ['border', 'border-gray-300', 'px-4', 'py-2'];
      }
    });
  };
}
function transformImageUrls() {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = node.properties.src;
      }
    });
  };
}

// Add interface for metadata structure
interface PostMetadata {
  title?: string;
  author?: string;
  date?: string;
  [key: string]: any; // Allow for additional metadata fields
}

// Update fetchContent to include typed metadata
async function fetchContent(slug: string): Promise<{ metadata: PostMetadata; content: string }> {

  const response = await fetch(
    `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages/${slug}.md`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
      },
      next: { revalidate: 3600 }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch content');
  }
  const content = await response.text();


  const { data: metadata, content: markdownContent } = matter(content);
  

  return { 
    metadata: metadata as PostMetadata, 
    content: markdownContent 
  };

}

async function processMarkdown(content: string, slug: string) {
  const theme = slug.split('/')[0] === 'program' ? rehypeCustomTheme : rehypeCustomTheme2;
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true, // Allow HTML in markdown
      footnoteLabel: 'Footnotes',
      footnoteBackLabel: 'Back to content',
    })
    .use(theme)
    .use(sanitizeIframe)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true }) // Preserve HTML in output
    .process(content);

  return result.toString();
}

interface Heading {
  id: string;
  text: string;
  level: number;
  children: Heading[];
}

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  // Updated regex to handle potential attributes and content with HTML tags
  const regex = /<h([23])[^>]*?id="([^"]+)"[^>]*>((?:(?!<\/h[23]>).)*)<\/h[23]>/gs;
  let match;
  let currentH2: Heading | null = null;
  
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    // Remove any HTML tags from the heading text
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


// Remove the PageParams interface

// Update the component signature
export default async function Post({
  params,
}: {
  params: any;
  searchParams?: any;
}) {

  const slug = params.slug.join('/');
  const [collection, page] = params.slug;
  const { metadata, content } = await fetchContent(slug);
  const processedContent = await processMarkdown(content, slug);
  const headings = extractHeadings(processedContent);
  
  // Clean up the title by removing quotes if present
  const cleanTitle = metadata?.title?.replace(/^["']|["']$/g, '') || page;

  return (
    <div className="flex flex-col items-stretch px-20 pb-14 pt-3 max-md:px-5 max-w-[1444px] mx-auto min-h-screen">
      {/* Pass the cleaned title to Breadcrumb */}
      <Breadcrumb collection={collection} page={cleanTitle} />
      {/* Rest of your component */}
      <div className="flex flex-row gap-8 relative">
        {/* Side Navigation */}
        <nav className="mt-10 w-64 flex-shrink-0 sticky top-10 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="border-l-[2.25px] border-[#49B5B1] p-4">
            <ul className="space-y-3 pl-4">
              {headings.map((h2) => (
                <li key={h2.id}>
                  <a
                    href={`#${h2.id}`}
                    className="text-gray-600 hover:text-blue-600 text-sm block transition-colors font-medium"
                  >
                    {h2.text}
                  </a>
                  {h2.children.length > 0 && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {h2.children.map((h3) => (
                        <li key={h3.id}>
                          <a
                            href={`#${h3.id}`}
                            className="text-gray-500 hover:text-blue-500 text-xs block transition-colors"
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
        {/* Main Content */}
        <main className="flex-1 max-w-4xl p-6">
          <div 
            className="prose lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </main>
      </div>
    </div>
  );
}