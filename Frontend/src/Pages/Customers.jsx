import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { axiosClient } from "../Api/axiosClient";
import EditCustomerModal from '../Components/EditCustomerModal';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import Spinner from '../Components/Spinner';

export default function Customers() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone_number: '', address: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status ,sestatus] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosClient.get('/customer/show');
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post('/customer/store', newCustomer);
      if (response.status === 201) {
        setNewCustomer({ name: '', email: '', phone_number: '', address: '' });
        fetchCustomers();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setLoading(true);
    try {
      await axiosClient.delete(`/customer/destroy/${id}`);
      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (id) => {
    const customer = customers.find((customer) => customer.id === id);
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleSaveCustomer = async (updatedCustomer) => {
    setLoading(true);
    try {
    const response =  await axiosClient.put(`/customer/update/${selectedCustomer.id}`, updatedCustomer);
    if(response.status === 200){
      sestatus('success');
    }
    
      
      fetchCustomers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error saving customer:", error);
      sestatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Customers
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all ${
            darkMode 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <FiPlus className="text-lg" />
          <span className="hidden sm:inline">Add Customer</span>
        </button>
      </div>

      {loading && <Spinner />}

      <div className="rounded-xl overflow-hidden shadow-lg">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className={`w-full ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} scroll-smooth`}>
            {/* Table headers */}
            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                {['ID', 'Name', 'Email', 'Phone', 'Address', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } ${header === 'ID' ? 'hidden sm:table-cell' : ''} ${
                      header === 'Address' ? 'hidden lg:table-cell' : ''
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table body */}
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`transition-colors hover:${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <td className={`px-4 py-3 sm:px-6 sm:py-4 hidden sm:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {customer.id}
                  </td>
                  <td className={`px-4 py-3 sm:px-6 sm:py-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {customer.name}
                  </td>
                  <td className={`px-4 py-3 sm:px-6 sm:py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {customer.email}
                  </td>
                  <td className={`px-4 py-3 sm:px-6 sm:py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {customer.phone_number}
                  </td>
                  <td className={`px-4 py-3 sm:px-6 sm:py-4 hidden lg:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {customer.address}
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 flex gap-2 sm:gap-3">
                    <button
                      onClick={() => handleEditCustomer(customer.id)}
                      className="p-1 sm:p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <FiEdit className="text-lg sm:text-xl" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="p-1 sm:p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="text-lg sm:text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className={`p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {customer.name}
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {customer.email}
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {customer.phone_number}
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {customer.address}
                  </p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEditCustomer(customer.id)}
                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  New Customer
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-2 rounded-full hover:bg-gray-100 ${
                    darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500'
                  }`}
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-4">
                {['name', 'email', 'phone_number', 'address'].map((field) => (
                  <div key={field}>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {field.replace('_', ' ').toUpperCase()}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={newCustomer[field]}
                      onChange={(e) => setNewCustomer({ ...newCustomer, [field]: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
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
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
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
                    {loading ? <Spinner size="small" /> : <FiPlus />}
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* No customers message */}
        {customers.length === 0 && (
          <div className={`p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No customers found. Start by adding a new customer.
            </p>
          </div>
        )}
      </div>

        <EditCustomerModal
          show={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          customer={selectedCustomer}
          handleSave={handleSaveCustomer}
          darkMode={darkMode}
          status={status}
        />
      </div>
  
  );
}