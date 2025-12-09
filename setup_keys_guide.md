# Setup Keys Guide

This guide explains how to obtain the necessary API keys for the Wallet Service.

## 1. Google OAuth Keys

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  Select **Web application**.
6.  Set **Authorized redirect URIs** to `http://localhost:3000/auth/google/callback`.
7.  Copy the **Client ID** and **Client Secret**.
8.  Add them to your `.env` file:
    ```env
    GOOGLE_CLIENT_ID=your_client_id
    GOOGLE_CLIENT_SECRET=your_client_secret
    GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
    ```

## 2. Paystack Keys

1.  Sign up or log in to [Paystack](https://dashboard.paystack.com/).
2.  Go to **Settings** > **API Keys & Webhooks**.
3.  Copy the **Secret Key** (Test Mode).
4.  Add it to your `.env` file:
    ```env
    PAYSTACK_SECRET_KEY=sk_test_...
    ```
5.  **Important**: In the same section, set your **Live Webhook URL** (or Test Webhook URL) to your public server URL + `/wallet/paystack/webhook`.
    *   For local testing, use your ngrok URL: `https://cornelius-hyte-culpably.ngrok-free.dev/wallet/paystack/webhook`.

## 3. MongoDB URI

1.  If running locally, use `mongodb://localhost:27017/wallet-service`.
2.  If using MongoDB Atlas, get your connection string from the dashboard.

## 4. JWT Secret

1.  Generate a random string for `JWT_SECRET`. You can use `openssl rand -hex 32` or just type a long random string.
