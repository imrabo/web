// ================================
// AUTH ENUMS
// ================================

import type { UserType } from "@/features/users";

export enum OtpPurpose {
    REGISTRATION = 'REGISTRATION',
    LOGIN = 'LOGIN',
    PASSWORD_RESET = 'PASSWORD_RESET',
    MFA = 'MFA',
    PHONE_VERIFICATION = 'PHONE_VERIFICATION',
    EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

export enum MfaMethod {
    SMS = 'SMS',
    EMAIL = 'EMAIL',
    AUTHENTICATOR_APP = 'AUTHENTICATOR_APP',
}


// ================================
// AUTH REQUEST TYPES
// ================================

export interface RegistrationRequest {
    first_name: string;
    last_name: string;

    username: string;
    email: string;

    phone_number?: string | null;

    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface OtpVerificationRequest {
    phone_number?: string;
    email?: string;

    otp: string;

    purpose: OtpPurpose;
}

export interface ResendOtpRequest {
    phone_number?: string;
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


// ================================
// AUTH RESPONSES
// ================================

export interface AuthResponse {
    user: UserType;

    access_token: string;
    refresh_token?: string;

    expiresIn?: number;

    requiresMfa?: boolean;
    requiresOtp?: boolean;

    mfaChallengeId?: string;
}

export interface OtpVerificationResponse {
    verified: boolean;

    user?: UserType;

    access_token?: string;
    refresh_token?: string;

    requiresMfa?: boolean;
}

export interface MfaVerificationResponse {
    verified: boolean;

    access_token?: string;
    refresh_token?: string;

    user?: UserType;
}

export interface PasswordResetResponse {
    success: boolean;

    message?: string;
}