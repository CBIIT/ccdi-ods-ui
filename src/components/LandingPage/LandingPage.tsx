"use client"
import { useEffect, useState } from 'react';
import { Hero } from './Hero';
import Banner from './Banner';
import Gallery from './Gallery';
import { DataSharingGuidance } from "./LinkList/DataSharingGuidance";
import { DataSharingResources } from "./Resources";

const LANDING_CONFIG_URL = 'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/config/home.json';

export function LandingPage() {
  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      async function fetchConfig() {
        const fileUrl = `${LANDING_CONFIG_URL}?ts=${new Date().getTime()}`;
        const res = await fetch(fileUrl, {
          headers: { 'Accept': 'application/vnd.github.v3.raw' },
        });
        if (res.ok) {
          const data = await res.json();
          setLandingData(data);
          setLoading(false);
        }
      }
      fetchConfig();
    }, []);

  if (loading || !landingData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Hero data={landingData} />
      <Banner data={landingData} />
      <Gallery data={landingData} />
      <DataSharingGuidance />
      <DataSharingResources />
    </>
  );
}
