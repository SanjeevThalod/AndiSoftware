import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Coupon code is required"],
    unique: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, "Coupon name is required"],
    trim: true,
  },
  Quantity: {
    type: Number,
    default: 1,
  },
  endDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  usedBy:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
});


const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
