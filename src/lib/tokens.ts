import crypto from 'crypto';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { PasswordResetToken } from '@prisma/client';


/**
 * Generates a new verification token for the specified email address.
 * If an existing token is found, it deletes the old token and creates a new one.
 * The token expires in 1 hour from the time of creation.
 * 
 * @param {string} email - The email address for which to generate the verification token.
 * @returns {Promise<{ email: string; token: string; expires: Date; }>} A promise that resolves to the newly created verification token.
 * @throws {Error} Throws an error if there is an issue generating the verification token.
 */
export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    // Expires in 1 hour from now
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await prisma.verificationToken.delete({ where: { id: existingToken.id } })
    }
    const newVerificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    });
    return newVerificationToken;
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
