export interface PaymentPlan {
    id: string
    name: string
    description: string
    price: number
    currency: "INR"
    interval: "monthly" | "yearly" | "one-time"
    popular?: boolean
    features: string[]
}

export interface RazorpayOrder {
    id: string
    amount: number
    currency: string
}

export interface RazorpayPaymentResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

export interface CreateOrderRequest {
    planId: string
}

export interface CreateOrderResponse {
    order: RazorpayOrder
    keyId: string
}

export interface PaymentVerificationRequest {
    planId: string
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}