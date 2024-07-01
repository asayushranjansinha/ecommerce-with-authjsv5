import { transporter } from '@/lib/mail';
import { verificationEmailTemplate, passwordResetEmailTemplate, twoFactorEmailTemplate } from '@/mail/template';


const domain = process.env.NEXT_PUBLIC_APP_URL;

/**
 * Sends a verification email to the specified email address with a verification token link.
 * 
 * @param {string} email - The recipient's email address.
 * @param {string} token - The verification token used in the verification link.
 * @returns {Promise<void>} A promise that resolves once the email has been successfully sent.
 * @throws {Error} If there is an error sending the verification email.
 */
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    try {
        await transporter.sendMail({
            from: '"Ecommerce Support" <ayushranjan1277@gmail.com>',
            to: email,
            subject: "Verify Your Email Address",
            html: verificationEmailTemplate(confirmLink)
        });
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
}


/**
 * Sends a password reset email to the specified email address with a provided reset token.
 * Generates a reset link and sends an email containing the link.
 * 
 * @param {string} email - The email address to which the password reset email will be sent.
 * @param {string} token - The token used to reset the password.
 * @returns {Promise<void>} A promise that resolves when the email is successfully sent.
 * @throws {Error} Throws an error if there is an issue sending the password reset email.
 */
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;
    try {
        await transporter.sendMail({
            from: '"Ecommerce Support" <ayushranjan1277@gmail.com>',
            to: email,
            subject: "Reset your password",
            html: passwordResetEmailTemplate(resetLink)
        });
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
}


/**
 * Sends a TFA mail to the specified email address with the TFA code.
 * 
 * @param {string} email - The email address to which the TFA email will be sent.
 * @param {string} token - The token used to TFA.
 * @returns {Promise<void>} A promise that resolves when the email is successfully sent.
 * @throws {Error} Throws an error if there is an issue sending the TFA email.
 */
export const sendTwoFactorEmail = async (email: string, token: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: '"Ecommerce Support" <ayushranjan1277@gmail.com>',
            to: email,
            subject: "Two Factor Authentication Code",
            html: twoFactorEmailTemplate(token)
        });
        console.log("Two Factor Authentication email sent successfully");
    } catch (error) {
        console.error("Error sending Two Factor Authentication email:", error);
        throw new Error("Failed to send Two Factor Authentication email");
    }
}