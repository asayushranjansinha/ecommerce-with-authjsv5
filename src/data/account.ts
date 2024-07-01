import prisma from '@/lib/db';
import { Account } from '@prisma/client';


/**
 * Retrieves an account by user ID.
 * 
 * @param {string} userId - The ID of the user whose account is being retrieved.
 * @returns {Promise<Account | null>} A promise that resolves to the account if found, or null if not found or an error occurs.
 */
export const getAccountByUserId = async (userId: string): Promise<Account | null> => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                userId
            }
        });
        if (!account) return null;
        return account;

    } catch (error) {
        return null;
    }
}