import type { KeywordData, AdGroup, SearchTheme, ShoppingBid, SEMInputs } from './types';
import { config } from './configLoader';

export class SEMAnalyzer {
  private static readonly CONVERSION_RATE = config.campaigns.conversion_rate;

  static generateAdGroups(keywords: KeywordData[]): AdGroup[] {
    const adGroups: AdGroup[] = [];
    
    // Group keywords by intent
    const brandKeywords = keywords.filter(k => k.intent === 'BRAND');
    const categoryKeywords = keywords.filter(k => k.intent === 'CATEGORY');
    const competitorKeywords = keywords.filter(k => k.intent === 'COMPETITOR');
    const locationKeywords = keywords.filter(k => k.intent === 'LOCATION');
    const longTailKeywords = keywords.filter(k => k.intent === 'LONG_TAIL');

    if (brandKeywords.length > 0) {
      adGroups.push({
        name: 'Brand Terms',
        keywords: brandKeywords,
        suggestedCPC: this.calculateAverageCPC(brandKeywords),
        matchTypes: ['Exact', 'Phrase']
      });
    }

    if (categoryKeywords.length > 0) {
      adGroups.push({
        name: 'Category Terms',
        keywords: categoryKeywords,
        suggestedCPC: this.calculateAverageCPC(categoryKeywords),
        matchTypes: ['Broad Match Modifier', 'Phrase']
      });
    }

    if (competitorKeywords.length > 0) {
      adGroups.push({
        name: 'Competitor Terms',
        keywords: competitorKeywords,
        suggestedCPC: this.calculateAverageCPC(competitorKeywords),
        matchTypes: ['Phrase', 'Exact']
      });
    }

    if (locationKeywords.length > 0) {
      adGroups.push({
        name: 'Location-based Queries',
        keywords: locationKeywords,
        suggestedCPC: this.calculateAverageCPC(locationKeywords),
        matchTypes: ['Broad Match Modifier', 'Phrase']
      });
    }

    if (longTailKeywords.length > 0) {
      adGroups.push({
        name: 'Long-Tail Informational Queries',
        keywords: longTailKeywords,
        suggestedCPC: this.calculateAverageCPC(longTailKeywords),
        matchTypes: ['Broad Match Modifier']
      });
    }

    return adGroups;
  }

  static generateSearchThemes(keywords: KeywordData[]): SearchTheme[] {
    const themes: SearchTheme[] = [];
    
    // Group keywords by common themes
    const serviceThemes = this.groupKeywordsByTheme(keywords);
    
    for (const [themeName, themeKeywords] of serviceThemes.entries()) {
      themes.push({
        name: themeName,
        description: `Asset group focused on ${themeName.toLowerCase()} related searches`,
        keywords: themeKeywords.map(k => k.keyword),
        suggestedBid: this.calculateAverageCPC(themeKeywords)
      });
    }

    return themes;
  }

  static generateShoppingBids(inputs: SEMInputs, keywords: KeywordData[]): ShoppingBid[] {
    const categories = config.shopping.product_categories;

    return categories.map(category => {
      const relevantKeywords = keywords.filter(k => 
        k.keyword.toLowerCase().includes(category.toLowerCase().split(' ')[0])
      );
      
      const avgCPC = relevantKeywords.length > 0 
        ? this.calculateAverageCPC(relevantKeywords)
        : Math.random() * 3 + 1;

      const expectedClicks = inputs.budgets.shopping / avgCPC;
      const expectedConversions = expectedClicks * this.CONVERSION_RATE;

      return {
        productCategory: category,
        suggestedCPC: Math.round(avgCPC * 100) / 100,
        priority: this.determinePriority(avgCPC, expectedConversions),
        expectedConversions: Math.round(expectedConversions * 100) / 100
      };
    });
  }

  private static calculateAverageCPC(keywords: KeywordData[]): number {
    if (keywords.length === 0) return 0;
    
    const totalCPC = keywords.reduce((sum, k) => sum + (k.topOfPageBidLow + k.topOfPageBidHigh) / 2, 0);
    return Math.round((totalCPC / keywords.length) * 100) / 100;
  }

  private static groupKeywordsByTheme(keywords: KeywordData[]): Map<string, KeywordData[]> {
    const themes = new Map<string, KeywordData[]>();
    const themePatterns = config.analysis.theme_patterns;

    for (const keyword of keywords) {
      let assigned = false;
      
      for (const theme of themePatterns) {
        if (theme.patterns.some(pattern => keyword.keyword.toLowerCase().includes(pattern))) {
          if (!themes.has(theme.name)) {
            themes.set(theme.name, []);
          }
          themes.get(theme.name)!.push(keyword);
          assigned = true;
          break;
        }
      }
      
      if (!assigned) {
        const generalTheme = 'General Marketing';
        if (!themes.has(generalTheme)) {
          themes.set(generalTheme, []);
        }
        themes.get(generalTheme)!.push(keyword);
      }
    }

    return themes;
  }

  private static determinePriority(cpc: number, conversions: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    const thresholds = config.shopping.priority_thresholds;
    
    if (conversions > thresholds.high_conversions && cpc < thresholds.high_cpc_threshold) return 'HIGH';
    if (conversions > thresholds.medium_conversions || cpc < thresholds.medium_cpc_threshold) return 'MEDIUM';
    return 'LOW';
  }

  static calculateTotalEstimatedCost(inputs: SEMInputs): number {
    return inputs.budgets.shopping + inputs.budgets.search + inputs.budgets.pmax;
  }

  static calculateExpectedConversions(totalCost: number): number {
    const avgCPC = config.campaigns.default_cpc;
    const estimatedClicks = totalCost / avgCPC;
    return Math.round(estimatedClicks * this.CONVERSION_RATE * 100) / 100;
  }
}
