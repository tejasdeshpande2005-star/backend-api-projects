const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    addToCart,getCart,removeFromCart,updateCartQuantity
} = require("../controllers/cartControllers");
const router = express.Router();
router.post("/",authMiddleware,addToCart);
router.get("/",authMiddleware,getCart);
router.put("/:productId",authMiddleware,updateCartQuantity);
router.delete("/:productId",authMiddleware,removeFromCart);
module.exports = router;
