import type {
    CreateOrderRequest,
    CreateOrderResponse,
    PaymentVerificationRequest,
} from "../types/payment"

export const paymentService = {
    async createOrder(
        data: CreateOrderRequest
    ): Promise<CreateOrderResponse> {
        console.log("Creating payment order:", data)

        // Temporary frontend mock.
        // Later replace this with:
        //
        // const response = await api.post("/payments/create-order", data)
        // return response.data

        return {
            order: {
                id: "order_test_123456",
                amount: 49900,
                currency: "INR",
            },
            keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
        }
    },

    async verifyPayment(
        data: PaymentVerificationRequest
    ): Promise<void> {
        console.log("Payment verification:", data)

        // Later:
        //
        // await api.post("/payments/verify", data)
    },
}