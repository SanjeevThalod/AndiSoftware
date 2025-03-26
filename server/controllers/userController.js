import User from "../models/userModel.js";
import Coupon from "../models/couponModel.js";

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
      status: updatedUser.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user", status:"pending" }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = req.body.status || "approved"; 
    await user.save();
    res.json({ message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const redeemCoupon = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.id;

  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (!coupon.isActive || new Date() > new Date(coupon.expirationDate)) {
      return res.status(400).json({ message: "Coupon is expired or inactive" });
    }

    if (coupon.currentUses >= coupon.totalQuantity) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    const user = await User.findById(userId);
    const alreadyRedeemed = user.redeemedCoupons.some(
      (c) => c.coupon.toString() === coupon._id.toString()
    );
    if (alreadyRedeemed) {
      return res.status(400).json({ message: "Coupon already redeemed" });
    }

    user.redeemedCoupons.push({ coupon: coupon._id });
    coupon.currentUses += 1;
    await Promise.all([user.save(), coupon.save()]);

    res.json({ message: "Coupon redeemed successfully", coupon });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const rejectUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export { getUserProfile, updateUserProfile, getAllUsers, approveUser, redeemCoupon,rejectUser };