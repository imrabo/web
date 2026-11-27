import {apiClient} from "@/lib/api/client";
import type {CreateOrderRequest,CreateOrderResponse,PaymentVerificationRequest} from "../types/payment";
export const paymentService={
 async createOrder(data:CreateOrderRequest):Promise<CreateOrderResponse>{const order=await apiClient.post<{key_id:string;order_id:string;amount:number;currency:string}>("/subscriptions/checkout",{plan_id:data.planId,billing_cycle:"monthly"});return {order:{id:order.order_id,amount:order.amount,currency:order.currency},keyId:order.key_id}},
 async verifyPayment(data:PaymentVerificationRequest){return apiClient.post("/subscriptions/verify",{razorpay_order_id:data.razorpay_order_id,razorpay_payment_id:data.razorpay_payment_id,razorpay_signature:data.razorpay_signature})},
 async getPlans(){return apiClient.get<Array<{id:string;name:string;description?:string;monthly_paise:number;features?:string[]}>>("/subscriptions/plans")},
 async getMySubscription(){return apiClient.get("/subscriptions/me")},
};
