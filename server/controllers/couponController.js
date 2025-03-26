import Coupon from "../models/couponModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const createCoupon = async (req, res) => {
  try {
    const {
      name,
      code,
      Quantity,
      endDate
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      name,
      code,
      Quantity,
      endDate,
    });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid coupon ID" });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid coupon ID" });
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updatedData, { new: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid coupon ID" });
    }

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    const availableCoupons = await Coupon.find({
      Quantity: { $gt: 0 },
      endDate: { $gte: now },
    });

    res.status(200).json(availableCoupons);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const redeemCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    console.log(req.user);
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const now = new Date();
    // if (now > coupon.endDate || coupon.Quantity <= 0) {
    //   return res.status(400).json({ success: false, message: "Coupon is not active or has expired" });
    // }

    if (coupon.usedBy.includes(req.user.id)) {
      return res.status(200).json({ exhausted:true, message: "Coupon has already been redeemed by you" });
    }

    // Update coupon
    coupon.Quantity -= 1;
    coupon.usedBy.push(req.user.id);
    await coupon.save();

    // Update user
    user.redeemedCoupons.push({ coupon: coupon._id });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Coupon redeemed successfully",
      coupon
    });

  } catch (error) {
    console.error("Redeem Coupon Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};


const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    const now = new Date();
    if (!coupon.isActive) {
      return res.status(400).json({ message: "This coupon is not active" });
    }

    if (now > coupon.expirationDate) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.currentUses >= coupon.totalQuantity) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    res.status(200).json({
      message: "Coupon is valid",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getAvailableCoupons,
  redeemCoupon,
  validateCoupon,
};