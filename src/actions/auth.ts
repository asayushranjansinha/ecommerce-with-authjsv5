"use server";

import bcrypt from 'bcryptjs';
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

import { signIn } from "@/auth";
import { signOut } from "@/auth";

import { getUserByEmail, getUserById } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

import prisma from "@/lib/db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema, LoginSchemaType } from "@/schemas";
import { RegisterSchema, RegisterSchemaType } from '@/schemas';
import { sendVerificationEmail, sendTwoFactorEmail } from "@/mail/mail";
import { generateVerificationTokenWithEmailAndUserId, generateTwoFactorToken } from '@/lib/tokens';

const redirectUrl = process.env.NEXT_PUBLIC_AFTER_LOGOUT_URL;

/**
 * Attempts to authenticate a user with provided credentials and handles 2FA (Two Factor Authentication) if enabled.
 * 
 * Validating credentials, generating and sending E-mail verification link for unverified users, and 2FA code for users with 2FA.
 * 
 * Verifying 2FA code and logging in user using signIn
 * 
 * @param {LoginSchemaType} values - The login credentials.
 * @param {string | null} [callbackUrl] - Optional callback URL after successful login.
 * @returns {Promise<{ status: 'success' | 'error' | 'twoFactor', message: string }>} Returns an object with status and a message.
 */
export const logInUserWithCredentials = async (values: LoginSchemaType, callbackUrl?: string | null): Promise<{ status: 'success' | 'error' | 'twoFactor'; message: string; }> => {
    // Validate all fields to fulfill login schema
    const validatedFields = LoginSchema.safeParse(values);

    // Check if validation succeeded
    if (!validatedFields.success) {
        return { status: 'error', message: "Invalid credentials." };
    }

    const { email, password, code } = validatedFields.data;

    // Retrieve existing user from the database based on email
    const existingUser = await getUserByEmail(email);

    // Check if user exists and has valid credentials
    if (!existingUser || !existingUser.email || !existingUser.password) {
        // Return error state and message if user or credentials are invalid
        return { status: 'error', message: "Invalid credentials. Please check your email and password and try again." };
    }

    // Check if user's email is not verified
    if (!existingUser.emailVerified) {
        // Generate a verification token for the user's email
        const verificationToken = await generateVerificationTokenWithEmailAndUserId(existingUser.email, existingUser.id);

        // Send the verification email with the generated token
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return {
            status: 'success', message: "Check your inbox for verification link."
        };
    }

    // Check if two-factor authentication is enabled for the user and email exists
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        // If a 2FA code is provided
        if (code) {
            // Retrieve the stored 2FA token for the user's email
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            // Check if the provided 2FA code matches the stored token
            if (!twoFactorToken || twoFactorToken.token !== code) {
                // Return error state and message for invalid 2FA code
                return { status: 'error', message: "Invalid two-factor authentication code. Please check your code and try again." };
            }

            // Check if the 2FA token has expired
            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                // Return error state and message for expired 2FA code
                return { status: 'error', message: "The two-factor authentication code has expired. Please request a new code and try logging in again." };
            }

            // Delete the used 2FA token from the database
            await prisma.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            });

            // Delete any existing 2FA confirmation for the user
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmation) {
                await prisma.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                });
            }

            // Create a new 2FA confirmation record for the user
            await prisma.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            });
        } else {
            // Generate a new 2FA token for the user's email
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);

            // Send the 2FA token to the user via email
            await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

            // Return state indicating 2FA is required and provide instructions to the user
            return {
                status: 'twoFactor',
                message: "A two-factor authentication code has been sent to your email. Please check your inbox and enter the code to complete the login process."
            };
        }
    }

    try {
        // Attempt to sign in using credentials
        await signIn("credentials", {
            email,
            password,
            // DEFAULT_LOGIN_REDIRECT - Redirect URL after successful login (currently /settings)
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
            redirect: true
        });
        return { status: 'success', message: "Login successful. Redirecting..." };

    } catch (error) {

        // Redirects in next js happens through errors
        // https://github.com/nextauthjs/next-auth/discussions/9389#discussioncomment-9595229
        if (isRedirectError(error)) {
            throw error;
        }

        console.log("Error in signIn in login-user :", error);

        // Handle specific types of authentication errors
        if (error instanceof AuthError) {
            const { type, cause } = error as AuthError;
            switch (type) {
                case "CredentialsSignin":
                    // Return error state and message for invalid credentials
                    return { status: 'error', message: "Invalid credentials. Please check your email and password and try again." };
                case "CallbackRouteError":
                    return { status: 'error', message: cause?.err?.toString() ? cause?.err?.toString() : 'Something went wrong. Please try again later.' }
                default:
                    // Return generic error state and message for other authentication errors
                    return { status: 'error', message: "Something went wrong. Please try again later." };
            }
        }

        return { status: 'error', message: "Something went wrong. Please try logging in again later." };
    }

};


