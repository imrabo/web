# ImRabo Workspace — Open Core Architecture

## Product direction

ImRabo Workspace is the user-facing workspace and collaboration surface for the ImRabo ecosystem. The target business model is **Open Core + Managed Cloud + Enterprise Self-Hosted**.

This document records boundaries and contracts. It does not claim that backend enforcement exists until the backend exposes and enforces the corresponding APIs.

## Deployment editions

### Community (open core)
- Local-first and self-hostable workspace.
- BYOK provider configurations.
- Chat, agents, MCP/connector configuration and execution supported by the deployed instance.
- Personal workspaces and self-managed organizations.
- Basic authentication through the deployment's configured identity provider.
- No dependency on ImRabo Cloud for core operation.

### ImRabo Cloud
- Hosted workspace, sync and backup.
- Managed AI gateway and usage metering.
- Hosted connector execution where enabled.
- Organization collaboration and subscription entitlements.
- Central account identity and billing.

### Enterprise
- Customer-controlled or private deployment.
- Enterprise identity federation (OIDC/SAML when supported).
- Advanced governance, audit, policy and support capabilities.
- Commercial extensions and contractual entitlements.

## Domain model

Do not equate users, organizations and workspaces.

- **User**: a human identity in one identity realm.
- **Organization**: personal or business ownership boundary.
- **Organization membership**: user, organization, role, status and invitation lifecycle.
- **Workspace**: resource namespace belonging to an organization.
- **Workspace membership**: scoped access to a workspace.
- **Subscription**: commercial agreement owned by an organization, not an individual user.
- **Entitlement**: effective permission to use a platform capability; computed by the backend.
- **Usage event**: immutable record of a billable or quota-relevant operation.
- **Credential reference**: opaque reference to encrypted secret material, never a plaintext secret in shared workspace metadata.

A user may belong to multiple organizations and multiple workspaces. A personal organization and its workspace must remain intact when the user joins a Team or Enterprise organization.

## Authorization

For every protected request, the backend must validate:
1. authenticated identity and identity realm;
2. active organization membership;
3. workspace membership or resource-specific permission;
4. requested action against role/policy;
5. applicable plan entitlement and quota.

A frontend route guard is only a UX control. It is not an authorization boundary. Never trust an organization ID, workspace ID, role, plan, usage balance or entitlement supplied by the browser.

## Billing and AI execution

- BYOK and ImRabo-managed AI are distinct execution modes.
- BYOK provider charges are made by the provider to the user; ImRabo-managed credits are not deducted.
- Managed AI requests must pass through the backend AI Gateway.
- The backend validates entitlement, quota, rate limits and credit availability before execution.
- Record provider, model, input/output tokens, latency, retry count, estimated provider cost and customer credit debit independently.
- Credit debits and adjustments require an append-only ledger and idempotency keys.
- Never calculate or enforce billable usage only in the browser.

## Local-first and sync

- Guest/local mode must remain useful without ImRabo Cloud authentication.
- Cloud sync is opt-in and explicit.
- Do not upload provider API keys, MCP credentials or other secrets implicitly during migration.
- Migrate local resources with a preview, conflict strategy and per-category consent.
- Store only secret references in shared resources. Encrypt secret material using server-side key management when cloud storage is required.
- Provide export and deletion paths appropriate to the deployment's retention policy.

## API integration contract

The workspace client must use the backend as the source of truth for identity, memberships, resources, subscriptions and entitlements. API origin is public configuration only; no privileged keys belong in VITE_* variables.

Recommended API resource families (final routes must be aligned with backend implementation):
- `/api/v1/me`
- `/api/v1/organizations`
- `/api/v1/organizations/:organizationId/members`
- `/api/v1/organizations/:organizationId/workspaces`
- `/api/v1/workspaces/:workspaceId`
- `/api/v1/workspaces/:workspaceId/agents`
- `/api/v1/workspaces/:workspaceId/connectors`
- `/api/v1/organizations/:organizationId/subscription`
- `/api/v1/organizations/:organizationId/entitlements`
- `/api/v1/organizations/:organizationId/usage`

These are proposed API contracts, not assertions that those endpoints already exist.

## Frontend responsibilities

- Display current organization/workspace context.
- Provide organization and workspace switching.
- Display role and entitlements returned by the backend.
- Request server-side actions and render authoritative results.
- Keep local resources available when cloud is unavailable.
- Show whether a resource is local, synced or cloud-managed.
- Do not infer paid access from locally cached plan names.

## Non-goals

- This client does not implement billing, authorization, secret encryption or AI usage enforcement.
- This repository does not contain the ImRabo platform operator console.
- The workspace app must not expose support/operator access to customer conversations or credentials by default.

## Delivery sequence

1. Align API contracts with backend.
2. Add organization/workspace context and switching.
3. Implement membership-aware navigation and access states.
4. Implement local-to-cloud migration UX.
5. Add plan and usage views backed by server entitlements.
6. Add Team collaboration UX.
7. Add enterprise identity and policy UX only when backend support exists.
