import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AddBrandModal from "../Components/AddBrandModal";
import SaleModal from "../Components/SaleModal";
import ShowMoreBrandModal from "../Components/ShowMoreBrandModal";
import EditProductModal from "../Components/EditProductModal";
import { axiosClient } from "../Api/axiosClient";
import "react-loading-skeleton/dist/skeleton.css";
import { Notification } from "../Components/Notification";



const Inventory = () => {
  // Get dark mode flag from Redux store
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [showProductModal, setShowProductModal] = useState(false);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showBrandDetailsModal, setShowBrandDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const itemsPerStep = 5;
  const [selectedBrand, setSelectedBrand] = useState('');
  const [notification, setNotification] = useState(null);
  // Fetch brands and products on mount
  useEffect(() => {
    fetchBrands();
    fetchOrders();
  }, []);
  useEffect(() => {
    setCurrentStep(1);
  }, [selectedBrand]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await axiosClient.get("/brand/show");
      setBrands(response.data.Brands.data);
      console.log(response.data.Brands.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, []);

  const filteredOrders = selectedBrand
  ? orders.filter(order => order.brand?.id == selectedBrand)
  : orders;



  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/product/show");
      setOrders(response.data.data.data);
      setError(null);
      console.log(response.data.data.data);
    } catch (error) {
      setError("Error fetching orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Modal toggle helper
  const handleToggleModal = (modalType, state) => {
    if (modalType === "product") setShowProductModal(state);
    if (modalType === "brand") setShowBrandModal(state);
    if (modalType === "brandDetails") setShowBrandDetailsModal(state);
  };

  // Save or update a product
  const handleSaveProduct = async (productData) => {
    setLoading(true);
    try {
      if (productData.id) {
        await axiosClient.put(`/product/update/${productData.id}`, {
          product_name: productData.name,
          price: productData.price,
          quantity: productData.stock,
        });
        setNotification({type:"success",message:"Product updated successfully!"})
      }
      fetchOrders();
    } catch (error) {
      console.error("Error saving product:", error);
      setNotification({type:"error",message:"Failed to save product. Please try again."})
    } finally {
      setLoading(false);
    }
  };

  // Save new brand
  const handleSaveBrand = async (newBrand) => {
    setLoading(true);
    setNotification(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Unauthorized. Please log in again.");
        return;
      }
      const response = await axiosClient.post("/brand/create", newBrand);
      console.log(response)
      setNotification({type:"success",message:response.data.message})
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      if(error.response){
      setNotification({type:"error",message:"Failed to save brand. Please try again."})
      }
    } finally {
      setLoading(false);
      setShowBrandModal(false);
    }
  };

  // Delete a product after confirmation
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosClient.delete(`/product/delete/${productId}`);
      setNotification({type:"success",message:"Product deleted successfully!"})
      fetchOrders();
    } catch (error) {
      console.error("Error deleting product:", error);
      setNotification({type:"error",message:"Product deletion failed. Please try again."})
    }
  };

  // Toggle product selection for sale
  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Open product editor modal
  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowProductModal(true);
  };

  // Open sale modal if at least one product is selected
  const handleOpenSaleModal = () => {
    if (selectedProducts.length > 0) {
      setShowSaleModal(true);
    }
  };

  // Pagination logic
  const currentOrders = filteredOrders.slice(
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
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 md:p-8">
      {/* Sidebar for Brands */}
      <aside
        className={`rounded-3xl shadow-md p-6 lg:w-1/4 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h3 className="text-xl font-bold mb-6">Brand Inventory</h3>
        {brands.length > 0 ? (
          <ul className="space-y-4">
            {brands.slice(0, 4).map((brand) => (
              <li
                key={brand.id}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{brand.name}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No brands available.</p>
        )}
        <div className="mt-6 space-y-3">
          <button
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-xl shadow hover:shadow-lg transition-shadow"
            onClick={() => handleToggleModal("brandDetails", true)}
          >
            Show More
          </button>
          <button
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-xl shadow hover:shadow-lg transition-shadow"
            onClick={() => handleToggleModal("brand", true)}
          >
            + Add Brand
          </button>
        </div>
      </aside>
      

      {/* Main Section for Products */}
      <main
        className={`flex-1 rounded-3xl shadow-md p-6 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
  <h3 className="text-2xl font-bold">Product Inventory</h3>
  <div className="flex items-center gap-4">
    <select
      value={selectedBrand}
      onChange={(e) => setSelectedBrand(e.target.value)}
      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
        darkMode 
          ? "bg-gray-700 text-white border-gray-600" 
          : "bg-white text-gray-800 border-gray-300"
      } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      <option value="">All Brands</option>
      {brands.map((brand) => (
        <option key={brand.id} value={brand.id}>
          {brand.name}
        </option>
      ))}
    </select>
    <button
      onClick={handleOpenSaleModal}
      disabled={selectedProducts.length === 0}
      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
        selectedProducts.length === 0
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      Sell Selected
    </button>
  </div>
</div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <p className="text-gray-500">Processing...</p>}

        {/* Products Table */}
        <div className="overflow-x-auto">
          {currentOrders.length > 0 ? (
            <table
              className={`w-full border-collapse rounded-xl shadow transition-colors duration-300 ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-800"
              }`}
            >
              <thead>
                <tr className={`text-left text-sm uppercase font-semibold ${
                  darkMode
                    ? "bg-gray-600 text-white"
                    : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800"
                }`}>
                  <th className="py-3 px-4 rounded-tl-xl">Select</th>
                  <th className="py-3 px-4">Product Id</th>
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
                    className={`transition border-t ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700 border-gray-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(order.id)}
                        onChange={() => handleSelectProduct(order.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                    </td>
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.product_name}</td>
                    <td className="py-3 px-4">${order.price}</td>
                    <td className="py-3 px-4">{order.quantity}</td>
                    <td className="py-3 px-4">{order.brand.name || "No Brand"}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:shadow-md transition-colors duration-200"
                        onClick={() => handleEditProduct(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 rounded-lg shadow hover:shadow-md transition-colors duration-200"
                        onClick={() => handleDeleteProduct(order.id)}
                      >
                        Delete
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
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              currentStep === 1
                ? darkMode
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handlePreviousStep}
          >
            Previous
          </button>
          <span className="font-medium">Step {currentStep}</span>
          <button
            disabled={currentStep * itemsPerStep >= filteredOrders.length}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              currentStep * itemsPerStep >= orders.length
                ? darkMode
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      </main>

      {/* Modals */}
      <EditProductModal
        show={showProductModal}
        handleClose={() => {
          setShowProductModal(false);
          setProductToEdit(null);
        }}
        handleSave={handleSaveProduct}
        product={productToEdit}
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
      <SaleModal
        show={showSaleModal}
        handleClose={() => setShowSaleModal(false)}
        selectedProducts={orders.filter((order) =>
          selectedProducts.includes(order.id)
        )}
        fetchOrders={fetchOrders}
      />
      {notification && <Notification type={notification.type} message={notification.message} />}
    </div>
    
  );
};

export default Inventory;
