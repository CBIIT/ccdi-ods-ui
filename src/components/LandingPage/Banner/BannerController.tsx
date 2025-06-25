import { useEffect, useState } from 'react';

export interface BannerConfig {
  supportTitle: string;
  questionText: string;
  homepageButton: {
    text: string;
    link: string;
  };
  textFrame: string[];
}

const LANDING_CONFIG_URL = 'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/config/home.json';

export function useBannerConfig() {
  const [config, setConfig] = useState<BannerConfig | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const fileUrl = `${LANDING_CONFIG_URL}?ts=${new Date().getTime()}`;
      const res = await fetch(fileUrl, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.banner || data); // support both { hero: {...} } and direct config
      }
    }
    fetchConfig();
  }, []);

  return config;
}
