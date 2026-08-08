import PricingCard from "../components/PricingCard"
import type { PaymentPlan } from "../types/payment"

const plans: PaymentPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For exploring the platform",
    price: 0,
    currency: "INR",
    interval: "monthly",

    features: [
      "Basic AI usage",
      "Limited connectors",
      "Basic HTTP access",
      "Community support",
    ],
  },

  {
    id: "pro",
    name: "Pro",
    description: "For individual users and developers",
    price: 499,
    currency: "INR",
    interval: "monthly",
    popular: true,

    features: [
      "Higher AI usage limits",
      "All connectors",
      "HTTP integrations",
      "MCP support",
      "Webhook support",
      "Priority support",
    ],
  },

  {
    id: "business",
    name: "Business",
    description: "For teams and production workloads",
    price: 1499,
    currency: "INR",
    interval: "monthly",

    features: [
      "Everything in Pro",
      "Higher usage limits",
      "Team collaboration",
      "Advanced connectors",
      "Production webhooks",
      "Priority support",
    ],
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Simple pricing for every workflow
          </h1>

          <p className="mt-4 text-gray-500">
            Choose the plan that fits the way you use the platform.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </main>
  )
}
