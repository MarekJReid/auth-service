import { InteractionRequiredAuthError } from "@azure/msal-node";

const acquireToken = async (
  msalInstance: any,
  req: any,
  res: any,
  next: any,
  options: {
    scopes?: string[];
    successRedirect?: string;
    redirectUri?: string;
  }
) => {
  try {
    /**
     * If a token cache exists in the session, deserialize it and set it as the
     * cache for the new MSAL CCA instance. For more, see:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/caching.md
     */
    if (req.session.tokenCache) {
      msalInstance.getTokenCache().deserialize(req.session.tokenCache);
    }

    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: req.session.account,
      scopes: options.scopes || [],
    });

    /**
     * On successful token acquisition, write the updated token
     * cache back to the session. For more, see:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/caching.md
     */
    req.session.tokenCache = msalInstance.getTokenCache().serialize();
    req.session.accessToken = tokenResponse.accessToken;
    req.session.idToken = tokenResponse.idToken;
    req.session.account = tokenResponse.account;

    res.redirect(options.successRedirect);
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

export default acquireToken;
