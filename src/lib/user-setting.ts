import { getUserByEmail } from "@/data/user";
import { SettingsSchemaType } from "@/schemas";
import { User } from "@prisma/client";
import { Session } from "next-auth";
import { generateVerificationTokenWithEmailAndUserId } from "./tokens";
import bcrypt from 'bcryptjs';
import prisma from "./db";
import { unstable_update } from "@/auth";
import { sendVerificationEmail } from "@/mail/mail";

export type UserUpdates = Partial<Pick<User, 'name' | 'email' | 'password' | 'role' | 'isTwoFactorEnabled'>>



/**
 * Prepares user updates based on the provided values and current user information.
 * 
 * @param {Session['user']} user - The current session user.
 * @param {User} dbUser - The current user data from the database.
 * @param {SettingsSchemaType} values - The updated settings values.
 * @returns {Promise<{ status: 'error' | 'success'; message: string; updates: UserUpdates | null }>}
 * A promise that resolves to an object indicating the status of the updates, a message, and the updates object if successful.
 */
export async function prepareUpdates(
    user: Session['user'],
    dbUser: User,
    values: SettingsSchemaType
): Promise<{ status: 'error' | 'success'; message: string; updates: UserUpdates | null }> {
    let updates: UserUpdates = {};
    let message: string = "Settings update successful."

    // Handle updates for oAuth Users with only name and role update
    if (user.isOAuth) {
        const oAuthUpdates = handleOAuthUser(updates, values);
        return { status: 'success', message, updates: oAuthUpdates }
    }


    // Check if email is required to be updated or not
    if (values.email && values.email !== user.email) {
        const emailUpdate = await handleEmailUpdate(values.email, user.id);
        return { status: emailUpdate.status, message: emailUpdate.message, updates: null }
    }

    // Check if password updates are required or not
    if (values.password && values.newPassword && dbUser.password) {
        const passwordUpdates = await handlePasswordUpdate(values.password, values.newPassword, dbUser.password);


        if (passwordUpdates.status === 'error') {
            return { status: 'error', message: passwordUpdates.message, updates: null }
        }
        updates.password = passwordUpdates.newHashedPassword;
    }

    // General updates, name, role, 2FA
    updates.name = values.name || dbUser.name;
    updates.role = values.role || dbUser.role;
    updates.isTwoFactorEnabled = values.isTwoFactorEnabled ?? dbUser.isTwoFactorEnabled;

    return { status: 'success', message, updates }
}

/**
 * Updates a user object with OAuth settings.
 * 
 * @param {UserUpdates} updates - The user object to update.
 * @param {SettingsSchemaType} values - An object containing the OAuth settings.
 * @returns {UserUpdates} The updated user object.
 */
function handleOAuthUser(
    updates: UserUpdates,
    values: SettingsSchemaType
): UserUpdates {
    updates.name = values.name;
    updates.role = values.role;
    return updates;
}

/**
 * Handles the email update by sending new verification token to new email.
 * 
 * @param {string} email - The new email address to set.
 * @param {string} userId - The ID of the user updating the email.
 * @returns {Promise<{ status: 'success' | 'error'; message: string }>} 
 * A promise that resolves to an object indicating the status of the email update and a message.
 */
async function handleEmailUpdate(
    email: string,
    userId: string
): Promise<{ status: 'success' | 'error'; message: string }> {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return { status: "error", message: "Email already in use." };
    }

    const verificationToken = await generateVerificationTokenWithEmailAndUserId(email, userId);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { status: "success", message: "Check your inbox for verification link." };
}


/**
 * Handles the password update and returns new hashed password.
 * 
 * @param {string} currentPassword - The user's current password.
 * @param {string} newPassword - The new password to set.
 * @param {string} dbPassword - The user's current password stored in the database (hashed).
 * @returns {Promise<{ status: 'success' | 'error'; message: string; newHashedPassword?: string }>} 
 * A promise that resolves to an object indicating the status of the password update and the new hashed password if successful.
 */
async function handlePasswordUpdate(
    currentPassword: string,
    newPassword: string,
    dbPassword: string
): Promise<{ status: 'success' | 'error'; message: string; newHashedPassword?: string }> {
    const passwordMatch = await bcrypt.compare(currentPassword, dbPassword);
    if (!passwordMatch) {
        return { status: "error", message: "Current password does not match." };
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 8);
    return { status: "success", message: "Password update successful.", newHashedPassword };
}

/**
 * Updates a user in the database with the provided updates.
 * 
 * @param {string} userId - The ID of the user to update.
 * @param {UserUpdates} updates - An object containing the user updates.
 * @returns {Promise<User>} A promise that resolves to the updated user object.
 */
export async function updateUserInDatabase(userId: string, updates: UserUpdates): Promise<User> {
    return await prisma.user.update({
        where: { id: userId },
        data: updates
    });
}


/**
 * Updates the user session with the provided user updates.
 * 
 * @param {UserUpdates} updatedUser - An object containing the updated user information.
 * @returns {Promise<void>} A promise that resolves when the user session is updated.
 */
export async function updateUserSession(updatedUser: UserUpdates): Promise<void> {
    await unstable_update({
        user: {
            ...updatedUser
        }
    });
}
