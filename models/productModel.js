import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
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
  },
  { timestamps: true }
);

const productModel = mongoose.model("Products", productSchema);
export default productModel;
