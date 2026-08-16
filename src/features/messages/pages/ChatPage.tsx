import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"

import {
  AtSign,
  ArrowUp,
  Bold,
  Check,
  ChevronDown,
  Code,
  File,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Paperclip,
  Quote,
  Search,
  Smile,
  Sparkles,
  Strikethrough,
  Underline,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  useMessagesQuery,
  useCreateMessageMutation,
} from "@/features/messages/hooks/useMessages"

import { MessageRole, type Message } from "@/features/messages/types"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Mention from "@tiptap/extension-mention"
import Link from "@tiptap/extension-link"
import UnderlineExtension from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import Suggestion from "@tiptap/suggestion"

type MentionUser = {
  id: number
  name: string
  username: string
  avatar?: string
}

type SlashCommand = {
  id: string
  title: string
  description: string
  icon: string
  keywords: string[]
}

type Attachment = {
  id: string
  file: File
  preview?: string
}

type SuggestionState = {
  type: "mention" | "slash" | "reference" | null
  query: string
  items: Array<MentionUser | SlashCommand>
  index: number
  rect: DOMRect | null
}

const MOCK_USERS: MentionUser[] = [
  {
    id: 1,
    name: "Ali Khan",
    username: "ali",
  },
  {
    id: 2,
    name: "Alice Smith",
    username: "alice",
  },
  {
    id: 3,
    name: "John Doe",
    username: "john",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    username: "sarah",
  },
]

const SLASH_COMMANDS: SlashCommand[] = [
  {
    id: "summarize",
    title: "Summarize",
    description: "Summarize the current conversation",
    icon: "✨",
    keywords: ["summary", "shorten", "brief"],
  },
  {
    id: "search",
    title: "Search",
    description: "Search your workspace",
    icon: "🔍",
    keywords: ["find", "workspace"],
  },
  {
    id: "translate",
    title: "Translate",
    description: "Translate your message",
    icon: "🌐",
    keywords: ["language", "translation"],
  },
  {
    id: "code",
    title: "Code",
    description: "Insert a code block",
    icon: "💻",
    keywords: ["programming", "developer"],
  },
  {
    id: "file",
    title: "Attach file",
    description: "Attach a file to your message",
    icon: "📎",
    keywords: ["upload", "attachment"],
  },
  {
    id: "image",
    title: "Generate image",
    description: "Generate an image",
    icon: "🖼️",
    keywords: ["picture", "visual"],
  },
  {
    id: "model",
    title: "Change model",
    description: "Choose a different AI model",
    icon: "🧠",
    keywords: ["gpt", "model", "ai"],
  },
  {
    id: "clear",
    title: "Clear composer",
    description: "Clear the current message",
    icon: "🧹",
    keywords: ["reset", "delete"],
  },
]

const MODELS = [
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    description: "Fast & balanced",
  },
  {
    id: "gpt-5",
    name: "GPT-5",
    description: "Most capable",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    description: "Fast & economical",
  },
]

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🥳",
  "😊",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "🎉",
  "🚀",
  "✨",
  "🤔",
  "😎",
  "🙏",
  "👏",
  "💯",
  "👀",
  "💡",
  "✅",
]

function filterUsers(query: string) {
  const normalized = query.toLowerCase()

  return MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(normalized) ||
      user.username.toLowerCase().includes(normalized)
  )
}

function filterCommands(query: string) {
  const normalized = query.toLowerCase()

  return SLASH_COMMANDS.filter((command) => {
    const searchable = [
      command.id,
      command.title,
      command.description,
      ...command.keywords,
    ]
      .join(" ")
      .toLowerCase()

    return searchable.includes(normalized)
  })
}

function getSuggestionRect(editor: ReturnType<typeof useEditor>) {
  if (!editor) {
    return null
  }

  try {
    const { from } = editor.state.selection
    const start = editor.view.coordsAtPos(from)

    return new DOMRect(start.left, start.bottom, 0, 0)
  } catch {
    return null
  }
}

