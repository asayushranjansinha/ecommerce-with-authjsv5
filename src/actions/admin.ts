"use server";
import { getCurrentUserRole } from "@/utils/auth";
import { UserRole } from "@prisma/client";

/**
 * Checks if the current user has admin access or not.
 * @returns {Promise<{ message: string, status: 'success' | 'error' }>} Returns an object with a status and a message.
 */
export const checkAdminAccess = async (): Promise<{ message: string; status: 'success' | 'error'; }> => {
    const role = await getCurrentUserRole();
    if (role !== UserRole.ADMIN) {
        return { status: 'error', message: "You do not have permission to perform this action. Admin access required." };
    }
    return { status: 'success', message: "Action allowed. Admin privileges verified." };
};