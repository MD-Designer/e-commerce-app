import { redis } from "../lib/redis.js";
import imagekit from "../lib/imagekit.js";
import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, image, price, category } = req.body;

    console.log("BODY:", req.body);

    let imageKitResponse = null;

    if (image) {
      console.log("Uploading image to ImageKit...");

      imageKitResponse = await imagekit.upload({
        file: image,
        fileName: `product-${Date.now()}`,
        folder: "/products",
      });

      console.log("ImageKit:", imageKitResponse);
    }

    const product = await Product.create({
      name,
      description,
      image: imageKitResponse
        ? {
            url: imageKitResponse.url,
            fileId: imageKitResponse.fileId,
          }
        : null,
      price,
      category,
    });


    res.status(201).json(product);
  } catch (error) {

    console.log(error);
    console.log("MESSAGE:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No feature products found" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategoryProducts = async (req, res) => {
  const { category } = req.params;
  try {
    if (!category) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    const products = await Product.find({ category });

    res.json({products});
  } catch (error) {
    console.log("Error in getCategoryProducts controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updateProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "Prodcut not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image?.fileId) {
      try {
        await imagekit.deleteFile(product.image.fileId);
      } catch (error) {
        console.log("Error deleting image from imagekit");
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log("Error in deleteProduct controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in update cache function");
  }
}
