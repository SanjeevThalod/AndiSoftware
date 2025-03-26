import User from "../models/userModel.js";
import { generateToken } from "../middleware/authMiddleware.js";

const register = async (req, res) => {
  const { name, email, phone, password} = req.body;  
  try {
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }    
    const user = await User.create({ name, email, phone, password });
    res.status(201).json({
      user,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select("+password")
      .populate("redeemedCoupons.coupon"); // Populate the redeemedCoupons array

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "approved") {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    res.json({
      user,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export { register, login };