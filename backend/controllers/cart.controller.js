import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItem.find(
      (item) => item.product && item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItem.push({
        product: productId,
        quantity: 1,
      });
    }

    await user.save();

    res.status(200).json({
      cartItem: user.cartItem,
    });
  } catch (error) {
    console.log("Error in addToCart controller:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const cartItems = req.user.cartItem;

    const productIds = cartItems.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const result = products.map((product) => {
      const cartItem = cartItems.find(
        (item) => item.product.toString() === product._id.toString()
      );

      return {
        ...product.toJSON(),
        quantity: cartItem.quantity,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in getCartProducts controller:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItem.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    if (quantity === 0) {
      user.cartItem = user.cartItem.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      existingItem.quantity = quantity;
    }

    await user.save();

    res.status(200).json(user.cartItem);
  } catch (error) {
    console.log("Error in updateCartItem controller:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    user.cartItem = user.cartItem.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json(user.cartItem);
  } catch (error) {
    console.log("Error in deleteFromCart controller:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};