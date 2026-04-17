import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";

function envOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: envOrThrow("BETTER_AUTH_SECRET"),
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    github: {
      clientId: envOrThrow("GITHUB_CLIENT_ID"),
      clientSecret: envOrThrow("GITHUB_CLIENT_SECRET"),
    },
    google: {
      clientId: envOrThrow("GOOGLE_CLIENT_ID"),
      clientSecret: envOrThrow("GOOGLE_CLIENT_SECRET"),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
});

export type Auth = typeof auth;
