'use client';

/**
 * Main landing page component
 * Fetches and displays the site's homepage content.
 * 
 * @returns {JSX.Element} The rendered landing page.
 */

import { useEffect, useState } from 'react';
import { Hero } from './Hero';
import Banner from './Banner';
import Gallery from './Gallery';
// import { DataSharingGuidance } from "./LinkList/DataSharingGuidance";
import { getGithubBranch } from '@/config/config';

/**
 * Main landing page component that fetches and displays the site's homepage content
 * Composed of several sections:
 * - Hero: Main banner with mission statement
 * - Banner: Support information and call-to-action
 * - Gallery: Latest updates and news
 * - DataSharingGuidance: Links to important resources
 * 
 * The component fetches its configuration from the /api/config endpoint
 * and handles loading states appropriately
 */
export function LandingPage() {
  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {

      const branch = getGithubBranch();
      const LANDING_CONFIG_URL = `https://raw.githubusercontent.com/CBIIT/ccdi-ods-content/${branch}/config/home.json`;

      try {
        const res = await fetch(`${LANDING_CONFIG_URL}?ts=${new Date().getTime()}`);
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
      {/* <DataSharingGuidance data={landingData} /> */}
    </>
  );
}
