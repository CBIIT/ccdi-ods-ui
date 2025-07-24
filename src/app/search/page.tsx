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
  const [inputValue, setInputValue] = useState(query);

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
    <>
      <div className="mb-8 ml-24 mt-11">
        <Link href="/" className="inline-block text-[#3377FF] text-xl font-medium transition-all underline" style={{ color: '#005EA2' }}>
          ← Back to Home
        </Link>
      </div>
      <main className="max-w-5xl mx-auto p-8 bg-white min-h-screen">
        <form action="/search" method="GET" className="mb-12 flex justify-center">
          <div className="flex w-full max-w-4xl border-2 border-[#345D85] rounded-2xl overflow-hidden">
            <div className="flex-1 relative">
              <input
                type="text"
                name="q"
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-6 py-4 text-2xl text-gray-700 bg-white focus:outline-none placeholder-gray-400"
                style={{ fontWeight: 300 }}
              />
              {/* Right icon: Search icon when empty, Clear icon when has value */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {inputValue ? (
                  <button
                    type="button"
                    onClick={() => setInputValue('')}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <div className="text-[#004A8B]">
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="7" cy="7.43" r="6" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 16.43L11.5 11.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
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
