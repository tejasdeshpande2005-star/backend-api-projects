const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            // Price at the time the order was created
            price: {
                type: Number,
                required: true
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "Stripe"],
        default: "COD"
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending"
    },

    stripeSessionId: {
        type: String,
        default: null
    },

    // Used to identify abandoned Stripe checkout sessions
    checkoutExpiresAt: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;