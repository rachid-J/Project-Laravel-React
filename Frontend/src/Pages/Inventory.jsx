import { useState, useEffect } from "react";
import AddBrandModal from "../Components/AddBrandModal";

import ShowMoreBrandModal from "../Components/ShowMoreBrandModal"; // New Component
import { axiosClient } from "../Api/axiosClient";
import EditProductModal from "../Components/EditProductModal";

const Inventory = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showBrandDetailsModal, setShowBrandDetailsModal] = useState(false); // Toggle for "Show More"
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Step for table pagination
  const itemsPerStep = 5; // Products per page

  useEffect(() => {
    fetchBrands();
    fetchOrders();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axiosClient.get("/brand/show");
      setBrands(response.data.Brands.data);
      console.log(response.data.Brands.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleToggleModal = (modalType, state) => {
    if (modalType === "product") setShowProductModal(state);
    if (modalType === "brand") setShowBrandModal(state);
    if (modalType === "brandDetails") setShowBrandDetailsModal(state);
  };

  const handleSaveProduct = async (productData) => {
    setLoading(true);
    try {
      if (productData.id) {
        await axiosClient.put(`/product/update/${productData.id}`, {
          product_name: productData.name,
          price: productData.price,
          quantity: productData.stock,
        });
        alert("Product updated successfully!");
      }
      fetchOrders();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/product/show");
      setOrders(response.data.data.data);
      console.log(response.data.data.data);
    } catch (error) {
      setError("Error fetching orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBrand = async (newBrand) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Unauthorized. Please log in again.");
        return;
      }
      await axiosClient.post("/brand/create", newBrand, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      fetchOrders();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleSaleProduct = async () => {
    
  } 

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const currentOrders = orders.slice(
    (currentStep - 1) * itemsPerStep,
    currentStep * itemsPerStep
  );

  const handleNextStep = () => {
    if (currentStep * itemsPerStep < orders.length) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300  flex flex-col lg:flex-row gap-6">
      {/* Sidebar for Brands */}
      <aside className="bg-white rounded-3xl shadow-md p-6 lg:w-1/4">
        <h3 className="text-xl font-semibold text-gray-700 mb-6">Brand Inventory</h3>
        {Array.isArray(brands) && brands.length > 0 ? (
          <ul className="space-y-4">
            {brands.slice(0, 4).map((brand) => (
              <li
                key={brand.id}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span>{brand.name}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No brands available.</p>
        )}
        <button
          className="mt-6 bg-gradient-to-r from-green-400 to-green-600 text-white w-full py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          onClick={() => handleToggleModal("brandDetails", true)}
        >
          Show More
        </button>
        <button
          className="mt-6 bg-gradient-to-r from-green-400 to-green-600 text-white w-full py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          onClick={() => handleToggleModal("brand", true)}
        >
          + Add Brand
        </button>
      </aside>

      {/* Main Section for Products */}
      <main className="flex-1 bg-white rounded-3xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-700">Product Inventory</h3>
        </div>
  	    {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <p className="text-gray-500">Processing...</p>}

        {/* Products Table */}
        <div className="overflow-x-auto">
          {Array.isArray(currentOrders) && currentOrders.length > 0 ? (
            <table className="table-auto w-full border-collapse bg-gray-50 rounded-xl shadow-sm">
              <thead>
                <tr className="text-left bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800 text-sm uppercase font-semibold">
                  <th className="py-3 px-4 rounded-tl-xl">Product Id</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4 rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="bg-white hover:bg-gray-100 transition border-t"
                  >
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.product_name}</td>
                  <td className="py-3 px-4">${order.price}</td>
                  <td className="py-3 px-4">{order.quantity}</td>
                  <td className="py-3 px-4">{order.brand.name || "no brand"}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-lg shadow-sm hover:shadow-md"
                        onClick={() => handleEditProduct(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 rounded-lg shadow-sm hover:shadow-md"
                        onClick={() => handleDeleteProduct(order.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-lg shadow-sm hover:shadow-md"
                        onClick={() => handleSaleProduct(order.id)}
                      >
                        Sale
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">No products available.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded ${
              currentStep === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
            onClick={handlePreviousStep}
          >
            Previous
          </button>
          <span>Step {currentStep}</span>
          <button
            disabled={currentStep * itemsPerStep >= orders.length}
            className={`px-4 py-2 rounded ${
              currentStep * itemsPerStep >= orders.length
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      </main>

      <EditProductModal
      show={showProductModal}
      handleClose={() => handleToggleModal("product", false)}
      handleSave={handleSaveProduct}
      product={selectedProduct}
      />

      <AddBrandModal
        show={showBrandModal}
        handleClose={() => handleToggleModal("brand", false)}
        handleSave={handleSaveBrand}
      />
      <ShowMoreBrandModal
        show={showBrandDetailsModal}
        brands={brands}
        handleClose={() => handleToggleModal("brandDetails", false)}
      />
    </div>
  );
};

export default Inventory;