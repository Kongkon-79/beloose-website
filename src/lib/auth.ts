import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          const response = await res.json();

          if (!res.ok || !response?.success) {
            throw new Error(response?.message || "Login failed");
          }

          const payload = response?.data ?? response;
          const user = payload?.user;
          const accessToken = payload?.accessToken ?? payload?.token;

          if (!user || !accessToken) {
            throw new Error(response?.message || "Invalid login response");
          }

          return {
            id: user?._id ?? user?.id,
            fullName: user?.fullName,
            businessName: user?.businessName ?? "",
            firstName: user?.firstName,
            lastName: user?.lastName,
            username: user?.username,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            status: user?.status,
            tag: user?.tag,
            gender: user?.gender,
            role: user?.role,
            verified: user?.verified ?? user?.verfied ?? "",
            isSubscription: Boolean(user?.isSubscription),
            profilePicture: user?.profilePicture,
            token: accessToken,
            accessToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Authentication failed. Please try again.";
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: { token: JWT; user?: any; trigger?: string; session?: any }) {
      if (user) {
        token.id = user.id ?? user._id;
        token.fullName = user.fullName;
        token.businessName = user.businessName;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.username = user.username;
        token.email = user.email;
        token.status = user.status;
        token.tag = user.tag;
        token.phoneNumber = user.phoneNumber;
        token.role = user.role;
        token.verified = user.verified;
        token.isSubscription = user.isSubscription;
        token.profilePicture = user.profilePicture;
        token.token = user.token ?? user.accessToken;
        token.accessToken = user.token ?? user.accessToken;
      }
      if (trigger === "update" && session) {
        token.fullName = session.fullName ?? token.fullName;
        token.email = session.email ?? token.email;
        token.profilePicture = session.profilePicture ?? token.profilePicture;
      }
      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        fullName: token.fullName,
        businessName: token.businessName,
        firstName: token.firstName,
        lastName: token.lastName,
        username: token.username,
        tag: token.tag,
        status: token.status,
        email: token.email,
        phoneNumber: token.phoneNumber,
        role: token.role,
        verified: token.verified,
        isSubscription: token.isSubscription,
        profilePicture: token.profilePicture,
        token: token.token ?? token.accessToken,
        accessToken: token.accessToken ?? token.token,
      };
      session.accessToken = token.accessToken ?? token.token;
      return session;
    },
  },
};
