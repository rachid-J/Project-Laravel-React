import { Outlet, Link, useNavigate } from "react-router-dom";
import Logo from "../picture/Logo.png";
import { useEffect } from "react";

export default function Guest() {
    const token = localStorage.getItem("access_token");
    const navigate = useNavigate()
  
    useEffect(() => {
      if (token){
       

          navigate("/loadings")
      
        
      }
    },[token,navigate]);
    

  return (
    <div>
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <nav className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt="Your Company Logo"
                src={Logo}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/store/Features"
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition"
            >
              Features
            </Link>
            <Link
              to="/store/pricing"
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition"
            >
              Pricing
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition"
            >
              Sign Up
            </Link>
          </div>
          <div className="hidden lg:flex">
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Log in
            </button>
          </div>
        </nav>
      </header>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
