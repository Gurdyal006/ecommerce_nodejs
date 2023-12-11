import User from "../models/userModel.js";
import { createJWTToken } from "../utils/jwt.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/fileUpload.js";

export const registerController = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    address,
    city,
    country,
    phone,
  } = req.body;

  try {
    if (
      !firstName ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message: "fields required",
      });
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(500).json({
        success: false,
        message: "email already exist",
      });
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      address,
      city,
      country,
      phone,
    });
    res.status(201).json({
      success: true,
      message: "new user created succesfully",
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      success: false,
      message: "All fields required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(404).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  user.password = undefined; // password hide

  // token
  const token = await createJWTToken(user);

  const options = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    // secure: process.env.NODE_ENV === "development" ? true : false,
    httpOnly: process.env.NODE_ENV === "development" ? true : false,
    // sameSite: process.env.NODE_ENV === "development" ? true : false,
  };

  return res.status(200).cookie("token", token, options).json({
    success: true,
    message: "Login success",
    user,
    token,
  });
};

export const userProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Prfolie Fetched Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error In PRofile API",
      error,
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    const options = {
      expires: new Date(Date.now()),
      httpOnly: process.env.NODE_ENV === "development" ? true : false,
    };
    return res.status(200).cookie("token", "", options).json({
      success: true,
      message: "Loggout successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "loggout error api",
      error,
    });
  }
};

export const updateUserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { firstName, lastName, email, address, city, country, phone } =
      req.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).json({
      success: true,
      message: "user profile updated",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "old and new password required",
      });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(500).json({
        success: false,
        message: "old password not match",
      });
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "user password updated",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const updateProfilePicController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // get file from client
    const file = getDataUri(req.file);

    // delete prevoius image from cloudinary
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

    // file update latest and replace old one
    const newPic = await cloudinary.v2.uploader.upload(file.content);

    user.profilePic = {
      public_id: newPic.public_id,
      url: newPic.secure_url,
    };

    // save image in db
    await user.save();
    res.status(200).send({
      success: true,
      message: " new profile pic updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const userResetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return res.status(400).json({
        success: false,
        message: "all fields required",
      });
    }

    const user = await User.findOne({ email, answer });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user and answer not found",
      });
    }

    newPassword = password;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "password reset",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error,
    });
  }
};
