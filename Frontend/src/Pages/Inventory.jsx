import { useState, useEffect } from "react";
import AddProductModal from "../Components/AddProductModal";
import AddBrandModal from "../Components/AddBrandModal";
import { axiosClient } from "../Api/axiosClient";

const Inventory = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axiosClient.get("/brand/list");
      setBrands(response.data.data); // Adjusting for paginated response if needed
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("/product/list");
      setProducts(response.data.data); // Adjusting for paginated response if needed
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleToggleModal = (modalType, state) => {
    if (modalType === "product") {setShowProductModal(state);
    if (!state) setSelectedProduct(null)};
    if (modalType === "brand") setShowBrandModal(state);
  };

  const handleSaveProduct = async (productData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Unauthorized. Please log in again.");
        return;
      }
  
      // Check if the product has an ID (indicates editing an existing product)
      if (productData.id) {
        // Update existing product
        await axiosClient.put(`/product/update/${productData.id}`, productData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Product updated successfully!");
      } else {
        // Add new product
        await axiosClient.post("/product/create", productData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Product added successfully!");
      }
  
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
      setShowProductModal(false); // Close the modal after save
    }
  };
  

  const handleSaveBrand = async (newBrand) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Unauthorized. Please log in again.');
        return; // Prevent further action if no token is found
      }
      console.log("Token Retrieved:", token); // Log token to verify it's retrieved
      
      const response = await axiosClient.post("/brand/create", newBrand, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
      });
      console.log("Brand saved:", response.data);
      alert("Brand added successfully!");
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Failed to add brand. Please try again.");
    } finally {
      setLoading(false);
      setShowBrandModal(false);
    }
  };
  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      await axiosClient.delete(`/product/delete/${productId}`);
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };
  
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
  <div className="flex justify-between mb-6">
    {/* Buttons for Adding */}
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={() => handleToggleModal("product", true)}
    >
      Add Product
    </button>
    <button
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      onClick={() => handleToggleModal("brand", true)}
    >
      Add Brand
    </button>
  </div>

  {loading && <p className="text-gray-500">Processing...</p>}

  {/* Product Modal */}
  <AddProductModal
    show={showProductModal}
    handleClose={() => handleToggleModal("product", false)}
    handleSave={handleSaveProduct}
    brands={brands}
    selectedProduct={selectedProduct}
  />

  {/* Brand Modal */}
  <AddBrandModal
    show={showBrandModal}
    handleClose={() => handleToggleModal("brand", false)}
    handleSave={handleSaveBrand}
  />

  {/* Products Table */}
  <div className="mt-6">
    <h3 className="text-2xl font-semibold mb-4">Product Inventory</h3>
    {Array.isArray(products) && products.length > 0 ? (
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm uppercase font-semibold text-gray-700">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-100 transition"
              >
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.sku}</td>
                <td className="py-2 px-4">${product.price}</td>
                <td className="py-2 px-4">{product.stock}</td>
                <td className="py-2 px-4">
                  {product.brand?.name || "No Brand"}
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => {
                      setSelectedProduct(product); // Set the product to edit
                      setShowProductModal(true); // Open the modal
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>No products available.</p>
    )}
  </div>

  {/* Brands List */}
  <div className="mt-12">
    <h3 className="text-2xl font-semibold mb-4">Brand Inventory</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.isArray(brands) && brands.length > 0 ? (
        brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h4 className="font-semibold text-lg text-gray-800">{brand.name}</h4>
          </div>
        ))
      ) : (
        <p>No brands available.</p>
      )}
    </div>
  </div>
</div>

  );
};

export default Inventory;
