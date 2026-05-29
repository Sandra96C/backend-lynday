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
        required: [true, "Address required"],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, "Zip code required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City required"],
        trim: true,
      },
      province: {
        type: String,
        required: [true, "Province required"],
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
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
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
              required: true,
              min: 1,
            },
            price: {
              type: Number,
              required: true,
              min: 0,
            },
          },
        ],
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      method: {
        type: String,
        enum: ["creditCard", "bizum"],
        required: true,
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
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "orderNumber" },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true },
    );

    this.orderNumber = `ORD-${String(counter.sequenceValue).padStart(4, "0")}`;

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Order", orderSchema);
