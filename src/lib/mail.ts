import nodemailer from "nodemailer";

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.EMAIL_PASSWORD;

/**
 * Nodemailer transporter configured for sending emails via Gmail.
 * Uses environment variables EMAIL and EMAIL_PASSWORD for authentication.
 */
export const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    }
});
