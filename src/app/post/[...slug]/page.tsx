'use client';

import { fetchContent, processMarkdown } from './serverUtils';
import ClientPost from './ClientPost';
import NotFound from '@/app/not-found';
import { useState, useEffect, use, useMemo } from 'react';
import { BreadcrumbSegment } from '@/components/Breadcrumbs';

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

  const breadcrumbs = useMemo<BreadcrumbSegment[]>(() => {
    const segments: BreadcrumbSegment[] = [];
    if (slug.length > 0) {
      slug.slice(0, -1).forEach((part) => {
        // TODO: Do we go to collection? Pending decision.
        const href = '/collection/' + slug.slice(0, slug.indexOf(part) + 1).join('/');
        // TODO: Need to get proper labels for breadcrumb parts
        segments.push({ label: part, href });
      });
    }
    
    segments.push({ label: metadata?.title?.replace(/^['"]|['"]$/g, '') || "Untitled" });

    return segments;
  }, [slug, metadata]);

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

  return (
    <ClientPost breadcrumbs={breadcrumbs} processedContent={processedContent} />
  );
}
