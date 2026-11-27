/** Multi-tenant contracts shared by workspace UI features.
 * These types describe API data; they do not grant access or enforce policy.
 */
export type OrganizationKind = "PERSONAL" | "TEAM" | "ENTERPRISE";
export type OrganizationStatus = "ACTIVE" | "SUSPENDED" | "PENDING";
export type OrganizationRole = "OWNER" | "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER";
export type MembershipStatus = "ACTIVE" | "INVITED" | "SUSPENDED" | "REMOVED";
export type WorkspaceStatus = "ACTIVE" | "ARCHIVED";
export type DeploymentMode = "LOCAL" | "SELF_HOSTED" | "IMRABO_CLOUD" | "PRIVATE_CLOUD";
export type BillingMode = "BYOK" | "MANAGED" | "MIXED";
export type PlanCode = "COMMUNITY" | "SOLO" | "TEAM" | "ENTERPRISE";

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  kind: OrganizationKind;
  status: OrganizationStatus;
  role: OrganizationRole;
  membershipStatus: MembershipStatus;
  plan?: PlanCode;
  deploymentMode?: DeploymentMode;
}

export interface WorkspaceSummary {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  status: WorkspaceStatus;
  role?: OrganizationRole;
  isDefault?: boolean;
}

export interface Entitlement {
  key: string;
  enabled: boolean;
  limit?: number | null;
  usage?: number;
}

export interface OrganizationContext {
  organization: OrganizationSummary;
  workspace?: WorkspaceSummary;
}

export interface UsageSummary {
  periodStart: string;
  periodEnd: string;
  billingMode: BillingMode;
  inputTokens: number;
  outputTokens: number;
  managedCreditsUsed: number;
  managedCreditsRemaining?: number | null;
}
