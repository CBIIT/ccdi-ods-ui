import { HomePageConfig } from '../types/config';

export class ConfigService {
  private static instance: ConfigService;
  private cache: HomePageConfig | null = null;

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public async fetchConfig(): Promise<HomePageConfig> {
    try {
      const GITHUB_API_URL = 'https://api.github.com/repos/CBIIT/ccdi-ods-content/contents/config/content.json';
      const response = await fetch(GITHUB_API_URL, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }

      const fileData = await response.json();
      // GitHub API returns content as base64 encoded string
      const decodedContent = atob(fileData.content);
      const data = JSON.parse(decodedContent);
      console.log('Fetched and decoded config data:', data);
      this.cache = data;
      return data;
    } catch (error) {
      console.error('Error fetching config:', error);
      // Load default config file as fallback
      const defaultConfig = await import('../data/homepage.config.json');
      this.cache = defaultConfig;
      return defaultConfig;
    }
  }
}
