import { InteractionRequiredAuthError } from "@azure/msal-node";

const handleRedirect = async (
  msalInstance: any,
  cryptoProvider: any,
  req: any,
  res: any,
  next: any
) => {
  if (!req.body || !req.body.state) {
    return next(new Error("Error: response not found"));
  }

  const authCodeRequest = {
    ...req.session.authCodeRequest,
    code: req.body.code,
    codeVerifier: req.session.pkceCodes.verifier,
  };

  try {
    if (req.session.tokenCache) {
      msalInstance.getTokenCache().deserialize(req.session.tokenCache);
    }

    const tokenResponse = await msalInstance.acquireTokenByCode(
      authCodeRequest,
      req.body
    );

    req.session.tokenCache = msalInstance.getTokenCache().serialize();
    req.session.idToken = tokenResponse.idToken;
    req.session.account = tokenResponse.account;
    req.session.isAuthenticated = true;

    const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));
    res.redirect(state.successRedirect);
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      // Handle the interaction required scenario
      // You can customize this based on your needs
      res.redirect("/login");
    } else {
      next(error);
    }
  }
};

export default handleRedirect;
