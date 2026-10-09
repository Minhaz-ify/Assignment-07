import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Remove accidental spaces, trailing slashes or dots from the env value
const siteUrl = (process.env.BETTER_AUTH_URL || "").trim().replace(/[\/.\s]+$/, "");

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: siteUrl || undefined,
  trustedOrigins: [
    siteUrl,
    "https://assignment-07-xi.vercel.app",
    "https://*.vercel.app", // preview / alternate Vercel URLs
    "http://localhost:3000",
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // after sign up -> go to the sign in page
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
});