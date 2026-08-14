import { useState } from "react"
import type { PaymentPlan, RazorpayPaymentResponse } from "../types/payment"
import { paymentService } from "../services/paymentService"

interface RazorpayCheckoutProps {
  plan: PaymentPlan
  onSuccess?: (response: RazorpayPaymentResponse) => void
  onFailure?: (error: unknown) => void
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill?: {
    name?: string
    email?: string
  }
  theme?: {
    color?: string
  }
}

interface RazorpayInstance {
  open: () => void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export default function RazorpayCheckout({
  plan,
  onSuccess,
  onFailure,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false)

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement("script")

      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true

      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    try {
      setLoading(true)

      const scriptLoaded = await loadRazorpayScript()

      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay Checkout")
      }

      const response = await paymentService.createOrder({
        planId: plan.id,
      })

      const options: RazorpayOptions = {
        key: response.keyId,

        amount: response.order.amount,

        currency: response.order.currency,

        name: "Your App",

        description: `${plan.name} Plan`,

        order_id: response.order.id,

        handler: async (paymentResponse: RazorpayPaymentResponse) => {
          try {
            await paymentService.verifyPayment({
              planId: plan.id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            })

            onSuccess?.(paymentResponse)
          } catch (error) {
            onFailure?.(error)
          }
        },

        theme: {
          color: "#000000",
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.open()
    } catch (error) {
      console.error("Payment failed:", error)

      onFailure?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Processing..." : `Upgrade to ${plan.name}`}
    </button>
  )
}
