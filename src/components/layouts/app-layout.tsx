"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { PanelLeft, PanelRight, Search, X } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

function SidebarSync({
  desiredOpen,
  children,
}: {
  desiredOpen: boolean
  children: React.ReactNode
}) {
  const { open, toggleSidebar } = useSidebar()

  React.useEffect(() => {
    if (desiredOpen && !open) {
      toggleSidebar()
    } else if (!desiredOpen && open) {
      toggleSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desiredOpen, open])

  return <>{children}</>
}

export default function AppLayout() {
  const [leftOpen, setLeftOpen] = React.useState(true)
  const [rightOpen, setRightOpen] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-full w-full overflow-hidden">
        {/* Left Sidebar */}
        <SidebarProvider
          defaultOpen={leftOpen}
          className="max-h-dvh w-fit overflow-hidden"
        >
          <SidebarSync desiredOpen={leftOpen}>
            <AppSidebar />
          </SidebarSync>
        </SidebarProvider>

        {/* Main Content */}
        <div className="flex w-full min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="-ml-1"
                onClick={() => setLeftOpen((v) => !v)}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-1 justify-center px-6">
              <Button
                variant="outline"
                className="h-9 w-full max-w-md justify-between font-normal text-muted-foreground"
                onClick={() => setOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search...</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-medium">
                  ⌘K
                </kbd>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="-mr-1"
                onClick={() => setRightOpen((v) => !v)}
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="h-full w-full flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>

        {/* Right panel — in-flow, animated width, no portal/overlay */}
        <div
          className={cn(
            "h-full shrink-0 overflow-hidden border-l bg-background transition-[width] duration-200 ease-in-out",
            rightOpen ? "w-[240px] sm:w-[320px]" : "w-0"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="font-semibold">Details</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRightOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex h-[calc(100%-4rem)] flex-col gap-4 overflow-auto p-4">
            {/* Replace with your actual right-panel content */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video h-12 w-full shrink-0 rounded-lg bg-muted/50"
              />
            ))}
          </div>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Dashboard</CommandItem>
              <CommandItem>Projects</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem>Create Project</CommandItem>
              <CommandItem>New File</CommandItem>
              <CommandItem>Logout</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
