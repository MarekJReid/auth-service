import {
    AuthorizationCodeRequest,
    AuthorizationUrlRequest,
    InteractionRequiredAuthError
} from "@azure/msal-node";




export const login = (options: {
    successRedirect?: string;
    scopes?: string[];
    redirectUri?: string;
}) => async (req: any, res: any, next: any) => {
    const state = /* generate your state here */;



    const authCodeUrlRequestParams: AuthorizationUrlRequest = {
        state: state,
        scopes: options.scopes || [],
        redirectUri: options.redirectUri || '',
    };

    const msalInstance = /* obtain your MSAL instance here */;

    // Trigger the first leg of auth code flow
    if (!req.body || !req.body.code) {
        try {
            const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(authCodeUrlRequestParams);
            res.redirect(authCodeUrlResponse);
        } catch (error) {
            next(error);
        }
    } else {
        // Handle the redirect and obtain the authorization code
        const authCodeRequestParams: AuthorizationCodeRequest = {
            state: state,
            scopes: options.scopes || [],
            redirectUri: options.redirectUri || '',
            code: req.body.code,
            codeVerifier: req.session.pkceCodes.verifier,
        };

        try {
            if (req.session.tokenCache) {
                msalInstance.getTokenCache().deserialize(req.session.tokenCache);
            }

            const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequestParams, req.body);

            req.session.tokenCache = msalInstance.getTokenCache().serialize();
            req.session.accessToken = tokenResponse.accessToken;
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;

            res.redirect(options.successRedirect || '/');
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                // Redirect to login if interaction is required
                return res.redirect(/* redirect to your login route */);
            }

            next(error);
        }
    }
};

export default login;
