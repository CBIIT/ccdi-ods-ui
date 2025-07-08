'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import matter from 'gray-matter';

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
    'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages',
    {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }

  const data: GithubCollection[] = await response.json();
  return data.filter(item => item.type === 'dir');
}

// Fetch posts under a collection
async function fetchPosts(collectionPath: string): Promise<GithubPost[]> {
  const response = await fetch(
    `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages/${collectionPath}`,
    {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch posts for ${collectionPath}`);
  }

  const items: GithubPost[] = await response.json();

  // For each item inside the collection
  const posts: GithubPost[] = [];
  for (const item of items) {
    if (item.type === 'file' && item.name.endsWith('.md')) {
      const postResonse = await fetch(
        `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/${item.path}`,
        {
          headers: {
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
    keys: ['name','content'],
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
    <main className="max-w-5xl mx-auto p-8 bg-white min-h-screen">
      <div className="mb-8">
        <Link href="/" className="inline-block text-[#3377FF] text-xl font-medium hover:underline transition-all">
          &larr; Back to Home
        </Link>
      </div>

      <form action="/search" method="GET" className="mb-12 flex justify-center">
        <div className="flex w-full max-w-4xl border-2 border-[#3377FF] rounded-2xl overflow-hidden">
          <input
            type="text"
            name="q"
            placeholder="Search..."
            defaultValue={query}
            className="flex-1 px-6 py-4 text-2xl text-gray-700 bg-white focus:outline-none placeholder-gray-400"
            style={{ fontWeight: 300 }}
          />
        </div>
      </form>

      <h1 className="text-5xl font-bold mb-4 text-[#36807B]" style={{ fontFamily: 'inherit', letterSpacing: '-2px' }}>Search Results</h1>
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
              <section key={collectionName} className="border border-[#3B6A75] rounded-xl p-8 bg-white">
                <h2 className="text-3xl font-bold mb-4 text-[#3B6A75]">{sectionTitle}</h2>
                <ul className="space-y-3">
                  {posts.map((post) => (
                    <li key={post.path}>
                      <Link
                        href={`/post/${collectionName}/${post.name.replace('.md', '')}`}
                        className="text-[#36807B] text-lg hover:underline"
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
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-6">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
