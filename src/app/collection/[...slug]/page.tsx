'use client';

/**
 * This module handles the collection page that displays a list of policy documents
 * fetched from a GitHub repository.
 */

import Link from 'next/link';
import matter from 'gray-matter';
import { getGithubBranch } from '@/config/config';
import { useState, useEffect } from 'react';

const branch = getGithubBranch();

/**
 * Interface representing the structure of GitHub content API response
 */
interface GithubContent {
  name: string;
  path: string;
  sha: string;
  download_url: string;
}

/**
 * Interface representing a processed post with metadata
 */
interface Post {
  id: string;
  title: string;
  slug: string;
}

/**
 * Interface for the page props
 */
interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * Fetches and extracts metadata from a markdown file
 * @param url - The raw content URL of the markdown file
 * @returns The title from the markdown frontmatter, or undefined if not found
 */
async function fetchPostMetadata(url: string): Promise<string | undefined> {
  const response = await fetch(url);
  if (!response.ok) return undefined;
  
  const content = await response.text();
  const { data } = matter(content);
  return data.title;
}

/**
 * Fetches and processes posts from a specific GitHub directory
 * @param slug - The directory path in the GitHub repository
 * @returns Array of processed posts with metadata
 */
async function fetchGithubPosts(slug: string): Promise<Post[]> {

  const response = await fetch(
    `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages/${slug}?ts=${new Date().getTime()}&ref=${branch}`,
    {
      headers: {
        'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch posts', response.statusText);
    return [];
  }

  const data: GithubContent[] = await response.json();
  // Filter to only include markdown files
  const mdFiles = data.filter(file => file.name.endsWith('.md'));
  
  // Fetch metadata for all files in parallel for better performance
  const posts = await Promise.all(
    mdFiles.map(async (file) => {
      const metadataTitle = file.download_url ? 
        await fetchPostMetadata(file.download_url) : 
        undefined;
      
      return {
        id: file.sha,
        title: metadataTitle || file.name.replace('.md', ''),
        slug: file.path.replace('pages/', '').replace('.md', '')
      };
    })
  );

  return posts;
}

/**
 * Fetches and displays a list of policy documents from GitHub.
 *
 * @returns {JSX.Element} The rendered collection page.
 */
export default function PostsList({ params }: PageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    async function fetchPosts() {
      const resolvedParams = await params;
      const slugArr = resolvedParams.slug;
      const slug = slugArr.join('/');
      setGroupName(slugArr[slugArr.length - 1] || 'Documents');
      const fetchedPosts = await fetchGithubPosts(slug);
      setPosts(fetchedPosts);
    }

    fetchPosts();
  }, [params]);

  let sectionTitle = groupName.charAt(0).toUpperCase() + groupName.slice(1);

  return (
    <>
      <div className="max-w-[1444px] mx-auto p-6">
        <div className="mb-4 ml-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#005EA2] underline"
            style={{ 
              fontFamily: '"Public Sans"', 
              fontSize: '16px', 
              fontWeight: 400, 
              lineHeight: '162%', 
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationSkipInk: 'none',
              textUnderlineOffset: 'auto',
              textUnderlinePosition: 'from-font'
            }}
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.50012 9.5L5.55762 8.4425L2.12262 5L5.55762 1.5575L4.50012 0.5L0.000117695 5L4.50012 9.5Z" fill="#71767A"/>
              </svg>
            </span> Back to Home
          </Link>
        </div>
      </div>
      <main className="max-w-7xl mx-auto p-8 bg-white min-h-screen">
        <h1 className="text-5xl font-bold mb-4 text-[#408B88]" style={{ fontFamily: 'inherit', letterSpacing: '-2px' }}>{sectionTitle}</h1>
        
        {posts.length === 0 ? (
          <p className="text-2xl text-gray-300 mt-16">No documents found.</p>
        ) : (
          <div className="flex flex-col gap-8">
            <section className="border border-[#345D85] rounded-xl p-8 bg-white">
              <ul className="space-y-3 ml-4.5">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-[#1C8278] text-lg hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </>
  );
}