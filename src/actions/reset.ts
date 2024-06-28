"use server";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/mail/mail";
import { ResetPasswordSchemaType, ResetSchema } from "@/schemas";


/**
 * Handles the password reset process by validating the input, checking if the user exists,
 * generating a password reset token, and sending the reset email.
 * 
 * @param {ResetPasswordSchemaType} values - The reset password request values containing the user's email.
 * @returns {Promise<{ success?: string; error?: string; }>} An object containing either a success or error message.
 */
export const resetPassword = async (values: ResetPasswordSchemaType): Promise<{ success?: string; error?: string; }> => {
    const validatedFields = ResetSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid email!" }
    }

    const { email } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
        return { error: "User not found!" };
    }

    try {
        const passwordResetToken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
        return { success: "Email to reset password sent!" }

    } catch (error) {
        console.log("Failed to reset password");
        return { error: "Unable to reset password. Please try again later!" }
    }
}