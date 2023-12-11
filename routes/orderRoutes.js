import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAllOrderController,
  getMyOrderController,
  getSingleOrderController,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", isAuth, createOrderController);
router.get("/get-myOrder", isAuth, getMyOrderController);
router.get("/get-singleOrder/:id", isAuth, getSingleOrderController);

/// admin only
router.get("/admin/get-allOrders", isAuth, isAdmin, getAllOrderController);
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;
