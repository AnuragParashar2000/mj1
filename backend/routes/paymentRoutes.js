const express = require('express');
const router = express.Router();
const {
    createCheckoutSession,
    stripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Route for creating Stripe Checkout session (Requires Authentication)
router.post('/create-checkout-session', protect, createCheckoutSession);

// Webhook endpoint (Does not require Authentication, but handled raw in server.js before body parser)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
