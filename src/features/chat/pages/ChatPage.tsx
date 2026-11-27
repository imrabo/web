import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUp, Bot, Cloud, Code2, KeyRound, Layers3, MessageSquare, ShieldCheck, Sparkles, Users } from "lucide-react"

const suggestions = [
  { label: "Explain a complex codebase", prompt: "Help me understand how to approach a complex codebase." },
  { label: "Design an agent workflow", prompt: "Help me design a multi-agent workflow for my project." },
  { label: "Research a technical decision", prompt: "Compare technical approaches and explain the trade-offs." },
  { label: "Build an API integration", prompt: "Help me plan and implement an API integration." },
]

export default function ChatPage() {
  const [prompt, setPrompt] = useState("")
  const [providerKey, setProviderKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [provider, setProvider] = useState("OpenAI")
  const [notice, setNotice] = useState("")

  const begin = () => {
    if (!prompt.trim()) {
      setNotice("Enter a message to start a conversation.")
      return
    }
    setNotice("The workspace interface is ready. Connect a provider in Settings to enable model execution.")
  }

  return (
    <main className="workspace-shell min-h-full">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col px-5 pb-10 pt-8 md:px-10">
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

        <section className="mx-auto w-full max-w-4xl flex-1 py-16 md:py-24">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.24em] text-[#88a9ca]">YOUR CONNECTED AI WORKSPACE</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.045em] text-white md:text-6xl">What are we working on?</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 md:text-base">Start without an account. Bring your own model API key, keep data in this browser, and add cloud capabilities when you need them.</p>
          </div>

          <div className="workspace-panel rounded-3xl p-3 shadow-2xl shadow-black/20 md:p-5">
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-2 pb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#26394c] px-3 py-1.5 text-xs font-medium text-[#d8e8f7]"><KeyRound className="h-3.5 w-3.5" /> Bring your own key</span>
              <span className="text-xs text-white/40">Model usage is billed by your provider</span>
            </div>
            <textarea
              value={prompt}
              onChange={(event) => { setPrompt(event.target.value); setNotice("") }}
              onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); begin() } }}
              placeholder="Ask a question, describe a task, or plan an agent workflow…"
              className="min-h-36 w-full resize-y bg-transparent px-3 py-5 text-base leading-7 text-white outline-none placeholder:text-white/30"
            />
            <div className="flex flex-col gap-3 border-t border-white/10 px-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/45" htmlFor="provider">Provider</label>
                <select id="provider" value={provider} onChange={(event) => setProvider(event.target.value)} className="rounded-lg border border-white/10 bg-[#0b0c0e] px-3 py-2 text-xs text-white/80 outline-none">
                  <option>OpenAI</option><option>Anthropic</option><option>Google</option><option>OpenAI-compatible</option>
                </select>
                <button type="button" onClick={() => setShowKey((v) => !v)} className="workspace-button px-3 py-2 text-xs text-white/70">{showKey ? "Hide key" : "Add API key"}</button>
              </div>
              <button type="button" onClick={begin} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#111315] transition hover:bg-[#dce7f1]"><span>Start working</span><ArrowUp className="h-3.5 w-3.5" /></button>
            </div>
            {showKey && <div className="mt-4 border-t border-white/10 px-2 pt-4"><label htmlFor="provider-key" className="mb-2 block text-xs text-white/60">{provider} API key</label><input id="provider-key" type="password" autoComplete="off" value={providerKey} onChange={(event) => setProviderKey(event.target.value)} placeholder="Paste your API key" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#668db4]" /><p className="mt-2 text-[11px] leading-5 text-white/35">This prototype field is not connected to a model runtime. Do not paste a production secret here until secure local key storage is implemented.</p></div>}
            {notice && <p role="status" className="px-2 pt-4 text-xs text-[#a8c4e0]">{notice}</p>}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {suggestions.map((item) => <button key={item.label} type="button" onClick={() => setPrompt(item.prompt)} className="workspace-button flex items-center gap-3 p-4 text-left text-sm text-white/75"><MessageSquare className="h-4 w-4 shrink-0 text-[#89aaca]" />{item.label}</button>)}
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-3">
            <div className="workspace-panel rounded-2xl p-4"><Code2 className="h-4 w-4 text-[#8eafd0]" /><h2 className="mt-3 text-sm font-semibold text-white">Developers</h2><p className="mt-1 text-xs leading-5 text-white/45">Use your preferred model provider and connect APIs.</p></div>
            <div className="workspace-panel rounded-2xl p-4"><Bot className="h-4 w-4 text-[#8eafd0]" /><h2 className="mt-3 text-sm font-semibold text-white">AI builders</h2><p className="mt-1 text-xs leading-5 text-white/45">Prototype agents and focused sub-agent workflows locally.</p></div>
            <div className="workspace-panel rounded-2xl p-4"><Users className="h-4 w-4 text-[#8eafd0]" /><h2 className="mt-3 text-sm font-semibold text-white">Teams</h2><p className="mt-1 text-xs leading-5 text-white/45">Upgrade when you need shared workspaces and access controls.</p></div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] text-white/35">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Local-first by design</span>
            <span className="inline-flex items-center gap-1.5"><Cloud className="h-3.5 w-3.5" /> Cloud sync on Solo+</span>
            <span className="inline-flex items-center gap-1.5"><Layers3 className="h-3.5 w-3.5" /> Start free, scale later</span>
          </div>
          <p className="mt-5 text-center text-[10px] text-white/25">No account required for local exploration. Cloud sync and collaboration require an account and an eligible plan.</p>
        </section>
      </div>
    </main>
  )
}
