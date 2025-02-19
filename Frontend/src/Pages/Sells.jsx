import { useState, useEffect } from "react";
import { axiosClient } from "../Api/axiosClient"; // Make sure you have the axios client set up

export default function Sells() {
  const [sells, setSells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sells data from the API
  const fetchSells = async () => {
    try {
      const response = await axiosClient.get("/product/showSells"); // Update the endpoint according to your API
      setSells(response.data.data); // Assuming the data is in `data` key
    } catch (error) {
      console.error("Error fetching sells:", error);
      setError("Failed to load sales data.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    if (!window.confirm("Are you sure you want to confirm this sale?")) return;
    try{
      console.log(`Confirming sell with ID: ${id}`);
      const response = await axiosClient.post(`/product/confirm/${id}`);
      console.log("Response Data:", response.data);
      alert(response.data.message || "Sale confirmed successfully!");
      fetchSells();
    }catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response);
        alert(`Error: ${error.response.data.message || "Failed to confirm sale"}`);
      } else {
        console.error("Request Failed:", error.message);
        alert("Network or server issue. Check console for details.");
      }
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Are you sure you want to return this sale?")) return;
  
    try {
      console.log(`Returning sell with ID: ${id}`);
      const response = await axiosClient.post(`/product/return/${id}`);
      console.log("Response Data:", response.data);
      alert(response.data.message || "Sale returned successfully!");
      fetchSells();
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response);
        alert(`Error: ${error.response.data.message || "Failed to return sale"}`);
      } else {
        console.error("Request Failed:", error.message);
        alert("Network or server issue. Check console for details.");
      }
    }
  };
  

  useEffect(() => {
    fetchSells();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Sales List</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer Id</th>
            <th className="border p-2">Product Id</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Total Price</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {sells.length > 0 ? (
            sells.map((sell) => (
              <tr key={sell.id}>
                <td className="border p-2">{sell.id}</td>
                <td className="border p-2">{sell.customer.id}</td>
                <td className="border p-2">{sell.product.product_name}</td> 
                <td className="border p-2">{sell.quantity}</td>
                <td className="border p-2">{sell.total_price}</td>
                <td className="border p-2">{sell.status}</td>
                <td className="border p-2">
                  <button className="bg-yellow-500 text-white px-4 py-1 rounded" 
                          onClick={() => handleReturn(sell.id)}
                  >
                    Return Sell
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-1 rounded ml-2"
                          onClick={() => handleConfirm(sell.id)}
                  >
                    Confirm Sell
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border p-2 text-center">
                No sales found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}