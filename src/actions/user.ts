"use server"

import bcrypt from 'bcryptjs'

import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail, getUserById } from "@/data/user"
import { getCurrentUser } from "@/utils/auth"
import prisma from '@/lib/db'
import { generatePasswordResetToken } from "@/lib/tokens"
import { UserUpdates, prepareUpdates, updateUserInDatabase, updateUserSession } from '@/lib/user-setting'
import { sendPasswordResetEmail } from "@/mail/mail"
import { NewPasswordSchema, NewPasswordSchemaType, ResetPasswordSchemaType, ResetSchema, SettingsSchemaType } from "@/schemas"

/**
 * Updates the password using password reset token sent on email, for providing forgot password functionality.
 * 
 * Validating the reset token, and new password followed by updating new password in the database.
 * 
 * @param {NewPasswordSchemaType} values - The new password details.
 * @param {string | null} [token] - The token for password reset.
 * @returns {Promise<{ status: 'success' | 'error'; message: string }>} Returns an object with status and a message.
 */
export const updatePasswordUsingPasswordResetToken = async (values: NewPasswordSchemaType, token?: string | null): Promise<{ status: 'success' | 'error'; message: string }> => {
    // Check if the token is provided
    if (!token) return { status: 'error', message: "Invalid request. Please request a new link and try again." };

    // Validate the new password fields
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
        return { status: 'error', message: "Invalid password format. Please ensure your password meets the required criteria." };
    }

    // Extracting password from values
    const { password } = validatedFields.data;

    // Retrieve the existing password reset token from the database
    const existingToken = await getPasswordResetTokenByToken(token);

    // Check if the token is valid
    if (!existingToken) {
        return { status: 'error', message: "Invalid request. Please request a new link and try again." };
    }

    // Check if the token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { status: 'error', message: "Invalid request. Please request a new link and try again." };
    }

    // Retrieve the user associated with the token
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { status: 'error', message: "User not found. Please request a new link and try again." };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Update the user's password in the database
    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            password: hashedPassword
        }
    });

    // Delete the used password reset token from the database
    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
    });

    return { status: 'success', message: "Your password has been successfully reset. Try logging in with your new password." };
};



/**
 * Handles the forgot password functionality by validating the email,
 * generating a password reset token, and sending a password reset email.
 * 
 * @param {ResetPasswordSchemaType} values - The values containing the email for password reset.
 * @returns {Promise<{ status: 'error' | 'success'; message: string }>} An object indicating the status and message.
 */
export const forgotPasswordAndSendEmail = async (values: ResetPasswordSchemaType): Promise<{ status: 'error' | 'success'; message: string }> => {
    // Validate the input email field
    const validatedFields = ResetSchema.safeParse(values);
    if (!validatedFields.success) {
        return { status: 'error', message: "Invalid email address." };
    }

    // Extract the email from validated data
    const { email } = validatedFields.data;

    // Check if a user exists with the provided email
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
        return { status: 'error', message: "User not found." };
    }

    try {
        // Generate a password reset token for the user's email
        const passwordResetToken = await generatePasswordResetToken(email);

        // Send the password reset email with the generated token
        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

        return { status: 'success', message: "Password reset email sent." };

    } catch (error) {
        console.log("Failed to reset password:", error);
        return { status: 'error', message: "Failed to send password reset email. Please try again later." };
    }
}

/**
 * Updates user settings based on the provided values.
 * 
 * @param {SettingsSchemaType} values - The updated settings values.
 * @returns {Promise<{ status: 'success' | 'error'; message: string }>} 
 * A promise that resolves to an object indicating the status of the update and a message.
 */
export const updateUserSettings = async (values: SettingsSchemaType): Promise<{
    status: 'success' | 'error';
    message: string;
}> => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { status: 'error', message: "Unauthorized request. Please log in again." };
        }

        const dbUser = await getUserById(user.id);
        if (!dbUser) {
            return { status: 'error', message: "User not found." };
        }

        const updateResult = await prepareUpdates(user, dbUser, values);
        if (updateResult.status === 'error' || !updateResult.updates) {
            return { status: updateResult.status, message: updateResult.message }
        }

        const updatedUser = await updateUserInDatabase(dbUser.id, updateResult.updates as UserUpdates);
        await updateUserSession(updatedUser);

        return { status: 'success', message: updateResult.message };
    } catch (error) {
        console.error("Error updating user settings: ", error);
        return { status: 'error', message: "Something went wrong. Please try again later." };
    }
};









