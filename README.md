# auth-service
This will be the service that provides authorisation for the front end service in the SUS application .

This is deliberately containerised in order for it to be used in other applications in the future.


---

# App Developer Guide

 This guide provides an overview of the `auth-service` backend, a list of endpoints, and developer instructions.

## Auth-Service Overview

The `auth-service` backend is built using Express.js and integrates with Microsoft Authentication Library (MSAL) to create a secure authentication flow. It consists of the following components:

- **Authentication Routes**: These routes handle the authentication and authorization processes using MSAL.
- **Session Management**: The app uses `express-session` to manage user sessions and store tokens securely.

## Endpoints

### Authentication Endpoints

1. **GET /auth/signin**: Initiates the authentication flow and redirects users to the Microsoft login page.
2. **GET /auth/acquireToken**: Acquires an access token after successful authentication.
3. **POST /auth/redirect**: Handles the redirect URL after authentication and obtains the authorization code.

### Other Endpoints

1. **GET /users/profile**: Fetches the user's profile information after successful authentication.

## Developer Instructions

To set up and run the `auth-service` backend:

1. Clone this repository.
2. Navigate to the `auth-service` directory and run `npm install` to install dependencies.
3. Configure environment variables in `.env` file (e.g., MSAL configuration).
4. Build the Docker container using `docker-compose build auth-service`.
5. Start the Docker containers using `docker-compose up`.

## Additional Resources

- [MSAL Node Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node/docs)
- [Express.js Documentation](https://expressjs.com/)

---

Feel free to reach out if you have any questions or need further assistance. Happy coding!

---

This README is a concise overview of the `auth-service` backend and provides developer instructions for setup and usage.
