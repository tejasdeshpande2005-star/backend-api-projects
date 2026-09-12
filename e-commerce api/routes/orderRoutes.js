const express = require("express");

const {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.get("/:userId",getUserOrders);
router.put("/:orderId/status",updateOrderStatus);
router.put("/:orderId/cancel", cancelOrder);
module.exports = router;