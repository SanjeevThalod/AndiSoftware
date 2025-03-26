import express from "express";
import {createCoupon,getAllCoupons,getCouponById,updateCoupon,deleteCoupon,getAvailableCoupons,
redeemCoupon,validateCoupon,} from "../controllers/couponController.js";
import { checkLogin, checkAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(checkLogin, checkAdmin, getAllCoupons).post(checkLogin, checkAdmin, createCoupon);
router.route("/available").get(checkLogin, getAvailableCoupons);
router.route("/redeem").post(checkLogin, redeemCoupon);
router.route("/:id").get(checkLogin, checkAdmin, getCouponById).put(checkLogin, checkAdmin, updateCoupon)
  .delete(checkLogin, checkAdmin, deleteCoupon);

export default router;