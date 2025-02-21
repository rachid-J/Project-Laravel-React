import { FiX } from 'react-icons/fi';
import Spinner from './Spinner';

import { useEffect, useState } from 'react';
import TopLeftNotification from './TopLeftNotification';

export default function EditCustomerModal({ show, handleClose, customer, handleSave, darkMode,status }) {
  const [editedCustomer, setEditedCustomer] = useState(customer || { name: '', email: '', phone_number: '', address: '' });
  const [loading, setLoading] = useState(false);
  

  // Update local state when the customer prop changes
  useEffect(() => {
    if (customer) {
      setEditedCustomer(customer);
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({ ...editedCustomer, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSave(editedCustomer);
    } finally {
      setLoading(false);

    }
  };

  if (!show) return null;

  return (
    <>
      {loading && <TopLeftNotification message="Saving changes..." status={status}  />}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className={`w-full max-w-md rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Edit Customer
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full hover:bg-gray-100 ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500'}`}
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {['name', 'email', 'phone_number', 'address'].map((field) => (
              <div key={field}>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.replace('_', ' ').toUpperCase()}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={editedCustomer[field] || ''}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  required
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className={`px-4 py-2 rounded-lg ${darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? <Spinner size="small" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
