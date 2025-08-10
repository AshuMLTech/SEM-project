export interface SEMInputs {
  brandWebsite: string;
  competitorWebsite: string;
  serviceLocations: string[];
  budgets: {
    shopping: number;
    search: number;
    pmax: number;
  };
}

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  topOfPageBidLow: number;
  topOfPageBidHigh: number;
  competition: 'LOW' | 'MEDIUM' | 'HIGH';
  intent: 'BRAND' | 'CATEGORY' | 'COMPETITOR' | 'LOCATION' | 'LONG_TAIL';
}

export interface AdGroup {
  name: string;
  keywords: KeywordData[];
  suggestedCPC: number;
  matchTypes: string[];
}

export interface SearchTheme {
  name: string;
  description: string;
  keywords: string[];
  suggestedBid: number;
}

export interface ShoppingBid {
  productCategory: string;
  suggestedCPC: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedConversions: number;
}

export interface SEMPlan {
  id: string;
  inputs: SEMInputs;
  keywords: KeywordData[];
  adGroups: AdGroup[];
  searchThemes: SearchTheme[];
  shoppingBids: ShoppingBid[];
  totalEstimatedCost: number;
  expectedConversions: number;
  createdAt: Date;
}

export interface CreateSEMPlanRequest {
  inputs: SEMInputs;
  seedKeywords?: string[];
}

export interface GenerateKeywordsRequest {
  website: string;
  competitorWebsite?: string;
  seedKeywords?: string[];
}

export interface KeywordAnalysisResponse {
  keywords: KeywordData[];
  totalKeywords: number;
  averageSearchVolume: number;
  averageCPC: number;
}
