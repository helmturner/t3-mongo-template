import {
  type Adapter,
  type AdapterAccount,
  type AdapterSession,
  type AdapterUser,
  type VerificationToken,
} from "next-auth/adapters";
import {
  type AuthOptions,
  getServerSession,
  type DefaultSession,
  type User,
} from "next-auth";
import { env } from "@/env.mjs";
import clientPromise from "./db";
import GitHubProvider from "next-auth/providers/github";
import type { GetServerSidePropsContext } from "next";
import { ObjectId } from "mongodb";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  //  interface User {
  //    ...other properties
  //    role: UserRole;
  //  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }
}

const getAuthOptions = async (): Promise<AuthOptions> => {
  const client = await clientPromise;
  const db = client.db(env.DB_NAME);
  const userCollection =
    db.collection<Omit<Omit<User, "email"> & AdapterUser, "id">>("users");
  const sessionCollection = db.collection<
    Omit<AdapterSession, "userId"> & { userId: ObjectId }
  >("sessions");
  const accountCollection = db.collection<Omit<AdapterAccount, "userId"> & { userId: ObjectId }>("accounts");
  const tokenCollection =
    db.collection<Omit<VerificationToken, "id">>("verificationTokens");

  const adapter: Adapter<true> = {
    createSession: async (session) => {
      const { userId, ...rest } = session;
      const newSession = await sessionCollection.insertOne({
        ...rest,
        userId: ObjectId.createFromHexString(userId),
      });
      if (!newSession.insertedId) throw new Error("Failed to create session");
      return session;
    },
    deleteSession: async (token) => {
      const deleted = await sessionCollection.findOneAndDelete({
        sessionToken: token,
      });
      if (!deleted.ok) throw new Error("Failed to delete session");
    },
    getSessionAndUser: async (token) => {
      const session = await sessionCollection.findOne({ sessionToken: token });
      if (!session) return null;
      const user = await userCollection.findOne({ _id: session.userId });
      if (!user) return null;
      return {
        session: {
          ...session,
          userId: session.userId.toHexString(),
        },
        user: {
          ...user,
          id: user._id.toHexString(),
        },
      };
    },
    updateSession: async (session) => {
      const { sessionToken, userId, ...rest } = session;
      const updated = await sessionCollection.findOneAndUpdate(
        { sessionToken },
        {
          $set: {
            ...rest,
            ...(userId && { userId: ObjectId.createFromHexString(userId) }),
          },
        }
      );
      if (!updated.ok) throw new Error("Failed to update session");
      const updatedSession = await sessionCollection.findOne({ sessionToken });
      if (!updatedSession) throw new Error("Failed to find updated session");
      return { ...updatedSession, userId: updatedSession.userId.toHexString() };
    },
    createUser: async (user) => {
      const newUser = await userCollection.insertOne(user);
      return {
        ...user,
        id: newUser.insertedId.toHexString(),
      };
    },
    getUser: async (userId) => {
      const user = await userCollection.findOne({ _id: ObjectId.createFromHexString(userId) });
      if (!user) return null;
      const { _id, ...rest } = user;
      return {
        ...rest,
        id: _id.toHexString(),
      };
    },
    getUserByEmail: async (email) => {
      const user = await userCollection.findOne({ email });
      if (!user) return null;
      const { _id, ...rest } = user;
      return {
        ...rest,
        id: _id.toHexString(),
      };
    },
    updateUser: async (user) => {
      const { id, ...rest } = user;
      if (!id) throw new Error("User id is required");
      const updated = await userCollection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id) },
        { $set: rest }
      );
      if (!updated.ok) throw new Error("Failed to update user");
      const updatedUser = await userCollection.findOne({
        _id: ObjectId.createFromHexString(id),
      });
      if (!updatedUser) throw new Error("Failed to find updated user");
      return {
        ...updatedUser,
        id: updatedUser._id.toHexString(),
      };
    },
    getUserByAccount: async (account) => {
      const userAccount = await accountCollection.findOne({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });
      if (!userAccount) return null;
      const user = await userCollection.findOne({ _id: userAccount.userId });
      if (!user) return null;
      const { _id, ...rest } = user;
      return {
        ...rest,
        id: _id.toHexString(),
      };
    },
    linkAccount: async (account) => {
      const { userId, ...rest } = account;
      const newAccount = await accountCollection.insertOne({
        ...rest,
        userId: ObjectId.createFromHexString(userId),
      });
      if (!newAccount.insertedId) throw new Error("Failed to link account");
      return account;
    },
    unlinkAccount: async (account) => {
      const deleted = await accountCollection.findOneAndDelete({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });
      if (!deleted.ok) throw new Error("Failed to unlink account");
    },
    createVerificationToken: async (token) => {
      const newToken = await tokenCollection.insertOne(token);
      if (!newToken.insertedId) throw new Error("Failed to create token");
      return token;
    },
    useVerificationToken: async ({identifier, token}) => {
      const deleted = await tokenCollection.findOneAndDelete({
        identifier,
        token,
      });
      return deleted.value;
    },
  };

  return {
    adapter,
    secret: env.NEXTAUTH_SECRET,
    providers: [
      GitHubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      }),
    ],
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
      jwt({ token, user, profile }) {
        if (user && profile) {
          token.user.id = user.id;
        }
        return token;
      },
      session({ session, token }) {
        session.user.id = token.user.id;
        return session;
      },
    },
  };
};

export const authOptions = await getAuthOptions();

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
