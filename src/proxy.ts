import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

const auth = withAuth(
  function proxy(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export default function proxy(req: NextRequest) {
  return (auth as any)(req);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cuadrilla/:path*"
  ],
};