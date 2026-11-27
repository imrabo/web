import { useState } from "react"
import { Link } from "react-router-dom"
import { Check, Sparkles } from "lucide-react"

const plans = [
  { id: "free", name: "Free", eyebrow: "Free forever", inr: "₹0", usd: "$0", cadence: "Forever", audience: "For developers exploring ImRabo.", cta: "Start free", href: "/workspace", features: ["Local AI provider configurations", "Bring Your Own API Key", "Local chat and agent execution", "Basic MCP connectors", "Basic agent and sub-agent creation", "Local data storage", "Community support"] },
  { id: "solo", name: "Solo", eyebrow: "Recommended", inr: "₹499", usd: "$6", cadence: "/month", audience: "For individual professionals and developers.", cta: "Choose Solo", href: "https://imrabo.github.io/website/contact/", features: ["Everything in Free", "Cloud synchronization", "Unlimited agent configurations", "Custom sub-agents", "Full connector marketplace", "Agent import/export", "Advanced activity logs", "Cross-device access", "Personal cloud workspace", "Priority support"] },
  { id: "team", name: "Team", eyebrow: "For small teams", inr: "₹1,499", usd: "$19", cadence: "/month", audience: "For teams building with AI agents.", cta: "Choose Team", href: "https://imrabo.github.io/website/contact/", features: ["Everything in Solo", "Up to 5 members", "Shared workspace", "Shared agents and sub-agents", "Shared MCP configurations", "Team-level permissions", "Role-based access control", "Team activity and audit logs", "Shared agent templates", "Centralized configuration management", "Team administration"] },
  { id: "enterprise", name: "Enterprise", eyebrow: "Custom licensing", inr: "Custom pricing", usd: "Custom pricing", cadence: "", audience: "For organizations and large deployments.", cta: "Contact sales", href: "https://imrabo.github.io/website/contact/", features: ["Everything in Team", "Custom or unlimited seats", "Self-hosted deployment", "SSO and identity management", "Advanced RBAC", "Organization-wide policies", "Centralized secrets management", "Advanced audit and compliance", "Custom connectors and integrations", "Dedicated support and SLA", "Custom deployment and licensing"] },
]

export default function PricingPage() {
  const [currency, setCurrency] = useState<"inr" | "usd">("inr")
  return <main className="workspace-shell min-h-screen px-5 py-14 md:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="flex items-center justify-between border-b border-white/10 pb-6">
        <Link to="/workspace" className="flex items-center gap-3 text-sm font-semibold text-white"><span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[.06]"><Sparkles className="h-4 w-4 text-[#91b9df]" /></span>imrabo <span className="font-normal text-white/40">/ plans</span></Link>
        <Link to="/workspace" className="text-xs text-white/60 hover:text-white">Back to workspace</Link>
      </header>
      <div className="mx-auto mt-16 max-w-3xl text-center"><p className="font-mono text-[10px] font-semibold uppercase tracking-[.24em] text-[#7898b8]">IMRABO PLANS</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-white md:text-5xl">Simple pricing. Your AI, your way.</h1><p className="mt-5 text-sm leading-7 text-white/55 md:text-base">Start free with your own API keys. Upgrade for cloud synchronization, collaboration and enterprise control.</p>
        <div className="pricing-switch mt-8 inline-flex" role="group" aria-label="Choose pricing currency"><button type="button" aria-pressed={currency === "inr"} onClick={() => setCurrency("inr")} className="rounded-full px-5 py-2 text-xs font-semibold">India (INR)</button><button type="button" aria-pressed={currency === "usd"} onClick={() => setCurrency("usd")} className="rounded-full px-5 py-2 text-xs font-semibold text-[#929ba5]">International (USD)</button></div>
        <p className="mt-3 text-[11px] text-[#858e98]">Monthly pricing · {currency === "inr" ? "India" : "International"}</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => <article key={plan.id} className={`pricing-plan-card relative flex flex-col p-6 md:p-7 ${plan.id === "solo" ? "ring-1 ring-[#7898b8]/60" : ""}`}>
          {plan.id === "solo" && <span className="absolute -top-3 left-6 rounded-full bg-[#527da8] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Recommended</span>}
          <p className="text-xs font-medium text-[#8da6bf]">{plan.eyebrow}</p><h2 className="mt-3 text-xl font-semibold text-white">{plan.name}</h2><div className="mt-5 flex min-h-12 items-baseline gap-2"><span className="text-3xl font-semibold tracking-tight text-white">{currency === "inr" ? plan.inr : plan.usd}</span><span className="text-xs text-[#929ba5]">{plan.cadence}</span></div><p className="mt-4 min-h-[52px] text-sm leading-6 text-[#a0a7af]">{plan.audience}</p>
          <a href={plan.href} className="mt-5 inline-flex w-full justify-center rounded-full bg-white px-4 py-3 text-sm font-medium text-[#111315] transition hover:bg-[#dce7f1]">{plan.cta}</a>
          <p className="mt-7 text-xs font-semibold text-white">Includes:</p><ul className="mt-3 flex-1 space-y-2.5 text-sm leading-6 text-[#929ba5]">{plan.features.map((feature) => <li key={feature} className="flex gap-2.5"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#7898b8]" /><span>{feature}</span></li>)}</ul>
        </article>)}
      </div>
      <div className="mt-6 rounded-2xl bg-[#191a1c] p-5 text-sm leading-6 text-[#a0a7af]"><strong className="text-white">BYOK stays available on every plan.</strong> Bring your own model API key and pay the provider directly for inference. ImRabo subscriptions cover workspace capabilities, not model-provider API consumption.</div>
      <p className="mt-5 text-center text-xs text-white/35">Monthly launch pricing. Taxes, including applicable GST, may be additional. Additional team members are a paid seat add-on. Paid-plan onboarding and billing are arranged through the ImRabo contact flow; self-service checkout is not enabled in this workspace yet.</p>
    </div>
  </main>
}
