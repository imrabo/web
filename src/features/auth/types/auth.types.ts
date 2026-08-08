// ================================
// AUTH ENUMS
// ================================

export enum OtpPurpose {
    REGISTRATION = "REGISTRATION",
    LOGIN = "LOGIN",
    PASSWORD_RESET = "PASSWORD_RESET",
    MFA = "MFA",
    PHONE_VERIFICATION = "PHONE_VERIFICATION",
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}


export enum MfaMethod {
    SMS = "SMS",
    EMAIL = "EMAIL",
    AUTHENTICATOR_APP = "AUTHENTICATOR_APP",
}


// ================================
// AUTH REQUEST TYPES
// ================================

import type { Gender, MembershipType, UserPreferences, UserType } from "@/features/users";

export interface RegistrationRequest {
    fullName: string;
    email: string;
    mobileNo: string;
    password: string;
    confirmPassword: string;

    dateOfBirth?: Date;
    gender?: Gender;

    membershipType?: MembershipType;

    preferences?: UserPreferences;
}


export interface LoginRequest {
    email: string;
    password: string;

    rememberMe?: boolean;
}


export interface OtpVerificationRequest {
    mobileNo?: string;
    email?: string;

    otp: string;

    purpose: OtpPurpose;
}


export interface ResendOtpRequest {
    mobileNo?: string;
    email?: string;

    purpose: OtpPurpose;
}


export interface ForgotPasswordRequest {
    email: string;
}


export interface ResetPasswordRequest {
    token?: string;
    otp?: string;

    email: string;

    newPassword: string;
    confirmPassword: string;
}


export interface ChangePasswordRequest {
    currentPassword: string;

    newPassword: string;
    confirmPassword: string;
}


// ================================
// MFA / 2FA
// ================================

export interface EnableMfaRequest {
    method: MfaMethod;
}


export interface VerifyMfaRequest {
    code: string;

    method: MfaMethod;

    challengeId?: string;
}


export interface DisableMfaRequest {
    password: string;
    code?: string;
}


export interface MfaChallengeRequest {
    method: MfaMethod;
}



export interface AuthResponse {
    user: UserType;

    accessToken: string;
    refreshToken?: string;

    expiresIn?: number;

    requiresMfa?: boolean;
    requiresOtp?: boolean;

    mfaChallengeId?: string;
}


export interface OtpVerificationResponse {
    verified: boolean;

    user?: UserType;

    accessToken?: string;
    refreshToken?: string;

    requiresMfa?: boolean;
}


export interface MfaVerificationResponse {
    verified: boolean;

    accessToken?: string;
    refreshToken?: string;

    user?: UserType;
}


export interface PasswordResetResponse {
    success: boolean;

    message?: string;
}