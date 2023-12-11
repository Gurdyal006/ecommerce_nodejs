import express from "express";
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createCatController,
  deleteCatController,
  getAllCatController,
  getByIdCatController,
  updateCatController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", isAuth, isAdmin, createCatController);
router.get("/get-all", getAllCatController);
router.get("/single/:id", getByIdCatController);
router.put("/update/:id", isAuth, isAdmin, updateCatController);
router.delete("/delete/:id", isAuth, isAdmin, deleteCatController);

export default router;