/**
 * Logs out the currently authenticated user and redirects to a specified URL.
 * @returns {Promise<void>} A promise that resolves when the sign-out process is complete.
 */
export const logoutAndRedirect = async (): Promise<void> => {
    await signOut({
        redirectTo: redirectUrl,
        redirect: true
    });
};


/**
 * Registers a new user by validating the input fields, hashing the password,
 * checking for existing user, creating a new user record in the database,
 * and sending a verification email.
 * 
 * @param {RegisterSchemaType} values - The values required for registration (email, name, password).
 * @returns {Promise<{ status: 'error' | 'success', message: string }>} Returns an object with status and message.
 */
export const registerNewUserWithCredentials = async (values: RegisterSchemaType): Promise<{ status: 'success' | 'error'; message: string }> => {

    // Validate all fields to fullfil register schema
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return { status: 'error', message: "Invalid credentials." };
    }

    // Extract fields and check for existing user in the database
    const { email, name, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 8);
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { status: 'error', message: "Email address is already in use. Please use a different email or login." };
    }

    try {
        // Create new user in the database
        const user = await prisma.user.create({
            data: {
                name, email, password: hashedPassword
            }
        });

        // Generate and send verification token to the provided email
        const verificationToken = await generateVerificationTokenWithEmailAndUserId(user.email, user.id);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { status: 'success', message: "User registration successful. Check your email for the verification link." };

    } catch (error) {
        console.error("Error registering user: ", error);
        return { status: 'error', message: "Failed to register user. Please try again later." };
    }
}


/**
 * Verifies the email of a new user using the provided verification token.
 * Updates the user's email verification status and deletes the verification token if valid.
 * 
 * @param {string} token - The verification token used for email verification.
 * @returns {Promise<{ status: 'success' | 'error'; message: string }>} An object with status and message.
 */
export const verifyUserEmail = async (token: string): Promise<{ status: 'success' | 'error'; message: string }> => {
    try {
        // Retrieve existing email verification token from the database
        const existingToken = await getVerificationTokenByToken(token);
        if (!existingToken) {
            return { status: 'error', message: 'Invalid verification link. Please request a new link and try again.' }
        }

        // TODO: logic to implement search based on user id not on email to allow email change functionality
        // Check if token is expired
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return { status: 'error', message: "The verification link has expired. Please request a new link and try again." };
        }

        // Retrieve the user associated with the token
        // const existingUser = await getUserByEmail(existingToken.email);
        const existingUser = await getUserById(existingToken.userId);
        if (!existingUser) {
            return { status: 'error', message: "User not found or invalid email address associated with the verification link." };
        }

        // Update the user associated with the token
        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(),
                email: existingToken.email
            }
        });

        // Delete the verification token to prevent complications
        await prisma.verificationToken.delete({
            where: { id: existingToken.id }
        });

        return { status: 'success', message: "Email verified successfully! You can now log in to your account." };
    } catch (error) {
        console.error("Error verifying user email: ", error);
        return { status: 'error', message: "An error occurred while verifying your email. Please try again later." };
    }
}