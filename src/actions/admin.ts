"use server";

import { getCurrentUserRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
    const role = await getCurrentUserRole();
    if (role !== UserRole.ADMIN) {
        return { error: "Forbidden Action" }
    }
    return { success: "Allowed Action" }
}