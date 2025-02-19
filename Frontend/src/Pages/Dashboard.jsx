import { useState, useEffect } from "react";
import { axiosClient } from "../Api/axiosClient";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [sellChart, setSellChart] = useState(null);
  const [orderChart, setOrderChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/dashboard/getdata");
      const response_2 = await axiosClient.get("/dashboard/getsellsChart");
      const response_3 = await axiosClient.get("/dashboard/getordersChart");

      setData(response.data);
      setSellChart(response_2.data);
      setOrderChart(response_3.data);

      console.log(response_2.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6 bg-gray-100">
      {/* Stock Cards */}
      <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Sales</h2>
          <p className="text-2xl">{data?.totalSales}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Customers</h2>
          <p className="text-2xl">{data?.totalCustomers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Products</h2>
          <p className="text-2xl">{data?.totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
          <p className="text-2xl">{data?.totalOrders}</p>
        </div>
      </div>
    </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Graph */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Sales Trend</h2>
          <p className="text-green-500">+10.14%</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sellChart}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Sold" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="returned" stroke="#ff0000" strokeWidth={2} />

            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Graph */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Orders Overview</h2>
          <p className="text-green-500">+10.14%</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={orderChart}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Paid" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="Cancelled" stroke="#ff0000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
