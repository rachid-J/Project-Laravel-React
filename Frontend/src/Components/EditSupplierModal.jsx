import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { axiosClient } from '../Api/axiosClient';

const EditSupplierModal = ({ show, handleClose, supplier, handleSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [brandId, setBrandId] = useState('');
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const darkMode = useSelector((state) => state.theme.darkMode); // Get dark mode state

  useEffect(() => {
    if (supplier) {
      setName(supplier.name || '');
      setEmail(supplier.email || '');
      setPhoneNumber(supplier.phone_number || '');
      setAddress(supplier.address || '');
      setBrandId(supplier.brand_id || '');
    }
  }, [supplier]);

  useEffect(() => {
    if (show) {
      fetchBrands();
    }
  }, [show]);

  const fetchBrands = async () => {
    try {
      const response = await axiosClient.get("/brand/show");
      setBrands(response.data.Brands.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updatedSupplier = { name, email, phone_number: phoneNumber, address, brand_id: brandId };

    try {
      await handleSave(updatedSupplier);
      handleClose();
    } catch (err) {
      setError('Failed to update supplier. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={handleClose}
      role="dialog"
      aria-labelledby="editSupplierTitle"
    >
      <div
        className={`w-1/2 p-6 rounded-lg shadow-lg transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="editSupplierTitle" className="text-xl font-bold">
            Edit Supplier
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
            onClick={handleClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Brand</label>
            <select
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
            >
              <option value="">Select a Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className={`px-4 py-2 rounded-md transition ${
                darkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
