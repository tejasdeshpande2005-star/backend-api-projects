const Cart = require("../models/Cart");
const stripe = require("../config/stripe");

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

        const lineItems = cart.items.map(item=>({
            price_data: {
                currency: "inr",
                product_data : {
                    name: item.productId.name
                },
                unit_amount: item.productId.price*100
            },
            quantity: item.quantity
        }));

        if (!stripe) {
            return res.status(503).json({
                message: "Stripe is not configured"
            });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel"
        });


        return res.status(200).json({
            message: "Checkout session created",
            sessionId: session.id,
            checkoutUrl: session.url
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports = {createCheckoutSession};