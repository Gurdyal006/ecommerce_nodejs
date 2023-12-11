import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

// for user
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  //valdiation token
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized User",
    });
  }
  const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodeData._id);
  next();
};

// for admin
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(404).json({
      success: false,
      message: "admin only",
    });
  }
  next();
};
