import { api } from "encore.dev/api";
import { semDB } from './db';

interface PlanSummary {
  id: string;
  brandWebsite: string;
  totalEstimatedCost: number;
  expectedConversions: number;
  keywordCount: number;
  createdAt: Date;
}

interface ListPlansResponse {
  plans: PlanSummary[];
}

// Lists all SEM plans with summary information.
export const listPlans = api<void, ListPlansResponse>(
  { expose: true, method: "GET", path: "/sem/plans" },
  async () => {
    try {
      const planRows = await semDB.queryAll<{
        id: string;
        brand_website: string;
        total_estimated_cost: number;
        expected_conversions: number;
        created_at: Date;
      }>`
        SELECT id, brand_website, total_estimated_cost, expected_conversions, created_at
        FROM sem_plans
        ORDER BY created_at DESC
      `;

      const plans: PlanSummary[] = [];
      for (const planRow of planRows) {
        const keywordCountRow = await semDB.queryRow<{count: number}>`
          SELECT COUNT(*) as count FROM keywords WHERE sem_plan_id = ${planRow.id}
        `;

        plans.push({
          id: planRow.id,
          brandWebsite: planRow.brand_website,
          totalEstimatedCost: planRow.total_estimated_cost,
          expectedConversions: planRow.expected_conversions,
          keywordCount: keywordCountRow?.count || 0,
          createdAt: planRow.created_at
        });
      }

      return { plans };
    } catch (error) {
      console.error('Error listing SEM plans:', error);
      throw error;
    }
  }
);
