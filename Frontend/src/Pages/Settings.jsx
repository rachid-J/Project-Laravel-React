import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosClient } from "../Api/axiosClient";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Settings() {
  const [formData, setFormData] = useState({
    name: "",
    store_name: "",
    store_category: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    photo: null,
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axiosClient.get("/store/index");
        const storeData = response.data.stock;
        setInitialData(storeData);
        
        setFormData({
          name: storeData.name,
          store_name: storeData.store_name,
          store_category: storeData.store_category,
          email: storeData.email,
          password: "",
          address: storeData.address,
          phone: storeData.phone,
          photo: storeData.photo,
        });

        setPreview(
          storeData.photo
            ? `http://127.0.0.1:8000/storage/${storeData.photo}`
            : "/default-avatar.png"
        );
      } catch (error) {
        toast.error("Failed to fetch store data");
      }
    };
    fetchStore();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const formDataToSend = new FormData();

        // Append all fields except photo
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "photo" && value !== initialData[key]) {
                formDataToSend.append(key, value);
            }
        });

        // Append photo if it's a File object
        if (formData.photo instanceof File) {
            formDataToSend.append("photo", formData.photo);
        }

        // Send the request
        const response = await axios.post(`http://localhost:8000/api/store/update/${initialData?.id}`, formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            },
        });

        // Update the UI with the response
        setInitialData(response.data.store);
        toast.success("Store updated successfully!");
        console.log(response)
    } catch (error) {
        console.error("Error updating store:", error?.response?.data?.message || error.message);
        toast.error("Failed to update store. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (

     

      <form onSubmit={handleSubmit} className={` ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Upload */}
          <div className="col-span-full flex items-center gap-6">
            <div className="relative">
              <img
                src={preview}
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                alt="Store Avatar"
              />
              <label
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                htmlFor="photo"
              >
                <input
                  type="file"
                  id="photo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={` p-4 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Store Name
            </label>
            <input
              type="text"
              name="store_name"
              value={formData.store_name}
              onChange={handleInputChange}
              className={`p-4 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Category
            </label>
            <input
              type="text"
              name="store_category"
              value={formData.store_category}
              onChange={handleInputChange}
              className={`p-4 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`p-4 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter new password"
              className={`p-4 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className={`p-4 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`p-4 mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
  );
}