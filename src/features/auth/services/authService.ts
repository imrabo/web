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
<<<<<<< HEAD
        apiClient.post<AuthResponse>('/auth-user/register', data),
=======
        apiClient.post<AuthResponse>('/auth/register', data),
>>>>>>> d1b3273a40bade3ada722899f90296323b1a3854


    // ================================
    // Login
    // ================================

    login: (data: LoginRequest) =>
<<<<<<< HEAD
        apiClient.post<AuthResponse>('/auth-user/login', data),
    logout: () =>
        apiClient.post<AuthResponse>('/auth-user/logout', {}),
=======
        apiClient.post<AuthResponse>('/auth/login', data),
    logout: () =>
        apiClient.post<AuthResponse>('/auth/logout', {}),
>>>>>>> d1b3273a40bade3ada722899f90296323b1a3854


    // ================================
    // OTP
    // ================================

    verifyOtp: (data: OtpVerificationRequest) =>
<<<<<<< HEAD
        apiClient.post<OtpVerificationResponse>('/auth-user/otp/verify', data),

    resendOtp: (data: ResendOtpRequest) =>
        apiClient.post<void>('/auth-user/otp/resend', data),
=======
        apiClient.post<OtpVerificationResponse>('/auth/otp/verify', data),

    resendOtp: (data: ResendOtpRequest) =>
        apiClient.post<void>('/auth/otp/resend', data),
>>>>>>> d1b3273a40bade3ada722899f90296323b1a3854


    // ================================
    // Password Reset
    // ================================

    forgotPassword: (data: ForgotPasswordRequest) =>
<<<<<<< HEAD
        apiClient.post<PasswordResetResponse>('/auth-user/password/forgot', data),

    resetPassword: (data: ResetPasswordRequest) =>
        apiClient.post<PasswordResetResponse>('/auth-user/password/reset', data),

    changePassword: (data: ChangePasswordRequest) =>
        apiClient.post<void>('/auth-user/password/change', data),
=======
        apiClient.post<PasswordResetResponse>('/auth/password/forgot', data),

    resetPassword: (data: ResetPasswordRequest) =>
        apiClient.post<PasswordResetResponse>('/auth/password/reset', data),

    changePassword: (data: ChangePasswordRequest) =>
        apiClient.post<void>('/auth/password/change', data),
>>>>>>> d1b3273a40bade3ada722899f90296323b1a3854


    // ================================
    // MFA / 2FA
    // ================================

    enableMfa: (data: EnableMfaRequest) =>
<<<<<<< HEAD
        apiClient.post<void>('/auth-user/mfa/enable', data),

    verifyMfa: (data: VerifyMfaRequest) =>
        apiClient.post<MfaVerificationResponse>('/auth-user/mfa/verify', data),

    disableMfa: (data: DisableMfaRequest) =>
        apiClient.post<void>('/auth-user/mfa/disable', data),
=======
        apiClient.post<void>('/auth/mfa/enable', data),

    verifyMfa: (data: VerifyMfaRequest) =>
        apiClient.post<MfaVerificationResponse>('/auth/mfa/verify', data),

    disableMfa: (data: DisableMfaRequest) =>
        apiClient.post<void>('/auth/mfa/disable', data),
>>>>>>> d1b3273a40bade3ada722899f90296323b1a3854


    // ================================
    // Current User
    // ================================

    getCurrentUser: () =>
<<<<<<< HEAD
        apiClient.get<UserType | null>('/auth-user/me'),
=======
        apiClient.get<UserType | null>('/auth/me'),
>>>>>>> d1b3273a40bade3ada722899f90296323b1a3854
};