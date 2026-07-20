import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => Boolean(token && token.role === "retailer"),
  },
});

export const config = {
  matcher: ["/retailer-dashboard/:path*"],
};
