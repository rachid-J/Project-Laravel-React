import { useEffect, useState } from "react";
import { axiosClient } from "../Api/axiosClient";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 6; // Number of orders per page
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/order/show");
      setOrders(response.data);
      console.log(response.data);	
    } catch (error) {
      setError("Error fetching orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleBatchPay = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors
  
    try {
      const responses = await Promise.all(
        selectedOrders.map(async (orderId) => {
          try {
            const response = await axiosClient.post(`/order/pay/${orderId}`);
            console.log(`Response for order ${orderId}:`, response);
            return response;
          } catch (err) {
            console.error(`Error for order ${orderId}:`, err.response?.data || err.message);
            throw err;
          }
        })
      );
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          selectedOrders.includes(order.id) ? { ...order, status: "Paid" } : order
        )
      );
  
      setSelectedOrders([]);
    } catch (error) {
      console.error("Batch payment error:", error);
      setError(error.response?.data?.message || "Failed to pay for selected orders.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleBatchCancel = async () => {
    setLoading(true);
    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          axiosClient.post(`/order/cancel/${orderId}`)
        )
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          selectedOrders.includes(order.id)
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
      setSelectedOrders([]);
    } catch (error) {
      setError("Failed to cancel selected orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchPrint = () => {
    const printableOrders = orders.filter((order) =>
      selectedOrders.includes(order.id)
    );
    const printContent = printableOrders
      .map(
        (order) =>
          `<tr>
            <td>${order.id}</td>
            <td>${order.product_name}</td>
            <td>${order.suppliers_id}</td>
            <td>${order.store_id}</td>
            <td>${order.price}</td>
            <td>${order.quantity}</td>
            <td>${order.total_price}</td>
            <td>${order.status}</td>
          </tr>`
      )
      .join("");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Orders</title>
        </head>
        <body>
          <h1>Selected Orders</h1>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Supplier ID</th>
                <th>Store ID</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${printContent}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Handle pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-500 mb-4">Loading...</div>}

      <div className="mb-4 space-x-2">
        <button
          onClick={handleBatchPay}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={selectedOrders.length === 0}
        >
          Pay Selected
        </button>
        <button
          onClick={handleBatchCancel}
          className="bg-red-500 text-white px-4 py-2 rounded"
          disabled={selectedOrders.length === 0}
        >
          Cancel Selected
        </button>
        <button
          onClick={handleBatchPrint}
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={selectedOrders.length === 0}
        >
          Print Selected
        </button>
      </div>

      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4">Select</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Supplier ID</th>
                <th className="py-3 px-4">Store ID</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                    />
                  </td>
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.product_name}</td>
                  <td className="py-3 px-4">{order.suppliers_id}</td>
                  <td className="py-3 px-4">{order.store_id}</td>
                  <td className="py-3 px-4">${order.price}</td>
                  <td className="py-3 px-4">{order.quantity}</td>
                  <td className="py-3 px-4">${order.total_price}</td>
                  <td className="py-3 px-4">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
