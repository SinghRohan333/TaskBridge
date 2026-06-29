import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("taskbridge-db");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "client",
        input: true, // allows the client to set this on signUp.email
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // Force Client role for anyone arriving via Google OAuth,
          // regardless of what (if anything) was passed in.
          const isGoogleSignUp =
            ctx?.context?.provider === "google" || ctx?.provider === "google";
          if (isGoogleSignUp) {
            return { data: { ...user, role: "client" } };
          }
          return { data: user };
        },
      },
    },
  },
});
