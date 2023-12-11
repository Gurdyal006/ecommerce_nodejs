import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCatController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(404).json({
        success: false,
        message: "name required",
      });
    }

    const existCat = await categoryModel.findOne({ name });
    if (existCat) {
      return res.status(404).json({
        success: false,
        message: "name already exist",
      });
    }

    const newCat = await categoryModel.create({ name });
    return res.status(200).json({
      success: true,
      message: "category created successfully",
      newCat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "category create api error",
    });
  }
};

export const getAllCatController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "no data found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All cat data success",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "category get all api error",
    });
  }
};

export const getByIdCatController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "no data found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Single cat data success",
      category,
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
      message: "category get single api error",
    });
  }
};

export const updateCatController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "no data found",
      });
    }

    // find category in product table
    const products = await productModel.find({ category: category._id });
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "cat data not found",
      });
    }

    const categoryId = category._id.toString();
    // update category in product table
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = categoryId;
      await product.save();
    }

    if (req.body.name) category.name = req.body.name;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "update cat data success",
      category,
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
      message: "category update api error",
    });
  }
};

export const deleteCatController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "no data found",
      });
    }

    // find category in product table
    const products = await productModel.find({ category: category._id });
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "cat data not found",
      });
    }

    // update category in product table
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "delete cat data success",
      category,
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
      message: "category delete api error",
    });
  }
};
