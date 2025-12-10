const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const secret = process.env.PAYSTACK_SECRET_KEY;
if (!secret) {
    console.error('Error: PAYSTACK_SECRET_KEY is not set in .env file.');
    process.exit(1);
}

const email = process.argv[2];
if (!email) {
    console.error('Usage: node scripts/generate-webhook-signature.js <email>');
    process.exit(1);
}

const body = {
    event: 'charge.success',
    data: {
        reference: 'test_ref_' + Date.now(),
        amount: 500000, // 5000.00 NGN
        status: 'success',
        customer: {
            email: email
        }
    }
};

// We use JSON.stringify to get the exact string representation that will be hashed
const jsonBody = JSON.stringify(body);

const hash = crypto.createHmac('sha512', secret).update(jsonBody).digest('hex');

const fs = require('fs');

const output = `
=== Webhook Test Data ===

1. Copy this JSON Body (Paste exactly as is, do not format/prettify):
---------------------------------------------------
${jsonBody}
---------------------------------------------------

2. Copy this Signature (Paste into x-paystack-signature header):
---------------------------------------------------
${hash}
---------------------------------------------------
`;

fs.writeFileSync('webhook_test_data.txt', output);
console.log('Test data written to webhook_test_data.txt');
