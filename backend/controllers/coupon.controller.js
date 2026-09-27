import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupn = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupn || null);
  } catch (error) {
    console.log("Error in getCoupon controller:", error.message);
    res.status(500).json({ massage: "Internal server error" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await Coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }
    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPrecentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon contrroller", error.message);
    res.status(500).json({ massage: "Internal server error" });
  }
};
