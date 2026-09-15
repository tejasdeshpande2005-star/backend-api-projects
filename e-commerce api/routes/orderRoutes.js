const express = require("express");

const {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.post("/",authMiddleware, createOrder);
router.get("/",authMiddleware,getUserOrders);
router.put("/:orderId/status",authMiddleware,authorizeRole("admin"),updateOrderStatus);
router.put("/:orderId/cancel",authMiddleware, cancelOrder);
module.exports = router;