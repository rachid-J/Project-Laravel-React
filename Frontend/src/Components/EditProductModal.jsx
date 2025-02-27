import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access dark mode state
import { Notification } from "./Notification";

const EditProductModal = ({ show, handleClose, handleSave, product }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [notification,setNotification] = useState(null);

  const darkMode = useSelector((state) => state.theme.darkMode); // Get dark mode state

  const resetForm = () => {
    setProductName("");
    setProductPrice("");
    setProductStock("");
    setTotalPrice(0);
  };

  useEffect(() => {
    if (product) {
      setProductName(product.product_name || "");
      setProductPrice(product.price !== undefined ? product.price.toString() : "");
      setProductStock(product.quantity !== undefined ? product.quantity.toString() : "");
    } else {
      resetForm();
    }
  }, [product]);

  useEffect(() => {
    const price = parseFloat(productPrice) || 0;
    const stock = parseInt(productStock, 10) || 0;
    setTotalPrice(price * stock);
  }, [productPrice, productStock]);

  const handleSubmit = () => {
    if (!productName || !productPrice || !productStock) {
      setNotification({type:"error",message:"Please fill in all required fields."});
      return;
    }

    if (isNaN(productPrice) || isNaN(productStock)) {
      setNotification({type:"error",message:"Price and Stock must be valid numbers."});
      return;
    }

    const newProduct = {
      id: product?.id,
      name: productName,
      price: parseFloat(productPrice),
      stock: parseInt(productStock, 10),
    };

    handleSave(newProduct);
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div
        className={`w-full max-w-lg p-6 rounded-lg shadow-lg transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input
              type="text"
              className={`block w-full px-4 py-2 border rounded-md focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              className={`block w-full px-4 py-2 border rounded-md focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Enter product price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              className={`block w-full px-4 py-2 border rounded-md focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
              placeholder="Enter product stock"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Price</label>
            <input
              type="text"
              className={`block w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed ${
                darkMode ? "border-gray-600 text-white" : "border-gray-300 text-gray-900"
              }`}
              value={totalPrice}
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md transition ${
              darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-500 text-white hover:bg-gray-400"
            }`}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md transition ${
              darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={handleSubmit}
          >
            {product ? "Save Changes" : "Save Product"}
          </button>
        </div>
      </div>
            {notification && <Notification type={notification.type} message={notification.message} />}
    </div>
  );
};

export default EditProductModal;
