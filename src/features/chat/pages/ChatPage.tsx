import { useState, type FormEvent, type KeyboardEvent } from "react"
import { Link } from "react-router-dom"
import { ArrowUp, Bot, Check, ChevronDown, Code2, ExternalLink, KeyRound, MessageSquare, ShieldCheck, Sparkles, Users, X } from "lucide-react"

type Provider = "openai" | "anthropic" | "google" | "compatible"
type ChatMessage = { role: "user" | "assistant"; content: string }

const providerOptions: { id: Provider; label: string; defaultModel: string }[] = [
  { id: "openai", label: "OpenAI", defaultModel: "gpt-4.1" },
  { id: "anthropic", label: "Anthropic", defaultModel: "claude-sonnet-4-5" },
  { id: "google", label: "Google Gemini", defaultModel: "gemini-2.5-flash" },
  { id: "compatible", label: "OpenAI-compatible", defaultModel: "your-model-id" },
]

const suggestions = [
  "Explain a complex codebase",
  "Design an agent workflow",
  "Research a technical decision",
  "Build an API integration",
]

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null) {
    const error = "error" in data ? (data as { error?: unknown }).error : undefined
    if (typeof error === "string") return error
    if (typeof error === "object" && error !== null && "message" in error) {
      const message = (error as { message?: unknown }).message
      if (typeof message === "string") return message
    }
  }
  return fallback
}

async function requestCompletion(args: {
  provider: Provider
  apiKey: string
  model: string
  baseUrl: string
  messages: ChatMessage[]
}) {
  const { provider, apiKey, model, baseUrl, messages } = args
  let url: string
  let headers: Record<string, string>
  let body: unknown

  if (provider === "anthropic") {
    url = "https://api.anthropic.com/v1/messages"
    headers = {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    }
    body = {
      model,
      max_tokens: 2048,
      messages: messages.map((message) => ({ role: message.role === "assistant" ? "assistant" : "user", content: message.content })),
    }
  } else if (provider === "google") {
    url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
    headers = { "content-type": "application/json" }
    body = {
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
    }
  } else {
    const endpoint = provider === "openai" ? "https://api.openai.com/v1" : baseUrl.replace(/\/+$/, "")
    url = `${endpoint}/chat/completions`
    headers = { "content-type": "application/json", authorization: `Bearer ${apiKey}` }
    body = {
      model,
      messages: messages.map((message) => ({ role: message.role, content: message.content })),
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(90000),
  })
  const data: unknown = await response.json().catch(() => undefined)

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `Provider request failed (HTTP ${response.status}). Check your key, model and provider access settings.`))
  }

  let content = ""
  if (provider === "google") {
    const candidates = (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] }).candidates
    content = candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? ""
  } else if (provider === "anthropic") {
    const blocks = (data as { content?: { type?: string; text?: string }[] }).content
    content = blocks?.filter((block) => block.type === "text").map((block) => block.text ?? "").join("") ?? ""
  } else {
    const choices = (data as { choices?: { message?: { content?: string | { text?: string }[] } }[] }).choices
    const responseContent = choices?.[0]?.message?.content
    content = typeof responseContent === "string"
      ? responseContent
      : responseContent?.map((part) => part.text ?? "").join("") ?? ""
  }

  if (!content.trim()) {
    throw new Error("The provider returned an empty response. Check that the selected model supports chat or text generation.")
  }
  return content
}

