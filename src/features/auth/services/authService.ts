import {apiClient,setAccessToken} from "@/lib/api/client";
import type {UserType} from "@/features/users";
import type {RegistrationRequest,LoginRequest,OtpVerificationRequest,ForgotPasswordRequest,ResetPasswordRequest,AuthResponse,PasswordResetResponse} from "../types/auth.types";
type BackendUser={id:number|string;name:string;email:string;phone_number?:string|null;created_at:string;updated_at?:string;email_verified?:boolean};
type TokenResponse={access_token:string;token_type:string};
const mapUser=(u:BackendUser):UserType=>({id:String(u.id),fullName:u.name,email:u.email,mobileNo:u.phone_number??"",membershipType:"FREE" as UserType["membershipType"],isActive:true,isExpert:false,status:"ACTIVE" as UserType["status"],gender:"OTHER" as UserType["gender"],dateOfBirth:new Date(0),createdAt:new Date(u.created_at)});
async function login(data:LoginRequest):Promise<AuthResponse>{const tokens=await apiClient.post<TokenResponse>("/auth-user/login",{email:data.email,password:data.password});setAccessToken(tokens.access_token);const user=await apiClient.get<BackendUser>("/auth-user/me");return {user:mapUser(user),accessToken:tokens.access_token}}
export const authService={
 async register(data:RegistrationRequest){return apiClient.post<BackendUser>("/auth-user/register",{name:data.fullName,email:data.email,password:data.password,phone_number:data.mobileNo||null})},
 login,
 async initialize(){const token=await apiClient.refreshSession();if(!token)return null;return apiClient.get<BackendUser>("/auth-user/me").then(mapUser)},
 async logout(){try{await apiClient.post("/auth-user/logout",{})}finally{setAccessToken(null)}},
 async getCurrentUser(){return mapUser(await apiClient.get<BackendUser>("/auth-user/me"))},
 requestOtp(data:{email:string}){return apiClient.post("/auth-user/email/otp",data)},
 verifyOtp(data:OtpVerificationRequest){return apiClient.post("/auth-user/email/verify",{email:data.email,otp:data.otp})},
 forgotPassword(data:ForgotPasswordRequest){return apiClient.post<PasswordResetResponse>("/auth-user/password/forgot",data)},
 resetPassword(data:ResetPasswordRequest){if(!data.token)throw new Error("A password reset token is required");return apiClient.post<PasswordResetResponse>("/auth-user/password/reset",{token:data.token,new_password:data.newPassword})},
};
