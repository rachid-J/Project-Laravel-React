import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../Api/axiosClient";
import { useLocation, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logOut } from "../Redux/features/AuthSlice";

export default function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { stock } = useSelector((state) => state.auth);
  const disp = useDispatch();

  const logout = async () => {
    try {
      const response = await axiosClient.post("/store/logout");
      if (response.status === 200) {
        disp(logOut());
        navigate("/loadings");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/inventory": "Inventory",
    "/suppliers": "Suppliers",
    "/orders": "Orders",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };

  const currentPage = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 h-screen bg-indigo-700 text-white flex flex-col p-6 shadow-lg">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={`http://127.0.0.1:8000/storage/${stock.photo}`}
            alt="Profile"
            className="rounded-full w-20 h-20 border-4 border-indigo-400 shadow-md mb-4"
          />
          <h2 className="text-lg font-semibold">{stock?.name}</h2>
          <p className="text-sm text-indigo-200">{stock?.role}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-4">
          {[
            { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
            { to: "/inventory", label: "Inventory", icon: "inventory" },
            { to: "/suppliers", label: "Suppliers", icon: "local_shipping" },
            { to: "/orders", label: "Orders", icon: "shopping_cart" },
            { to: "/analytics", label: "Analytics", icon: "bar_chart" },
            { to: "/settings", label: "Settings", icon: "settings" },
          ].map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-4 px-4 py-3 bg-indigo-600 rounded-lg shadow-md"
                  : "flex items-center space-x-4 px-4 py-3 text-indigo-200 hover:bg-indigo-600 rounded-lg"
              }
            >
              <span className="material-icons">{icon}</span>
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-6 border-t border-indigo-600">
          <button
            onClick={logout}
            className="w-full flex items-center justify-start px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg"
          >
            <span className="material-icons">logout</span>
            <span className="ml-4">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-8">
          <h1 className="text-2xl font-semibold text-gray-800">{currentPage}</h1>
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <button className="text-gray-500 hover:text-gray-700">
              <span className="material-icons">notifications</span>
            </button>

            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-700">{stock.name}</p>
                <p className="text-gray-500 text-sm">{stock.role}</p>
              </div>
              <img
                src={`http://127.0.0.1:8000/storage/${stock.photo}`}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
