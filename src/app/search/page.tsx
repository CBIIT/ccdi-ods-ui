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
// Fetch Helpers
// ==========================

// Fetch top-level collections (directories under pages/)
async function fetchCollections() {
  const response = await fetch(
    `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages?ts=${new Date().getTime()}&ref=${branch}`,
    {
      headers: {
        'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch collections', response.statusText);
    return [];
  }

  const data: GithubCollection[] = await response.json();
  return data.filter(item => item.type === 'dir');
}

// Fetch posts under a collection
async function fetchPosts(collectionPath: string): Promise<GithubPost[]> {
  const response = await fetch(
    `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages/${collectionPath}?ref=${branch}`,
    {
      headers: {
        'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
    }
  );

  if (!response.ok) {
    console.error(`Failed to fetch posts for ${collectionPath}`, response.statusText);
    return [];
  }

  const items: GithubPost[] = await response.json();

  // For each item inside the collection
  const posts: GithubPost[] = [];
  for (const item of items) {
    if (item.type === 'file' && item.name.endsWith('.md')) {
      const postResonse = await fetch(
        `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/${item.path}?ts=${new Date().getTime()}&ref=${branch}`,
        {
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3.raw',
          },
          next: { revalidate: 3600 }
        }
      );
      if (postResonse.ok) {
        const rawContent = await postResonse.text();
        const { data: metadata, content } = matter(rawContent);
        const post: GithubPost = {
          ...item,
          content,
          metadata: metadata as { title?: string },
        };
        posts.push(post);
      }
    }
  }
  return posts;
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
        const fetchedCollections = await fetchCollections();
        const collectionsWithPosts = await Promise.all(
          fetchedCollections.map(async (collection) => ({
            ...collection,
            posts: await fetchPosts(collection.name),
          }))
        );
        setCollections(collectionsWithPosts);
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
    threshold: 0.2,
    ignoreLocation: true,
    shouldSort: true,
    findAllMatches: true,
    useExtendedSearch: true,
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
    <>
      <div className="mb-8 ml-24 mt-11">
        ←&nbsp;
        <Link href="/" className="inline-block text-[#3377FF] text-xl font-medium transition-all underline" style={{ color: '#005EA2' }}>
          Back to Home
        </Link>
      </div>
      <main className="max-w-5xl mx-auto p-8 bg-white min-h-screen">
        <form action="/search" method="GET" className="mb-12 flex justify-center">
          <div className="flex w-full max-w-4xl border-2 border-[#345D85] rounded-2xl overflow-hidden">
            <input
              type="text"
              name="q"
              placeholder="Search..."
              defaultValue={query}
              className="flex-1 px-6 py-4 text-2xl text-gray-700 bg-white focus:outline-none placeholder-gray-400"
              style={{ fontWeight: 300 }}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#3E8283] text-white text-lg font-semibold hover:bg-[#27605c] transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </form>

        <h1 className="text-5xl font-bold mb-4 text-[#408B88]" style={{ fontFamily: 'inherit', letterSpacing: '-2px' }}>Search Results</h1>
        <p className="mb-8 text-xl text-gray-600">Showing results for: “{query}”</p>

        {Object.keys(groupedResults).length === 0 ? (
          <p className="text-2xl text-gray-300 mt-16">No results found.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(groupedResults).map(([collectionName, posts]) => {
              // Map collectionName to friendly section titles
              let sectionTitle = collectionName;
              if (collectionName.toLowerCase().includes('example')) sectionTitle = 'Examples';
              else if (collectionName.toLowerCase().includes('about')) sectionTitle = 'About';
              else if (collectionName.toLowerCase().includes('guidance')) sectionTitle = 'Guidance';
              else sectionTitle = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);

              return (
                <section key={collectionName} className="border border-[#345D85] rounded-xl p-8 bg-white">
                  <h2 className="text-3xl font-bold mb-4 text-[#345D85]">{sectionTitle}</h2>
                  <ul className="space-y-3 ml-4.5">
                    {posts.map((post) => (
                      <li key={post.path}>
                        <Link
                          href={`/post/${collectionName}/${post.name.replace('.md', '')}`}
                          className="text-[#1C8278] text-lg hover:underline"
                        >
                          {post.metadata?.title || post.name.replace('.md', '').replace(/-/g, ' ')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-6">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
