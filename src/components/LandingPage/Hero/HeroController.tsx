import { useEffect, useState } from 'react';

export interface HeroConfig {
  title: string;
  subtitle: string;
  mission: {
    title: string;
    description: string;
  };
  image: {
    src: string;
    alt: string;
  };
}

const HERO_CONFIG_URL = 'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/config/home.json';

export function useHeroConfig() {
  const [config, setConfig] = useState<HeroConfig | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const fileUrl = `${HERO_CONFIG_URL}?ts=${new Date().getTime()}`;
      const res = await fetch(fileUrl, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.hero || data); // support both { hero: {...} } and direct config
      }
    }
    fetchConfig();
  }, []);

  return config;
}
