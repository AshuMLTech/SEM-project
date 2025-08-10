import { api } from "encore.dev/api";
import { semDB } from './db';
import { config } from './configLoader';
import type { SEMInputs, KeywordData, AdGroup, SearchTheme, ShoppingBid } from './types';

interface TestDataResponse {
  message: string;
  planId: string;
  summary: {
    keywords: number;
    adGroups: number;
    searchThemes: number;
    shoppingBids: number;
    totalBudget: number;
  };
}

// Creates test SEM plan data for demonstration purposes.
export const createTestData = api<void, TestDataResponse>(
  { expose: true, method: "POST", path: "/sem/test/create-data" },
  async () => {
    const planId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Test SEM inputs
    const testInputs: SEMInputs = {
      brandWebsite: "https://digitalmarketingpro.com",
      competitorWebsite: "https://marketingexperts.com",
      serviceLocations: ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX"],
      budgets: {
        shopping: 2500,
        search: 5000,
        pmax: 3000
      }
    };

    // Test keywords data
    const testKeywords: KeywordData[] = [
      {
        keyword: "digital marketing services",
        searchVolume: 8900,
        topOfPageBidLow: 4.50,
        topOfPageBidHigh: 12.80,
        competition: "HIGH",
        intent: "CATEGORY"
      },
      {
        keyword: "best digital marketing agency",
        searchVolume: 2400,
        topOfPageBidLow: 6.20,
        topOfPageBidHigh: 15.40,
        competition: "HIGH",
        intent: "BRAND"
      },
      {
        keyword: "seo optimization services",
        searchVolume: 5600,
        topOfPageBidLow: 3.80,
        topOfPageBidHigh: 9.60,
        competition: "MEDIUM",
        intent: "CATEGORY"
      },
      {
        keyword: "ppc advertising management",
        searchVolume: 3200,
        topOfPageBidLow: 5.10,
        topOfPageBidHigh: 13.20,
        competition: "HIGH",
        intent: "CATEGORY"
      },
      {
        keyword: "social media marketing near me",
        searchVolume: 1800,
        topOfPageBidLow: 2.90,
        topOfPageBidHigh: 7.80,
        competition: "MEDIUM",
        intent: "LOCATION"
      },
      {
        keyword: "content marketing strategy",
        searchVolume: 4100,
        topOfPageBidLow: 3.40,
        topOfPageBidHigh: 8.90,
        competition: "MEDIUM",
        intent: "CATEGORY"
      },
      {
        keyword: "email marketing automation",
        searchVolume: 2900,
        topOfPageBidLow: 4.70,
        topOfPageBidHigh: 11.30,
        competition: "HIGH",
        intent: "CATEGORY"
      },
      {
        keyword: "how to improve seo ranking",
        searchVolume: 6700,
        topOfPageBidLow: 1.20,
        topOfPageBidHigh: 4.50,
        competition: "LOW",
        intent: "LONG_TAIL"
      },
      {
        keyword: "google ads vs facebook ads",
        searchVolume: 1500,
        topOfPageBidLow: 2.80,
        topOfPageBidHigh: 6.90,
        competition: "MEDIUM",
        intent: "COMPETITOR"
      },
      {
        keyword: "marketing automation tools",
        searchVolume: 3800,
        topOfPageBidLow: 5.60,
        topOfPageBidHigh: 14.20,
        competition: "HIGH",
        intent: "CATEGORY"
      },
      {
        keyword: "conversion rate optimization",
        searchVolume: 2200,
        topOfPageBidLow: 4.30,
        topOfPageBidHigh: 10.70,
        competition: "MEDIUM",
        intent: "CATEGORY"
      },
      {
        keyword: "local seo services",
        searchVolume: 4500,
        topOfPageBidLow: 3.90,
        topOfPageBidHigh: 9.20,
        competition: "MEDIUM",
        intent: "LOCATION"
      },
      {
        keyword: "professional web design",
        searchVolume: 5200,
        topOfPageBidLow: 4.80,
        topOfPageBidHigh: 12.40,
        competition: "HIGH",
        intent: "CATEGORY"
      },
      {
        keyword: "brand strategy consulting",
        searchVolume: 1600,
        topOfPageBidLow: 6.50,
        topOfPageBidHigh: 16.80,
        competition: "HIGH",
        intent: "CATEGORY"
      },
      {
        keyword: "affordable marketing services",
        searchVolume: 2800,
        topOfPageBidLow: 2.10,
        topOfPageBidHigh: 6.30,
        competition: "LOW",
        intent: "CATEGORY"
      }
    ];

    // Calculate totals
    const totalEstimatedCost = testInputs.budgets.shopping + testInputs.budgets.search + testInputs.budgets.pmax;
    const avgCPC = config.campaigns.default_cpc;
    const estimatedClicks = totalEstimatedCost / avgCPC;
    const expectedConversions = Math.round(estimatedClicks * config.campaigns.conversion_rate * 100) / 100;

    // Save test plan to database
    await semDB.exec`
      INSERT INTO sem_plans (
        id, brand_website, competitor_website, service_locations,
        shopping_budget, search_budget, pmax_budget,
        total_estimated_cost, expected_conversions
      ) VALUES (
        ${planId}, ${testInputs.brandWebsite}, ${testInputs.competitorWebsite}, ${testInputs.serviceLocations},
        ${testInputs.budgets.shopping}, ${testInputs.budgets.search}, ${testInputs.budgets.pmax},
        ${totalEstimatedCost}, ${expectedConversions}
      )
    `;

    // Save test keywords
    for (const keyword of testKeywords) {
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

    // Create test ad groups
    const testAdGroups = [
      {
        name: "Brand Terms",
        keywords: testKeywords.filter(k => k.intent === "BRAND"),
        suggestedCPC: 8.90,
        matchTypes: ["Exact", "Phrase"]
      },
      {
        name: "Category Terms", 
        keywords: testKeywords.filter(k => k.intent === "CATEGORY"),
        suggestedCPC: 6.45,
        matchTypes: ["Broad Match Modifier", "Phrase"]
      },
      {
        name: "Location-based Queries",
        keywords: testKeywords.filter(k => k.intent === "LOCATION"),
        suggestedCPC: 5.35,
        matchTypes: ["Broad Match Modifier", "Phrase"]
      },
      {
        name: "Long-Tail Informational Queries",
        keywords: testKeywords.filter(k => k.intent === "LONG_TAIL"),
        suggestedCPC: 2.85,
        matchTypes: ["Broad Match Modifier"]
      },
      {
        name: "Competitor Terms",
        keywords: testKeywords.filter(k => k.intent === "COMPETITOR"),
        suggestedCPC: 4.85,
        matchTypes: ["Phrase", "Exact"]
      }
    ];

    // Save test ad groups
    for (const adGroup of testAdGroups) {
      if (adGroup.keywords.length > 0) {
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
    }

    // Create test search themes
    const testSearchThemes = [
      {
        name: "Digital Marketing Services",
        description: "Asset group focused on digital marketing services related searches",
        keywords: ["digital marketing services", "best digital marketing agency", "marketing automation tools"],
        suggestedBid: 7.20
      },
      {
        name: "SEO & Optimization",
        description: "Asset group focused on seo & optimization related searches", 
        keywords: ["seo optimization services", "how to improve seo ranking", "local seo services"],
        suggestedBid: 4.50
      },
      {
        name: "Advertising & PPC",
        description: "Asset group focused on advertising & ppc related searches",
        keywords: ["ppc advertising management", "google ads vs facebook ads"],
        suggestedBid: 6.80
      },
      {
        name: "Content & Email Marketing",
        description: "Asset group focused on content & email marketing related searches",
        keywords: ["content marketing strategy", "email marketing automation"],
        suggestedBid: 5.90
      },
      {
        name: "Web Design & Development",
        description: "Asset group focused on web design & development related searches",
        keywords: ["professional web design"],
        suggestedBid: 8.60
      }
    ];

    // Save test search themes
    for (const theme of testSearchThemes) {
      await semDB.exec`
        INSERT INTO search_themes (sem_plan_id, name, description, keywords, suggested_bid)
        VALUES (${planId}, ${theme.name}, ${theme.description}, ${theme.keywords}, ${theme.suggestedBid})
      `;
    }

    // Create test shopping bids
    const testShoppingBids = [
      {
        productCategory: "Electronics & Technology",
        suggestedCPC: 3.45,
        priority: "HIGH" as const,
        expectedConversions: 12.8
      },
      {
        productCategory: "Health & Beauty", 
        suggestedCPC: 2.90,
        priority: "MEDIUM" as const,
        expectedConversions: 8.6
      },
      {
        productCategory: "Home & Garden",
        suggestedCPC: 2.15,
        priority: "MEDIUM" as const,
        expectedConversions: 7.2
      },
      {
        productCategory: "Sports & Outdoors",
        suggestedCPC: 2.80,
        priority: "LOW" as const,
        expectedConversions: 5.4
      },
      {
        productCategory: "Clothing & Accessories",
        suggestedCPC: 1.95,
        priority: "LOW" as const,
        expectedConversions: 4.8
      }
    ];

    // Save test shopping bids
    for (const bid of testShoppingBids) {
      await semDB.exec`
        INSERT INTO shopping_bids (sem_plan_id, product_category, suggested_cpc, priority, expected_conversions)
        VALUES (${planId}, ${bid.productCategory}, ${bid.suggestedCPC}, ${bid.priority}, ${bid.expectedConversions})
      `;
    }

    return {
      message: "Test SEM plan data created successfully",
      planId,
      summary: {
        keywords: testKeywords.length,
        adGroups: testAdGroups.filter(ag => ag.keywords.length > 0).length,
        searchThemes: testSearchThemes.length,
        shoppingBids: testShoppingBids.length,
        totalBudget: totalEstimatedCost
      }
    };
  }
);

interface ClearTestDataResponse {
  message: string;
  deletedPlans: number;
}

// Clears all test data from the database.
export const clearTestData = api<void, ClearTestDataResponse>(
  { expose: true, method: "DELETE", path: "/sem/test/clear-data" },
  async () => {
    // Get count of test plans before deletion
    const testPlansCount = await semDB.queryRow<{count: number}>`
      SELECT COUNT(*) as count FROM sem_plans WHERE id LIKE 'test_%'
    `;

    // Delete all test plans (cascading deletes will handle related data)
    await semDB.exec`
      DELETE FROM sem_plans WHERE id LIKE 'test_%'
    `;

    return {
      message: "Test data cleared successfully",
      deletedPlans: testPlansCount?.count || 0
    };
  }
);

interface TestCaseResult {
  testName: string;
  status: "PASS" | "FAIL";
  message: string;
  data?: any;
}

interface RunTestCasesResponse {
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
  results: TestCaseResult[];
}

// Runs comprehensive test cases for the SEM system.
export const runTestCases = api<void, RunTestCasesResponse>(
  { expose: true, method: "POST", path: "/sem/test/run-cases" },
  async () => {
    const results: TestCaseResult[] = [];

    // Test Case 1: Configuration Loading
    try {
      const configTest = {
        minSearchVolume: config.keywords.min_search_volume,
        sampleKeywordsCount: config.keywords.sample_keywords.length,
        defaultBudgets: config.campaigns.default_budgets,
        conversionRate: config.campaigns.conversion_rate
      };

      if (configTest.minSearchVolume > 0 && 
          configTest.sampleKeywordsCount > 0 && 
          configTest.conversionRate > 0 && configTest.conversionRate <= 1) {
        results.push({
          testName: "Configuration Loading",
          status: "PASS",
          message: "Configuration loaded successfully with valid values",
          data: configTest
        });
      } else {
        results.push({
          testName: "Configuration Loading",
          status: "FAIL",
          message: "Configuration contains invalid values"
        });
      }
    } catch (error) {
      results.push({
        testName: "Configuration Loading",
        status: "FAIL",
        message: `Configuration loading failed: ${error}`
      });
    }

    // Test Case 2: Database Connection
    try {
      await semDB.queryRow`SELECT 1 as test`;
      results.push({
        testName: "Database Connection",
        status: "PASS",
        message: "Database connection successful"
      });
    } catch (error) {
      results.push({
        testName: "Database Connection",
        status: "FAIL",
        message: `Database connection failed: ${error}`
      });
    }

    // Test Case 3: Keyword Generation
    try {
      const { KeywordGenerator } = await import('./keyword_generator');
      const keywords = await KeywordGenerator.generateKeywords({
        website: "https://test.com",
        seedKeywords: ["test keyword", "sample keyword"]
      });

      if (keywords.length > 0 && keywords.every(k => k.searchVolume >= config.keywords.min_search_volume)) {
        results.push({
          testName: "Keyword Generation",
          status: "PASS",
          message: `Generated ${keywords.length} valid keywords`,
          data: { keywordCount: keywords.length, sampleKeywords: keywords.slice(0, 3) }
        });
      } else {
        results.push({
          testName: "Keyword Generation",
          status: "FAIL",
          message: "Keyword generation produced invalid results"
        });
      }
    } catch (error) {
      results.push({
        testName: "Keyword Generation",
        status: "FAIL",
        message: `Keyword generation failed: ${error}`
      });
    }

    // Test Case 4: SEM Analysis
    try {
      const { SEMAnalyzer } = await import('./sem_analyzer');
      const testKeywords: KeywordData[] = [
        {
          keyword: "test keyword",
          searchVolume: 1000,
          topOfPageBidLow: 2.0,
          topOfPageBidHigh: 5.0,
          competition: "MEDIUM",
          intent: "CATEGORY"
        }
      ];

      const adGroups = SEMAnalyzer.generateAdGroups(testKeywords);
      const searchThemes = SEMAnalyzer.generateSearchThemes(testKeywords);
      const testInputs: SEMInputs = {
        brandWebsite: "https://test.com",
        competitorWebsite: "https://competitor.com",
        serviceLocations: ["Test City"],
        budgets: { shopping: 1000, search: 2000, pmax: 1500 }
      };
      const shoppingBids = SEMAnalyzer.generateShoppingBids(testInputs, testKeywords);

      if (adGroups.length > 0 && searchThemes.length > 0 && shoppingBids.length > 0) {
        results.push({
          testName: "SEM Analysis",
          status: "PASS",
          message: "SEM analysis components generated successfully",
          data: {
            adGroups: adGroups.length,
            searchThemes: searchThemes.length,
            shoppingBids: shoppingBids.length
          }
        });
      } else {
        results.push({
          testName: "SEM Analysis",
          status: "FAIL",
          message: "SEM analysis failed to generate required components"
        });
      }
    } catch (error) {
      results.push({
        testName: "SEM Analysis",
        status: "FAIL",
        message: `SEM analysis failed: ${error}`
      });
    }

    // Test Case 5: Plan Creation and Retrieval
    try {
      const testPlanId = `test_case_${Date.now()}`;
      
      // Create a test plan
      await semDB.exec`
        INSERT INTO sem_plans (
          id, brand_website, competitor_website, service_locations,
          shopping_budget, search_budget, pmax_budget,
          total_estimated_cost, expected_conversions
        ) VALUES (
          ${testPlanId}, 'https://testcase.com', 'https://competitor.com', ${'{"Test City"}'},
          1000, 2000, 1500, 4500, 30.0
        )
      `;

      // Retrieve the test plan
      const retrievedPlan = await semDB.queryRow`
        SELECT * FROM sem_plans WHERE id = ${testPlanId}
      `;

      if (retrievedPlan) {
        // Clean up test plan
        await semDB.exec`DELETE FROM sem_plans WHERE id = ${testPlanId}`;
        
        results.push({
          testName: "Plan Creation and Retrieval",
          status: "PASS",
          message: "Plan creation and retrieval successful"
        });
      } else {
        results.push({
          testName: "Plan Creation and Retrieval",
          status: "FAIL",
          message: "Failed to retrieve created plan"
        });
      }
    } catch (error) {
      results.push({
        testName: "Plan Creation and Retrieval",
        status: "FAIL",
        message: `Plan creation/retrieval failed: ${error}`
      });
    }

    // Test Case 6: Budget Calculations
    try {
      const { SEMAnalyzer } = await import('./sem_analyzer');
      const testInputs: SEMInputs = {
        brandWebsite: "https://test.com",
        competitorWebsite: "https://competitor.com", 
        serviceLocations: ["Test City"],
        budgets: { shopping: 1000, search: 2000, pmax: 1500 }
      };

      const totalCost = SEMAnalyzer.calculateTotalEstimatedCost(testInputs);
      const expectedConversions = SEMAnalyzer.calculateExpectedConversions(totalCost);

      if (totalCost === 4500 && expectedConversions > 0) {
        results.push({
          testName: "Budget Calculations",
          status: "PASS",
          message: "Budget calculations are accurate",
          data: { totalCost, expectedConversions }
        });
      } else {
        results.push({
          testName: "Budget Calculations",
          status: "FAIL",
          message: "Budget calculations produced incorrect results"
        });
      }
    } catch (error) {
      results.push({
        testName: "Budget Calculations",
        status: "FAIL",
        message: `Budget calculations failed: ${error}`
      });
    }

    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === "PASS").length,
      failed: results.filter(r => r.status === "FAIL").length
    };

    return { summary, results };
  }
);
