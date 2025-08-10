import { api } from "encore.dev/api";
import type { CreateSEMPlanRequest, SEMPlan } from './types';
import { semDB } from './db';
import { KeywordGenerator } from './keyword_generator';
import { SEMAnalyzer } from './sem_analyzer';
import { config } from './configLoader';

// Creates a comprehensive SEM plan with keyword analysis and campaign recommendations.
export const createPlan = api<CreateSEMPlanRequest, SEMPlan>(
  { expose: true, method: "POST", path: "/sem/plans" },
  async (req) => {
    try {
      const planId = `sem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Creating SEM plan with request:', {
        brandWebsite: req.inputs.brandWebsite,
        budgets: req.inputs.budgets,
        seedKeywordsCount: req.seedKeywords?.length || 0
      });

      // Use provided budgets or fall back to config defaults
      const budgets = {
        shopping: req.inputs.budgets.shopping || config.campaigns.default_budgets.shopping,
        search: req.inputs.budgets.search || config.campaigns.default_budgets.search,
        pmax: req.inputs.budgets.pmax || config.campaigns.default_budgets.pmax
      };

      // Generate keywords
      const keywords = await KeywordGenerator.generateKeywords({
        website: req.inputs.brandWebsite,
        competitorWebsite: req.inputs.competitorWebsite,
        seedKeywords: req.seedKeywords
      });

      console.log(`Generated ${keywords.length} keywords`);

      // Analyze keywords and generate recommendations
      const adGroups = SEMAnalyzer.generateAdGroups(keywords);
      const searchThemes = SEMAnalyzer.generateSearchThemes(keywords);
      const shoppingBids = SEMAnalyzer.generateShoppingBids({
        ...req.inputs,
        budgets
      }, keywords);
      const totalEstimatedCost = SEMAnalyzer.calculateTotalEstimatedCost({
        ...req.inputs,
        budgets
      });
      const expectedConversions = SEMAnalyzer.calculateExpectedConversions(totalEstimatedCost);

      // Save to database
      await semDB.exec`
        INSERT INTO sem_plans (
          id, brand_website, competitor_website, service_locations,
          shopping_budget, search_budget, pmax_budget,
          total_estimated_cost, expected_conversions
        ) VALUES (
          ${planId}, ${req.inputs.brandWebsite}, ${req.inputs.competitorWebsite || ''}, ${req.inputs.serviceLocations},
          ${budgets.shopping}, ${budgets.search}, ${budgets.pmax},
          ${totalEstimatedCost}, ${expectedConversions}
        )
      `;

      // Save keywords
      for (const keyword of keywords) {
        await semDB.exec`
          INSERT INTO keywords (
            sem_plan_id, keyword, search_volume, top_of_page_bid_low,
            top_of_page_bid_high, competition, intent
          ) VALUES (
            ${planId}, ${keyword.keyword}, ${keyword.searchVolume}, ${keyword.topOfPageBidLow},
            ${keyword.topOfPageBidHigh}, ${keyword.competition}, ${keyword.intent}
          )
        `;
      }

      // Save ad groups
      for (const adGroup of adGroups) {
        const result = await semDB.queryRow<{id: number}>`
          INSERT INTO ad_groups (sem_plan_id, name, suggested_cpc, match_types)
          VALUES (${planId}, ${adGroup.name}, ${adGroup.suggestedCPC}, ${adGroup.matchTypes})
          RETURNING id
        `;
        
        if (result) {
          for (const keyword of adGroup.keywords) {
            const keywordResult = await semDB.queryRow<{id: number}>`
              SELECT id FROM keywords 
              WHERE sem_plan_id = ${planId} AND keyword = ${keyword.keyword}
            `;
            
            if (keywordResult) {
              await semDB.exec`
                INSERT INTO ad_group_keywords (ad_group_id, keyword_id)
                VALUES (${result.id}, ${keywordResult.id})
              `;
            }
          }
        }
      }

      // Save search themes
      for (const theme of searchThemes) {
        await semDB.exec`
          INSERT INTO search_themes (sem_plan_id, name, description, keywords, suggested_bid)
          VALUES (${planId}, ${theme.name}, ${theme.description}, ${theme.keywords}, ${theme.suggestedBid})
        `;
      }

      // Save shopping bids
      for (const bid of shoppingBids) {
        await semDB.exec`
          INSERT INTO shopping_bids (sem_plan_id, product_category, suggested_cpc, priority, expected_conversions)
          VALUES (${planId}, ${bid.productCategory}, ${bid.suggestedCPC}, ${bid.priority}, ${bid.expectedConversions})
        `;
      }

      const plan: SEMPlan = {
        id: planId,
        inputs: {
          ...req.inputs,
          budgets
        },
        keywords,
        adGroups,
        searchThemes,
        shoppingBids,
        totalEstimatedCost,
        expectedConversions,
        createdAt: new Date()
      };

      console.log(`SEM plan created successfully: ${planId}`);
      return plan;
    } catch (error) {
      console.error('Error creating SEM plan:', error);
      throw error;
    }
  }
);
