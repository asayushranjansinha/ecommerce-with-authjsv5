import prisma from '@/lib/db';
import { User } from '@prisma/client';

/**
 * Retrieves a user by email.
 * 
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<User | null>} A promise that resolves to the user if found, or null if not found or an error occurs.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        return null;
    }
};

/**
 * Retrieves a user by ID.
 * 
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<User | null>} A promise that resolves to the user if found, or null if not found or an error occurs.
 */
export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    } catch (error) {
        return null;
    }
};
