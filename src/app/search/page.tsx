'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import matter from 'gray-matter';
import { getGithubBranch } from '@/config/config';

const branch = getGithubBranch();

// ==========================
// Interfaces
// ==========================
interface GithubCollection {
  name: string;
  path: string;
  type: string;
  posts?: GithubPost[];
}

interface GithubPost {
  name: string;
  path: string;
  type: string;
  content?: string;
  metadata?: {
    title?: string;
  };
}

interface PostWithCollection extends GithubPost {
  collectionName: string;
}




// ==========================
// SearchPage Component
// ==========================
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [collections, setCollections] = useState<GithubCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/CBIIT/ccdi-ods-content/git/trees/${branch}?recursive=1`,
          {
            headers: { 
              'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json' 
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch repository tree');
        }

        const data = await response.json();
        const pagesFiles = data.tree
          .filter((item: { path: string }) => item.path.startsWith('pages/') && item.path.endsWith('.md'))
          .map((item: { path: string }) => {
            const pathParts = item.path.split('/');
            return {
              name: pathParts[pathParts.length - 1],
              collectionName: pathParts[1],
              path: item.path
            };
          });

        // Group files by collection
        const groupedFiles = pagesFiles.reduce((acc: { [key: string]: GithubCollection }, file: { path: string; name: string; collectionName: string }) => {
          if (!acc[file.collectionName]) {
            acc[file.collectionName] = {
              name: file.collectionName,
              path: `pages/${file.collectionName}`,
              type: 'dir',
              posts: []
            };
          }
          acc[file.collectionName].posts?.push({
            name: file.name,
            path: file.path,
            type: 'file'
          });
          return acc;
        }, {});

        // Fetch content for all files in parallel
        const collectionsWithContent = await Promise.all(
          (Object.values(groupedFiles) as GithubCollection[]).map(async (collection) => ({
            ...collection,
            posts: await Promise.all(
              (collection.posts || []).map(async (post) => {
                const contentResponse = await fetch(
                  `https://raw.githubusercontent.com/CBIIT/ccdi-ods-content/${branch}/${post.path}`,
                  {
                    headers: {
                      'Accept': 'application/json',
                    }
                  }
                );
                const rawContent = await contentResponse.text();
                const { data: metadata, content } = matter(rawContent);
                return {
                  ...post,
                  content,
                  metadata: metadata as { title?: string },
                };
              })
            )
          }))
        );

        setCollections(collectionsWithContent);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Flatten posts and add collection context
  const allPosts: PostWithCollection[] = collections.flatMap(collection =>
    (collection.posts || []).map(post => ({
      ...post,
      collectionName: collection.name
    }))
  );
  console.log(allPosts);
  const fuse = new Fuse(allPosts, {
    keys: ['name', 'content'],
    includeScore: true,
    threshold: 0,
    ignoreLocation: true,
    shouldSort: true,
    findAllMatches: true,
    useExtendedSearch: true
  });

  const searchResults = query ? fuse.search(query) : [];

  // Group results by collection
  const groupedResults = searchResults.reduce((acc, result) => {
    const post = result.item;
    if (!acc[post.collectionName]) {
      acc[post.collectionName] = [];
    }
    acc[post.collectionName].push(post);
    return acc;
  }, {} as Record<string, PostWithCollection[]>);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>

      <form action="/search" method="GET" className="mb-6">
        <input
          type="text"
          name="q"
          placeholder="Search documentation..."
          defaultValue={query}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <h1 className="text-4xl font-bold mb-6">Search Results</h1>
      <p className="mb-6">Showing results for: &quot;{query}&quot;</p>

      {Object.keys(groupedResults).length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid gap-6">
          {Object.entries(groupedResults).map(([collectionName, posts]) => (
            <article key={collectionName} className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                <Link href={`/collection/${collectionName}`} className="hover:text-blue-600">
                  {collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}
                </Link>
              </h2>
              <ul className="space-y-2 ml-4">
                {posts.map((post) => (
                  <li key={post.path}>
                    <Link
                      href={`/post/${collectionName}/${post.name.replace('.md', '')}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {post.metadata?.title || post.name.replace('.md', '').replace(/-/g, ' ')}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-6">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
