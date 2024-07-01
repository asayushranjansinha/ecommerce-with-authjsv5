import prisma from '@/lib/db';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getVerificationTokenByUserId } from '@/data/verification-token';
import { PasswordResetToken, VerificationToken } from '@prisma/client';


/**
 * Generates a verification token for the given email and userId.
 * The token will expire in 1 day (24 hours).
 *
 * @param {string} email - The email address to associate with the verification token.
 * @param {string} userId - The ID of the user to associate with the verification token.
 * @returns {Promise<VerificationToken>} A promise that resolves to the newly created verification token object.
 */
export const generateVerificationTokenWithEmailAndUserId = async (email: string, userId: string): Promise<VerificationToken> => {
    // Generate verification token
    const token = uuidv4();
    // Set token expiry time to be `1D`
    const expires = new Date(new Date().getTime() + 24 * 3600 * 1000);

    // Check for existinng token in the database and delete if found
    const existingToken = await getVerificationTokenByUserId(userId);
    if (existingToken) {
        await prisma.verificationToken.delete({
            where: { id: existingToken.id },
        });
    }

    // Insert new token in database
    const verificationToken = await prisma.verificationToken.create({
        data: {
            token,
            email,
            userId,
            expires,
        }
    });
    return verificationToken;
}

/**
 * Generates a password reset token in the database or replaces the existing one
 * 
 * @param email - The email to be associated with the token in the database.
 * @returns {Promise<PasswordResetToken>} A promise that resolves to the password reset token object from the database.
 */
export const generatePasswordResetToken = async (email: string): Promise<PasswordResetToken> => {
    const token = uuidv4();

    // Set expires in to be 1 hour from now
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    // Remove existing token from database associated with the email.
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id }
        });
    }

    // Add new token associated with the same email into the database.
    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        }
    });
    return passwordResetToken;
}


/**
 * Generates a new two-factor authentication (2FA) token for the specified email address.
 * If an existing token is found, it deletes the old token and creates a new one.
 * The token is a six-digit number and expires in 5 minutes.
 * 
 * @param {string} email - The email address for which to generate the 2FA token.
 * @returns {Promise<{ email: string; token: string; expires: Date; }>} A promise that resolves to the newly created 2FA token.
 */
export const generateTwoFactorToken = async (email: string): Promise<{ email: string; token: string; expires: Date; }> => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);
    if (existingToken) {
        await prisma.twoFactorToken.delete({
            where: { id: existingToken.id }
        });
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        }
    });
    return twoFactorToken;
}
