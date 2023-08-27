import { Configuration, LogLevel } from "@azure/msal-node";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.CLIENT_ID || "", // Use a default empty string or your desired fallback value
    authority:
      (process.env.CLOUD_INSTANCE || "") + (process.env.TENANT_ID || ""),
    clientSecret: process.env.CLIENT_SECRET || "",
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    },
  },
};

export const REDIRECT_URI = process.env.REDIRECT_URI || "";
export const POST_LOGOUT_REDIRECT_URI =
  process.env.POST_LOGOUT_REDIRECT_URI || "";
export const GRAPH_ME_ENDPOINT =
  (process.env.GRAPH_API_ENDPOINT || "") + "v1.0/me";
