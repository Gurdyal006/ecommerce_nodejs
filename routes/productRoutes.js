import express from "express";
import {
  creteProductController,
  deleteProductController,
  deleteProductImageController,
  getAllProducts,
  getSingleProductById,
  updateProductController,
  updateProductImageController,
} from "../controllers/productContrroller.js";
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.get("/get-all", getAllProducts);
router.get("/get-By-Id/:id", getSingleProductById);
router.post("/create", isAuth, isAdmin, singleUpload, creteProductController);
router.put("/update/:id", isAuth, isAdmin, updateProductController);
router.put(
  "/update/image/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImageController
);

router.delete(
  "/delete-image/:id",
  isAuth,
  isAdmin,
  deleteProductImageController
);
router.delete("/delete/:id", isAuth, isAdmin, deleteProductController);

export default router;
