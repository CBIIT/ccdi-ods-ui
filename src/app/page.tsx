import { LandingPage } from '@/components/LandingPage/LandingPage';


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
