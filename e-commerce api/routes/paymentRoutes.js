const express = require("express");
const {
    createCheckoutSession
} = require("../controllers/paymentControllers");

const {
    handleStripeWebhook
} = require("../controllers/stripeWebhookController");



const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/checkout",authMiddleware,createCheckoutSession);
router.post("/webhook", handleStripeWebhook);
module.exports = router;
