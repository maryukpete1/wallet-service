# Swagger Testing Guide

This guide provides step-by-step instructions on how to test the Wallet Service API using the built-in Swagger UI.

## 1. Accessing Swagger UI

1.  Ensure your application is running (`npm run start:dev` or deployed URL).
2.  Open your web browser.
3.  Navigate to: `http://localhost:3000/api` (or `https://<your-deployed-url>/api`).

You should see the "Wallet Service API" documentation page listing all available endpoints.

## 2. Authentication

Most endpoints require authentication. You need a JWT (JSON Web Token) to authorize your requests.

### Step 2.1: Get a JWT Token
Since Google OAuth is the primary login method, you cannot "login" directly via Swagger's "Try it out" button for the `/auth/google` endpoint because it redirects to Google.

**Method A: Via Browser (Easiest)**
1.  Open a new tab and visit `http://localhost:3000/auth/google`.
2.  Complete the Google Sign-In process.
3.  You will be redirected to the callback URL.
4.  **Copy the `access_token`** from the JSON response displayed in your browser.

### Step 2.2: Authorize in Swagger
1.  Go back to the Swagger UI tab.
2.  Click the **Authorize** button at the top right.
3.  In the "BearerAuth" section, paste your token into the **Value** field.
    *   *Note: Swagger automatically adds the "Bearer " prefix, so just paste the token string.*
4.  Click **Authorize**, then **Close**.

The padlock icons next to the endpoints should now appear "locked," indicating you are authenticated.

## 3. Testing Endpoints

### 3.1 Create an API Key
1.  Scroll to the **API Keys** section.
2.  Click on `POST /keys/create`.
3.  Click **Try it out**.
4.  In the **Request body**, modify the JSON if needed:
    ```json
    {
      "name": "Test Key",
      "permissions": [
        "deposit",
        "transfer",
        "read"
      ],
      "expiry": "30d"
    }
    ```
5.  Click **Execute**.
6.  Scroll down to **Server response**. You should see a `201 Created` response containing your new `apiKey`. **Copy this key**.

### 3.2 Initialize a Deposit
1.  Scroll to the **Wallet** section.
2.  Click on `POST /wallet/deposit`.
3.  Click **Try it out**.
4.  In the **Request body**:
    ```json
    {
      "amount": 5000
    }
    ```
5.  Click **Execute**.
6.  The response will contain an `authorization_url`. Copy this URL and open it in a new tab to complete the payment on Paystack's checkout page.

### 3.3 Check Balance
1.  Click on `GET /wallet/balance`.
2.  Click **Try it out**.
3.  Click **Execute**.
4.  The response will show your current wallet balance.

### 3.4 Transfer Funds
1.  Click on `POST /wallet/transfer`.
2.  Click **Try it out**.
3.  Enter the recipient's wallet number and amount in the JSON body.
    *   *Tip: You might need to create a second user/wallet to test this fully.*
4.  Click **Execute**.

## 4. Troubleshooting

*   **401 Unauthorized**: Your token has expired or was not added correctly. Refresh the page and re-authorize (Step 2).
*   **403 Forbidden**: Your API key or User does not have the required permissions.
*   **Failed to fetch**: This usually means CORS is blocked or the server is down. (We fixed CORS in the previous step, so this should not happen).
