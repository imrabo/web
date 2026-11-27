import { Cloud, HardDrive, Server } from "lucide-react";
import type { DeploymentMode } from "../types/tenant.types";

const labels: Record<DeploymentMode, { title: string; description: string; icon: typeof Cloud }> = {
  LOCAL: { title: "Local workspace", description: "Data and BYOK credentials remain on this device.", icon: HardDrive },
  SELF_HOSTED: { title: "Self-hosted", description: "This instance is operated by your organization.", icon: Server },
  IMRABO_CLOUD: { title: "ImRabo Cloud", description: "Workspace services are managed by ImRabo.", icon: Cloud },
  PRIVATE_CLOUD: { title: "Private cloud", description: "This environment is deployed for your organization.", icon: Server },
};

export function DeploymentModeNotice({ mode }: { mode: DeploymentMode }) {
  const config = labels[mode];
  const Icon = config.icon;
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-medium">{config.title}</p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
    </div>
  );
}
