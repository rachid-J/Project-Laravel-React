import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../Api/axiosClient";
import { useLocation, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logOut } from "../Redux/features/AuthSlice";
import { enableDarkMode } from "../Redux/features/themDarkmode";
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function Welcome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stock } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme.darkMode);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosClient.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axiosClient.patch(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Click outside handler for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const logout = useCallback(async () => {
    try {
      const response = await axiosClient.post("/store/logout");
      if (response.status === 200) {
        dispatch(logOut());
        navigate("/loadings");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [dispatch, navigate]);
  const deleteNotification = async (notificationId) => {
    try {
      const response = await axiosClient.delete(`/notifications/${notificationId}`);
      if (response.status === 200) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/inventory": "Inventory",
    "/customers": "Customers",
    "/suppliers": "Suppliers",
    "/orders": "Orders",
    "/sells": "Sells",
    "/settings": "Settings",
  };

  const currentPage = pageTitles[location.pathname] || "Dashboard";
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "ChartPieIcon" },
    { to: "/inventory", label: "Inventory", icon: "ArchiveBoxIcon" },
    { to: "/customers", label: "Customers", icon: "UserGroupIcon" },
    { to: "/suppliers", label: "Suppliers", icon: "TruckIcon" },
    { to: "/orders", label: "Orders", icon: "ShoppingCartIcon" },
    { to: "/sells", label: "Sells", icon: "CurrencyDollarIcon" },
    { to: "/settings", label: "Settings", icon: "Cog6ToothIcon" },
  ];
  return (
    <div className={`flex ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
    {/* Mobile Sidebar Backdrop */}
    {isSidebarOpen && (
      <div
        className="fixed inset-0 z-20 bg-black/50 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside
        className={`fixed top-0 z-30 h-screen w-96 transform transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:translate-x-0 ${darkMode ? "bg-gray-800" : "bg-indigo-700"}`}
      >
      <div className="flex h-full flex-col p-6">
        {/* Close Button (Mobile) */}
        <button onClick={() => setIsSidebarOpen(false)} className="mb-6 self-end lg:hidden">
          <XMarkIcon className="h-6 w-6 text-white" />
        </button>

        {/* Profile Section */}
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-white">{stock?.name}</h2>
          <p className="text-indigo-200">{stock?.role}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-indigo-600 text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-indigo-200 hover:bg-indigo-600"
                }`
              }
            >
              <span className="h-5 w-5">
                {icon === "ChartPieIcon" && <ChartPieIcon />}
                {icon === "ArchiveBoxIcon" && <ArchiveBoxIcon />}
                {icon === "UserGroupIcon" && <UserGroupIcon />}
                {icon === "TruckIcon" && <TruckIcon />}
                {icon === "ShoppingCartIcon" && <ShoppingCartIcon />}
                {icon === "CurrencyDollarIcon" && <CurrencyDollarIcon />}
                {icon === "Cog6ToothIcon" && <Cog6ToothIcon />}
              </span>
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto border-t border-indigo-600 pt-6">
          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-indigo-200 transition-colors hover:bg-indigo-600"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>

    {/* Header */}
    <header
        className={`fixed top-0 left-0 right-0 z-20 flex h-16 items-center justify-between border-b px-6 transition-colors ${
          darkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-200 bg-white text-gray-800"
        }`}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">{currentPage}</h1>
        </div>

        <div className="flex items-center gap-4">
        
          <button
            onClick={() => dispatch(enableDarkMode(!darkMode))}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="relative notification-dropdown">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div 
                  className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="divide-y">
                      {notifications.length === 0 ? (
                        <p className="text-center text-gray-500 py-2">No notifications</p>
                      ) : (
                       // In the notification dropdown rendering
                       notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-2 ${!notification.read ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm">{notification.message}</p>
                              <small className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(notification.created_at).toLocaleDateString()}
                              </small>
                            </div>
                            <div className="flex gap-2 ml-2">
                              {!notification.read && (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className={`text-xs ${
                                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                                  }`}
                                >
                                  Mark read
                                </button>
                              )}
                              <button 
                                onClick={() => deleteNotification(notification.id)}
                                className={`text-xs ${
                                  darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'
                                }`}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <img
                src={`http://127.0.0.1:8000/storage/${stock.photo}`}
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-indigo-500"
              />
              <div className="hidden text-sm sm:block">
                <p className="font-medium">{stock?.name}</p>
                <p className="text-gray-500 dark:text-gray-400">{stock?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full pt-20 p-4">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Add these icon components (or use from a library)
const ChartPieIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
    />
  </svg>
);

const ArchiveBoxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    {/* Draw the box outline */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h18M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4"
    />
  </svg>
);

const UserGroupIcon = () => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  className="h-5 w-5"
>
  {/* Left person */}
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M7 11a3 3 0 100-6 3 3 0 000 6z"
  />
  {/* Right person */}
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M17 11a3 3 0 100-6 3 3 0 000 6z"
  />
  {/* Base representing the group */}
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M4 20v-2a4 4 0 014-4h4m6 0h4a4 4 0 014 4v2"
  />
</svg>
);

const TruckIcon = () => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-5 w-5"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <line x1="3" y1="13" x2="3" y2="5" />
  <line x1="3" y1="13" x2="14" y2="13" />
  <line x1="14" y1="13" x2="14" y2="5" />
  <path d="M14 13l4 0a3 3 0 0 1 3 3v3h-7" />
  <line x1="7" y1="13" x2="7" y2="16" />
  <line x1="17" y1="16" x2="17" y2="19" />
  <circle cx="7" cy="19" r="2" />
  <circle cx="17" cy="19" r="2" />
</svg>
);

const ShoppingCartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6"
    />
  </svg>
);

const CurrencyDollarIcon = () => (
   <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 11.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10.5V8a2 2 0 012-2h2.5m8 0H19a2 2 0 012 2v2.5m0 4V16a2 2 0 01-2 2h-2.5m-8 0H5a2 2 0 01-2-2v-2.5M3 12h18"
    />
  </svg>
);

const BellIcon = () => (
  
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 18h5l-1.405-1.405A2.032 2.032 0 0118 15V11a6 6 0 10-12 0v4c0 .386-.147.735-.395 1.005L4 18h5m6 0a3 3 0 11-6 0"
      />
    </svg>
);

const ArrowLeftOnRectangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M9 12h12m0 0l-3-3m3 3l-3 3"
    />
  </svg>
);

const Cog6ToothIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 1.5v21m0-21c-3.866 0-7 3.134-7 7s3.134 7 7 7 7 3.134 7 7-3.134 7-7 7m0-21c3.866 0 7 3.134 7 7s-3.134 7-7 7-7 3.134-7 7 3.134 7 7 7"
    />
  </svg>
);

// Create similar components for other icons...