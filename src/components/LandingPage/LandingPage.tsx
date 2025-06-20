import { Hero } from './Hero';
import Banner from './Banner';
import Gallery from './Gallery';
import { DataSharingGuidance } from "./LinkList/DataSharingGuidance";
import { DataSharingProcess } from "./DataProcessing";
import { DataSharingResources } from "./Resources";

export function LandingPage() {
  return (
    <>
      <Hero />
      <Banner />
      <Gallery />
      <DataSharingGuidance />
      <DataSharingProcess />
      <DataSharingResources />
    </>
  );
}
