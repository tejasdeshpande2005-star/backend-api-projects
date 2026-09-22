const Cart = require("../models/Cart");
const stripe = require("../config/stripe");
const Order = require("../models/Order");

const createCheckoutSession = async (req, res, next) => {
    try {
        const userId = req.user.id;

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

        // Check products and stock
        for (const item of cart.items) {
            if (!item.productId) {
                return res.status(404).json({
                    message: "One or more products in the cart no longer exist"
                });
            }

            if (item.quantity > item.productId.stock) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.productId.name}`
                });
            }
        }

        // Check Stripe configuration
        if (!stripe) {
            return res.status(503).json({
                message: "Stripe is not configured"
            });
        }

        // Check for an active pending Stripe order
        const existingOrder = await Order.findOne({
            userId,
            paymentMethod: "Stripe",
            paymentStatus: "Pending",
            status: "Pending",
            checkoutExpiresAt: {
                $gt: new Date()
            }
        });

        if (existingOrder) {
            return res.status(409).json({
                message: "You already have a pending payment",
                orderId: existingOrder._id
            });
        }

        // Create order items with price snapshot
        const orderItems = cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price
        }));

        // Calculate total
        const totalPrice = cart.items.reduce(
            (total, item) =>
                total + item.productId.price * item.quantity,
            0
        );

        // Create pending Stripe order
        const order = new Order({
            userId,
            items: orderItems,
            totalPrice,
            paymentMethod: "Stripe",
            paymentStatus: "Pending",
            status: "Pending"   
        });

        await order.save();

        // Create Stripe line items using the order's price snapshot
        const lineItems = order.items.map(item => {
            const cartItem = cart.items.find(
                cartItem =>
                    cartItem.productId._id.toString() ===
                    item.productId.toString()
            );

            return {
                price_data: {
                    currency: "inr",

                    product_data: {
                        name: cartItem.productId.name
                    },

                    unit_amount: item.price * 100
                },

                quantity: item.quantity
            };
        });

        let session;

        try {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],

                line_items: lineItems,

                mode: "payment",

                metadata: {
                    userId: userId.toString(),
                    orderId: order._id.toString()
                },

                success_url: "http://localhost:5173/success",

                cancel_url: "http://localhost:5173/cancel"
            });
        } catch (error) {
            // If Stripe session creation fails,
            // remove the temporary order
            await Order.findByIdAndDelete(order._id);

            throw error;
        }

        // Save Stripe session information
        order.stripeSessionId = session.id;

        // Stripe Checkout sessions normally expire after a limited period.
        // Store a local expiry so abandoned orders don't block checkout forever.
        order.checkoutExpiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        await order.save();

        return res.status(200).json({
            message: "Checkout session created",

            orderId: order._id,

            paymentStatus: order.paymentStatus,

            sessionId: session.id,

            checkoutUrl: session.url
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCheckoutSession
};