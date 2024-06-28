"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/mail/mail";
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens';
import { LoginSchema, LoginSchemaType } from "@/schemas";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import prisma from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const loginUser = async (values: LoginSchemaType, callbackUrl?: string | null): Promise<{ success?: string; error?: string; twoFactor?: boolean; }> => {
    // Validate all fields to fullfil login schema
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    // Extract fields and check for existing user in the database
    const { email, password, code } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        // TODO: Logic of success or failure for email sent

        return { success: "Confirmation email sent!" }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if (!twoFactorToken || twoFactorToken.token !== code) {
                return { error: "Invalid code" }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: "Code expired! Please try log in again!" }
            }

            await prisma.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmation) {
                await prisma.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                })
            }
            await prisma.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            // currently just set to /settings page, shows some error on successful login and redirect
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
            redirect: true
        });
    } catch (error) {
        // this is what seems to be returning the error message "CallbackRouteError" for invalid credentials case
        console.log("Error :", error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials." };
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }

    return { error: "Something went wrong. Please try again later!!" };
};