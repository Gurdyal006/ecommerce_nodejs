import express from "express";

import {
  loginController,
  registerController,
  updateUserPassword,
  updateUserProfileController,
  userLogout,
  userProfileController,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// routes
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile", isAuth, userProfileController);
router.get("/logout", isAuth, userLogout);
router.put("/update-profile", isAuth, updateUserProfileController);
router.put("/update-password", isAuth, updateUserPassword);

// export
export default router;
