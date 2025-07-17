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

  useEffect(() => {
    async function fetchPosts() {
      const resolvedParams = await params;
      const slug = resolvedParams.slug.join('/');
      const fetchedPosts = await fetchGithubPosts(slug);
      setPosts(fetchedPosts);
    }

    fetchPosts();
  }, [params]);

  // Render the list of policy documents in a responsive grid layout
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Policy Documents</h1>

      <div className="grid gap-4">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <Link href={`/post/${post.slug}`}>
              <h2 className="text-xl font-semibold hover:text-blue-500">
                {post.title}
              </h2>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Link 
          href="/" 
          className="text-blue-500 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}