# Wallet Service

## Introduction

The Wallet Service is a robust, scalable backend application designed to manage digital wallets, financial transactions, and user authentication. Built with NestJS, TypeScript, and MongoDB, it provides a secure and efficient platform for handling deposits, transfers, and balance management. The service integrates with Paystack for payment processing and implements strict security measures including JWT authentication, API key management with granular permissions, and webhook signature verification.

## Technology Stack

*   **Framework**: NestJS (Node.js)
*   **Language**: TypeScript
*   **Database**: MongoDB (via Mongoose)
*   **Authentication**: Passport.js (Google OAuth2, JWT)
*   **Payment Gateway**: Paystack
*   **Documentation**: Swagger (OpenAPI)
*   **Testing**: Jest, Supertest
*   **Containerization**: Docker

## Features

### Authentication and Security
*   **Google OAuth2**: Secure user sign-in using Google credentials.
*   **JWT Authentication**: Stateless session management using JSON Web Tokens.
*   **API Key Management**:
    *   Generation of unique API keys for service-to-service communication.
    *   Granular permission system (e.g., read-only, deposit, transfer).
    *   Key expiration and rollover mechanisms.
    *   Revocation capabilities.
*   **Guards**: Composite guards supporting both JWT and API Key authentication methods.

### Wallet Management
*   **Automatic Creation**: Wallets are automatically provisioned upon user registration.
*   **Balance Tracking**: Real-time balance updates and retrieval.
*   **Transaction History**: Comprehensive logging of all deposits and transfers.

### Financial Transactions
*   **Deposits**: Integration with Paystack to initialize and verify deposits.
*   **Atomic Transfers**: ACID-compliant wallet-to-wallet transfers using MongoDB sessions to ensure data integrity.
*   **Webhooks**: Secure handling of Paystack webhooks to confirm transaction status and credit wallets.

## Prerequisites

Before running the application, ensure the following are installed and configured:

1.  **Node.js**: Version 16 or higher.
2.  **MongoDB**: A running instance of MongoDB (Local or Atlas).
3.  **Paystack Account**: For obtaining API keys to process payments.
4.  **Google Cloud Console Project**: For obtaining OAuth 2.0 credentials.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/maryukpete1/wallet-service.git
    cd wallet-service
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

The application requires environment variables for configuration. Create a file named `.env` in the root directory.

**Required Environment Variables:**

*   `PORT`: The port number on which the server will listen (default: 3000).
*   `MONGODB_URI`: The connection string for your MongoDB instance.
*   `GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Client ID.
*   `GOOGLE_CLIENT_SECRET`: Your Google OAuth 2.0 Client Secret.
*   `GOOGLE_CALLBACK_URL`: The callback URL configured in Google Cloud Console (e.g., http://localhost:3000/auth/google/callback).
*   `JWT_SECRET`: A strong secret key for signing JSON Web Tokens.
*   `PAYSTACK_SECRET_KEY`: Your Paystack Secret Key.

**Example .env file:**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/wallet-service
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=your_super_secure_jwt_secret
PAYSTACK_SECRET_KEY=sk_test_your_paystack_key
```

## Running the Application

### Development Mode
To start the application in development mode with hot-reloading:
```bash
npm run start:dev
```

### Production Mode
To build and start the application for production:
```bash
npm run build
npm run start:prod
```

### Docker
To run the application using Docker:
```bash
# Build the image
docker build -t wallet-service .

# Run the container
docker run -p 3000:3000 --env-file .env wallet-service
```

## API Documentation

The application includes auto-generated Swagger documentation.

1.  Start the application.
2.  Navigate to `http://localhost:3000/api` in your web browser.

This interactive documentation allows you to explore endpoints, view request/response schemas, and test API calls directly.

### Key Endpoints

**Authentication**
*   `GET /auth/google`: Initiates the Google OAuth login flow.
*   `GET /auth/google/callback`: Handles the redirect from Google.

**API Keys**
*   `POST /keys/create`: Generates a new API key (Requires JWT).
*   `POST /keys/rollover`: Rotates an expired API key (Requires JWT).

**Wallet**
*   `GET /wallet/balance`: Retrieves the current wallet balance.
*   `GET /wallet/transactions`: Retrieves transaction history.
*   `POST /wallet/deposit`: Initializes a deposit transaction.
*   `POST /wallet/transfer`: Transfers funds to another wallet.

## Testing

### Unit Tests
Run the unit test suite:
```bash
npm run test
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
