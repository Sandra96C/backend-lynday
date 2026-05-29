import mongoose from "mongoose";

const giftBoxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["fixed", "custom"],
    required: true,
  },
  level: {
    type: String,
    enum: ["basic", "medium", "premium"],
    required: true,
  },
  basePrice: {
    type: Number,
    min: 0,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      quantity: {
        type: Number,
        default: 1,
      },

      customizable: {
        type: Boolean,
        default: false,
      },
    },
  ],

  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("GiftBox", giftBoxSchema);
