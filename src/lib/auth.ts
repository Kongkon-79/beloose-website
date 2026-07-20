import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface LoginUser {
  _id: string;
  fullName: string;
  businessName?: string;
  email: string;
  role: string;
  verfied: string;
  status: string;
  isSubscription: boolean;
}

interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    user: LoginUser;
  };
}

interface AuthUser extends User {
  id: string;
  fullName: string;
  businessName: string;
  role: string;
  verified: string;
  status: string;
  isSubscription: boolean;
  accessToken: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        registrationAccessToken: { label: "Registration token", type: "text" },
        registrationUser: { label: "Registration user", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.registrationAccessToken && credentials.registrationUser) {
          try {
            const registeredUser = JSON.parse(credentials.registrationUser) as LoginUser;

            if (!registeredUser._id || !registeredUser.email) return null;

            return {
              id: registeredUser._id,
              name: registeredUser.fullName,
              email: registeredUser.email,
              fullName: registeredUser.fullName,
              businessName: registeredUser.businessName || "",
              role: registeredUser.role,
              verified: registeredUser.verfied,
              status: registeredUser.status,
              isSubscription: Boolean(registeredUser.isSubscription),
              accessToken: credentials.registrationAccessToken,
            } satisfies AuthUser;
          } catch {
            return null;
          }
        }

        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Please enter your email and password");
        }

        let response: Response;

        try {
          response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
          });
        } catch {
          throw new Error("Unable to connect to the login service");
        }

        let result: LoginResponse;

        try {
          result = (await response.json()) as LoginResponse;
        } catch {
          throw new Error("The login service returned an invalid response");
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Invalid email or password");
        }

        const accessToken = result.data?.accessToken;
        const user = result.data?.user;

        if (!accessToken || !user?._id) {
          throw new Error("The login response is missing user information");
        }

        return {
          id: user._id,
          name: user.fullName,
          email: user.email,
          fullName: user.fullName,
          businessName: user.businessName || "",
          role: user.role,
          verified: user.verfied,
          status: user.status,
          isSubscription: user.isSubscription,
          accessToken,
        } satisfies AuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;

        token.id = authUser.id;
        token.name = authUser.fullName;
        token.email = authUser.email;
        token.fullName = authUser.fullName;
        token.businessName = authUser.businessName;
        token.role = authUser.role;
        token.verified = authUser.verified;
        token.status = authUser.status;
        token.isSubscription = authUser.isSubscription;
        token.accessToken = authUser.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        name: token.fullName as string,
        fullName: token.fullName as string,
        businessName: token.businessName as string,
        email: token.email ?? "",
        role: token.role as string,
        verified: token.verified as string,
        status: token.status as string,
        isSubscription: Boolean(token.isSubscription),
      };
      session.accessToken = token.accessToken as string;

      return session;
    },
  },
};
