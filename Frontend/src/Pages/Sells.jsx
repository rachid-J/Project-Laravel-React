import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; 
import { axiosClient } from "../Api/axiosClient"; 
import { Notification } from "../Components/Notification";

export default function Sells() {
  const [sells, setSells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification,setNotification] = useState(null);

  const darkMode = useSelector((state) => state.theme.darkMode);


  const fetchSells = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/product/showSells");
      setSells(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
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
      setNotification({type:"success",message:"Sale confirmed successfully!"});
      fetchSells();
    }catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response);
        setNotification({type:"error",message:"Failed to confirm sale"});
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
      setNotification({type:"success",message:"Sale returned successfully!"});
      fetchSells();
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response);
        setNotification({type:"error",message:"Failed to return sale"});
      } else {
        console.error("Request Failed:", error.message);
        alert("Network or server issue. Check console for details.");
      }
    }
  };
  

  useEffect(() => {
    fetchSells();
  }, []);

  if (loading) return <div className="text-center text-gray-700 dark:text-gray-300">Loading...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400">{error}</div>;

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 dark:text-white">
        <h2 className="text-2xl font-semibold mb-4">Sales List</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sells.length > 0 ? (
                sells.map((sell) => (
                  <tr key={sell.id} className="border-t dark:border-gray-600">
                    <td className="py-3 px-4">{sell.id}</td>
                    <td className="py-3 px-4">{sell.customer?.id || "N/A"}</td>
                    <td className="py-3 px-4">{sell.product?.product_name || "N/A"}</td>
                    <td className="py-3 px-4">{sell.quantity}</td>
                    <td className="py-3 px-4">${sell.total_price}</td>
                    <td className="py-3 px-4">{sell.status}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 dark:hover:bg-yellow-400" onClick={()=>handleReturn(sell.id)}>
                        Return
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 dark:hover:bg-blue-400 ml-2" onClick={()=>handleConfirm(sell.id)}>
                        Confirm
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-3 px-4 text-center">
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
          {notification && <Notification type={notification.type} message={notification.message} />}
    </div>
  );
}
