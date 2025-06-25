import { useEffect, useState } from 'react';

export interface LinkListItem {
  text: string;
  href: string;
}

export interface LinkListConfig {
  title: string;
  titleTextColor: string;
  links: LinkListItem[];
}

const LANDING_CONFIG_URL = 'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/config/home.json';

export function useLinkListConfig() {
  const [config, setConfig] = useState<LinkListConfig | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const fileUrl = `${LANDING_CONFIG_URL}?ts=${new Date().getTime()}`;
      const res = await fetch(fileUrl, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.linkList || data); // support both { hero: {...} } and direct config
      }
    }
    fetchConfig();
  }, []);

  return config;
}
