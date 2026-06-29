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
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "client",
        input: true,
      },
      skills: {
        type: "string[]",
        required: false,
        defaultValue: [],
        input: false,
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false,
      },
      hourlyRate: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      isVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
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
