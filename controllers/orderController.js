import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;
    if (
      !shippingInfo ||
      !orderItems ||
      !paymentMethod ||
      !itemPrice ||
      !tax ||
      !shippingCharges ||
      !totalAmount
    ) {
      return res.status(404).json({
        success: false,
        message: "fields required",
      });
    }

    const newOrder = await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // update stock values
    for (let i = 0; i < orderItems.length; i++) {
      // product find
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity; // minus stock from product tables
      await product.save();
    }

    return res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
      newOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};

// get my order
export const getMyOrderController = async (req, res) => {
  try {
    const order = await orderModel.find({ user: req.user._id });
    if (!order) {
      return res.status(404).json({
        success: true,
        message: "not found order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "my order data",
      totalOrder: order.length,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};

// get single order
export const getSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: true,
        message: "not found order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "single order data",
      order,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid Id",
      });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};

// payments
export const orderPaymentController = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount) {
      return res.status(404).json({
        success: false,
        message: "total amount required",
      });
    }
    const { client_secret } = await Stripe.create({
      amount: Number(totalAmount * 100), // dollars
      currency: "usd",
    });

    return res.status(200).json({
      success: true,
      message: "payment create success",
      client_secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};

//admin only
export const getAllOrderController = async (req, res) => {
  try {
    const order = await orderModel.find({});
    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "no order found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All order success",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};

export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "no order found",
      });
    }

    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "shipped") {
      order.orderStatus = "delivered";
      order.deliverdAt = new Date();
    } else {
      return res.status(500).json({
        success: false,
        message: "already deliverd order",
      });
    }

    await order.save();
    return res.status(200).json({
      success: true,
      message: "order status updated",
      order,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid Id",
      });
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};
