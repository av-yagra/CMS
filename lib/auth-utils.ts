import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

// Define the valid roles in our system natively
export type Role = "user" | "editor" | "admin";

// Establish a weight hierarchy for simple greater-than/less-than permission checking
const roleWeights: Record<Role, number> = {
    user: 1,
    editor: 2,
    admin: 3,
};

// Define a unified signature for route handlers safely bypassing the complexity 
// of Next.js internal context typings, while remaining strictly secure
export type AuthenticatedRouteHandler = (
    req: Request,
    session: Session,
    context: any
) => Promise<NextResponse | Response> | NextResponse | Response;

/**
 * A reusable Higher-Order Function (HOF) to protect backend API routes.
 * It strictly determines authentication status and validates role hierarchy privileges.
 * 
 * @param handler The API route logic to execute if authorized
 * @param minimumRole The minimum required role (default: "user")
 * @returns Standard Next.js Request handler mapped safely with Auth checks.
 */
export function withAuth(
    handler: AuthenticatedRouteHandler,
    minimumRole: Role = "user"
) {
    return async (req: Request, context: any) => {
        try {
            // Retrieve session natively initialized by Auth.js using the JWT cookie
            const session = await auth();

            // 1. Unauthenticated -> 401 Unauthorized
            if (!session || !session.user) {
                return NextResponse.json(
                    { message: "Unauthorized: Missing or invalid authentication session." },
                    { status: 401 }
                );
            }

            // Extract the user role established in the database exclusively 
            // fallback gracefully to base 'user' level privileges.
            const userRole = (session.user.role as Role) || "user";

            const requiredWeight = roleWeights[minimumRole] || 1;
            const userWeight = roleWeights[userRole] || 1;

            // 2. Authenticated but insufficient permission -> 403 Forbidden
            if (userWeight < requiredWeight) {
                return NextResponse.json(
                    { message: "Forbidden: You do not possess the required privileges to perform this action." },
                    { status: 403 }
                );
            }

            // 3. Authorized -> Pass to the explicit target handler injecting the trusted session
            return await handler(req, session, context);

        } catch (error) {
            // Logs stay secure server-side without leaking implementation details or stacks
            console.error("Authorization wrapper encountered an error:", error);
            return NextResponse.json(
                { message: "Internal server error occurred during authorization." },
                { status: 500 }
            );
        }
    };
}
