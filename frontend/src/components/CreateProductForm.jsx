import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];
const CreateProductForm = () => {
  const [newProdcut, setNewProdcut] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
     await createProduct(newProdcut);
    setNewProdcut({
      name: "",
      description: "",
      category: "",
      price: "",
      image: "",
    });
   } catch {
    console.log("Error creating a product")
   }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProdcut({ ...newProdcut, image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-emerald-300 mb-6">
        Create New Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Product Name
          </label>

          <input
            type="text"
            id="name"
            required
            value={newProdcut.name}
            onChange={(e) =>
              setNewProdcut({ ...newProdcut, name: e.target.value })
            }
            className="block w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Jon Doe"
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>

          <textarea
            type="text"
            id="name"
            rows={3}
            required
            value={newProdcut.description}
            onChange={(e) =>
              setNewProdcut({ ...newProdcut, description: e.target.value })
            }
            className="block w-full px-3 py-2  bg-gray-600 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Jon Doe"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Price
          </label>

          <input
            type="number"
            id="price"
            name="price"
            required
            step={0.01}
            value={newProdcut.price}
            onChange={(e) =>
              setNewProdcut({ ...newProdcut, price: e.target.value })
            }
            className="block w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="0.00"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Category
          </label>

          <select
            type="text"
            id="category"
            required
            value={newProdcut.category}
            onChange={(e) =>
              setNewProdcut({ ...newProdcut, category: e.target.value })
            }
            className="block w-full px-3 py-2 text-gray-400 bg-gray-600 border border-gray-600 rounded-md shadow-sm
                  placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="" className="text-gray-400">
              Select a Category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1">
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="sr-only"
            accept="image/*"
          />

          <label
            htmlFor="image"
            className="cursor-pointer flex items-center w-full px-3 py-2 text-gray-400 bg-gray-600 border border-gray-600 rounded-md shadow-sm"
          >
            <div className="flex justify-end">
              {newProdcut.image && (
                <img
                  src={newProdcut.image}
                  alt="Uploaded product"
                  className="w-18 h-18 object-cover rounded-md mr-3 "
                />
              )}
            </div>

            <span className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Image
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm
          font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2
          focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Prodcut
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
