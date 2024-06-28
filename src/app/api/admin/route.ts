import { useCurrentUserRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const role = await useCurrentUserRole();
    if (role === UserRole.ADMIN) {
        return new NextResponse(null, { status: 200 });
    }
    return new NextResponse(null, { status: 403 });
}