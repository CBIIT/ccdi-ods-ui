import { Hero } from '@/components/Hero';
import Banner from '@/components/Banner';
import Gallery from '@/components/Gallery';
import { DataSharingGuidance } from "@/components/LinkList/DataSharingGuidance";
import { DataSharingProcess } from "@/components/DataProcessing";
import { DataSharingResources } from "@/components/Resources";
import { ConfigService } from '../services/ConfigService';
import { HomePageConfig } from '../types/config';

async function getHomePageConfig() {
  const configService = ConfigService.getInstance();
  try {
    return await configService.fetchConfig();
  } catch (error) {
    console.error('Error fetching homepage config:', error);
    return null;
  }
}

export default async function Home() {
  const config = await getHomePageConfig();
  return <HomeContent config={config} />;
}

function HomeContent({ config }: { config: HomePageConfig | null }) {
  return (
    <main>
      <Hero config={config?.hero} />
      <Banner />
      <Gallery config={config?.gallery} />
      <DataSharingGuidance config={config?.guidance} />
      <DataSharingProcess config={config?.dataSharing} />
      <DataSharingResources />
    </main>
  );
}
