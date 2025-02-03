import { useState, useEffect } from 'react';
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

    const updatedSupplier = { name, email, phone_number: phoneNumber, address ,brand_id: brandId  };

    try {
      await handleSave(updatedSupplier); // Pass only updatedSupplier
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
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={handleClose}
      role="dialog"
      aria-labelledby="editSupplierTitle"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="editSupplierTitle" className="text-xl font-bold">
            Edit Supplier
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Brand</label>
            <select
              className="w-full px-3 py-2 border rounded"
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
              className="px-4 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md transition ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
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
