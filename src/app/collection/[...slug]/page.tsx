import Link from 'next/link';
import matter from 'gray-matter';

interface GithubContent {
  name: string;
  path: string;
  sha: string;
  // Add download_url for raw content
  download_url: string;
}


interface Post {
  id: string;
  title: string;
  slug: string;
}

async function fetchPostMetadata(url: string): Promise<string | undefined> {
  const response = await fetch(url);
  if (!response.ok) return undefined;
  
  const content = await response.text();
  const { data } = matter(content);
  return data.title;
}

export async function generateStaticParams() {
  // Fetch all possible paths from GitHub at build time
  const response = await fetch(
    'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages',
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch directory structure');
  }

  const data: GithubContent[] = await response.json();
  
  // Generate paths for both directories and files
  const paths = data.map(item => ({
    slug: [item.name]
  }));

  return paths;
}


async function fetchGithubPosts(slug: string): Promise<Post[]> {

  const response = await fetch(
    `https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/pages/${slug}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  const data: GithubContent[] = await response.json();
  const mdFiles = data.filter(file => file.name.endsWith('.md'));
  
  // Fetch metadata for all files in parallel
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PostsList(props : any) {
  const { params } = props;
  const slug = params.slug.join('/');
  const posts = await fetchGithubPosts(slug);

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