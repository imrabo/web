import { useState } from "react"
import { ArrowUp, Paperclip } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

import {
  useMessagesQuery,
  useCreateMessageMutation,
} from "@/features/messages/hooks/useMessages"

import { MessageRole, type Message } from "@/features/messages/types"

export default function ChatPage() {
  const [message, setMessage] = useState("")

  const { data: messages = [], isLoading } = useMessagesQuery()

  const createMessageMutation = useCreateMessageMutation()

  const handleSendMessage = async () => {
    const content = message.trim()

    if (!content || createMessageMutation.isPending) {
      return
    }

    setMessage("")

    await createMessageMutation.mutateAsync({
      conversationId: 1,
      workspaceId: 1,
      role: MessageRole.User,
      content,
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const renderMessage = (item: Message) => {
    const isUser = item.role === MessageRole.User

    if (item.role === MessageRole.System || item.role === MessageRole.Tool) {
      return null
    }

    return (
      <div key={item.id} className={isUser ? "flex justify-end" : "flex gap-4"}>
        {isUser ? (
          <div className="max-w-[80%] rounded-3xl bg-primary px-5 py-3 text-primary-foreground">
            <p className="whitespace-pre-wrap">{item.content}</p>
          </div>
        ) : (
          <>
            <Avatar className="shrink-0">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>

            <div className="max-w-3xl space-y-2">
              <p className="font-medium">Assistant</p>

              <p className="leading-7 whitespace-pre-wrap">{item.content}</p>

              {item.status === "streaming" && (
                <span className="text-sm text-muted-foreground">
                  Generating...
                </span>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  const hasMessages = messages.data?.length > 0

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-8">
          {!hasMessages && !isLoading ? (
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
          ) : (
            <div className="space-y-8 py-8">{messages.map(renderMessage)}</div>
          )}

          {isLoading && (
            <div className="flex gap-4 py-8">
              <Avatar className="shrink-0">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>

              <div className="text-sm text-muted-foreground">
                Loading messages...
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
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI..."
              disabled={createMessageMutation.isPending}
              className="min-h-[80px] resize-none border-0 shadow-none focus-visible:ring-0"
            />

            <div className="flex items-center justify-between border-t px-3 py-3">
              <div className="flex items-center gap-2">
                <Button type="button" size="icon" variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Button type="button" variant="ghost" size="sm">
                  GPT-4.1
                </Button>
              </div>

              <Button
                type="button"
                size="icon"
                className="rounded-full"
                disabled={!message.trim() || createMessageMutation.isPending}
                onClick={handleSendMessage}
              >
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
