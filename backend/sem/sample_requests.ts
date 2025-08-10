import { api } from "encore.dev/api";
import type { CreateSEMPlanRequest, GenerateKeywordsRequest } from './types';

interface SampleRequest {
  name: string;
  description: string;
  endpoint: string;
  method: string;
  data: any;
}

interface SampleRequestsResponse {
  requests: SampleRequest[];
}

// Provides sample API requests for testing the SEM system.
export const getSampleRequests = api<void, SampleRequestsResponse>(
  { expose: true, method: "GET", path: "/sem/test/sample-requests" },
  async () => {
    const requests: SampleRequest[] = [
      {
        name: "Create Digital Marketing Agency Plan",
        description: "Sample request for creating a comprehensive SEM plan for a digital marketing agency",
        endpoint: "/sem/plans",
        method: "POST",
        data: {
          inputs: {
            brandWebsite: "https://digitalmarketingpro.com",
            competitorWebsite: "https://marketingexperts.com",
            serviceLocations: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
            budgets: {
              shopping: 2500,
              search: 5000,
              pmax: 3000
            }
          },
          seedKeywords: [
            "digital marketing services",
            "seo optimization",
            "ppc advertising",
            "social media marketing",
            "content marketing",
            "email marketing automation",
            "conversion rate optimization",
            "google ads management",
            "facebook advertising",
            "marketing analytics"
          ]
        } as CreateSEMPlanRequest
      },
      {
        name: "Create E-commerce Store Plan",
        description: "Sample request for an e-commerce business focusing on shopping campaigns",
        endpoint: "/sem/plans", 
        method: "POST",
        data: {
          inputs: {
            brandWebsite: "https://trendy-fashion-store.com",
            competitorWebsite: "https://fashion-competitor.com",
            serviceLocations: ["United States", "Canada"],
            budgets: {
              shopping: 8000,
              search: 3000,
              pmax: 4000
            }
          },
          seedKeywords: [
            "women's clothing",
            "men's fashion",
            "trendy outfits",
            "designer clothes",
            "casual wear",
            "formal attire",
            "accessories",
            "shoes",
            "handbags",
            "jewelry"
          ]
        } as CreateSEMPlanRequest
      },
      {
        name: "Create Local Service Business Plan",
        description: "Sample request for a local service business with location-based targeting",
        endpoint: "/sem/plans",
        method: "POST", 
        data: {
          inputs: {
            brandWebsite: "https://local-plumbing-services.com",
            competitorWebsite: "https://city-plumbers.com",
            serviceLocations: ["Miami, FL", "Fort Lauderdale, FL", "West Palm Beach, FL"],
            budgets: {
              shopping: 500,
              search: 3000,
              pmax: 1500
            }
          },
          seedKeywords: [
            "plumbing services",
            "emergency plumber",
            "drain cleaning",
            "pipe repair",
            "water heater installation",
            "bathroom plumbing",
            "kitchen plumbing",
            "leak detection",
            "sewer line repair",
            "plumbing contractor"
          ]
        } as CreateSEMPlanRequest
      },
      {
        name: "Create SaaS Company Plan",
        description: "Sample request for a software-as-a-service company",
        endpoint: "/sem/plans",
        method: "POST",
        data: {
          inputs: {
            brandWebsite: "https://project-management-saas.com",
            competitorWebsite: "https://competitor-pm-tool.com", 
            serviceLocations: ["Global"],
            budgets: {
              shopping: 0,
              search: 6000,
              pmax: 4000
            }
          },
          seedKeywords: [
            "project management software",
            "team collaboration tools",
            "task management app",
            "project tracking",
            "agile project management",
            "team productivity",
            "project planning software",
            "workflow management",
            "project dashboard",
            "team communication"
          ]
        } as CreateSEMPlanRequest
      },
      {
        name: "Generate Keywords for Fitness Business",
        description: "Sample request for generating keywords for a fitness and wellness business",
        endpoint: "/sem/keywords/generate",
        method: "POST",
        data: {
          website: "https://fitness-wellness-center.com",
          competitorWebsite: "https://competitor-gym.com",
          seedKeywords: [
            "personal training",
            "fitness classes",
            "gym membership",
            "weight loss program",
            "strength training",
            "cardio workout",
            "yoga classes",
            "nutrition coaching",
            "fitness equipment",
            "wellness center"
          ]
        } as GenerateKeywordsRequest
      },
      {
        name: "Generate Keywords for Tech Startup",
        description: "Sample request for generating keywords for a technology startup",
        endpoint: "/sem/keywords/generate", 
        method: "POST",
        data: {
          website: "https://ai-automation-startup.com",
          seedKeywords: [
            "artificial intelligence",
            "machine learning",
            "automation software",
            "ai solutions",
            "business automation",
            "intelligent systems",
            "data analytics",
            "predictive analytics",
            "ai consulting",
            "automation tools"
          ]
        } as GenerateKeywordsRequest
      },
      {
        name: "Create Restaurant Chain Plan",
        description: "Sample request for a restaurant chain with multiple locations",
        endpoint: "/sem/plans",
        method: "POST",
        data: {
          inputs: {
            brandWebsite: "https://gourmet-pizza-chain.com",
            competitorWebsite: "https://competitor-pizza.com",
            serviceLocations: [
              "Boston, MA",
              "Cambridge, MA", 
              "Somerville, MA",
              "Newton, MA",
              "Brookline, MA"
            ],
            budgets: {
              shopping: 1500,
              search: 4000,
              pmax: 2500
            }
          },
          seedKeywords: [
            "pizza delivery",
            "gourmet pizza",
            "italian restaurant",
            "pizza near me",
            "online pizza order",
            "pizza catering",
            "fresh pizza",
            "wood fired pizza",
            "pizza restaurant",
            "family dining"
          ]
        } as CreateSEMPlanRequest
      },
      {
        name: "Create Healthcare Practice Plan",
        description: "Sample request for a healthcare practice with specialized services",
        endpoint: "/sem/plans",
        method: "POST",
        data: {
          inputs: {
            brandWebsite: "https://advanced-dental-care.com",
            competitorWebsite: "https://competitor-dentist.com",
            serviceLocations: ["San Francisco, CA", "Oakland, CA", "San Jose, CA"],
            budgets: {
              shopping: 800,
              search: 3500,
              pmax: 2000
            }
          },
          seedKeywords: [
            "dental implants",
            "cosmetic dentistry",
            "teeth whitening",
            "orthodontics",
            "dental cleaning",
            "root canal treatment",
            "dental emergency",
            "family dentist",
            "pediatric dentistry",
            "oral surgery"
          ]
        } as CreateSEMPlanRequest
      }
    ];

    return { requests };
  }
);

