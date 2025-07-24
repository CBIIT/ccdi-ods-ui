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

  // Friendly section title mapping (like Search Results)
  let sectionTitle = groupName;
  if (sectionTitle.toLowerCase().includes('example')) sectionTitle = 'Examples';
  else if (sectionTitle.toLowerCase().includes('about')) sectionTitle = 'About';
  else if (sectionTitle.toLowerCase().includes('guidance')) sectionTitle = 'Guidance';
  else if (sectionTitle.toLowerCase().includes('news')) sectionTitle = 'News';
  else sectionTitle = sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1);

  return (
    <>
      <div className="mb-8 ml-24 mt-11">
        <Link
          href="/"
          className="inline-block text-[#3377FF] text-xl font-medium transition-all underline"
          style={{ color: '#005EA2' }}
        >
          ← Back to Home
        </Link>
      </div>
      <main className="max-w-5xl mx-auto p-8 bg-white min-h-screen">
        <section className="border-2 border-[#345D85] rounded-2xl p-8 bg-white">
          <h1 className="text-5xl font-bold mb-4 text-[#408B88]" style={{ fontFamily: 'inherit', letterSpacing: '-2px' }}>
            {sectionTitle}
          </h1>
          <div className="flex flex-col gap-6">
            {posts.length === 0 ? (
              <p className="text-2xl text-gray-300 mt-16">No documents found.</p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="border border-[#345D85] rounded-xl p-6 bg-white text-xl font-semibold text-[#1C8278] hover:underline hover:shadow transition-all"
                >
                  {post.title}
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}