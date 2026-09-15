const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res, next) => {
    try {
        const userId  = req.user.id;

        // Find user's cart
        const cart = await Cart.findOne({ userId })
            .populate("items.productId");

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Check if cart is empty
        if (cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalPrice = 0;
        const orderItems = [];

        // Check stock and prepare order items
        for (const item of cart.items) {
            const product = item.productId;

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            totalPrice += product.price * item.quantity;

            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create order
        const order = new Order({
            userId,
            items: orderItems,
            totalPrice
        });

        await order.save();

        // Reduce product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.productId._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // Empty cart after successful order
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "Order created successfully",
            order
        });
    }
    catch (error) {
        next(error);
    }
};

const getUserOrders = async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const orders = await Order.find({ userId }).populate("items.productId").sort({createdAt: -1});
        return res.status(200).json({orders});
    }
    catch(error){
        next(error);
    }
}

const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        // Check if status is valid
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    }
    catch (error) {
        next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const order = await Order.findOne({_id: orderId,userId: userId});

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Order can only be cancelled before shipping
        if (order.status !== "Pending" && order.status !== "Confirmed") {
            return res.status(400).json({
                message: "Order cannot be cancelled"
            });
        }

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        // Change order status
        order.status = "Cancelled";

        await order.save();

        return res.status(200).json({
            message: "Order cancelled successfully",
            order
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    cancelOrder
};
