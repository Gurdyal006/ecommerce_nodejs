import mongoose from "mongoose";

// REVIEW SCHEMA
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user is required"],
    },
  },
  { timestamps: true }
);

// PRODUCT SCHEMA
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    description: {
      type: String,
      required: [true, "desciption is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Products", productSchema);
export default productModel;
