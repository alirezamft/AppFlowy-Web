import { APIResponse, executeAPIRequest, getAxios } from './core';

export type PortfolioHealth = 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' | 'UNKNOWN';

export interface ProgressRollup {
  done_leaf_count: number;
  in_scope_leaf_count: number;
  progress_percent: number;
}

export interface OutcomeMetricSummary {
  name: string;
  value?: number | null;
  target_value?: number | null;
  unit?: string | null;
}

export interface ProductOverviewItem {
  product_id: string;
  product_key: string;
  name: string;
  color_token: string;
  health: PortfolioHealth;
  delivery: ProgressRollup;
  outcome?: OutcomeMetricSummary | null;
}

export interface DomainOverviewResponse {
  api_version: string;
  schema_version: string;
  workspace_id: string;
  delivery: ProgressRollup;
  products: ProductOverviewItem[];
  at_risk_initiative_count: number;
  off_track_initiative_count: number;
  open_critical_blocker_count: number;
  critical_dependency_count: number;
  projection_updated_at?: string | null;
}

export async function getPortfolioOverview(workspaceId: string): Promise<DomainOverviewResponse> {
  return executeAPIRequest<DomainOverviewResponse>(() =>
    getAxios()?.get<APIResponse<DomainOverviewResponse>>(`/api/portfolio/v1/${workspaceId}/overview`)
  );
}

