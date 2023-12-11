import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "address is required"],
      },
      city: {
        type: String,
        required: [true, "city is required"],
      },
      country: {
        type: String,
        required: [true, "country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "product name is required"],
        },
        price: {
          type: Number,
          required: [true, "product price is required"],
        },
        stock: {
          type: Number,
          required: [true, "product stock is required"],
        },
        quantity: {
          type: Number,
          required: [true, "product quantity is required"],
        },
        image: {
          type: String,
          required: [true, "product image is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    paidDate: Date,
    pamentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "item price is required"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "item shippingCharges is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "item totalAmount is required"],
    },
    tax: {
      type: Number,
      required: [true, "item tax is required"],
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },
    deliverdAt: Date,
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
