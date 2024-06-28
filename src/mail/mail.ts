import { transporter } from '@/lib/nodemailer';


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
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4a4a4a; text-align: center;">Email Verification</h1>
                    <p style="color: #666; line-height: 1.5;">Thank you for registering. Please click the button below to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${confirmLink}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                    </div>
                    <p style="color: #666; line-height: 1.5;">If you didn't request this verification, please ignore this email.</p>
                    <p style="color: #666; line-height: 1.5;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p style="word-break: break-all; color: #007bff;">${confirmLink}</p>
                </div>
            `
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
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4a4a4a; text-align: center;">Reset Password</h1>
                    <p style="color: #666; line-height: 1.5;">Click below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset password</a>
                    </div>
                    <p style="color: #666; line-height: 1.5;">If you didn't request this reset password request, please ignore this email.</p>
                    <p style="color: #666; line-height: 1.5;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p style="word-break: break-all; color: #007bff;">${resetLink}</p>
                </div>
            `
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
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h1 style="color: #007bff; text-align: center; margin-bottom: 20px;">Your Two Factor Authentication Code</h1>
            <p style="color: #4a4a4a; line-height: 1.6; text-align: center;">Use the following code to complete your login process. This code is valid for a limited time, so please use it promptly.</p>
            <div style="text-align: center; margin: 30px 0;">
                <p style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 24px; letter-spacing: 3px;">${token}</p>
            </div>
            <p style="color: #666; line-height: 1.6; text-align: center;">If you did not request this code, please ignore this email or contact support.</p>
            <p style="color: #666; line-height: 1.6; text-align: center; margin-top: 20px;">Thank you, <br> The Ecommerce Support Team</p>
        </div>
        
            `
        });
        console.log("Two Factor Authentication email sent successfully");
    } catch (error) {
        console.error("Error sending Two Factor Authentication email:", error);
        throw new Error("Failed to send Two Factor Authentication email");
    }

}