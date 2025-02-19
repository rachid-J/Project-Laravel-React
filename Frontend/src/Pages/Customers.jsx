import { useState, useEffect } from 'react';
import { axiosClient } from "../Api/axiosClient";
import EditCustomerModal from '../Components/EditCustomerModal';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone_number: '', address: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch customers from API
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosClient.get('/customer/show');
      setCustomers(response.data.data);
      console.log('Customers:', response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Handle adding new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post('/customer/store', newCustomer);
      console.log(response);
      if (response.status === 201) {
        setNewCustomer({ name: '', email: '', phone_number: '', address: '' });
        fetchCustomers(); 
        setIsModalOpen(false);
      } else {
        console.error('Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting customer
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setLoading(true);
    try {
      const response = await axiosClient.delete(`/customer/destroy/${id}`);
      if (response.status === 200) {
        setCustomers(customers.filter((customer) => customer.id !== id));
      } else {
        console.error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing customer
  const handleEditCustomer = (id) => {
    const customer = customers.find((customer) => customer.id === id);
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleSaveCustomer = async (updatedCustomer) => {
    setLoading(true);
    try {
      const response = await axiosClient.put(`/customer/update/${selectedCustomer.id}`, updatedCustomer);
      if (response.status === 200 && response.data) {
        alert("Customer updated successfully");
        fetchCustomers();
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to update customer");
        alert("Failed to update customer. Please try again.");
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Failed to save customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Customers</h1>
      {loading && <div>Loading...</div>}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Add Customer
      </button>

      <div className="overflow-x-auto mt-6">
        {customers.length > 0 ?(
        <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="py-3 px-4">{customer.id}</td>
                <td className="py-3 px-4">{customer.name}</td>
                <td className="py-3 px-4">{customer.email}</td>
                <td className="py-3 px-4">{customer.phone_number}</td>
                <td className="py-3 px-4">{customer.address}</td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    onClick={() => handleEditCustomer(customer.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        ): (
          <p className="text-gray-500 text-center">No customers available.</p>
        )}
        <EditCustomerModal
          show={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          customer={selectedCustomer}
          handleSave={handleSaveCustomer}
        />
      </div>

      {/* Modal for adding new customer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Customer</h2>
            <form onSubmit={handleAddCustomer}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="customer-name">
                  Name
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Customer Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="customer-email">
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="customer-phone">
                  Phone Number
                </label>
                <input
                  id="customer-phone"
                  type="text"
                  value={newCustomer.phone_number}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Phone Number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="customer-address">
                  Address
                </label>
                <input
                  id="customer-address"
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Address"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-md transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
