import { useState } from "react";
import { axiosClient } from "../Api/axiosClient";

export default function Sign_up() {
  const [formData, setFormData] = useState({
    name: "",
    store_name: "",
    store_category: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    phone: "",
    role: "",
    photo: null,
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleNext = () => {
    setError("");
    if (validateStep(step)) setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prevStep) => prevStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.store_name || !formData.store_category) {
          setError("All fields in this step are required.");
          return false;
        }
        break;
      case 2:
        if (!formData.email || !formData.password || formData.password !== formData.password_confirmation) {
          setError("Email, password, and password confirmation are required and passwords must match.");
          return false;
        }
        break;
      case 3:
        if (!formData.address || !formData.phone || !formData.role) {
          setError("All fields in this step are required.");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formDataToSubmit = new FormData();
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      const response = await axiosClient.post("/store/create", formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Create Your Profile</h2>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Store Details */}
          {step === 1 && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="store_name" className="block text-sm font-medium text-gray-700">Store Name</label>
                <input
                  type="text"
                  id="store_name"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="store_category" className="block text-sm font-medium text-gray-700">Store Category</label>
                <select
                  id="store_category"
                  name="store_category"
                  value={formData.store_category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                >
                  <option value="">Select a category</option>
                  <option value="bakery">Bakery</option>
                  <option value="grocery">Grocery</option>
                  <option value="fashion">Fashion</option>
                  <option value="electronics">Electronics</option>
                </select>
              </div>
            </>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                />
              </div>
            </>
          )}

          {/* Step 3: Additional Information */}
          {step === 3 && (
            <>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Your Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Your Profession</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                >
                  <option value="">Select a profession</option>
                  <option value="admin">Administrator</option>
                  <option value="vendor">Store Vendor</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload Your Photo</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500"
                />
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md bg-gray-300 py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-md bg-teal-500 py-2 px-4 text-sm font-medium text-white hover:bg-teal-600"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center rounded-md py-2 px-4 text-sm font-medium text-white ${
                  loading ? "bg-teal-400" : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
