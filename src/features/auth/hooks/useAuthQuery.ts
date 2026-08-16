'use client';

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { authService } from '../services/authService';

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
} from '../types/auth.types';

import type { UserType } from '@/features/users';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';


// ============================================================
// Current User
// ============================================================

export const useCurrentUserQuery = () => {
    return useQuery({
        queryKey: [COLLECTIONS.AUTH, 'me'],

        queryFn: async () => {
            const response = await authService.getCurrentUser();

            return response.data;
        },
    });
};


// ============================================================
// Registration
// ============================================================

export const useRegisterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegistrationRequest) =>
            authService.register(data),

        onSuccess: (response) => {
            // if (response.data) {
            //     queryClient.setQueryData<UserType>(
            //         [COLLECTIONS.AUTH, 'me'],
            //         response.data,
            //     );
            // }

            toast.success(
                response.message ||
                'Account created successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to create account',
            );
        },
    });
};


// ============================================================
// Login
// ============================================================

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginRequest) =>
            authService.login(data),

        onSuccess: (response) => {
            const tokenResponse = response.data;

            console.log('Login successful:', tokenResponse);

            if (!tokenResponse?.access_token) {

                toast.error(
                    'Login succeeded but access token was not returned.',
                );
                return;
            }

            /*
             * Do NOT store the JWT in sessionStorage/localStorage
             * if your architecture requires the token to exist
             * only in memory.
             *
             * Store it in your auth state/store here.
             *
             * Example:
             *
             * authStore.setAccessToken(
             *     tokenResponse.access_token
             * );
             */

            queryClient.invalidateQueries({
                queryKey: [COLLECTIONS.AUTH, 'me'],
            });

            toast.success(
                response.message || 'Login successful',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Invalid username or password',
            );
        },
    });
};


// ============================================================
// Logout
// ============================================================

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            authService.logout(),

        onSuccess: (response) => {
            // Remove current authenticated user.
            queryClient.setQueryData(
                [COLLECTIONS.AUTH, 'me'],
                null,
            );

            // Clear cached authenticated data.
            queryClient.clear();

            /*
             * Also clear the access token from your
             * in-memory auth store here.
             *
             * Example:
             *
             * authStore.clearAccessToken();
             */

            toast.success(
                response.message || 'Logged out successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to logout',
            );
        },
    });
};


// ============================================================
// OTP
// ============================================================

export const useVerifyOtpMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: OtpVerificationRequest) =>
            authService.verifyOtp(data),

        onSuccess: (response) => {
            // if (response.data) {
            //     queryClient.setQueryData<UserType>(
            //         [COLLECTIONS.AUTH, 'me'],
            //         response.data,
            //     );
            // }

            toast.success(
                response.message ||
                'OTP verified successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to verify OTP',
            );
        },
    });
};


// ============================================================
// Resend OTP
// ============================================================

export const useResendOtpMutation = () => {
    return useMutation({
        mutationFn: (data: ResendOtpRequest) =>
            authService.resendOtp(data),

        onSuccess: (response) => {
            toast.success(
                response.message ||
                'OTP sent successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to resend OTP',
            );
        },
    });
};


// ============================================================
// Forgot Password
// ============================================================

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordRequest) =>
            authService.forgotPassword(data),

        onSuccess: (response) => {
            toast.success(
                response.message ||
                'Password reset instructions sent successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to process password reset',
            );
        },
    });
};


// ============================================================
// Reset Password
// ============================================================

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ResetPasswordRequest) =>
            authService.resetPassword(data),

        onSuccess: (response) => {
            toast.success(
                response.message ||
                'Password reset successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to reset password',
            );
        },
    });
};


// ============================================================
// Change Password
// ============================================================

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) =>
            authService.changePassword(data),

        onSuccess: (response) => {
            toast.success(
                response.message ||
                'Password changed successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to change password',
            );
        },
    });
};


// ============================================================
// MFA / 2FA
// ============================================================

export const useEnableMfaMutation = () => {
    return useMutation({
        mutationFn: (data: EnableMfaRequest) =>
            authService.enableMfa(data),

        onSuccess: (response) => {
            toast.success(
                response.message ||
                'MFA enabled successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to enable MFA',
            );
        },
    });
};


// ============================================================
// Verify MFA
// ============================================================

export const useVerifyMfaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VerifyMfaRequest) =>
            authService.verifyMfa(data),

        onSuccess: (response) => {
            // if (response.data) {
            //     queryClient.setQueryData<UserType | null>(
            //         [COLLECTIONS.AUTH, 'me'],
            //         response.data,
            //     );
            // }

            toast.success(
                response.message ||
                'MFA verified successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to verify MFA',
            );
        },
    });
};


// ============================================================
// Disable MFA
// ============================================================

export const useDisableMfaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DisableMfaRequest) =>
            authService.disableMfa(data),

        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: [COLLECTIONS.AUTH, 'me'],
            });

            toast.success(
                response.message ||
                'MFA disabled successfully',
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                'Failed to disable MFA',
            );
        },
    });
};