
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
        queryFn: () => authService.getCurrentUser(),
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
            // If your backend returns the authenticated user,
            // you can update the current-user cache here.
            if (response?.user) {
                queryClient.setQueryData(
                    [COLLECTIONS.AUTH, 'me'],
                    response.user
                );
            }

            toast.success('Account created successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to create account'
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
            // If login response contains the user,
            // immediately populate the current-user cache.
            if (response?.user) {
                sessionStorage.setItem(
                    'access_token',
                    response.accessToken
                );
                queryClient.setQueryData(
                    [COLLECTIONS.AUTH, 'me'],
                    response.user
                );
            } else {
                // Otherwise let useCurrentUserQuery fetch it.
                queryClient.invalidateQueries({
                    queryKey: [COLLECTIONS.AUTH, 'me'],
                });
            }

            toast.success('Login successful');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Invalid email or password'
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
        mutationFn: () => authService.logout(),

        onSuccess: async () => {
            // Remove the current authenticated user.
            queryClient.setQueryData(
                [COLLECTIONS.AUTH, 'me'],
                null
            );

            // Clear all cached server data belonging
            // to the authenticated user.
            queryClient.clear();

            toast.success('Logged out successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to logout'
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
            if (response?.user) {
                queryClient.setQueryData(
                    [COLLECTIONS.AUTH, 'me'],
                    response.user
                );
            }

            toast.success('OTP verified successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to verify OTP'
            );
        },
    });
};


export const useResendOtpMutation = () => {
    return useMutation({
        mutationFn: (data: ResendOtpRequest) =>
            authService.resendOtp(data),

        onSuccess: () => {
            toast.success('OTP sent successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to resend OTP'
            );
        },
    });
};


// ============================================================
// Password Reset
// ============================================================

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordRequest) =>
            authService.forgotPassword(data),

        onSuccess: () => {
            toast.success(
                'Password reset instructions sent successfully'
            );
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to process password reset'
            );
        },
    });
};


export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ResetPasswordRequest) =>
            authService.resetPassword(data),

        onSuccess: () => {
            toast.success('Password reset successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to reset password'
            );
        },
    });
};


export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) =>
            authService.changePassword(data),

        onSuccess: () => {
            toast.success('Password changed successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to change password'
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

        onSuccess: () => {
            toast.success('MFA enabled successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to enable MFA'
            );
        },
    });
};


export const useVerifyMfaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VerifyMfaRequest) =>
            authService.verifyMfa(data),

        onSuccess: (response) => {
            if (response?.user) {
                queryClient.setQueryData<UserType>(
                    [COLLECTIONS.AUTH, 'me'],
                    response.user
                );
            }

            toast.success('MFA verified successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to verify MFA'
            );
        },
    });
};


export const useDisableMfaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DisableMfaRequest) =>
            authService.disableMfa(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [COLLECTIONS.AUTH, 'me'],
            });

            toast.success('MFA disabled successfully');
        },

        onError: (err: any) => {
            toast.error(
                err?.message || 'Failed to disable MFA'
            );
        },
    });
};

