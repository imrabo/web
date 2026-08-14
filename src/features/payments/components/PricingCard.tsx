import type { PaymentPlan } from "../types/payment"
import RazorpayCheckout from "./RazorpayCheckout"

interface PricingCardProps {
  plan: PaymentPlan
}

export default function PricingCard({ plan }: PricingCardProps) {
  const handleSuccess = () => {
    alert("Payment successful!")
  }

  const handleFailure = (error: unknown) => {
    console.error(error)
    alert("Payment failed. Please try again.")
  }

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        plan.popular ? "border-black shadow-lg" : "border-gray-200"
      }`}
    >
      {plan.popular && (
        <span className="absolute top-4 right-4 rounded-full bg-black px-3 py-1 text-xs text-white">
          Popular
        </span>
      )}

      <h2 className="text-xl font-semibold">{plan.name}</h2>

      <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

      <div className="mt-6">
        <span className="text-4xl font-bold">₹{plan.price}</span>

        {plan.interval !== "one-time" && (
          <span className="ml-1 text-sm text-gray-500">
            /{plan.interval === "monthly" ? "month" : "year"}
          </span>
        )}
      </div>

      <div className="my-6 h-px bg-gray-200" />

      <ul className="mb-8 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm">
            <span>✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <RazorpayCheckout
          plan={plan}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
        />
      </div>
    </div>
  )
}
