import { fetchContent, processMarkdown } from './serverUtils';
import ClientPost from './ClientPost';
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

interface Metadata {
  title?: string;
}

export default async function Post({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const contentData = await fetchContent(slugPath);
  if (!contentData) notFound();

  const processedContent = await processMarkdown(contentData.content, slugPath);
  const metadata: Metadata = contentData.metadata ?? {};

  const cleanTitle =
    metadata?.title?.replace(/^['"]|['"]$/g, "") || slug[1] || slugPath;

  return (
    <ClientPost
      collection={slug[0]}
      page={cleanTitle}
      processedContent={processedContent}
    />
  );
}