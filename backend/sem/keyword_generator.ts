import type { KeywordData, GenerateKeywordsRequest } from './types';
import { config } from './configLoader';

// Mock keyword generation service - in a real implementation, this would integrate with Google Keyword Planner API
export class KeywordGenerator {
  static async generateKeywords(request: GenerateKeywordsRequest): Promise<KeywordData[]> {
    try {
      const keywords: KeywordData[] = [];
      
      // Use seed keywords if provided, otherwise use sample keywords from config
      const baseKeywords = request.seedKeywords && request.seedKeywords.length > 0 
        ? request.seedKeywords 
        : config.keywords.sample_keywords;

      // Generate variations and related keywords
      for (const baseKeyword of baseKeywords) {
        // Add the base keyword
        keywords.push(this.createKeywordData(baseKeyword));
        
        // Generate variations
        const variations = this.generateKeywordVariations(baseKeyword);
        for (const variation of variations) {
          keywords.push(this.createKeywordData(variation));
        }
      }

      // Filter keywords with search volume >= configured minimum
      const filteredKeywords = keywords.filter(k => k.searchVolume >= config.keywords.min_search_volume);
      
      console.log(`Generated ${filteredKeywords.length} keywords from ${baseKeywords.length} base keywords`);
      return filteredKeywords;
    } catch (error) {
      console.error('Error in keyword generation:', error);
      throw error;
    }
  }

  private static generateKeywordVariations(baseKeyword: string): string[] {
    const variations: string[] = [];
    const modifiers = [
      'best', 'top', 'affordable', 'professional', 'expert', 'local',
      'near me', 'services', 'company', 'agency', 'consultant',
      'cost', 'price', 'cheap', 'premium', 'custom'
    ];

    // Add modifier variations
    for (const modifier of modifiers.slice(0, 5)) {
      variations.push(`${modifier} ${baseKeyword}`);
      variations.push(`${baseKeyword} ${modifier}`);
    }

    // Add long-tail variations
    variations.push(`how to ${baseKeyword}`);
    variations.push(`${baseKeyword} tips`);
    variations.push(`${baseKeyword} guide`);

    return variations;
  }

  private static createKeywordData(keyword: string): KeywordData {
    const competitionLevels = config.analysis.competition_levels as Array<'LOW' | 'MEDIUM' | 'HIGH'>;
    
    return {
      keyword,
      searchVolume: Math.floor(Math.random() * 10000) + config.keywords.min_search_volume,
      topOfPageBidLow: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
      topOfPageBidHigh: Math.round((Math.random() * 10 + 5) * 100) / 100,
      competition: competitionLevels[Math.floor(Math.random() * competitionLevels.length)],
      intent: this.determineIntent(keyword)
    };
  }

  private static determineIntent(keyword: string): 'BRAND' | 'CATEGORY' | 'COMPETITOR' | 'LOCATION' | 'LONG_TAIL' {
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerKeyword.includes('near me') || lowerKeyword.includes('local')) {
      return 'LOCATION';
    }
    
    if (lowerKeyword.includes('how to') || lowerKeyword.includes('guide') || lowerKeyword.includes('tips')) {
      return 'LONG_TAIL';
    }
    
    if (lowerKeyword.includes('vs') || lowerKeyword.includes('alternative')) {
      return 'COMPETITOR';
    }
    
    if (lowerKeyword.split(' ').length > 3) {
      return 'LONG_TAIL';
    }
    
    return 'CATEGORY';
  }
}
