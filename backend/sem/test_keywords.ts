import { api } from "encore.dev/api";
import { KeywordGenerator } from './keyword_generator';
import { config } from './configLoader';
import type { KeywordData } from './types';

interface TestKeywordsResponse {
  keywords: KeywordData[];
  totalKeywords: number;
  averageSearchVolume: number;
  averageCPC: number;
  config: {
    minSearchVolume: number;
    sampleKeywordsCount: number;
    competitionLevels: string[];
    intentTypes: string[];
  };
}

// Test endpoint to generate keywords using configuration settings.
export const testKeywords = api<void, TestKeywordsResponse>(
  { expose: true, method: "GET", path: "/sem/test/keywords" },
  async () => {
    try {
      console.log('Testing keyword generation with config:', {
        minSearchVolume: config.keywords.min_search_volume,
        sampleKeywordsCount: config.keywords.sample_keywords.length,
        competitionLevels: config.analysis.competition_levels,
        intentTypes: config.analysis.intent_types
      });

      const keywords = await KeywordGenerator.generateKeywords({
        website: "https://example.com",
        seedKeywords: config.keywords.sample_keywords.slice(0, 5) // Use first 5 sample keywords
      });
      
      const totalSearchVolume = keywords.reduce((sum, k) => sum + k.searchVolume, 0);
      const totalCPC = keywords.reduce((sum, k) => sum + (k.topOfPageBidLow + k.topOfPageBidHigh) / 2, 0);
      
      return {
        keywords,
        totalKeywords: keywords.length,
        averageSearchVolume: keywords.length > 0 ? Math.round(totalSearchVolume / keywords.length) : 0,
        averageCPC: keywords.length > 0 ? Math.round((totalCPC / keywords.length) * 100) / 100 : 0,
        config: {
          minSearchVolume: config.keywords.min_search_volume,
          sampleKeywordsCount: config.keywords.sample_keywords.length,
          competitionLevels: config.analysis.competition_levels,
          intentTypes: config.analysis.intent_types
        }
      };
    } catch (error) {
      console.error('Error in test keywords:', error);
      throw error;
    }
  }
);
