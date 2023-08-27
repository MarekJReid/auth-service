const logout =
  (msalConfig: any) =>
  (options: { postLogoutRedirectUri?: string }) =>
  (req: any, res: any) => {
    /**
     * Construct a logout URI and redirect the user to end the
     * session with Azure AD. For more information, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
     */
    let logoutUri = `${msalConfig.auth.authority}/oauth2/v2.0/`;

    if (options.postLogoutRedirectUri) {
      logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`;
    }

    req.session.destroy(() => {
      res.redirect(logoutUri);
    });
  };

export default logout;
