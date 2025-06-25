import { useEffect, useState } from 'react';

export interface GalleryUpdate {
  image: string;
  title: string;
  description: string;
  link: string;
}

export interface GalleryConfig {
  title: string;
  viewLatestButtonText: string;
  viewLatestButtonLink: string;
  newsletterButtonText: string;
  newsletterButtonLink: string;
  updates: GalleryUpdate[];
}

const LANDING_CONFIG_URL = 'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/config/home.json';

export function useHeroConfig() {
  const [config, setConfig] = useState<GalleryConfig | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const fileUrl = `${LANDING_CONFIG_URL}?ts=${new Date().getTime()}`;
      const res = await fetch(fileUrl, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.gallery || data); // support both { hero: {...} } and direct config
      }
    }
    fetchConfig();
  }, []);

  return config;
}
