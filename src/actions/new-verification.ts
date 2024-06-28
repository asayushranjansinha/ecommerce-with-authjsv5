"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import prisma from "@/lib/db";


/**
 * Verifies the provided token, updates the user's email verification status, and deletes the token.
 * 
 * @param {string} token - The verification token to be validated and used for email verification.
 * @returns {Promise<{ success?: string; error?: string; }>} An object containing either a success or error message.
 */
export const newVerification = async (token: string): Promise<{ success?: string; error?: string; }> => {

    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
        return { error: "Invalid request!" }

    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) return { error: "Token Expired!" }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: "Unauthorized!! Invalid email!" }
    }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    });


    // delete verification token to prevent complications
    await prisma.verificationToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "Email verified!" }
}