export default function ChatPage() {
  const [provider, setProvider] = useState<Provider>("openai")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState(providerOptions[0].defaultModel)
  const [baseUrl, setBaseUrl] = useState("https://api.openai.com/v1")
  const [showSettings, setShowSettings] = useState(true)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [notice, setNotice] = useState("")
  const [isSending, setIsSending] = useState(false)

  const changeProvider = (next: Provider) => {
    setProvider(next)
    setModel(providerOptions.find((option) => option.id === next)?.defaultModel ?? "")
    if (next === "compatible") setBaseUrl("https://api.openai.com/v1")
  }

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault()
    const text = prompt.trim()
    if (!text || isSending) return
    if (!apiKey.trim()) {
      setShowSettings(true)
      setNotice("Add your provider API key before sending a message.")
      return
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setPrompt("")
    setNotice("")
    setIsSending(true)
    try {
      const answer = await requestCompletion({
        provider,
        apiKey: apiKey.trim(),
        model: model.trim(),
        baseUrl,
        messages: nextMessages,
      })
      setMessages([...nextMessages, { role: "assistant", content: answer }])
    } catch (error) {
      setMessages(messages)
      setPrompt(text)
      setNotice(error instanceof Error ? error.message : "The request failed. Check your provider settings and try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const selectedProvider = providerOptions.find((option) => option.id === provider)

  return (
    <main className="workspace-shell min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-8 pt-6 md:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link to="/" className="flex items-center gap-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[.06]"><Sparkles className="h-4 w-4 text-[#91b9df]" /></span>
            <span className="text-sm font-semibold tracking-tight">imrabo <span className="font-normal text-white/40">/ workspace</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/[.07] px-3 py-1.5 text-[11px] font-medium text-emerald-200 sm:inline-flex">Guest · Free BYOK</span>
            <Link to="/pricing" className="workspace-button px-3 py-2 text-xs font-medium text-white/75">Plans</Link>
            <Link to="/login" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#101214] hover:bg-[#dce7f1]">Sign in</Link>
          </div>
        </header>

        <section className="mx-auto w-full max-w-4xl flex-1 py-10">
          {messages.length === 0 ? (
            <div className="mb-8 pt-8 text-center md:pt-14">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[.24em] text-[#88a9ca]">YOUR CONNECTED AI WORKSPACE</p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.045em] text-white md:text-6xl">What are we working on?</h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 md:text-base">Start without an account. Bring your own model API key, keep this session in your browser, and add cloud capabilities when you need them.</p>
            </div>
          ) : (
            <div className="mb-8 space-y-6">
              {messages.map((message, index) => (
                <article key={index} className={message.role === "user" ? "ml-auto max-w-[88%] rounded-2xl bg-[#26394c] px-5 py-4 text-sm leading-7 text-white" : "max-w-[92%] rounded-2xl border border-white/10 bg-[#141618] px-5 py-4 text-sm leading-7 text-white/85"}>
                  {message.role === "assistant" && <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#91b9df]"><Bot className="h-3.5 w-3.5" /> Assistant · {selectedProvider?.label}</div>}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </article>
              ))}
              {isSending && <div className="flex items-center gap-3 text-xs text-white/45"><span className="h-2 w-2 animate-pulse rounded-full bg-[#91b9df]" />Waiting for {selectedProvider?.label}…</div>}
            </div>
          )}

          <form onSubmit={(event) => void sendMessage(event)} className="workspace-panel rounded-3xl p-3 shadow-2xl shadow-black/20 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-2 pb-4">
              <div className="flex items-center gap-2"><span className="inline-flex items-center gap-2 rounded-full bg-[#26394c] px-3 py-1.5 text-xs font-medium text-[#d8e8f7]"><KeyRound className="h-3.5 w-3.5" /> BYOK</span><span className="text-xs text-white/40">Direct provider request · No ImRabo account</span></div>
              <button type="button" onClick={() => setShowSettings((value) => !value)} className="workspace-button inline-flex items-center gap-2 px-3 py-2 text-xs text-white/70">{showSettings ? "Hide setup" : "Provider setup"}<ChevronDown className={`h-3.5 w-3.5 transition-transform ${showSettings ? "rotate-180" : ""}`} /></button>
            </div>

            {showSettings && <div className="grid gap-3 border-b border-white/10 px-2 py-4 md:grid-cols-2">
              <label className="text-xs text-white/60">Provider<select value={provider} onChange={(event) => changeProvider(event.target.value as Provider)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0c0e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#668db4]"><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option><option value="google">Google Gemini</option><option value="compatible">OpenAI-compatible API</option></select></label>
              <label className="text-xs text-white/60">Model ID<input required value={model} onChange={(event) => setModel(event.target.value)} placeholder="Enter provider model ID" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0c0e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#668db4]" /></label>
              {provider === "compatible" && <label className="text-xs text-white/60 md:col-span-2">API base URL<input required type="url" value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://your-provider.example/v1" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0c0e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#668db4]" /></label>}
              <label className="text-xs text-white/60 md:col-span-2">API key<input required type="password" autoComplete="off" spellCheck={false} value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={`Paste your ${selectedProvider?.label} API key (kept in this page's memory)`} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0c0e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#668db4]" /></label>
              <div className="flex items-start gap-2 text-[11px] leading-5 text-white/40 md:col-span-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300/70" />Your key is held in page memory and sent directly to the selected provider. It is not saved to ImRabo or browser storage. Clear it by refreshing or closing this page.</div>
            </div>}

            <textarea value={prompt} onChange={(event) => { setPrompt(event.target.value); setNotice("") }} onKeyDown={handleComposerKeyDown} placeholder="Ask a question, describe a task, or plan an agent workflow…" disabled={isSending} className="min-h-32 w-full resize-y bg-transparent px-3 py-5 text-base leading-7 text-white outline-none placeholder:text-white/30 disabled:opacity-50" />
            <div className="flex flex-col gap-3 border-t border-white/10 px-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-white/40"><span className="h-2 w-2 rounded-full bg-emerald-300" />{selectedProvider?.label} · {model}</div>
              <button type="submit" disabled={isSending || !prompt.trim()} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#111315] transition hover:bg-[#dce7f1] disabled:cursor-not-allowed disabled:opacity-40">{isSending ? "Sending…" : "Send message"}<ArrowUp className="h-3.5 w-3.5" /></button>
            </div>
            {notice && <p role="alert" className="px-2 pt-4 text-xs leading-5 text-rose-300">{notice}</p>}
          </form>

          {messages.length === 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2">{suggestions.map((item) => <button key={item} type="button" onClick={() => setPrompt(item)} className="workspace-button flex items-center gap-3 p-4 text-left text-sm text-white/75"><MessageSquare className="h-4 w-4 shrink-0 text-[#89aaca]" />{item}</button>)}</div>}

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            <div className="workspace-panel rounded-2xl p-4"><Code2 className="h-4 w-4 text-[#8eafd0]" /><h2 className="mt-3 text-sm font-semibold text-white">Developers</h2><p className="mt-1 text-xs leading-5 text-white/45">Use your preferred model provider and connect APIs.</p></div>
            <div className="workspace-panel rounded-2xl p-4"><Bot className="h-4 w-4 text-[#8eafd0]" /><h2 className="mt-3 text-sm font-semibold text-white">AI builders</h2><p className="mt-1 text-xs leading-5 text-white/45">Prototype agent conversations with your own models.</p></div>
            <div className="workspace-panel rounded-2xl p-4"><Users className="h-4 w-4 text-[#8eafd0]" /><h2 className="mt-3 text-sm font-semibold text-white">Teams</h2><p className="mt-1 text-xs leading-5 text-white/45">Upgrade for shared workspaces and access controls.</p></div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] text-white/35"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Session-only API key</span><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Local-first BYOK</span><span className="inline-flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> Provider usage billed separately</span></div>
          <p className="mt-5 text-center text-[10px] leading-5 text-white/25">This browser chat sends requests directly to your selected provider. Availability depends on that provider's browser CORS policy. Cloud sync, collaboration and account-backed features require sign-in and an eligible plan.</p>
        </section>
      </div>
    </main>
  )
}
