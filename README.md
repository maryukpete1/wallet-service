# Wallet Service

A robust backend wallet service built with **NestJS**, **MongoDB**, and **TypeScript**. This service handles user authentication, wallet management, deposits via Paystack, and atomic transfers between users.

## Features

-   **Authentication**
    -   Google OAuth2 Sign-in
    -   JWT-based authentication
    -   Secure user session management
-   **API Key Management**
    -   Generate, rollover, and revoke API keys
    -   Granular permissions (`deposit`, `transfer`, `read`)
    -   Expiration management
-   **Wallet Operations**
    -   Automatic wallet creation on user registration
    -   **Deposits**: Integrated with Paystack for secure funding
    -   **Transfers**: Atomic, ACID-compliant wallet-to-wallet transfers
    -   **History**: Comprehensive transaction history and balance tracking
-   **Security**
    -   Environment variable configuration
    -   Role-based and Permission-based Guards
    -   Webhook signature verification

## Prerequisites

-   Node.js (v16+)
-   MongoDB (Local or Atlas)
-   Paystack Account (for API keys)
-   Google Cloud Console Project (for OAuth credentials)

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/maryukpete1/wallet-service.git
    cd wallet-service
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and populate it with your credentials. See [Setup Keys Guide](setup_keys_guide.md) for detailed instructions.
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/wallet-service
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
    JWT_SECRET=your_jwt_secret
    PAYSTACK_SECRET_KEY=your_paystack_secret_key
    ```

## Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Testing

### End-to-End (E2E) Testing
We have a comprehensive guide for testing all endpoints using Postman.
-   **Guide**: [E2E Testing Guide](e2e_testing_guide.md)
-   **Postman Collection**: `wallet-service.postman_collection.json` (Included in the repo)

### Unit Tests
```bash
npm run test
```

## API Documentation

The API is documented via the included Postman Collection. Import `wallet-service.postman_collection.json` into Postman to explore:

-   **Auth**: `GET /auth/google`
-   **API Keys**: `POST /keys/create`, `POST /keys/rollover`
-   **Wallet**:
    -   `GET /wallet/balance`
    -   `POST /wallet/deposit`
    -   `POST /wallet/transfer`
    -   `GET /wallet/transactions`

## License

This project is [MIT licensed](LICENSE).
