import { api } from "encore.dev/api";
import type { GenerateKeywordsRequest, KeywordAnalysisResponse } from './types';
import { KeywordGenerator } from './keyword_generator';

// Generates keywords based on website content and seed keywords.
export const generateKeywords = api<GenerateKeywordsRequest, KeywordAnalysisResponse>(
  { expose: true, method: "POST", path: "/sem/keywords/generate" },
  async (req) => {
    try {
      const keywords = await KeywordGenerator.generateKeywords(req);
      
      const totalSearchVolume = keywords.reduce((sum, k) => sum + k.searchVolume, 0);
      const totalCPC = keywords.reduce((sum, k) => sum + (k.topOfPageBidLow + k.topOfPageBidHigh) / 2, 0);
      
      return {
        keywords,
        totalKeywords: keywords.length,
        averageSearchVolume: keywords.length > 0 ? Math.round(totalSearchVolume / keywords.length) : 0,
        averageCPC: keywords.length > 0 ? Math.round((totalCPC / keywords.length) * 100) / 100 : 0
      };
    } catch (error) {
      console.error('Error generating keywords:', error);
      throw error;
    }
  }
);
