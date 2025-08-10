import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface DatabaseConfig {
  name: string;
  migrations_path: string;
}

interface CampaignConfig {
  default_budgets: {
    shopping: number;
    search: number;
    pmax: number;
  };
  conversion_rate: number;
  default_cpc: number;
}

interface KeywordConfig {
  min_search_volume: number;
  sample_keywords: string[];
}

interface AnalysisConfig {
  competition_levels: string[];
  intent_types: string[];
  theme_patterns: Array<{
    name: string;
    patterns: string[];
  }>;
}

interface ShoppingConfig {
  product_categories: string[];
  priority_thresholds: {
    high_conversions: number;
    medium_conversions: number;
    high_cpc_threshold: number;
    medium_cpc_threshold: number;
  };
}

interface LoggingConfig {
  level: string;
  format: string;
}

interface AppConfig {
  name: string;
  version: string;
  environment: string;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  campaigns: CampaignConfig;
  keywords: KeywordConfig;
  analysis: AnalysisConfig;
  shopping: ShoppingConfig;
  logging: LoggingConfig;
}

class ConfigLoader {
  private static instance: Config | null = null;

  static load(): Config {
    if (this.instance) {
      return this.instance;
    }

    // Always use default config to avoid file system issues during startup
    this.instance = this.getDefaultConfig();
    console.log('Using default configuration for reliable startup');
    return this.instance;
  }

  private static getDefaultConfig(): Config {
    return {
      app: {
        name: "SEM Plan Builder",
        version: "1.0.0",
        environment: "development"
      },
      database: {
        name: "sem",
        migrations_path: "./migrations"
      },
      campaigns: {
        default_budgets: {
          shopping: 1000,
          search: 2000,
          pmax: 1500
        },
        conversion_rate: 0.02,
        default_cpc: 3.0
      },
      keywords: {
        min_search_volume: 500,
        sample_keywords: [
          "digital marketing services",
          "seo optimization",
          "ppc advertising",
          "social media marketing",
          "content marketing",
          "email marketing",
          "web design",
          "brand strategy",
          "online advertising",
          "marketing automation",
          "conversion optimization",
          "google ads management",
          "facebook advertising",
          "instagram marketing",
          "linkedin marketing",
          "video marketing",
          "influencer marketing",
          "affiliate marketing",
          "marketing analytics",
          "customer acquisition"
        ]
      },
      analysis: {
        competition_levels: ["LOW", "MEDIUM", "HIGH"],
        intent_types: ["BRAND", "CATEGORY", "COMPETITOR", "LOCATION", "LONG_TAIL"],
        theme_patterns: [
          {
            name: "Digital Marketing Services",
            patterns: ["digital", "marketing", "online", "internet"]
          },
          {
            name: "SEO & Optimization",
            patterns: ["seo", "optimization", "search engine", "ranking"]
          },
          {
            name: "Advertising & PPC",
            patterns: ["advertising", "ppc", "ads", "campaign"]
          },
          {
            name: "Social Media Marketing",
            patterns: ["social", "facebook", "instagram", "twitter", "linkedin"]
          },
          {
            name: "Content & Email Marketing",
            patterns: ["content", "email", "newsletter", "blog"]
          },
          {
            name: "Web Design & Development",
            patterns: ["web", "website", "design", "development"]
          }
        ]
      },
      shopping: {
        product_categories: [
          "Electronics & Technology",
          "Health & Beauty",
          "Home & Garden",
          "Sports & Outdoors",
          "Clothing & Accessories",
          "Books & Media",
          "Automotive",
          "Food & Beverages"
        ],
        priority_thresholds: {
          high_conversions: 10,
          medium_conversions: 5,
          high_cpc_threshold: 3,
          medium_cpc_threshold: 5
        }
      },
      logging: {
        level: "info",
        format: "json"
      }
    };
  }
}

export const config = ConfigLoader.load();
