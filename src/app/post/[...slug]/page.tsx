import { fetchContent, processMarkdown } from './serverUtils';
import ClientPost from './ClientPost';
import { getGithubBranch } from '@/config/config';

const PAGES_URL = `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages`;
const branch = getGithubBranch();

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

    const data = await response.json();
    const paths: { slug: string[] }[] = [
      { slug: ['Resources', 'resource-list'] }
    ];

    // Recursively fetch all .md files
    async function fetchMarkdownFiles(items: any[], currentPath: string[] = []) {
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

export default async function Post({
  params,
}: {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const slug = params.slug.join('/');
  const [collection, page] = params.slug;
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