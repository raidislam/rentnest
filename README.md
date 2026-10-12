# RentNest Backend

RentNest is a rental marketplace REST API.

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
- Search and filter by location, price range, property type and amenity
- View property details and categories

**Tenant**
- Register and login, view and update profile
- Submit rental requests and view rental request history
- Pay with SSLCommerz after the landlord approves (failed payments can be retried)
- View payment history and payment details
- Mark an active rental as completed
- Leave a review after a completed rental

**Landlord**
- Register and login
- Create, edit and delete own listings, set availability
- Landlord can View own listings
- Approve and reject rental requests and view rental history
- View tenant reviews for own properties

**Admin**
- View all users with status (active / banned)
- Ban / unban users (banned users can't log in and old tokens stop working)
- View all listings and all rental requests
- Create, update and delete property categories


## Run Locally

```bash
npm install
cp .env.example .env      
npx prisma migrate deploy
npx prisma db seed    # creates demo admin, landlord, tenant and categories
npm run dev
```
