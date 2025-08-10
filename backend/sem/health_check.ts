import { api } from "encore.dev/api";
import { semDB } from './db';
import { config } from './configLoader';

interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  checks: {
    database: "ok" | "error";
    config: "ok" | "error";
  };
  version: string;
}

// Health check endpoint to verify system status.
export const healthCheck = api<void, HealthCheckResponse>(
  { expose: true, method: "GET", path: "/sem/health" },
  async () => {
    const checks = {
      database: "ok" as const,
      config: "ok" as const
    };

    // Test database connection
    try {
      await semDB.queryRow`SELECT 1 as test`;
    } catch (error) {
      console.error('Database health check failed:', error);
      checks.database = "error";
    }

    // Test config loading
    try {
      if (!config.app.name || !config.keywords.sample_keywords.length) {
        throw new Error('Invalid config');
      }
    } catch (error) {
      console.error('Config health check failed:', error);
      checks.config = "error";
    }

    const status = checks.database === "ok" && checks.config === "ok" ? "healthy" : "unhealthy";

    return {
      status,
      timestamp: new Date().toISOString(),
      checks,
      version: config.app.version
    };
  }
);
