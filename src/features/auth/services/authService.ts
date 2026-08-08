import { apiClient } from '@/lib/api/client';
import type { UserType } from '@/features/users';

import type {
    RegistrationRequest,
    LoginRequest,
    OtpVerificationRequest,
    ResendOtpRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    EnableMfaRequest,
    VerifyMfaRequest,
    DisableMfaRequest,
    AuthResponse,
    OtpVerificationResponse,
    MfaVerificationResponse,
    PasswordResetResponse,
} from '../types/auth.types';


export const authService = {
    // ================================
    // Registration
    // ================================

    register: (data: RegistrationRequest) =>
        apiClient.post<AuthResponse>('/auth/register', data),


    // ================================
    // Login
    // ================================

    login: (data: LoginRequest) =>
        apiClient.post<AuthResponse>('/auth/login', data),
    logout: () =>
        apiClient.post<AuthResponse>('/auth/logout', {}),


    // ================================
    // OTP
    // ================================

    verifyOtp: (data: OtpVerificationRequest) =>
        apiClient.post<OtpVerificationResponse>('/auth/otp/verify', data),

    resendOtp: (data: ResendOtpRequest) =>
        apiClient.post<void>('/auth/otp/resend', data),


    // ================================
    // Password Reset
    // ================================

    forgotPassword: (data: ForgotPasswordRequest) =>
        apiClient.post<PasswordResetResponse>('/auth/password/forgot', data),

    resetPassword: (data: ResetPasswordRequest) =>
        apiClient.post<PasswordResetResponse>('/auth/password/reset', data),

    changePassword: (data: ChangePasswordRequest) =>
        apiClient.post<void>('/auth/password/change', data),


    // ================================
    // MFA / 2FA
    // ================================

    enableMfa: (data: EnableMfaRequest) =>
        apiClient.post<void>('/auth/mfa/enable', data),

    verifyMfa: (data: VerifyMfaRequest) =>
        apiClient.post<MfaVerificationResponse>('/auth/mfa/verify', data),

    disableMfa: (data: DisableMfaRequest) =>
        apiClient.post<void>('/auth/mfa/disable', data),


    // ================================
    // Current User
    // ================================

    getCurrentUser: () =>
        apiClient.get<UserType | null>('/auth/me'),
};