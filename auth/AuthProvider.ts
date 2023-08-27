import msal from "@azure/msal-node";
import axios from "axios";

const cryptoProvider = new msal.CryptoProvider();

async function getMsalInstance(msalConfig: any) {
  return new msal.ConfidentialClientApplication(msalConfig);
}

async function redirectToAuthCodeUrl(
  authCodeUrlRequestParams: any,
  authCodeRequestParams: any
) {
  const msalInstance = await getMsalInstance(
    authCodeUrlRequestParams.msalConfig
  );
  return createRedirectToAuthCodeUrl(
    authCodeUrlRequestParams,
    authCodeRequestParams,
    msalInstance
  );
}

async function createRedirectToAuthCodeUrl(
  authCodeUrlRequestParams: any,
  authCodeRequestParams: any,
  msalInstance: any
) {
  return async (req: any, res: any, next: any) => {
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

    req.session.pkceCodes = {
      challengeMethod: "S256",
      verifier: verifier,
      challenge: challenge,
    };

    req.session.authCodeUrlRequest = {
      ...authCodeUrlRequestParams,
      responseMode: msal.ResponseMode.FORM_POST,
      codeChallenge: req.session.pkceCodes.challenge,
      codeChallengeMethod: req.session.pkceCodes.challengeMethod,
    };

    req.session.authCodeRequest = {
      ...authCodeRequestParams,
      code: "",
    };

    try {
      const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(
        req.session.authCodeUrlRequest
      );
      res.redirect(authCodeUrlResponse);
    } catch (error) {
      next(error);
    }
  };
}

async function getCloudDiscoveryMetadata(authority: string) {
  const endpoint =
    "https://login.microsoftonline.com/common/discovery/instance";

  try {
    const response = await axios.get(endpoint, {
      params: {
        "api-version": "1.1",
        authorization_endpoint: `${authority}/oauth2/v2.0/authorize`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getAuthorityMetadata(authority: string) {
  const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;

  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export {
  getMsalInstance,
  redirectToAuthCodeUrl,
  getCloudDiscoveryMetadata,
  getAuthorityMetadata,
};
export function login(arg0: {
  scopes: never[];
  redirectUri: string;
  successRedirect: string;
}): import("express-serve-static-core").RequestHandler<
  {},
  any,
  any,
  import("qs").ParsedQs,
  Record<string, any>
> {
  throw new Error("Function not implemented.");
}

export function acquireToken(arg0: {
  scopes: string[];
  redirectUri: string;
  successRedirect: string;
}): import("express-serve-static-core").RequestHandler<
  {},
  any,
  any,
  import("qs").ParsedQs,
  Record<string, any>
> {
  throw new Error("Function not implemented.");
}

export function handleRedirect(): import("express-serve-static-core").RequestHandler<
  {},
  any,
  any,
  import("qs").ParsedQs,
  Record<string, any>
> {
  throw new Error("Function not implemented.");
}

export function logout(arg0: {
  postLogoutRedirectUri: string;
}): import("express-serve-static-core").RequestHandler<
  {},
  any,
  any,
  import("qs").ParsedQs,
  Record<string, any>
> {
  throw new Error("Function not implemented.");
}
