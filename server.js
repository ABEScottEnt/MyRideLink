require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const winston = require('winston');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Winston logger
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/health', require('./routes/health'));
app.use('/api/users', require('./routes/users'));

// Socket.io basic connection
io.on('connection', (socket) => {
  logger.info('Socket connected: ' + socket.id);
  socket.on('disconnect', () => logger.info('Socket disconnected: ' + socket.id));
});

// MongoDB connection
mongoose.connect(process.env.DB_URI || process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`)); 