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
      <div className="max-w-[1444px] mx-auto p-6 pt-[11px] pb-[1px]">
     <div className="mb-8 ml-8">
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
      <main className="max-w-7xl mx-auto p-8 pt-[16px] bg-white min-h-screen">
        <form action="/search" method="GET" className="mb-[34px] flex justify-center">
          <div className="flex w-full max-w-[711px] border-1 border-[#345D85] rounded-md overflow-hidden">
            <div className="flex-1 relative">
              <input
                type="text"
                name="q"
                placeholder="Search..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-6 h-[41px] text-lg text-gray-700 bg-white focus:outline-none placeholder-gray-400"
                style={{ fontWeight: 300 }}
              />
              {/* Right icon: Search icon when empty, Clear icon when has value */}
              <div className="absolute right-4 top-5.5 transform -translate-y-1/2">
                {inputValue ? (
                  <button
                    type="button"
                    onClick={() => setInputValue('')}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <div className="text-[#004A8B]">
                    <svg width="15" height="15" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="7" cy="7.43" r="6" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 16.43L11.5 11.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="px-[25px] py-0 bg-[#3E8283] text-white text-base font-semibold hover:bg-[#27605c] transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </form>

        <h1 className="[font-family:Inter] text-5xl font-bold mb-4 text-[#408B88] tracking-[0.045px]">Search Results</h1>
        <p className="mb-8 text-xl text-gray-600">Showing results for: “{query}”</p>

        {Object.keys(groupedResults).length === 0 ? (
          <p className="text-2xl text-gray-300 mt-16">No results found.</p>
        ) : (
          <div className="flex flex-col gap-[35px]">
            {Object.entries(groupedResults).map(([collectionName, posts]) => {
              // Map collectionName to friendly section titles
              const sectionTitle = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);

              return (
                <section key={collectionName} className="border border-[#345D85] rounded-xl p-8 bg-white">
                  <h2 className="text-3xl font-bold mb-4">
                    <div
                      // href={`/collection/${collectionName}`}
                      className="text-[#345D85] [font-family:Inter] text-[32px] font-semibold leading-[35px]"
                    >
                      {sectionTitle}
                    </div>
                  </h2>
                  <ul className="space-y-3 ml-4.5">
                    {posts.map((post) => (
                      <li key={post.path}>
                        <Link
                          href={`/post/${collectionName}/${post.name.replace('.md', '')}`}
                          className="text-[#1C8278] text-lg underline"
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
