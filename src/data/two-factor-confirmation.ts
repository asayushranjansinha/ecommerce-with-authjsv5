import prisma from '@/lib/db'
import { TwoFactorConfirmation } from '@prisma/client';


/**
 * Retrives two factor confirmation from the database.
 * 
 * @param {string} userId - The userId associated with the two factor confirmation to search for.
 * @returns {Promise<TwoFactorConfirmation | null>} A promise that resolves to two factor confirmation object if found, otherwise null
 */
export const getTwoFactorConfirmationByUserId = async (userId: string): Promise<TwoFactorConfirmation | null> => {
    try {
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where: {
                userId
            }
        });

        return twoFactorConfirmation;
    } catch (error) {
        return null;
    }
}