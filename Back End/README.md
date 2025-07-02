# RideLink - Comprehensive Ride-Sharing Application

A full-featured ride-sharing platform that aggregates services from Uber and Lyft, providing fare comparison, real-time tracking, and seamless payment processing.

## 🚀 Features

- **Multi-Platform Integration**: Seamlessly integrates with Uber and Lyft APIs
- **Fare Comparison**: Real-time fare comparison across multiple ride-sharing services
- **Real-Time Tracking**: Live ride tracking with WebSocket support
- **Payment Processing**: Secure payment processing with Stripe integration
- **User Management**: Complete user registration, authentication, and profile management
- **Notification System**: Email and push notifications for ride updates
- **Admin Dashboard**: Comprehensive admin interface for ride and user management
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Rate Limiting**: Advanced rate limiting with Redis
- **Security**: Comprehensive security measures including CORS, Helmet, and input validation

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Cache**: Redis for session management and rate limiting
- **Authentication**: JWT with refresh tokens
- **Payment**: Stripe integration
- **Notifications**: Firebase Cloud Messaging, Nodemailer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with comprehensive test coverage
- **Logging**: Winston for structured logging

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 8.0
- Redis >= 6.0
- SMTP server for email notifications

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ride-link.git
cd ride-link
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=my_ride_db
DB_HOST=localhost
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Uber API Configuration
UBER_CLIENT_ID=your_uber_client_id
UBER_CLIENT_SECRET=your_uber_client_secret
UBER_SERVER_TOKEN=your_uber_server_token

# Lyft API Configuration
LYFT_CLIENT_ID=your_lyft_client_id
LYFT_CLIENT_SECRET=your_lyft_client_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@ridelink.com

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Optional Configuration
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at:
- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests for CI
npm run test:ci
```

## 📚 API Documentation

The API documentation is automatically generated using Swagger/OpenAPI and is available at `/api-docs` when the server is running.

### Key Endpoints

- **Authentication**: `/api/v1/auth/*`
- **Users**: `/api/v1/users/*`
- **Rides**: `/api/v1/rides/*`
- **Payments**: `/api/v1/payments/*`
- **Notifications**: `/api/v1/notifications/*`
- **Fare Comparison**: `/api/v1/fare-comparison/*`
- **Admin**: `/api/v1/admin/*`

## 🏗️ Project Structure

```
RideLink/
├── config/                 # Configuration files
├── migrations/            # Database migrations
├── seeders/              # Database seeders
├── src/
│   ├── app.js            # Express application setup
│   ├── config/           # Application configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── socket/           # WebSocket handlers
│   ├── utils/            # Utility functions
│   └── validation/       # Input validation schemas
├── tests/                # Test files
├── logs/                 # Application logs
├── server.js             # Application entry point
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. See the `.env` example above for all required variables.

### Database Configuration

The application supports MySQL with the following features:
- Connection pooling
- Automatic migrations
- Model synchronization
- Transaction support

### Redis Configuration

Redis is used for:
- Session storage
- Rate limiting
- Caching
- Real-time features

## 🔒 Security Features

- **CORS Protection**: Configurable CORS policies
- **Rate Limiting**: Advanced rate limiting with Redis
- **Input Validation**: Comprehensive input validation
- **SQL Injection Protection**: Parameterized queries with Sequelize
- **XSS Protection**: XSS-Clean middleware
- **Helmet**: Security headers
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security

## 📊 Monitoring and Logging

### Logging

The application uses Winston for structured logging with:
- Multiple log levels (error, warn, info, debug)
- File and console output
- JSON formatting for production
- Request/response logging

### Health Checks

Health check endpoint available at `/health` for monitoring:
- Database connectivity
- Redis connectivity
- Application status

## 🚀 Deployment

### Production Deployment

1. **Set Environment Variables**: Configure all required environment variables for production
2. **Database Setup**: Run migrations on production database
3. **Build**: No build step required for Node.js application
4. **Start**: Use `npm start` or PM2 for process management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔄 Version History

- **v1.0.0**: Initial release with core features
  - Multi-platform ride aggregation
  - Real-time tracking
  - Payment processing
  - User management
  - Admin dashboard

## 📈 Performance

The application is optimized for:
- High concurrency with connection pooling
- Fast response times with Redis caching
- Scalable architecture with microservices-ready design
- Efficient database queries with proper indexing

