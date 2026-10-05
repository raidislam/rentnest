# RentNest Backend

RentNest is a rental marketplace REST API. Landlords list properties, tenants search and request rentals, landlords approve or reject requests, tenants pay with SSLCommerz, and admins manage users, listings and categories.

## Tech Stack

- Node.js + Express 5 + TypeScript
- PostgreSQL (Neon) + Prisma ORM
- JWT authentication + bcrypt
- Zod validation
- SSLCommerz payment gateway (Sandbox)
- Deployed on Vercel

## Roles and Features

**Public**
- Browse available properties
- Search/filter by location, price range, property type and amenity
- View property details and categories

**Tenant**
- Register / login, view and update profile
- Submit rental requests and view rental request history
- Pay with SSLCommerz after the landlord approves (failed payments can be retried)
- View payment history and payment details
- Mark an active rental as completed
- Leave a review after a completed rental

**Landlord**
- Register / login
- Create, edit and delete own listings, set availability
- View own listings
- Approve / reject rental requests and view rental history
- View tenant reviews for own properties

**Admin**
- View all users with status (active / banned)
- Ban / unban users (banned users can't log in and old tokens stop working)
- View all listings and all rental requests
- Create, update and delete property categories

## API Base URL

- Local: `http://localhost:5000`
- Live: `<add Vercel URL here>`

All routes start with `/api`, for example `GET /api/properties`.

## Run Locally

```bash
npm install
cp .env.example .env      # then fill in the values
npx prisma migrate deploy
npx prisma db seed        # creates demo admin, landlord, tenant and categories
npm run dev
```

## Environment Variables

See `.env.example`. Only the names are listed here:

```
PORT
NODE_ENV
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
SSLCOMMERZ_STORE_ID
SSLCOMMERZ_STORE_PASSWORD
SSLCOMMERZ_IS_LIVE
SSLCOMMERZ_SUCCESS_URL
SSLCOMMERZ_FAIL_URL
SSLCOMMERZ_CANCEL_URL
SSLCOMMERZ_IPN_URL
```

## API Documentation (Postman)

Import `postman/RentNest.postman_collection.json` into Postman.

- Set the `baseUrl` variable (local or live URL)
- Set the password variables, then run the Login requests. They save `tenantToken`, `landlordToken` and `adminToken` automatically.
- Folders: Auth, Public, Landlord, Tenant, Admin, Payment Callbacks (SSLCommerz)

## Admin Login

- Email: `admin@rentnest.com`
- Password: shared with the assignment submission

## Main API Flow

1. Landlord creates a property: `POST /api/landlord/properties`
2. Tenant sends a rental request: `POST /api/rentals` (status `PENDING`)
3. Landlord approves or rejects it: `PATCH /api/landlord/requests/:id` (`APPROVED` / `REJECTED`)
4. Tenant starts payment: `POST /api/payments/create` and opens the returned `paymentUrl`
5. SSLCommerz calls `/api/payments/success`. The server validates the payment with SSLCommerz, then the payment becomes `COMPLETED` and the rental becomes `ACTIVE`
6. Tenant marks the rental finished: `PATCH /api/rentals/:id/complete` (`COMPLETED`)
7. Tenant leaves a review: `POST /api/reviews`
8. Landlord sees reviews: `GET /api/landlord/reviews`

## Payment

- Provider: SSLCommerz (Sandbox)
- A payment is only marked completed after server-side validation of `val_id` with SSLCommerz (status, transaction ID, amount and currency are checked)
- If a payment fails or is cancelled, the tenant can call `POST /api/payments/create` again to retry with a new transaction ID
- A completed payment can't be paid again

## Error Response Format

```json
{
  "success": false,
  "message": "Validation error",
  "errorDetails": [{ "field": "minPrice", "message": "Invalid input: expected number, received NaN" }]
}
```

Status codes: 400 validation / bad request, 401 not logged in, 403 not allowed or banned, 404 not found, 409 duplicate or conflict, 500 server error.

## Links

- GitHub: https://github.com/raidislam/rentnest
- Live API: `<add Vercel URL here>`
