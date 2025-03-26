import Coupon from "../models/couponModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const createCoupon = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      discountType,
      discountValue,
      totalQuantity,
      minOrderValue,
      startDate,
      expirationDate,
      isActive = true,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      name,
      code,
      description,
      discountType,
      discountValue,
      totalQuantity,
      currentUses: 0,
      minOrderValue,
      startDate: startDate || Date.now(),
      expirationDate,
      isActive,
      createdBy: req.user.id,
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
    const coupons = await Coupon.find().populate("createdBy", "name email");
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

    const coupon = await Coupon.findById(id).populate("createdBy", "name email");
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
      isActive: true,
      startDate: { $lte: now },
      expirationDate: { $gte: now },
      currentUses: { $lt: "totalQuantity" },
    });

    res.status(200).json(availableCoupons);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const redeemCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const now = new Date();
    if (!coupon.isActive || now < coupon.startDate || now > coupon.expirationDate) {
      return res.status(400).json({ message: "Coupon is not active or has expired" });
    }

    if (coupon.currentUses >= coupon.totalQuantity) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    const user = await User.findById(userId);
    const alreadyRedeemed = user.redeemedCoupons.some(
      (c) => c.coupon.toString() === coupon._id.toString()
    );
    if (alreadyRedeemed) {
      return res.status(400).json({ message: "Coupon already redeemed by this user" });
    }

    user.redeemedCoupons.push({ coupon: coupon._id });
    coupon.currentUses += 1;
    await Promise.all([user.save(), coupon.save()]);

    res.status(200).json({
      message: "Coupon redeemed successfully",
      coupon: {
        code: coupon.code,
        name: coupon.name,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        expirationDate: coupon.expirationDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
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