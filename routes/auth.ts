import express from "express";
import { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } from "../authConfig";
import * as authProvider from "../auth/AuthProvider";
import login from "../auth/login";

const router = express.Router();

router.get(
  "/signin",
  login({
    scopes: [],
    redirectUri: REDIRECT_URI,
    successRedirect: "/",
  })
);

router.get(
  "/acquireToken",
  authProvider.acquireToken({
    scopes: ["User.Read"],
    redirectUri: REDIRECT_URI,
    successRedirect: "/users/profile",
  })
);

router.post("/redirect", authProvider.handleRedirect());

router.get(
  "/signout",
  authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
  })
);

export default router;
