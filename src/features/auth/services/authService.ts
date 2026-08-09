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
        apiClient.post<AuthResponse>('/auth-user/register', data),


    // ================================
    // Login
    // ================================

    login: (data: LoginRequest) =>
        apiClient.post<AuthResponse>('/auth-user/login', data),
    logout: () =>
        apiClient.post<AuthResponse>('/auth-user/logout', {}),


    // ================================
    // OTP
    // ================================

    verifyOtp: (data: OtpVerificationRequest) =>
        apiClient.post<OtpVerificationResponse>('/auth-user/otp/verify', data),

    resendOtp: (data: ResendOtpRequest) =>
        apiClient.post<void>('/auth-user/otp/resend', data),


    // ================================
    // Password Reset
    // ================================

    forgotPassword: (data: ForgotPasswordRequest) =>
        apiClient.post<PasswordResetResponse>('/auth-user/password/forgot', data),

    resetPassword: (data: ResetPasswordRequest) =>
        apiClient.post<PasswordResetResponse>('/auth-user/password/reset', data),

    changePassword: (data: ChangePasswordRequest) =>
        apiClient.post<void>('/auth-user/password/change', data),


    // ================================
    // MFA / 2FA
    // ================================

    enableMfa: (data: EnableMfaRequest) =>
        apiClient.post<void>('/auth-user/mfa/enable', data),

    verifyMfa: (data: VerifyMfaRequest) =>
        apiClient.post<MfaVerificationResponse>('/auth-user/mfa/verify', data),

    disableMfa: (data: DisableMfaRequest) =>
        apiClient.post<void>('/auth-user/mfa/disable', data),


    // ================================
    // Current User
    // ================================

    getCurrentUser: () =>
        apiClient.get<UserType | null>('/auth-user/me'),
};