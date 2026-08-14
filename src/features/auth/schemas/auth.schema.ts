
import * as zod from 'zod';

import {
    emailValidator,
    passwordValidator,
    mobileNoValidator,
    otpValidator,
    confirmPasswordValidator,
    currentPasswordValidator,
    fullNameValidator,
    requiredBooleanValidator,
} from '@/lib/validation';


// ============================================================
// REGISTRATION
// ============================================================

export const registrationSchema = zod
    .object({
        fullName: fullNameValidator,

        email: emailValidator,

        mobileNo: mobileNoValidator,

        password: passwordValidator,

        confirmPassword: confirmPasswordValidator,

        dateOfBirth: zod
            .string()
            .optional(),

        gender: zod
            .string()
            .optional(),

        membershipType: zod
            .string()
            .optional(),

        termsAccepted: requiredBooleanValidator(
            'You must accept the terms and conditions',
        ),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        },
    );

export type RegistrationFormValues =
    zod.infer<typeof registrationSchema>;


// ============================================================
// LOGIN
// ============================================================

export const loginSchema = zod.object({
    email: emailValidator,

    password: zod
        .string()
        .min(1, 'Password is required'),

    rememberMe: zod
        .boolean()
        .optional()
        .default(false),
});

export type LoginFormValues =
    zod.infer<typeof loginSchema>;


// ============================================================
// OTP VERIFICATION
// ============================================================

export const otpVerificationSchema = zod.object({
    otp: otpValidator,
});

export type OtpVerificationFormValues =
    zod.infer<typeof otpVerificationSchema>;


// ============================================================
// RESEND OTP
// ============================================================

export const resendOtpSchema = zod
    .object({
        email: emailValidator.optional(),

        mobileNo: mobileNoValidator.optional(),

        purpose: zod.enum([
            'REGISTRATION',
            'LOGIN',
            'PASSWORD_RESET',
            'MFA',
            'PHONE_VERIFICATION',
            'EMAIL_VERIFICATION',
        ]),
    })
    .refine(
        (data) => Boolean(data.email || data.mobileNo),
        {
            message: 'Email or mobile number is required',
            path: ['email'],
        },
    );

export type ResendOtpFormValues =
    zod.infer<typeof resendOtpSchema>;


// ============================================================
// FORGOT PASSWORD
// ============================================================

export const forgotPasswordSchema = zod.object({
    email: emailValidator,
});

export type ForgotPasswordFormValues =
    zod.infer<typeof forgotPasswordSchema>;


// ============================================================
// RESET PASSWORD
// ============================================================

export const resetPasswordSchema = zod
    .object({
        email: emailValidator,

        otp: otpValidator.optional(),

        token: zod
            .string()
            .min(1, 'Reset token is required')
            .optional(),

        newPassword: passwordValidator,

        confirmPassword: confirmPasswordValidator,
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        },
    )
    .refine(
        (data) => Boolean(data.otp || data.token),
        {
            message: 'OTP or reset token is required',
            path: ['otp'],
        },
    );

export type ResetPasswordFormValues =
    zod.infer<typeof resetPasswordSchema>;


// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changePasswordSchema = zod
    .object({
        currentPassword: currentPasswordValidator,

        newPassword: passwordValidator,

        confirmPassword: confirmPasswordValidator,
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        },
    )
    .refine(
        (data) => data.currentPassword !== data.newPassword,
        {
            message:
                'New password must be different from current password',
            path: ['newPassword'],
        },
    );

export type ChangePasswordFormValues =
    zod.infer<typeof changePasswordSchema>;


// ============================================================
// MFA / 2FA
// ============================================================

export const enableMfaSchema = zod.object({
    method: zod.enum([
        'SMS',
        'EMAIL',
        'AUTHENTICATOR_APP',
    ]),
});

export type EnableMfaFormValues =
    zod.infer<typeof enableMfaSchema>;


// ============================================================
// VERIFY MFA
// ============================================================

export const verifyMfaSchema = zod.object({
    code: otpValidator,

    method: zod.enum([
        'SMS',
        'EMAIL',
        'AUTHENTICATOR_APP',
    ]),

    challengeId: zod
        .string()
        .optional(),
});

export type VerifyMfaFormValues =
    zod.infer<typeof verifyMfaSchema>;


// ============================================================
// DISABLE MFA
// ============================================================

export const disableMfaSchema = zod.object({
    password: currentPasswordValidator,

    code: otpValidator.optional(),
});

export type DisableMfaFormValues =
    zod.infer<typeof disableMfaSchema>;


// ============================================================
// MFA CHALLENGE
// ============================================================

export const mfaChallengeSchema = zod.object({
    method: zod.enum([
        'SMS',
        'EMAIL',
        'AUTHENTICATOR_APP',
    ]),
});

export type MfaChallengeFormValues =
    zod.infer<typeof mfaChallengeSchema>;

