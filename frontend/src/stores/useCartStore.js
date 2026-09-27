import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getMyCoupon: async () => {
    try {
      const response = await axiosInstance.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetch coupon:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axiosInstance.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon  applied successfully");
    } catch (error) {
      toast.error(error.response?.data.message || "Failed to apply coupon");
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItem: async () => {
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "An error occured");
    }
  },

  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },

  addToCart: async (product) => {
    try {
      await axiosInstance.post("/cart", { productId: product._id });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      toast.success("Product added to cart");
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occured");
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete("/cart", {
        data: { productId },
      });

      set((state) => ({
        cart: state.cart.filter((item) => item._id !== productId),
      }));

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.log("REMOVE CART ERROR:", error.response?.data || error);

      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity === 0) {
        await get().removeFromCart(productId);
        return;
      }

      await axiosInstance.put(`/cart/${productId}`, {
        quantity,
      });

      set((state) => {
        const updatedCart = state.cart.map((item) =>
          item._id === productId
            ? { ...item, quantity: Number(quantity) }
            : item,
        );

        return {
          cart: updatedCart,
        };
      });
    } catch (error) {
      console.log(
        "UPDATE QUANTITY ERROR:",
        error.response?.data || error.message,
      );
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPrecentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));
