"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  Brain,
  Command,
  Frame,
  GalleryVerticalEnd,
  Layers3,
  LifeBuoy,
  Map,
  MessageSquare,
  PieChart,
  Send,
  Settings2,
  Store,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ROUTES } from "@/lib/constants/ROUTES"
import { NavSecondary } from "./nav-secondary"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: ROUTES.HOME ?? "/",
      icon: Layers3,
      showItems: false,
    },

    {
      title: "Agents",
      url: ROUTES.AGENTS ?? "/agents",
      icon: Bot,
      showItems: false,
    },

    {
      title: "Memory",
      url: ROUTES.MEMORY ?? "/memory",
      icon: Brain,
      showItems: false,
    },

    {
      title: "Marketplace",
      url: ROUTES.MARKETPLACE ?? "/marketplace",
      icon: Store,
      showItems: true,

      items: [
        {
          title: "Discover",
          url: ROUTES.MARKETPLACE ?? "/marketplace",
        },
        {
          title: "Integrations",
          url: ROUTES.INTEGRATIONS ?? "/integrations",
        },
        {
          title: "Plugins",
          url: ROUTES.PLUGINS ?? "/plugins",
        },
        {
          title: "Skills",
          url: ROUTES.SKILLS ?? "/skills",
        },
        {
          title: "Templates",
          url: ROUTES.TEMPLATES ?? "/templates",
        },
      ],
    },

    {
      title: "Settings",
      url: ROUTES.SETTINGS,
      icon: Settings2,
      showItems: false,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="w-full border-t">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
