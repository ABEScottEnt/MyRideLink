const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { User, Ride } = require('../models');
const winston = require('winston');

let io;

// Initialize Socket.IO server
exports.initialize = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      winston.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    winston.info(`User connected: ${socket.user.id}`);

    // Join user's room
    socket.join(`user:${socket.user.id}`);

    // Join ride room if user is part of an active ride
    if (socket.user.role === 'DRIVER') {
      socket.join(`driver:${socket.user.id}`);
    }

    // Handle driver location updates
    socket.on('updateLocation', async (data) => {
      try {
        if (socket.user.role !== 'DRIVER') {
          throw new Error('Only drivers can update location');
        }

        const { latitude, longitude, rideId } = data;

        // Update driver's last location
        await socket.user.update({
          lastLocation: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        });

        // If this is part of an active ride, broadcast to rider
        if (rideId) {
          const ride = await Ride.findByPk(rideId, {
            include: [{ model: User, as: 'rider' }]
          });

          if (ride && ride.status === 'STARTED') {
            io.to(`user:${ride.riderId}`).emit('driverLocation', {
              rideId,
              location: { latitude, longitude },
              timestamp: new Date()
            });
          }
        }
      } catch (error) {
        winston.error('Error updating driver location:', error);
        socket.emit('error', { message: 'Error updating location' });
      }
    });

    // Handle ride status updates
    socket.on('rideStatusUpdate', async (data) => {
      try {
        const { rideId, status } = data;
        const ride = await Ride.findByPk(rideId, {
          include: [
            { model: User, as: 'rider' },
            { model: User, as: 'driver' }
          ]
        });

        if (!ride) {
          throw new Error('Ride not found');
        }

        // Verify user is authorized to update status
        if (socket.user.role !== 'ADMIN' && 
            socket.user.id !== ride.driverId && 
            socket.user.id !== ride.riderId) {
          throw new Error('Not authorized to update ride status');
        }

        // Update ride status
        await ride.update({ status });

        // Notify relevant parties
        io.to(`user:${ride.riderId}`).emit('rideStatusChanged', {
          rideId,
          status,
          timestamp: new Date()
        });

        if (ride.driverId) {
          io.to(`user:${ride.driverId}`).emit('rideStatusChanged', {
            rideId,
            status,
            timestamp: new Date()
          });
        }
      } catch (error) {
        winston.error('Error updating ride status:', error);
        socket.emit('error', { message: 'Error updating ride status' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      winston.info(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

// Get Socket.IO instance
exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

// Emit event to specific user
exports.emitToUser = (userId, event, data) => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  io.to(`user:${userId}`).emit(event, data);
};

// Emit event to all drivers
exports.emitToDrivers = (event, data) => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  io.to('drivers').emit(event, data);
}; 