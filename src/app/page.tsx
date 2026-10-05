import type { Metadata } from 'next';
import { LandingPage } from '@/components/LandingPage/LandingPage';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  return <HomeContent/>;
}

function HomeContent() {
  return (
    <main>
      <LandingPage />
    </main>
  );
}
