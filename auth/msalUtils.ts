import msal from "@azure/msal-node";
import axios from "axios";

export async function redirectToAuthCodeUrl(
  authCodeUrlRequestParams: any,
  authCodeRequestParams: any,
  msalInstance: { getAuthCodeUrl: (arg0: any) => any },
  generatePkceCodes: () =>
    | PromiseLike<{ verifier: any; challenge: any }>
    | { verifier: any; challenge: any }
) {
  return async (
    req: {
      session: {
        pkceCodes: { challenge: any; challengeMethod: any; verifier?: any };
        authCodeUrlRequest: any;
        authCodeRequest: any;
      };
    },
    res: { redirect: (arg0: any) => void },
    next: (arg0: unknown) => void
  ) => {
    const { verifier, challenge } = await generatePkceCodes();

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

export async function getCloudDiscoveryMetadata(authority: any) {
  const endpoint =
    "https://login.microsoftonline.com/common/discovery/instance";

  try {
    const response = await axios.get(endpoint, {
      params: {
        "api-version": "1.1",
        authorization_endpoint: `${authority}/oauth2/v2.0/authorize`,
      },
    });

    return await response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAuthorityMetadata(authority: any) {
  const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;

  try {
    const response = await axios.get(endpoint);
    return await response.data;
  } catch (error) {
    console.log(error);
  }
}
