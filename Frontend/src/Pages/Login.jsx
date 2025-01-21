import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../Api/axiosClient";
import { loginSuccess } from "../Redux/features/AuthSlice";
import { useDispatch } from "react-redux";
export default function Login() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true)
    const payload = {
      email : email ,
      password : password
    }

    try {
      const response = await axiosClient.post("store/login", payload);
      if (response.status === 200) {
        const { token, stock } = response.data;

        dispatch(loginSuccess({ token, stock }));

        console.log(response.data)

        navigate("/loadings")

      }
      
    } catch (err) {
      setError("Invalid email or password",err);
    }finally{
      setLoading(false); 
    }}


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="h-4 w-4 text-teal-600 border-gray-300 rounded" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-sm text-teal-600 hover:text-teal-500">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${
                loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
              }`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/sign_up" className="font-medium text-teal-600 hover:text-teal-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
