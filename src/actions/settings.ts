"use server";
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById } from "@/data/user";
import { SettingsSchemaType } from "@/schemas";
import { getCurrentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/mail/mail";
import { unstable_update } from "@/auth";


export const settings = async (values: SettingsSchemaType) => {
    const user = await getCurrentUser();

    if (!user) {
        return { error: "Unauthorized!" }
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "Unauthorized!" }
    }


    if (user.isOAuth) {
        values.email = undefined;
        values.newPassword = undefined;
        values.password = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    // Case for update email
    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);
        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" };
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "Please check your email for verification link." }
    }


    // Handle password update
    if (values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
        if (!passwordMatch) {
            return { error: "Incorrect password!" }
        }
    }


    const updatedUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
            ...values
        }
    });

    await unstable_update({
        user: {
            ...updatedUser
        }
    })
    return { success: "Settings updated!" }
}