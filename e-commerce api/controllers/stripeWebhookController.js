const stripe = require("../config/stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const handleStripeWebhook = async (req, res) => {
    try {
        console.log("Stripe webhook received");

        const signature = req.headers["stripe-signature"];

        if (!signature) {
            return res.status(400).json({
                message: "Missing Stripe signature"
            });
        }

        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            return res.status(503).json({
                message: "Stripe webhook is not configured"
            });
        }

        if (!stripe) {
            return res.status(503).json({
                message: "Stripe is not configured"
            });
        }

        // Verify Stripe webhook
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log("Verified event:", event.type);

        switch (event.type) {

            case "checkout.session.completed": {

                const session = event.data.object;

                const orderId = session.metadata?.orderId;

                if (!orderId) {
                    console.log("Order ID not found in Stripe metadata");
                    break;
                }

                const order = await Order.findById(orderId);

                if (!order) {
                    console.log("Order not found");
                    break;
                }

                // Idempotency:
                // Stripe may deliver the same webhook more than once.
                if (order.paymentStatus === "Paid") {
                    console.log("Order is already marked as Paid");
                    break;
                }

                // Make sure this is actually a Stripe order
                if (order.paymentMethod !== "Stripe") {
                    console.log("Order is not a Stripe order");
                    break;
                }

                // Check stock again
                for (const item of order.items) {

                    const product = await Product.findById(
                        item.productId
                    );

                    if (!product) {
                        console.log(
                            `Product ${item.productId} no longer exists`
                        );

                        break;
                    }

                    if (product.stock < item.quantity) {
                        console.log(
                            `Not enough stock for ${product.name}`
                        );

                        break;
                    }
                }

                // Reduce stock
                for (const item of order.items) {

                    const product = await Product.findById(
                        item.productId
                    );

                    if (product) {
                        product.stock -= item.quantity;

                        await product.save();
                    }
                }

                // Mark payment as successful
                order.paymentStatus = "Paid";

                // Payment successful → order confirmed
                order.status = "Confirmed";

                await order.save();

                // Remove only the purchased quantities
                // from the user's cart.
                const cart = await Cart.findOne({
                    userId: order.userId
                });

                if (cart) {

                    for (const orderItem of order.items) {

                        const cartItemIndex = cart.items.findIndex(
                            item =>
                                item.productId.toString() ===
                                orderItem.productId.toString()
                        );

                        if (cartItemIndex !== -1) {

                            const cartItem =
                                cart.items[cartItemIndex];

                            cartItem.quantity -= orderItem.quantity;

                            if (cartItem.quantity <= 0) {
                                cart.items.splice(
                                    cartItemIndex,
                                    1
                                );
                            }
                        }
                    }

                    await cart.save();
                }

                console.log(
                    `Order ${order._id} marked as Paid and Confirmed`
                );

                break;
            }

            default:
                console.log(
                    `Unhandled event type: ${event.type}`
                );
        }

        return res.status(200).json({
            message: "Webhook received",
            eventType: event.type
        });

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            message: "Webhook verification failed"
        });
    }
};

module.exports = {
    handleStripeWebhook
};