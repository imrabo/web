import { apiClient } from "@/lib/api/client";
import type {
  Entitlement,
  OrganizationSummary,
  UsageSummary,
  WorkspaceSummary,
} from "../types/tenant.types";

export const tenantService = {
  getMyOrganizations: () =>
    apiClient.get<OrganizationSummary[]>("/api/v1/me/organizations"),

  getOrganizationWorkspaces: (organizationId: string) =>
    apiClient.get<WorkspaceSummary[]>(
      `/api/v1/organizations/${encodeURIComponent(organizationId)}/workspaces`,
    ),

  getEntitlements: (organizationId: string) =>
    apiClient.get<Entitlement[]>(
      `/api/v1/organizations/${encodeURIComponent(organizationId)}/entitlements`,
    ),

  getUsage: (organizationId: string) =>
    apiClient.get<UsageSummary>(
      `/api/v1/organizations/${encodeURIComponent(organizationId)}/usage`,
    ),
};
