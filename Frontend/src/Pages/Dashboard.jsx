import { useState, useEffect } from "react";
import { axiosClient } from "../Api/axiosClient";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiTrendingUp, FiPackage, FiUsers, FiDollarSign } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from "react-redux";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [sellChart, setSellChart] = useState(null);
  const [orderChart, setOrderChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const darkMode = useSelector((state) => state.theme.darkMode);
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [response, response2, response3] = await Promise.all([
        axiosClient.get("/dashboard/getdata"),
        axiosClient.get("/dashboard/getsellsChart"),
        axiosClient.get("/dashboard/getordersChart")
      ]);

      setData(response.data);
      setSellChart(response2.data);
      setOrderChart(response3.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={100} className="rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} height={300} className="rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className={`flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <div className="text-center p-6 bg-red-100 rounded-xl max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );

  return (
    <div className={` transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Sales" 
            value={data?.totalSales} 
            icon={<FiDollarSign className="text-3xl" />}
            trend="+10.14%"
            darkMode={darkMode}
          />
          <StatCard 
            title="Customers" 
            value={data?.totalCustomers} 
            icon={<FiUsers className="text-3xl" />}
            trend="+5.2%"
            darkMode={darkMode}
          />
          <StatCard 
            title="Products" 
            value={data?.totalProducts} 
            icon={<FiPackage className="text-3xl" />}
            darkMode={darkMode}
          />
          <StatCard 
            title="Total Orders" 
            value={data?.totalOrders} 
            icon={<FiTrendingUp className="text-3xl" />}
            trend="+8.3%"
            darkMode={darkMode}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Sales Trend" trend="+10.14%" darkMode={darkMode}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sellChart}>
                <XAxis dataKey="day" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Sold" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="returned" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Orders Overview" trend="+10.14%" darkMode={darkMode}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderChart}>
                <XAxis dataKey="day" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Paid" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Cancelled" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, trend, darkMode }) => (
  <div className={`p-6 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-sm hover:shadow-md`}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="flex items-center mt-4">
        <span className="text-green-500 text-sm font-medium">{trend}</span>
      </div>
    )}
  </div>
);

const ChartCard = ({ title, trend, children, darkMode }) => (
  <div className={`p-6 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-sm hover:shadow-md`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      {trend && <span className="text-green-500 text-sm font-medium">{trend}</span>}
    </div>
    {children}
  </div>
);
