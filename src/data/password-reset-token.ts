import prisma from '@/lib/db'
import { PasswordResetToken } from '@prisma/client';

/**
 * Retrieves a password reset token from the database.
 *
 * @param {string} token - The token to search for in the database.
 * @returns {Promise<PasswordResetToken|null>} A promise that resolves to the password reset token object if found, otherwise null.
 */
export const getPasswordResetTokenByToken = async (token:string): Promise<PasswordResetToken | null> => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        return passwordResetToken;

    } catch (error) {   
        return null;
    }
}



/**
 * Retrieves the first password reset token associated with a given email from the database.
 *
 * @param {string} email - The email to search for in the database.
 * @returns {Promise<PasswordResetToken | null>} A promise that resolves to the password reset token object if found, otherwise null.
 */
export const getPasswordResetTokenByEmail = async (email: string): Promise<PasswordResetToken | null> => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email }
        });

        return passwordResetToken;

    } catch (error) {   
        return null;
    }
}

