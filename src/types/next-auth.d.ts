import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: DefaultSession["user"] & {
      id: string;
      fullName: string;
      businessName: string;
      role: string;
      verified: string;
      status: string;
      isSubscription: boolean;
    };
  }

  interface User {
    fullName: string;
    businessName: string;
    role: string;
    verified: string;
    status: string;
    isSubscription: boolean;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fullName: string;
    businessName: string;
    role: string;
    verified: string;
    status: string;
    isSubscription: boolean;
    accessToken: string;
  }
}
