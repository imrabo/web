import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useMyOrganizations, useOrganizationWorkspaces } from "../hooks/useTenantContext";
import type { OrganizationSummary, WorkspaceSummary } from "../types/tenant.types";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface OrganizationWorkspaceSwitcherProps {
  value?: { organizationId: string; workspaceId?: string };
  onChange: (value: { organization: OrganizationSummary; workspace?: WorkspaceSummary }) => void;
}

/** Selection is UI context only. Backend must re-authorize every request. */
export function OrganizationWorkspaceSwitcher({ value, onChange }: OrganizationWorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { data: organizations = [], isLoading, isError } = useMyOrganizations();
  const selectedOrganization = useMemo(
    () => organizations.find((item) => item.id === value?.organizationId) ?? organizations[0],
    [organizations, value?.organizationId],
  );
  const { data: workspaces = [], isLoading: workspacesLoading } =
    useOrganizationWorkspaces(selectedOrganization?.id);
  const selectedWorkspace = workspaces.find((item) => item.id === value?.workspaceId) ??
    workspaces.find((item) => item.isDefault) ?? workspaces[0];

  useEffect(() => {
    if (selectedOrganization && value?.organizationId !== selectedOrganization.id) {
      onChange({ organization: selectedOrganization, workspace: selectedWorkspace });
    } else if (selectedOrganization && selectedWorkspace && value?.workspaceId !== selectedWorkspace.id) {
      onChange({ organization: selectedOrganization, workspace: selectedWorkspace });
    }
  }, [selectedOrganization, selectedWorkspace, value?.organizationId, value?.workspaceId, onChange]);

  if (isLoading) {
    return <Button variant="outline" size="sm" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading workspace</Button>;
  }
  if (isError) {
    return <p className="text-xs text-destructive">Unable to load organizations. Refresh and try again.</p>;
  }
  if (!organizations.length) {
    return <p className="text-xs text-muted-foreground">No organization membership found.</p>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" size="sm" className="max-w-[260px] justify-between" />}>
        <span className="truncate">{selectedOrganization?.name ?? "Select organization"}{selectedWorkspace ? ` / ${selectedWorkspace.name}` : ""}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Find organization or workspace..." />
          <CommandList>
            <CommandEmpty>No accessible organization found.</CommandEmpty>
            {organizations.map((organization) => (
              <CommandGroup key={organization.id} heading={`${organization.name} · ${organization.role}`}>
                <CommandItem
                  value={`${organization.name} ${organization.slug}`}
                  onSelect={() => {
                    onChange({ organization });
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedOrganization?.id === organization.id ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{organization.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{organization.plan ?? organization.kind}</span>
                </CommandItem>
                {organization.id === selectedOrganization?.id && workspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    value={`${organization.name} ${workspace.name} ${workspace.slug}`}
                    onSelect={() => {
                      onChange({ organization, workspace });
                      setOpen(false);
                    }}
                  >
                    <span className="ml-6 truncate">{workspace.name}</span>
                    {workspace.id === selectedWorkspace?.id && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
                {organization.id === selectedOrganization?.id && workspacesLoading && (
                  <CommandItem disabled><Loader2 className="mr-2 h-3 w-3 animate-spin" />Loading workspaces</CommandItem>
                )}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
