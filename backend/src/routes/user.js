const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../middleware/validation');
const { authenticate } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authenticate, validate(schemas.user.update), userController.updateProfile);

/**
 * @swagger
 * /api/v1/users/password:
 *   put:
 *     summary: Change password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put('/password', authenticate, userController.changePassword);

/**
 * @swagger
 * /api/v1/users/vehicles:
 *   get:
 *     summary: Get user's vehicles
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's vehicles
 *       401:
 *         description: Unauthorized
 */
router.get('/vehicles', authenticate, userController.getVehicles);

/**
 * @swagger
 * /api/v1/users/rides:
 *   get:
 *     summary: Get user's ride history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of user's rides
 *       401:
 *         description: Unauthorized
 */
router.get('/rides', authenticate, userController.getRides);

/**
 * @swagger
 * /api/users/device-token:
 *   put:
 *     tags: [Users]
 *     summary: Update user's device token for push notifications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceToken
 *             properties:
 *               deviceToken:
 *                 type: string
 *                 description: Firebase Cloud Messaging device token
 *     responses:
 *       200:
 *         description: Device token updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Device token updated successfully
 *       500:
 *         description: Server error
 */
router.put('/device-token', authenticate, userController.updateDeviceToken);

module.exports = router; 