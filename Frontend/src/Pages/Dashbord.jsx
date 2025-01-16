import { axiosClient } from "../Api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axiosClient.post("store/logout");
      if (response.status === 200) {
        console.log(response.data.message);
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-gray-800">
            <span className="text-lg font-bold">Stock Manager</span>
          </div>
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 rounded-md bg-gray-800"
                >
                  <span className="material-icons mr-3">dashboard</span>
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <span className="material-icons mr-3">inventory</span>
                  Inventory
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <span className="material-icons mr-3">store</span>
                  Suppliers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <span className="material-icons mr-3">shopping_cart</span>
                  Orders
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <span className="material-icons mr-3">bar_chart</span>
                  Analytics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <span className="material-icons mr-3">settings</span>
                  Settings
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your teams</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                    <span className="mr-3 bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">H</span>
                    Heroicons
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                    <span className="mr-3 bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">T</span>
                    Tailwind Labs
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                    <span className="mr-3 bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">W</span>
                    Workcation
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="border-t border-gray-800 p-4">
            <button
              onClick={logout}
              className="flex items-center text-gray-300 hover:text-white w-full"
            >
              <span className="material-icons mr-3">logout</span>
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
  <div className="text-gray-700 text-lg font-bold">Dashboard</div>
  <div className="flex items-center space-x-4">
    {/* Notification Button */}
    <button className="text-gray-500 hover:text-gray-700 flex justify-center">
      <span className="material-icons">notifications</span>
    </button>

    {/* Profile Section */}
    <div className="flex items-center space-x-4">
    
      {/* Name and Role */}
      <div className="text-sm">
        <p className="text-gray-700 font-medium">John Doe</p>
        <p className="text-gray-500 text-xs">Administrator</p>
      </div>
        {/* Profile Image */}
        <div className="relative w-10 h-10">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    </div>
  </div>
</header>

         
        </div>
      </div>
    </div>
  );
}
