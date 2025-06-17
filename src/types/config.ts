export interface HomePageConfig {
  hero: {
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
  };
  gallery: {
    title: string;
    updates: Array<{
      title: string;
      description: string;
      image: string;
      readMoreColor: string;
      link: string;
    }>;
  };
  guidance: {
    title: string;
    leftColumnLinks: Array<{
      text: string;
      href: string;
    }>;
    rightColumnLinks: Array<{
      text: string;
      href: string;
    }>;
  };
  dataSharing: {
    title: string;
    processList: string[];
  };
}
