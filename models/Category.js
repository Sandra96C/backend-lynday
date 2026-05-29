import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    image: {
      type: String,
    },

    active: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ slug: 1 });

export default mongoose.model("Category", categorySchema);
