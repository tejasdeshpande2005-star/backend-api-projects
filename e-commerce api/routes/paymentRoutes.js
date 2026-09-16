const express = require("express");
const {
    createCheckoutSession
} = require("../controllers/paymentControllers");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/checkout",authMiddleware,createCheckoutSession);
module.exports = router;
