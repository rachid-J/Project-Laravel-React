import { useState, useEffect } from "react";
import { axiosClient } from "../Api/axiosClient";

const SaleModal = ({ show, handleClose, selectedProducts, fetchOrders }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [saleQuantities, setSaleQuantities] = useState(
    selectedProducts.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {})
  );

  useEffect(() => {
    if (show) fetchCustomers();
  }, [show]);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axiosClient.get("/customer/show");
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleChange = (productId, value) => {
    setSaleQuantities({ ...saleQuantities, [productId]: Number(value) });
  };

  const handleConfirmSale = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    try {
      await axiosClient.post(`/product/sale`, {
        customer_id: selectedCustomer,
        products: selectedProducts.map((product) => ({
          product_id: product.id,
          quantity: saleQuantities[product.id],
        })),
      });

      fetchOrders();
      handleClose();
    } catch (error) {
      console.error("Sale error:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Sale</h2>

        {/* Customer Selection */}
        <label className="block text-gray-700 mb-2">Select Customer:</label>
        <select
          className="border rounded px-2 py-1 w-full mb-4"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">-- Select Customer --</option>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No customers available
            </option>
          )}
        </select>

        {/* Product Selection */}
        {selectedProducts.map((product) => (
          <div key={product.id} className="mb-3">
            <label className="block text-gray-700">{product.product_name}</label>
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={saleQuantities[product.id]}
              onChange={(e) => handleChange(product.id, e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleConfirmSale}>
            Confirm Sale
          </button>
          <button className="ml-2 text-gray-500" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;
