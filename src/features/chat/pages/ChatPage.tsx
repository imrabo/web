import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Paperclip, ArrowUp } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="mx-auto flex h-full max-w-4xl flex-col px-6 py-8">
          {/* Empty State */}
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-xl text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                How can I help today?
              </h1>

              <p className="mt-3 text-muted-foreground">
                Ask anything, upload files, or start a conversation.
              </p>
            </div>
          </div>

          {/* Example Messages (remove when empty) */}

          {false && (
            <div className="space-y-8 py-8">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-3xl bg-primary px-5 py-3 text-primary-foreground">
                  Explain React Server Components.
                </div>
              </div>

              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>

                <div className="max-w-3xl space-y-2">
                  <p className="font-medium">Assistant</p>

                  <p className="leading-7">
                    React Server Components allow rendering components on the
                    server without shipping their JavaScript to the client...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Composer */}
      <div className="border-t bg-background">
        <div className="mx-auto max-w-4xl p-4">
          <div className="rounded-3xl border bg-background shadow-sm">
            <Textarea
              placeholder="Message AI..."
              className="min-h-[80px] resize-none border-0 shadow-none focus-visible:ring-0"
            />

            <div className="flex items-center justify-between border-t px-3 py-3">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm">
                  GPT-4.1
                </Button>
              </div>

              <Button size="icon" className="rounded-full">
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
