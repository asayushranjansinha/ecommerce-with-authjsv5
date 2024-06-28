"use server";

import { useCurrentUserRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
    const role = await useCurrentUserRole();
    if (role !== UserRole.ADMIN) {
        return { error: "Forbidden Action" }
    }
    return { success: "Allowed Action" }
}