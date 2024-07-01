import prisma from "@/lib/db";
import { VerificationToken } from "@prisma/client";

/**
 * Retrieves a verification token by token.
 * 
 * @param {string} token - The token of the verification token to retrieve.
 * @returns {Promise<VerificationToken | null>} A promise that resolves to the verification token if found, or null if not found or an error occurs.
 */
export const getVerificationTokenByToken = async (token: string): Promise<VerificationToken | null> => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        });
        return verificationToken;
    } catch (error) {
        return null;
    }
}

/**
 * Retrieves a verification token by user ID.
 * 
 * @param {string} userId - The ID of the user associated with the verification token to retrieve.
 * @returns {Promise<VerificationToken | null>} A promise that resolves to the verification token if found, or null if not found or an error occurs.
 */
export const getVerificationTokenByUserId = async (userId: string): Promise<VerificationToken | null> => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { userId }
        });
        return verificationToken;
    } catch (error) {
        console.error("Error fetching verification token by userId:", error);
        return null;
    }
};
