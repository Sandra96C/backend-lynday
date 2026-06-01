import mongoose from "mongoose";
import Counter from "./Counter.js";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, "Name required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email required"],
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      province: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number required"],
      },
    },
    giftBoxes: [
      {
        giftBox: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "GiftBox",
        },
        name: {
          type: String,
        },
        price: {
          type: Number,
          min: 0,
        },
        quantity: {
          type: Number,
          min: 1,
        },
        level: {
          type: String,
        },
        products: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
            name: { type: String },
            quantity: {
              type: Number,
              min: 1,
            },
            price: {
              type: Number,
              min: 0,
            },
          },
        ],
      },
    ],
    totalPrice: {
      type: Number,
      min: 0,
    },
    payment: {
      method: {
        type: String,
        enum: ["creditCard", "bizum"],
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      reference: {
        type: String,
      },
    },
    orderStatus: {
      type: String,
      enum: [
        "draft",
        "checkout",
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
