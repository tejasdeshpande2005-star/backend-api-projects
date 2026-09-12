const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req,res,next)=>{
    try{
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        if(product.stock<quantity){
            return res.status(400).json({
                message: "Not enough stock"
            });
        }
        let cart = await Cart.findOne({userId});
        if(!cart){
            cart = new Cart({userId,items:[{productId,quantity}]});
            await cart.save();
            return res.status(201).json({
                message: "Cart created successfully",
                cart
            });
        }
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if(existingItem){
            if(existingItem.quantity + quantity > product.stock){
                return res.status(400).json({
                    message: "Not enough stock"
                });
            }
            existingItem.quantity += quantity; 
        }
        else{
            cart.items.push({productId,quantity});
        }
        await cart.save();
        return res.status(200).json({
            message: "Product added to cart",
            cart
        });

    }catch(error){
        next(error);
    }
};

const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId })
            .populate("items.productId");

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }
        let totalPrice = 0;
        cart.items.forEach(item=>{totalPrice += item.productId.price*item.quantity;});

        return res.status(200).json({
            cart,
            totalPrice
        });
    }
    catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();

        return res.status(200).json({
            message: "Product removed from cart",
            cart
        });
    }
    catch (error) {
        next(error);
    }
};

const updateCartQuantity = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const { quantity } = req.body;

        // Validate quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Not enough stock"
            });
        }

        // Find cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Find product in cart
        const existingItem = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (!existingItem) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        // Update quantity
        existingItem.quantity = quantity;

        await cart.save();

        return res.status(200).json({
            message: "Cart quantity updated successfully",
            cart
        });
    }
    catch (error) {
        next(error);
    }
};
module.exports = {addToCart,getCart,removeFromCart,updateCartQuantity};