// custom.d.ts

declare module "express-session" {
  interface Session {
    accessToken: string;
  }
}
