"use client";
import { useEffect, useState } from 'react';
import { Hero } from './Hero';
import Banner from './Banner';
import Gallery from './Gallery';
import { DataSharingGuidance } from "./LinkList/DataSharingGuidance";

export function LandingPage() {
  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setLandingData(data);
        } else {
          console.error(`Failed to fetch config: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        console.error(`Error fetching config: ${error}`);
      } finally {
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
      <DataSharingGuidance data={landingData} />
    </>
  );
}
