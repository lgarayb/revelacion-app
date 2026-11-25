import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

const auth = withAuth(
  function proxy(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) return false;

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        if (adminEmail) {
          return token.email?.toLowerCase() === adminEmail;
        }

        return true;
      },
    },
  }
);

export default function proxy(req: NextRequest) {
  return (auth as any)(req);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cuadrilla/:path*",
  ],
};