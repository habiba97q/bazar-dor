import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { memoryAdapter } from "better-auth/adapters/memory";

import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

let adapter;

let uri = process.env.MONGODB_URI;
if (
  uri &&
  !uri.includes("REPLACE_WITH_YOUR_PASSWORD") &&
  !uri.includes("<password>")
) {
  // If Windows DNS blocks querySrv, use the direct replica set URI
  if (uri.startsWith("mongodb+srv://") && uri.includes("cluster0.p6dhjka.mongodb.net")) {
    const credsMatch = uri.match(/mongodb\+srv:\/\/([^@]+)@/);
    if (credsMatch) {
      const creds = credsMatch[1];
      uri = `mongodb://${creds}@ac-wwyrwmp-shard-00-00.p6dhjka.mongodb.net:27017,ac-wwyrwmp-shard-00-01.p6dhjka.mongodb.net:27017,ac-wwyrwmp-shard-00-02.p6dhjka.mongodb.net:27017/bazardor?ssl=true&replicaSet=atlas-fnwdhm-shard-0&authSource=admin&retryWrites=true&w=majority`;
    }
  }

  try {
    if (!globalThis._mongoClient) {
      globalThis._mongoClient = new MongoClient(uri);
    }
    const client = globalThis._mongoClient;
    const db = client.db();
    adapter = mongodbAdapter(db, { client, transaction: false });
  } catch (e) {
    console.warn("MongoDB initialization failed, falling back to memory adapter:", e);
  }
}

if (!adapter) {
  globalThis._betterAuthStore = globalThis._betterAuthStore || {};
  adapter = memoryAdapter(globalThis._betterAuthStore);
}

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "ENKshEi1D8ZBTwVugKCKPktu95fvrwwn_secure_fallback_key",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://bazar-dor-orcin.vercel.app"
      : "http://localhost:3000"),
  trustedOrigins: [
    "http://localhost:3000",
    "https://bazar-dor-orcin.vercel.app",
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    "*.vercel.app",
  ].filter(Boolean),
  database: adapter,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "google_client_id_placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google_client_secret_placeholder",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "github_client_id_placeholder",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "github_client_secret_placeholder",
    },
  },
});
