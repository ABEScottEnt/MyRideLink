const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const paymentValidation = require('../validation/paymentValidation');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and management
 */

// All routes require authentication
router.use(authenticate);

// Create Stripe checkout session
router.post(
  '/checkout/:rideId',
  paymentController.createCheckoutSession
);

// Handle Stripe webhook
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// Payment processing
// router.post('/process', validate(paymentValidation.processPayment), paymentController.processPayment);

/**
 * @swagger
 * /api/v1/payments/methods:
 *   get:
 *     tags: [Payments]
 *     summary: Get user's payment methods
 *     description: Retrieve all payment methods associated with the user's account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       type:
 *                         type: string
 *                         enum: [CARD, CASH]
 *                       last_four:
 *                         type: string
 *                         example: "4242"
 *                       brand:
 *                         type: string
 *                         example: "visa"
 *                       is_default:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// router.get('/methods', paymentController.getPaymentMethods);

/**
 * @swagger
 * /api/v1/payments/methods:
 *   post:
 *     tags: [Payments]
 *     summary: Add a new payment method
 *     description: Add a new payment method to the user's account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - token
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [CARD, CASH]
 *               token:
 *                 type: string
 *                 description: Payment token from payment processor
 *               is_default:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Payment method added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     type:
 *                       type: string
 *                     last_four:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     is_default:
 *                       type: boolean
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/methods', validate(paymentValidation.addPaymentMethod), paymentController.addPaymentMethod);

/**
 * @swagger
 * /api/v1/payments/methods/{methodId}:
 *   delete:
 *     tags: [Payments]
 *     summary: Remove a payment method
 *     description: Remove a payment method from the user's account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: methodId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Payment method removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Payment method removed successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payment method not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/methods/:methodId', paymentController.removePaymentMethod);

/**
 * @swagger
 * /api/v1/payments/methods/{methodId}/default:
 *   put:
 *     tags: [Payments]
 *     summary: Set default payment method
 *     description: Set a payment method as the default for the user's account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: methodId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Default payment method updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     is_default:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payment method not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/methods/:methodId/default', paymentController.setDefaultPaymentMethod);

/**
 * @swagger
 * /api/v1/payments/transactions:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment transactions
 *     description: Retrieve the user's payment transaction history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Payment transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       amount:
 *                         type: number
 *                       currency:
 *                         type: string
 *                         example: "USD"
 *                       status:
 *                         type: string
 *                         enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *                       payment_method:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           last_four:
 *                             type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/transactions', paymentController.getTransactions);

// Get payment details
router.get(
  '/:paymentId',
  paymentController.getPaymentDetails
);

// Get user's payment history
router.get(
  '/history',
  paymentController.getPaymentHistory
);

module.exports = router; 