interface TestScenario {
  name: string;
  description: string;
  steps: string[];
  expectedResults: string[];
}

interface TestScenariosResponse {
  scenarios: TestScenario[];
}

// Provides test scenarios for manual testing of the SEM system.
export const getTestScenarios = api<void, TestScenariosResponse>(
  { expose: true, method: "GET", path: "/sem/test/scenarios" },
  async () => {
    const scenarios: TestScenario[] = [
      {
        name: "End-to-End Plan Creation",
        description: "Complete workflow from plan creation to data export",
        steps: [
          "1. Create a new SEM plan using POST /sem/plans with sample data",
          "2. Retrieve the created plan using GET /sem/plans/{id}",
          "3. Verify all components are present (keywords, ad groups, themes, shopping bids)",
          "4. Check that budget calculations are accurate",
          "5. Verify keyword filtering and intent classification",
          "6. Test data export functionality in the frontend"
        ],
        expectedResults: [
          "Plan created successfully with unique ID",
          "All plan data retrieved correctly",
          "Keywords generated with proper search volumes and competition levels",
          "Ad groups organized by intent type",
          "Search themes created with relevant keywords",
          "Shopping bids calculated with priority levels",
          "Budget totals match input values",
          "Expected conversions calculated based on conversion rate"
        ]
      },
      {
        name: "Keyword Generation Testing",
        description: "Test keyword generation with various inputs",
        steps: [
          "1. Test keyword generation with seed keywords using POST /sem/keywords/generate",
          "2. Test keyword generation without seed keywords (using config defaults)",
          "3. Test with different website types (e-commerce, service, SaaS)",
          "4. Verify keyword variations and intent classification",
          "5. Check search volume filtering based on config minimum"
        ],
        expectedResults: [
          "Keywords generated from seed keywords with variations",
          "Default keywords used when no seeds provided",
          "Intent classification working correctly (BRAND, CATEGORY, etc.)",
          "Competition levels assigned appropriately",
          "Search volumes above configured minimum threshold",
          "Keyword variations include modifiers and long-tail terms"
        ]
      },
      {
        name: "Configuration System Testing",
        description: "Test configuration loading and validation",
        steps: [
          "1. Test with valid config.yaml file",
          "2. Test with missing config.yaml (should use defaults)",
          "3. Test with invalid config values",
          "4. Verify config values are used in keyword generation",
          "5. Test config validation for required fields"
        ],
        expectedResults: [
          "Configuration loaded successfully from file",
          "Default configuration used when file missing",
          "Invalid configurations rejected with clear error messages",
          "Config values properly applied in business logic",
          "All required fields validated on startup"
        ]
      },
      {
        name: "Database Operations Testing",
        description: "Test all database operations and data integrity",
        steps: [
          "1. Create test data using POST /sem/test/create-data",
          "2. Verify data integrity with foreign key relationships",
          "3. Test plan listing with GET /sem/plans",
          "4. Test plan retrieval with all related data",
          "5. Test data cleanup using DELETE /sem/test/clear-data"
        ],
        expectedResults: [
          "Test data created with all relationships intact",
          "Foreign key constraints working properly",
          "Plan listing returns summary information",
          "Plan details include all related keywords, ad groups, themes",
          "Data cleanup removes all test records"
        ]
      },
      {
        name: "Budget and Performance Calculations",
        description: "Test budget allocation and performance estimates",
        steps: [
          "1. Create plans with different budget allocations",
          "2. Verify total budget calculations",
          "3. Test conversion estimates based on CPC and conversion rate",
          "4. Test shopping bid calculations and priority assignment",
          "5. Verify budget distribution across campaign types"
        ],
        expectedResults: [
          "Total budgets calculated correctly",
          "Conversion estimates based on configured conversion rate",
          "Shopping priorities assigned based on performance thresholds",
          "CPC recommendations within reasonable ranges",
          "Budget allocations preserved in database"
        ]
      },
      {
        name: "Error Handling and Edge Cases",
        description: "Test system behavior with invalid inputs and edge cases",
        steps: [
          "1. Test plan creation with missing required fields",
          "2. Test with invalid website URLs",
          "3. Test with zero or negative budgets",
          "4. Test retrieval of non-existent plan IDs",
          "5. Test with extremely large or small input values"
        ],
        expectedResults: [
          "Appropriate error messages for missing fields",
          "URL validation working correctly",
          "Budget validation preventing invalid values",
          "404 errors for non-existent resources",
          "Graceful handling of edge case values"
        ]
      },
      {
        name: "Performance and Scalability Testing",
        description: "Test system performance with larger datasets",
        steps: [
          "1. Create multiple plans with large keyword sets",
          "2. Test plan listing performance with many plans",
          "3. Test keyword generation with large seed keyword lists",
          "4. Monitor database query performance",
          "5. Test concurrent plan creation requests"
        ],
        expectedResults: [
          "System handles large keyword sets efficiently",
          "Plan listing remains responsive with many plans",
          "Keyword generation scales with input size",
          "Database queries execute within reasonable time",
          "Concurrent requests handled properly"
        ]
      }
    ];

    return { scenarios };
  }
);
