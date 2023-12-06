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
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.get("/get-all", getAllProducts);
router.get("/get-By-Id/:id", getSingleProductById);
router.post("/create", isAuth, singleUpload, creteProductController);
router.put("/update/:id", isAuth, updateProductController);
router.put(
  "/update/image/:id",
  isAuth,
  singleUpload,
  updateProductImageController
);

router.delete("/delete-image/:id", isAuth, deleteProductImageController);
router.delete("/delete/:id", isAuth, deleteProductController);

export default router;
