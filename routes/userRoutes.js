import express from "express";

import {
  loginController,
  registerController,
  updateProfilePicController,
  updateUserPassword,
  updateUserProfileController,
  userLogout,
  userProfileController,
  userResetPasswordController,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multerMiddleware.js";

import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

const router = express.Router();

// routes
router.post("/register", limiter, registerController);
router.post("/login", limiter, loginController);
router.get("/profile", isAuth, userProfileController);
router.get("/logout", isAuth, userLogout);
router.put("/update-profile", isAuth, updateUserProfileController);
router.put("/update-password", isAuth, updateUserPassword);
router.put(
  "/update-profilePic",
  isAuth,
  singleUpload,
  updateProfilePicController
);

// without email reset password
router.post("/reset-password", userResetPasswordController);

// export
export default router;
