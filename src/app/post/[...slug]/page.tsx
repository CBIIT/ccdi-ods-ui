'use client';

import { fetchContent, processMarkdown } from './serverUtils';
import ClientPost from './ClientPost';
import NotFound from '@/app/not-found';
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
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setIsNotFound(false);
      
      const slugPath = slug.join('/');
      const contentData = await fetchContent(slugPath);
      
      if (contentData === null) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      const processedData = await processMarkdown(contentData.content, slugPath);
      setMetadata(contentData.metadata);
      setProcessedContent(processedData);
      setIsLoading(false);
    }

    fetchData();
  }, [slug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isNotFound || !metadata || !processedContent) {
    return <NotFound />;
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