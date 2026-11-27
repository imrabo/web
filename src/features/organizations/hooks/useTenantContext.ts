import { useQuery } from "@tanstack/react-query";
import { tenantService } from "../services/tenantService";

export const tenantQueryKeys = {
  organizations: ["tenant", "organizations"] as const,
  workspaces: (organizationId: string) =>
    ["tenant", "workspaces", organizationId] as const,
  entitlements: (organizationId: string) =>
    ["tenant", "entitlements", organizationId] as const,
  usage: (organizationId: string) => ["tenant", "usage", organizationId] as const,
};

export function useMyOrganizations() {
  return useQuery({
    queryKey: tenantQueryKeys.organizations,
    queryFn: tenantService.getMyOrganizations,
    staleTime: 60_000,
  });
}

export function useOrganizationWorkspaces(organizationId?: string) {
  return useQuery({
    queryKey: tenantQueryKeys.workspaces(organizationId ?? ""),
    queryFn: () => tenantService.getOrganizationWorkspaces(organizationId!),
    enabled: Boolean(organizationId),
    staleTime: 60_000,
  });
}

export function useOrganizationEntitlements(organizationId?: string) {
  return useQuery({
    queryKey: tenantQueryKeys.entitlements(organizationId ?? ""),
    queryFn: () => tenantService.getEntitlements(organizationId!),
    enabled: Boolean(organizationId),
    staleTime: 30_000,
  });
}

export function useOrganizationUsage(organizationId?: string) {
  return useQuery({
    queryKey: tenantQueryKeys.usage(organizationId ?? ""),
    queryFn: () => tenantService.getUsage(organizationId!),
    enabled: Boolean(organizationId),
    staleTime: 30_000,
  });
}
