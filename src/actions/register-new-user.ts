"use server";


import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/mail/mail';
import { RegisterSchema, RegisterSchemaType } from '@/schemas';
import { generateVerificationToken } from '@/lib/tokens';


/**
 * Registers a new user by validating the input fields, hashing the password,
 * checking for existing user, creating a new user record, and sending a verification email.
 * 
 * @param {RegisterSchemaType} values - The values required for registration (email, name, password).
 * @returns {Promise<{ success?: string, error?: string }>} An object containing either a success or error message.
 */
export const registerNewUser = async (values: RegisterSchemaType): Promise<{ success?: string; error?: string; }> => {

    // Validate all fields to fullfil register schema
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    // Extract fields and check for existing user in the database
    const { email, name, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 8);
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already in use!" };
    }
    
    try {
        // Create new user in the database
        await prisma.user.create({
            data: {
                name, email, password: hashedPassword
            }
        });

        // Generate and send verification token to the provided email
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        // Handle success case after sending verification email
        console.log("Verification email sent successfully");
        return { success: "Check your email for the verification link." };

    } catch (error) {
        // Handle any errors that occur during database operation or email sending
        console.error("Error registering user:", error);
        return { error: "Failed to register user. Please try again later." };
    }
}

