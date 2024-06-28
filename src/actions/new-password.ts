"use server"
import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import prisma from '@/lib/db'
import { NewPasswordSchema, NewPasswordSchemaType } from "@/schemas"
import bcrypt from 'bcryptjs'

/**
 * Resets the user's password using the provided values and token.
 * Validates the input, checks for the token's existence and expiration, verifies the user,
 * updates the password, and deletes the reset token.
 * 
 * @param {NewPasswordSchemaType} values - The new password values.
 * @param {string | null} [token] - The token used for password reset. Optional parameter that defaults to null.
 * @returns {Promise<{ success?: string; error?: string; }>} A promise that resolves to an object containing either a success or error message.
 */
export const newPassword = async (values: NewPasswordSchemaType, token?: string | null): Promise<{ success?: string; error?: string }> => {
    if (!token) return { error: "Missing token!" }

    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid credentials!" }
    }
    const { password } = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Invalid token!" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: "Token expired!" }
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: "Email does not exist!" }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            password: hashedPassword
        }
    });

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "Password reset completed" }
}