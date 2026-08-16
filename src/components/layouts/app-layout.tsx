"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { CommandIcon, PanelLeft, PanelRight, Search, X } from "lucide-react"
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
          <header className="flex h-16 items-center justify-between border-b px-4">
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
                <Button
                  variant="secondary"
                  size="icon"
                  className="flex items-center gap-0.5 transition-colors hover:text-foreground"
                >
                  <CommandIcon height={8} width={8} className="h-8 w-8" />
                  <span>K</span>
                </Button>
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
          {/* Bottom details / status bar */}
          <footer className="flex h-9 shrink-0 items-center justify-between border-t bg-background px-3 text-xs text-muted-foreground">
            {/* Left: important workspace details */}
            <div className="flex min-w-0 items-center gap-4">
              <button className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span>Connected</span>
              </button>

              <div className="hidden h-4 w-px bg-border sm:block" />

              <span className="hidden sm:inline">
                Workspace: <span className="text-foreground">Acme Inc</span>
              </span>

              <div className="hidden h-4 w-px bg-border md:block" />

              <span className="hidden md:inline">
                Model: <span className="text-foreground">GPT-4.1</span>
              </span>
            </div>

            {/* Right: useful quick details */}
            <div className="flex shrink-0 items-center gap-3">
              <button className="transition-colors hover:text-foreground">
                Notifications
              </button>

              <div className="h-4 w-px bg-border" />

              <Button
                variant="ghost"
                size="icon"
                className="flex items-center gap-0.5 transition-colors hover:text-foreground"
              >
                <CommandIcon height={8} width={8} className="h-8 w-8" />
                <span>K</span>
              </Button>
            </div>
          </footer>
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
