# Ride-Sharing Backend

A simple, scalable backend for a ride-sharing web and mobile application.

## Features
- User authentication (JWT)
- Ride management (create, update, cancel)
- Payments (Stripe integration)
- Notifications (email, SMS, push - mocked where needed)
- Real-time ride status (Socket.io)
- Logging/monitoring (Winston)
- RESTful API, modular code

## Tech Stack
- Node.js + Express
- MongoDB (Mongoose)
- Stripe, Uber API, Nodemailer, Twilio (mocked), Socket.io

## Setup
1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your secrets
4. Start MongoDB locally or use a cloud URI
5. Run `npm run dev` for development

## .env Example
```
PORT=5000
DB_URI=mongodb://localhost:27017/ride_sharing
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...your_key...
UBER_CLIENT_SECRET=...your_uber_secret...
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
TWILIO_SID=mock_twilio_sid
TWILIO_AUTH_TOKEN=mock_twilio_token
FIREBASE_SERVER_KEY=mock_firebase_key
```

## Sample API Calls (Postman)

### Register
```
POST /api/auth/register
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

### Login
```
POST /api/auth/login
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Get Current User
```
GET /api/users/me
Headers: Authorization: Bearer <JWT>
```

### Update Profile
```
PATCH /api/users/me
Headers: Authorization: Bearer <JWT>
{
  "phone": "+1234567890"
}
```

### Get Nearby Drivers
```
GET /api/users/nearby-drivers
Headers: Authorization: Bearer <JWT>
```

### Create Ride
```
POST /api/rides
Headers: Authorization: Bearer <JWT>
{
  "pickup": { "lat": 40.7, "lng": -74.0 },
  "dropoff": { "lat": 40.8, "lng": -73.9 },
  "service": "uber"
}
```

### Make Payment
```
POST /api/payments/charge
Headers: Authorization: Bearer <JWT>
{
  "rideId": "...",
  "amount": 15.00,
  "currency": "usd",
  "paymentMethodId": "..."
}
```

---

## Folder Structure
- `/routes` - Express route definitions
- `/controllers` - Business logic
- `/models` - Mongoose schemas
- `/middleware` - Auth, logging, etc.
- `/utils` - Helpers, notifications, fare engine

---

## Notes
- Lyft, Twilio, Firebase are mocked for now
- Use Postman or similar to test endpoints
- Keep code simple and modular 