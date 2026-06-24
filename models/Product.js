import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
    },

    level: {
      type: String,
      enum: ["basic", "medium", "premium"],
      default: "basic",
      required: true,
    },

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
