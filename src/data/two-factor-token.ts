import prisma from '@/lib/db'
import { TwoFactorToken } from '@prisma/client';

/**
 * Retrieves a two factor token from database.
 * 
 * @param {string} token - The token to search for in the database.
 * @returns {Promise<TwoFactorToken | null>} A promise that resolves to the two factor token object if found, otherwise null
 */
export const getTwoFactorTokenByToken = async (token: string): Promise<TwoFactorToken | null> => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findUnique({
            where: { token }
        });
        return twoFactorToken;
    } catch (error) {
        return null;
    }
}

/**
 * Retrieves a two factor token from the database.
 * 
 * @param {string} email - The email associated with the token to search for in the database.
 * @returns {Promise<TwoFactorToken | null} A promise that resolves to the two factor token if found, otherwise null
 */
export const getTwoFactorTokenByEmail = async (email: string): Promise<TwoFactorToken | null> => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findFirst({
            where: { email }
        });
        return twoFactorToken;
    } catch (error) {
        return null;
    }
}