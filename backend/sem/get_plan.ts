import { api, APIError } from "encore.dev/api";
import type { SEMPlan, KeywordData, AdGroup, SearchTheme, ShoppingBid } from './types';
import { semDB } from './db';

interface GetPlanParams {
  id: string;
}

// Retrieves a SEM plan by ID with all associated data.
export const getPlan = api<GetPlanParams, SEMPlan>(
  { expose: true, method: "GET", path: "/sem/plans/:id" },
  async ({ id }) => {
    try {
      // Get plan details
      const planRow = await semDB.queryRow<{
        id: string;
        brand_website: string;
        competitor_website: string;
        service_locations: string[];
        shopping_budget: number;
        search_budget: number;
        pmax_budget: number;
        total_estimated_cost: number;
        expected_conversions: number;
        created_at: Date;
      }>`
        SELECT * FROM sem_plans WHERE id = ${id}
      `;

      if (!planRow) {
        throw APIError.notFound("SEM plan not found");
      }

      // Get keywords
      const keywordRows = await semDB.queryAll<{
        keyword: string;
        search_volume: number;
        top_of_page_bid_low: number;
        top_of_page_bid_high: number;
        competition: 'LOW' | 'MEDIUM' | 'HIGH';
        intent: 'BRAND' | 'CATEGORY' | 'COMPETITOR' | 'LOCATION' | 'LONG_TAIL';
      }>`
        SELECT keyword, search_volume, top_of_page_bid_low, top_of_page_bid_high, competition, intent
        FROM keywords WHERE sem_plan_id = ${id}
      `;

      const keywords: KeywordData[] = keywordRows.map(row => ({
        keyword: row.keyword,
        searchVolume: row.search_volume,
        topOfPageBidLow: row.top_of_page_bid_low,
        topOfPageBidHigh: row.top_of_page_bid_high,
        competition: row.competition,
        intent: row.intent
      }));

      // Get ad groups with keywords
      const adGroupRows = await semDB.queryAll<{
        id: number;
        name: string;
        suggested_cpc: number;
        match_types: string[];
      }>`
        SELECT id, name, suggested_cpc, match_types
        FROM ad_groups WHERE sem_plan_id = ${id}
      `;

      const adGroups: AdGroup[] = [];
      for (const adGroupRow of adGroupRows) {
        const adGroupKeywords = await semDB.queryAll<{
          keyword: string;
          search_volume: number;
          top_of_page_bid_low: number;
          top_of_page_bid_high: number;
          competition: 'LOW' | 'MEDIUM' | 'HIGH';
          intent: 'BRAND' | 'CATEGORY' | 'COMPETITOR' | 'LOCATION' | 'LONG_TAIL';
        }>`
          SELECT k.keyword, k.search_volume, k.top_of_page_bid_low, k.top_of_page_bid_high, k.competition, k.intent
          FROM keywords k
          JOIN ad_group_keywords agk ON k.id = agk.keyword_id
          WHERE agk.ad_group_id = ${adGroupRow.id}
        `;

        adGroups.push({
          name: adGroupRow.name,
          keywords: adGroupKeywords.map(k => ({
            keyword: k.keyword,
            searchVolume: k.search_volume,
            topOfPageBidLow: k.top_of_page_bid_low,
            topOfPageBidHigh: k.top_of_page_bid_high,
            competition: k.competition,
            intent: k.intent
          })),
          suggestedCPC: adGroupRow.suggested_cpc,
          matchTypes: adGroupRow.match_types
        });
      }

      // Get search themes
      const searchThemeRows = await semDB.queryAll<{
        name: string;
        description: string;
        keywords: string[];
        suggested_bid: number;
      }>`
        SELECT name, description, keywords, suggested_bid
        FROM search_themes WHERE sem_plan_id = ${id}
      `;

      const searchThemes: SearchTheme[] = searchThemeRows.map(row => ({
        name: row.name,
        description: row.description,
        keywords: row.keywords,
        suggestedBid: row.suggested_bid
      }));

      // Get shopping bids
      const shoppingBidRows = await semDB.queryAll<{
        product_category: string;
        suggested_cpc: number;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        expected_conversions: number;
      }>`
        SELECT product_category, suggested_cpc, priority, expected_conversions
        FROM shopping_bids WHERE sem_plan_id = ${id}
      `;

      const shoppingBids: ShoppingBid[] = shoppingBidRows.map(row => ({
        productCategory: row.product_category,
        suggestedCPC: row.suggested_cpc,
        priority: row.priority,
        expectedConversions: row.expected_conversions
      }));

      return {
        id: planRow.id,
        inputs: {
          brandWebsite: planRow.brand_website,
          competitorWebsite: planRow.competitor_website,
          serviceLocations: planRow.service_locations,
          budgets: {
            shopping: planRow.shopping_budget,
            search: planRow.search_budget,
            pmax: planRow.pmax_budget
          }
        },
        keywords,
        adGroups,
        searchThemes,
        shoppingBids,
        totalEstimatedCost: planRow.total_estimated_cost,
        expectedConversions: planRow.expected_conversions,
        createdAt: planRow.created_at
      };
    } catch (error) {
      console.error('Error getting SEM plan:', error);
      throw error;
    }
  }
);
