'use client';

import { fetchContent, processMarkdown } from './serverUtils';
import ClientPost from './ClientPost';
import { useState, useEffect, use } from 'react';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

interface Metadata {
  title?: string;
}

export default function Post({ params }: PageProps) {
  const paramsData = use(params);
  const { slug } = paramsData;

  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [processedContent, setProcessedContent] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const slugPath = slug.join('/');
      const contentData = await fetchContent(slugPath);
      const processedData = await processMarkdown(contentData.content, slugPath);

      setMetadata(contentData.metadata);
      setProcessedContent(processedData);
    }

    fetchData();
  }, [slug]);

  if (!metadata || !processedContent) {
    return <div>Loading...</div>;
  }

  const cleanTitle = metadata?.title?.replace(/^['"]|['"]$/g, '') || slug[1];

  return (
    <ClientPost 
      collection={slug[0]}
      page={cleanTitle}
      processedContent={processedContent}
    />
  );
}