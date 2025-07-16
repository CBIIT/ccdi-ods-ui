'use client';

import { fetchContent, processMarkdown } from './serverUtils';
import ClientPost from './ClientPost';
import { getGithubBranch } from '@/config/config';

interface GitHubContentItem {
  name: string;
  type: 'file' | 'dir';
  url: string;
}

const PAGES_URL = `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages`;
const branch = getGithubBranch();

interface PageProps {
  params: Promise<{ slug: string[] }>
}

// Required for static site generation with app directory
export async function generateStaticParams() {
  const pagesUrl = `${PAGES_URL}?ts=${new Date().getTime()}&ref=${branch}`;
  try {
    const response = await fetch(
      pagesUrl,
      {
        headers: {
          'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch directory structure');
      return [{ slug: ['Resources', 'resource-list'] }];
    }

    const data = await response.json() as GitHubContentItem[];
    const paths: { slug: string[] }[] = [
      { slug: ['Resources', 'resource-list'] }
    ];

    // Recursively fetch all .md files
    async function fetchMarkdownFiles(items: GitHubContentItem[], currentPath: string[] = []) {
      for (const item of items) {
        if (item.type === 'file' && item.name.endsWith('.md')) {
          paths.push({
            slug: [...currentPath, item.name.replace('.md', '')]
          });
        } else if (item.type === 'dir') {
          const dirResponse = await fetch(
            item.url,
            {
              headers: {
                'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
              }
            }
          );
          if (dirResponse.ok) {
            const dirData = await dirResponse.json();
            await fetchMarkdownFiles(dirData, [...currentPath, item.name]);
          }
        }
      }
    }

    await fetchMarkdownFiles(data);
    return paths;
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [{ slug: ['Resources', 'resource-list'] }];
  }
}

/**
 * Fetches and processes markdown content for a given page.
 * 
 * @param {PageProps} props - Page properties
 * @returns {Promise<JSX.Element>} The rendered page.
 */
export default async function Post({ params }: PageProps) {
  
 const resolvedParams = await params;
  
  const slug = resolvedParams.slug.join('/');
  const [collection, page] = resolvedParams.slug;
  const { metadata, content } = await fetchContent(slug);
  const processedContent = await processMarkdown(content, slug);
  const cleanTitle = metadata?.title?.replace(/^["']|["']$/g, '') || page;

  return (
    <ClientPost 
      collection={collection}
      page={cleanTitle}
      processedContent={processedContent}
    />
  );
}