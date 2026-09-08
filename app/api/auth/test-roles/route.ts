import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-utils";

export const GET = withAuth(async (req, session) => {
    return NextResponse.json({
        message: "You are allowed!",
        role: session.user.role
    }, { status: 200 });
}, "editor");
