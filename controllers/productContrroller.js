import productModel from "../models/productModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "./../utils/fileUpload.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (products.length === 0) {
      return res.status(500).json({
        success: false,
        message: "no data found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "all products fetch",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};

export const getSingleProductById = async (req, res) => {
  try {
    const singleProduct = await productModel.findById(req.params.id);
    if (!singleProduct) {
      return res.status(404).json({
        success: false,
        message: "no data found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "single products fetch",
      singleProduct,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid id",
      });
    }
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const creteProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!name || !description || !price || !stock) {
      return res.status(500).send({
        success: false,
        message: "Please Provide all fields",
      });
    }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "please provide images",
      });
    }

    const file = getDataUri(req.file);
    const uploadImage = await cloudinary.v2.uploader.upload(file.content);

    const image = {
      public_id: uploadImage.public_id,
      url: uploadImage.secure_url,
    };

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });
    return res.status(201).send({
      success: true,
      message: "product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "no product",
      });
    }
    const { name, description, price, category, stock } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    return res.status(201).send({
      success: true,
      message: "product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid id",
      });
    }
    return res.status(500).json({
      success: false,
      message: "api error",
    });
  }
};

export const updateProductImageController = async (req, res, file) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    // valdiation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    // check file
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Product image not found",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save
    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "product image updated",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error  UPDATE Products API",
      error,
    });
  }
};

export const deleteProductImageController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    // valdiation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    // check  image id
    const imageId = req.query.id;
    if (!imageId) {
      return res.status(404).send({
        success: false,
        message: "eee image  not found",
      });
    }

    let isExist = -1;
    product.images.forEach((item, i) => {
      if (item._id.toString() === imageId.toString()) isExist = i;
    });

    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "image  not found",
      });
    }
    // delete product exist image
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

    // splice method remove image wit index
    product.images.splice(isExist, 1);

    await product.save();
    return res.status(200).send({
      success: true,
      message: "delete image ",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error  delete  API",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // image file delete from cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    return res.status(200).json({
      success: true,
      message: "delete product",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error delete  Products API",
      error,
    });
  }
};
