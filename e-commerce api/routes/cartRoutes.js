const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    addToCart,getCart,removeFromCart,updateCartQuantity
} = require("../controllers/cartControllers");
const router = express.Router();
router.post("/",authMiddleware,addToCart);
router.get("/:userId",authMiddleware,getCart);
router.put("/:userId/:productId",authMiddleware,updateCartQuantity);
router.delete("/:userId/:productId",authMiddleware,removeFromCart);
module.exports = router;
