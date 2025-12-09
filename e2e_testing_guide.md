# End-to-End Testing Guide

This guide walks you through testing the Wallet Service functionality.

## Prerequisites

- Node.js installed
- MongoDB running
- Postman or curl
- Ngrok (for Paystack Webhook testing)

## 1. Start the Server

```bash
npm run start:dev
```

## 2. Authentication (Google)

Since Google Auth requires a browser, you can test it by visiting:
`http://localhost:3000/auth/google`

After login, you will receive a JWT token. Copy this token.

**For Testing without GUI:**
You can temporarily create a "dev login" endpoint that returns a token for a test user if you want to bypass Google Auth for Postman testing.

## 3. Create API Key

**Request:**
`POST /keys/create`
**Headers:**
`Authorization: Bearer <YOUR_JWT_TOKEN>`
**Body:**
```json
{
  "name": "Test Service",
  "permissions": ["deposit", "transfer", "read"],
  "expiry": "1D"
}
```
**Response:**
Copy the `api_key`.

## 4. Deposit (Paystack)

**Request:**
`POST /wallet/deposit`
**Headers:**
`x-api-key: <YOUR_API_KEY>` (or use Bearer token)
**Body:**
```json
{
  "amount": 5000
}
```
**Response:**
You will get an `authorization_url`. Open it in a browser to complete the payment.

## 5. Simulate Webhook (Credit Wallet)

Since you might not want to actually pay, you can simulate the webhook call that Paystack would send.

**Request:**
`POST /wallet/paystack/webhook`
**Headers:**
`x-paystack-signature`: <CALCULATED_HMAC_SHA512_SIGNATURE>

**Generating Signature:**
You need to generate the HMAC SHA512 hash of the body using your `PAYSTACK_SECRET_KEY`.
You can use an online HMAC generator or a simple Node.js script:

```javascript
const crypto = require('crypto');
const secret = 'YOUR_PAYSTACK_SECRET_KEY';
const body = JSON.stringify({
  event: 'charge.success',
  data: {
    reference: 'REFERENCE_FROM_DEPOSIT_RESPONSE',
    amount: 500000, // 5000 * 100 kobo
    status: 'success'
  }
});
const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
console.log(hash);
```

**Body:**
Use the JSON body from the script above.

## 6. Check Balance

**Request:**
`GET /wallet/balance`
**Headers:**
`x-api-key: <YOUR_API_KEY>`

## 7. Transfer

**Request:**
`POST /wallet/transfer`
**Headers:**
`x-api-key: <YOUR_API_KEY>`
**Body:**
```json
{
  "wallet_number": "RECIPIENT_WALLET_NUMBER",
  "amount": 1000
}
```

## 8. Transaction History

**Request:**
`GET /wallet/transactions`
**Headers:**
`x-api-key: <YOUR_API_KEY>`
