"use client"

import { Settings } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Link } from "react-router-dom"
import { ROUTES } from "@/lib/constants/ROUTES"

export function NavUser() {
  const { user } = useAuth()

  return (
    <SidebarMenu className="w-full">
      <SidebarMenuItem className="w-full px-1">
        <SidebarMenuButton
          size="lg"
          className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 border-none">
            {/* <AvatarImage src={user?.avatar} alt={user?.first_name} /> */}
            <AvatarFallback className="border-none bg-muted text-muted-foreground">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
          <Link
            to={ROUTES.SETTINGS}
            className="ml-auto flex items-center space-x-2"
          >
            <Settings className="ml-auto size-4" />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