function getSuggestionType(
  editor: ReturnType<typeof useEditor>
): "mention" | "slash" | "reference" | null {
  if (!editor) {
    return null
  }

  const { from } = editor.state.selection

  const textBefore = editor.state.doc.textBetween(
    Math.max(0, from - 100),
    from,
    "\n",
    " "
  )

  const match = textBefore.match(/(^|\s)([@/#])([^\s]*)$/)

  if (!match) {
    return null
  }

  if (match[2] === "@") {
    return "mention"
  }

  if (match[2] === "/") {
    return "slash"
  }

  if (match[2] === "#") {
    return "reference"
  }

  return null
}

function ChatComposer({
  disabled,
  onSend,
}: {
  disabled?: boolean
  onSend: (content: string) => Promise<void>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [selectedModel, setSelectedModel] = useState("gpt-4.1")
  const [showModels, setShowModels] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [suggestion, setSuggestion] = useState<SuggestionState>({
    type: null,
    query: "",
    items: [],
    index: 0,
    rect: null,
  })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      UnderlineExtension,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Placeholder.configure({
        placeholder: "Message AI...",
      }),

      Mention.configure({
        HTMLAttributes: {
          class:
            "rounded-md bg-primary/10 px-1 py-0.5 font-medium text-primary",
        },

        suggestion: {
          char: "@",

          items: ({ query }: { query: string }) => {
            return filterUsers(query).slice(0, 8)
          },

          command: ({
            editor,
            range,
            props,
          }: {
            editor: any
            range: any
            props: MentionUser
          }) => {
            editor
              .chain()
              .focus()
              .insertContentAt(range, [
                {
                  type: "mention",
                  attrs: {
                    id: props.id,
                    label: props.name,
                  },
                },
                {
                  type: "text",
                  text: " ",
                },
              ])
              .run()
          },

          render: () => {
            return {
              onStart: () => {
                // UI is handled by React state below.
              },

              onUpdate: () => {},

              onKeyDown: () => false,

              onExit: () => {},
            }
          },
        },
      }),

      // Suggestion.configure({
      //   char: "/",

      //   items: ({ query }: { query: string }) => {
      //     return filterCommands(query).slice(0, 8)
      //   },

      //   allow: ({ state, range }: any) => {
      //     const $from = state.doc.resolve(range.from)

      //     return $from.parent.type.name === "paragraph"
      //   },
      // }),
    ],

    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[80px] max-h-[240px] overflow-y-auto px-5 py-4 outline-none",
      },

      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? [])

        if (files.length > 0) {
          addFiles(files)
        }

        return false
      },

      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? [])

        if (files.length > 0) {
          addFiles(files)
          return true
        }

        return false
      },

      handleKeyDown: (_view, event) => {
        if (disabled) {
          return true
        }

        if (suggestion.type) {
          if (event.key === "ArrowDown") {
            event.preventDefault()

            setSuggestion((current) => ({
              ...current,
              index:
                current.items.length === 0
                  ? 0
                  : (current.index + 1) % current.items.length,
            }))

            return true
          }

          if (event.key === "ArrowUp") {
            event.preventDefault()

            setSuggestion((current) => ({
              ...current,
              index:
                current.items.length === 0
                  ? 0
                  : current.index <= 0
                    ? current.items.length - 1
                    : current.index - 1,
            }))

            return true
          }

          if (event.key === "Escape") {
            event.preventDefault()
            closeSuggestions()
            return true
          }

          if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault()

            selectSuggestion()

            return true
          }
        }

        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault()
          void submit()
          return true
        }

        return false
      },
    },

    onUpdate: ({ editor }) => {
      updateSuggestions(editor)
    },

    onSelectionUpdate: ({ editor }) => {
      updateSuggestions(editor)
    },
  })

  function updateSuggestions(currentEditor: ReturnType<typeof useEditor>) {
    if (!currentEditor) {
      return
    }

    const type = getSuggestionType(currentEditor)

    if (!type) {
      setSuggestion({
        type: null,
        query: "",
        items: [],
        index: 0,
        rect: null,
      })

      return
    }

    const { from } = currentEditor.state.selection

    const textBefore = currentEditor.state.doc.textBetween(
      Math.max(0, from - 100),
      from,
      "\n",
      " "
    )

    const match = textBefore.match(/(^|\s)([@/#])([^\s]*)$/)

    if (!match) {
      return
    }

    const query = match[3] ?? ""

    let items: Array<MentionUser | SlashCommand> = []

    if (type === "mention") {
      items = filterUsers(query)
    }

    if (type === "slash") {
      items = filterCommands(query)
    }

    if (type === "reference") {
      items = [
        {
          id: "conversation",
          title: "Current conversation",
          description: "Reference this conversation",
          icon: "💬",
          keywords: ["conversation"],
        },
        {
          id: "workspace",
          title: "Workspace",
          description: "Reference your current workspace",
          icon: "🏢",
          keywords: ["workspace"],
        },
      ]
    }

    setSuggestion({
      type,
      query,
      items: items.slice(0, 8),
      index: 0,
      rect: getSuggestionRect(currentEditor),
    })
  }

  function closeSuggestions() {
    setSuggestion({
      type: null,
      query: "",
      items: [],
      index: 0,
      rect: null,
    })
  }

  function selectSuggestion() {
    if (!editor || !suggestion.type) {
      return
    }

    const item = suggestion.items[suggestion.index]

    if (!item) {
      return
    }

    if (suggestion.type === "mention") {
      const mention = item as MentionUser

      const { from } = editor.state.selection

      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - 100),
        from,
        "\n",
        " "
      )

      const match = textBefore.match(/(^|\s)@([^\s]*)$/)

      if (!match) {
        return
      }

      const deleteLength = match[0].length - (match[1]?.length ?? 0)

      editor
        .chain()
        .focus()
        .deleteRange({
          from: from - deleteLength,
          to: from,
        })
        .insertContent([
          {
            type: "mention",
            attrs: {
              id: mention.id,
              label: mention.name,
            },
          },
          {
            type: "text",
            text: " ",
          },
        ])
        .run()
    }

    if (suggestion.type === "slash") {
      const command = item as SlashCommand

      const { from } = editor.state.selection

      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - 100),
        from,
        "\n",
        " "
      )

      const match = textBefore.match(/(^|\s)\/([^\s]*)$/)

      if (!match) {
        return
      }

      const deleteLength = match[0].length - (match[1]?.length ?? 0)

      editor
        .chain()
        .focus()
        .deleteRange({
          from: from - deleteLength,
          to: from,
        })
        .run()

      handleSlashCommand(command)
    }

    if (suggestion.type === "reference") {
      const reference = item as SlashCommand

      const { from } = editor.state.selection

      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - 100),
        from,
        "\n",
        " "
      )

      const match = textBefore.match(/(^|\s)#([^\s]*)$/)

      if (!match) {
        return
      }

      const deleteLength = match[0].length - (match[1]?.length ?? 0)

      editor
        .chain()
        .focus()
        .deleteRange({
          from: from - deleteLength,
          to: from,
        })
        .insertContent(`#${reference.title} `)
        .run()
    }

    closeSuggestions()
  }

  function handleSlashCommand(command: SlashCommand) {
    if (!editor) {
      return
    }

    switch (command.id) {
      case "summarize":
        editor
          .chain()
          .focus()
          .insertContent("Please summarize the conversation.")
          .run()
        break

      case "search":
        editor.chain().focus().insertContent("Search the workspace for ").run()
        break

      case "translate":
        editor.chain().focus().insertContent("Translate this to ").run()
        break

      case "code":
        editor.chain().focus().toggleCodeBlock().run()
        break

      case "file":
        fileInputRef.current?.click()
        break

      case "image":
        editor.chain().focus().insertContent("Generate an image of ").run()
        break

      case "model":
        setShowModels(true)
        break

      case "clear":
        editor.commands.clearContent()
        setAttachments([])
        break
    }
  }

  async function submit() {
    if (!editor || disabled) {
      return
    }

    const content = editor.getText().trim()

    if (!content && attachments.length === 0) {
      return
    }

    closeSuggestions()

    editor.commands.clearContent()

    await onSend(content)

    setAttachments([])
  }

  function addFiles(files: File[]) {
    const validFiles = files.filter((file) => {
      const maxSize = 25 * 1024 * 1024
      return file.size <= maxSize
    })

    const newAttachments: Attachment[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }))

    setAttachments((current) => [...current, ...newAttachments])
  }

  function removeAttachment(id: string) {
    setAttachments((current) => {
      const attachment = current.find((item) => item.id === id)

      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview)
      }

      return current.filter((item) => item.id !== id)
    })
  }

  function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])

    if (files.length > 0) {
      addFiles(files)
    }

    event.target.value = ""
  }

  function insertEmoji(emoji: string) {
    editor?.chain().focus().insertContent(emoji).run()
    setShowEmoji(false)
  }

  function setLink() {
    if (!editor) {
      return
    }

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter URL", previousUrl ?? "https://")

    if (url === null) {
      return
    }

    if (url === "") {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().setLink({ href: url }).run()
  }

  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview)
        }
      })
    }
  }, [attachments])

  const activeModel = MODELS.find((model) => model.id === selectedModel)

  return (
    <div
      className="relative"
      onDragEnter={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        setIsDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)

        const files = Array.from(event.dataTransfer.files)

        if (files.length > 0) {
          addFiles(files)
        }
      }}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl border-2 border-dashed border-primary bg-background/95">
          <div className="text-center">
            <Paperclip className="mx-auto h-8 w-8 text-primary" />

            <p className="mt-2 font-medium">Drop files to attach</p>

            <p className="text-sm text-muted-foreground">
              Images, documents and other files
            </p>
          </div>
        </div>
      )}

      {suggestion.type && suggestion.items.length > 0 && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-[360px] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
            {suggestion.type === "mention" && "Mention someone"}

            {suggestion.type === "slash" && "Commands"}

            {suggestion.type === "reference" && "References"}
          </div>

          {suggestion.items.map((item, index) => {
            const isActive = index === suggestion.index

            if (suggestion.type === "mention") {
              const user = item as MentionUser

              return (
                <button
                  key={user.id}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                    isActive ? "bg-accent" : "hover:bg-accent"
                  }`}
                  onMouseDown={(event) => {
                    event.preventDefault()

                    setSuggestion((current) => ({
                      ...current,
                      index,
                    }))

                    setTimeout(selectSuggestion, 0)
                  }}
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar && <img src={user.avatar} alt={user.name} />}

                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>

                    <p className="truncate text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </button>
              )
            }

            const command = item as SlashCommand

            return (
              <button
                key={command.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                  isActive ? "bg-accent" : "hover:bg-accent"
                }`}
                onMouseDown={(event) => {
                  event.preventDefault()

                  setSuggestion((current) => ({
                    ...current,
                    index,
                  }))

                  setTimeout(selectSuggestion, 0)
                }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-base">
                  {command.icon}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {command.title}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {command.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="group relative flex items-center gap-2 rounded-xl border bg-background p-2"
            >
              {attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <File className="h-5 w-5" />
                </div>
              )}

              <div className="max-w-[180px]">
                <p className="truncate text-sm font-medium">
                  {attachment.file.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {(attachment.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border bg-background shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-3xl border bg-background shadow-sm">
        <EditorContent editor={editor} />

        <div className="flex items-center justify-between border-t px-3 py-2">
          <div className="flex items-center gap-1">
            {/* Attachment */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              title="Attach file"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Mention */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              title="Mention"
              disabled={disabled}
              onClick={() => {
                editor?.chain().focus().insertContent("@").run()
              }}
            >
              <AtSign className="h-4 w-4" />
            </Button>

            {/* Emoji */}
            <div className="relative">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                title="Emoji"
                disabled={disabled}
                onClick={() => setShowEmoji((current) => !current)}
              >
                <Smile className="h-4 w-4" />
              </Button>

              {showEmoji && (
                <div className="absolute bottom-full left-0 z-50 mb-2 w-[260px] rounded-xl border bg-popover p-3 shadow-xl">
                  <div className="grid grid-cols-5 gap-1">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="rounded-lg p-2 text-xl hover:bg-accent"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Formatting */}
            <div className="hidden items-center gap-1 border-l pl-2 sm:flex">
              <Button
                type="button"
                size="icon"
                variant={editor?.isActive("bold") ? "secondary" : "ghost"}
                title="Bold"
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={editor?.isActive("italic") ? "secondary" : "ghost"}
                title="Italic"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={editor?.isActive("underline") ? "secondary" : "ghost"}
                title="Underline"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                <Underline className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={editor?.isActive("strike") ? "secondary" : "ghost"}
                title="Strikethrough"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={editor?.isActive("code") ? "secondary" : "ghost"}
                title="Inline code"
                onClick={() => editor?.chain().focus().toggleCode().run()}
              >
                <Code className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
                title="Bullet list"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={
                  editor?.isActive("orderedList") ? "secondary" : "ghost"
                }
                title="Numbered list"
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={editor?.isActive("blockquote") ? "secondary" : "ghost"}
                title="Quote"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              >
                <Quote className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant={editor?.isActive("link") ? "secondary" : "ghost"}
                title="Link"
                onClick={setLink}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Model */}
            <div className="relative ml-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => setShowModels((current) => !current)}
                className="gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" />

                {activeModel?.name ?? "GPT-4.1"}

                <ChevronDown className="h-3.5 w-3.5" />
              </Button>

              {showModels && (
                <div className="absolute bottom-full left-0 z-50 mb-2 w-[240px] rounded-xl border bg-popover p-1 shadow-xl">
                  {MODELS.map((model) => {
                    const active = model.id === selectedModel

                    return (
                      <button
                        key={model.id}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent"
                        onClick={() => {
                          setSelectedModel(model.id)
                          setShowModels(false)
                        }}
                      >
                        <Sparkles className="h-4 w-4 shrink-0" />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{model.name}</p>

                          <p className="text-xs text-muted-foreground">
                            {model.description}
                          </p>
                        </div>

                        {active && <Check className="h-4 w-4" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <Button
            type="button"
            size="icon"
            className="rounded-full"
            disabled={
              disabled ||
              (!editor?.getText().trim() && attachments.length === 0)
            }
            onClick={() => void submit()}
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  )
}

export default function ChatPage() {
  const { data: messages = [], isLoading } = useMessagesQuery()

  const createMessageMutation = useCreateMessageMutation()

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || createMessageMutation.isPending) {
        return
      }

      await createMessageMutation.mutateAsync({
        conversation_id: 6,
        workspace_id: 11,
        role: MessageRole.User,
        content: content.trim(),
      })
    },
    [createMessageMutation]
  )

  const renderMessage = useCallback((item: Message) => {
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
  }, [])

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-full flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-8">
          {!hasMessages && !isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="max-w-xl text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                  How can I help today?
                </h1>

                <p className="mt-3 text-muted-foreground">
                  Ask anything, upload files, mention people, or use slash
                  commands.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <div className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground">
                    @ Mention
                  </div>

                  <div className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground">
                    / Commands
                  </div>

                  <div className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground">
                    # References
                  </div>

                  <div className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground">
                    📎 Files
                  </div>
                </div>
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

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading messages...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background">
        <div className="mx-auto max-w-4xl p-4">
          <ChatComposer
            disabled={createMessageMutation.isPending}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}
// import { useState } from "react"
// import { ArrowUp, Paperclip } from "lucide-react"

// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Textarea } from "@/components/ui/textarea"

// import {
//   useMessagesQuery,
//   useCreateMessageMutation,
// } from "@/features/messages/hooks/useMessages"

// import { MessageRole, type Message } from "@/features/messages/types"

// export default function ChatPage() {
//   const [message, setMessage] = useState("")

//   const { data: messages = [], isLoading } = useMessagesQuery()

//   const createMessageMutation = useCreateMessageMutation()

//   const handleSendMessage = async () => {
//     const content = message.trim()

//     if (!content || createMessageMutation.isPending) {
//       return
//     }

//     setMessage("")

//     await createMessageMutation.mutateAsync({
//       conversation_id: 6,
//       workspace_id: 11,
//       role: MessageRole.User,
//       content,
//     })
//   }

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault()
//       handleSendMessage()
//     }
//   }

//   const renderMessage = (item: Message) => {
//     const isUser = item.role === MessageRole.User

//     if (item.role === MessageRole.System || item.role === MessageRole.Tool) {
//       return null
//     }

//     return (
//       <div key={item.id} className={isUser ? "flex justify-end" : "flex gap-4"}>
//         {isUser ? (
//           <div className="max-w-[80%] rounded-3xl bg-primary px-5 py-3 text-primary-foreground">
//             <p className="whitespace-pre-wrap">{item.content}</p>
//           </div>
//         ) : (
//           <>
//             <Avatar className="shrink-0">
//               <AvatarFallback>AI</AvatarFallback>
//             </Avatar>

//             <div className="max-w-3xl space-y-2">
//               <p className="font-medium">Assistant</p>

//               <p className="leading-7 whitespace-pre-wrap">{item.content}</p>

//               {item.status === "streaming" && (
//                 <span className="text-sm text-muted-foreground">
//                   Generating...
//                 </span>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     )
//   }

//   const hasMessages = messages?.length > 0

//   return (
//     <div className="flex h-full flex-col bg-background">
//       {/* Messages */}
//       <ScrollArea className="flex-1">
//         <div className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-8">
//           {!hasMessages && !isLoading ? (
//             <div className="flex flex-1 items-center justify-center">
//               <div className="max-w-xl text-center">
//                 <h1 className="text-3xl font-semibold tracking-tight">
//                   How can I help today?
//                 </h1>

//                 <p className="mt-3 text-muted-foreground">
//                   Ask anything, upload files, or start a conversation.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-8 py-8">{messages.map(renderMessage)}</div>
//           )}

//           {isLoading && (
//             <div className="flex gap-4 py-8">
//               <Avatar className="shrink-0">
//                 <AvatarFallback>AI</AvatarFallback>
//               </Avatar>

//               <div className="text-sm text-muted-foreground">
//                 Loading messages...
//               </div>
//             </div>
//           )}
//         </div>
//       </ScrollArea>

//       {/* Composer */}
//       <div className="border-t bg-background">
//         <div className="mx-auto max-w-4xl p-4">
//           <div className="rounded-3xl border bg-background shadow-sm">
//             <Textarea
//               value={message}
//               onChange={(event) => setMessage(event.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Message AI..."
//               disabled={createMessageMutation.isPending}
//               className="min-h-[80px] resize-none border-0 shadow-none focus-visible:ring-0"
//             />

//             <div className="flex items-center justify-between border-t px-3 py-3">
//               <div className="flex items-center gap-2">
//                 <Button type="button" size="icon" variant="ghost">
//                   <Paperclip className="h-4 w-4" />
//                 </Button>

//                 <Button type="button" variant="ghost" size="sm">
//                   GPT-4.1
//                 </Button>
//               </div>

//               <Button
//                 type="button"
//                 size="icon"
//                 className="rounded-full"
//                 disabled={!message.trim() || createMessageMutation.isPending}
//                 onClick={handleSendMessage}
//               >
//                 <ArrowUp className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* <p className="mt-2 text-center text-xs text-muted-foreground">
//             AI can make mistakes. Verify important information.
//           </p> */}
//         </div>
//       </div>
//     </div>
//   )
// }
