import { useState, useEffect } from 'react';
import { axiosClient } from "../Api/axiosClient";
import EditSupplierModal from '../Components/EditSupplierModal';

export default function Suppliers() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [hasProduct, setHasProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', email: '', phone_number: '', address: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [newOrder, setNewOrder] = useState({  
    brand_name:"",
    product_name: "",
    suppliers_id: "",
    store_id: "",
    product_id: "",
    price: null,
    quantity: "",
  });
  const [ProductSelected,setProductSelected] = useState({})
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchSuppliers();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (isProductModalOpen) {
      fetchProducts();
    }
  }, [isProductModalOpen]);

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("/product/show");
      setProducts(response.data.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const toggleProductModal = () => setIsProductModalOpen(!isProductModalOpen);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      const response = await axiosClient.get('/supplier/show');
      setSuppliers(response.data);
      console.log('Suppliers:', response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axiosClient.get("/brand/show");
      setBrands(response.data.Brands.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };


  const toggleOrderModal = () => setIsOrderModalOpen(!isOrderModalOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle adding new supplier
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post('/supplier/store', newSupplier);
      if (response.status === 201) {
        setNewSupplier({ name: '', email: '', phone_number: '', address: '', brand_id: '' });
        fetchSuppliers(); 
        setIsModalOpen(false); 
      } else {
        console.error('Failed to add supplier');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
    } finally {
      setLoading(false);
    }
  };
  

  // Handle creating order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newOrder.price === null) {
        newOrder.price = ProductSelected.price;
      }
      const response = await axiosClient.post('/order/store', newOrder);
      console.log('Order created:', response.data);
      if (response.status === 201) {
        alert('Order created successfully');
        setNewOrder({ brand_name: "", product_id: '', product_name: '', suppliers_id: '', store_id: '', price: '', quantity: 1 });
        toggleOrderModal();
        toggleProductModal();
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting supplier
  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    setLoading(true);
    try {
      const response = await axiosClient.delete(`/supplier/destroy/${id}`);
      if (response.status === 200) {
        setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
      } else {
        console.error('Failed to delete supplier');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing supplier
  const handleEditSupplier = (id) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleSaveSupplier = async (updatedSupplier) => {
    console.log('Selected Supplier:', selectedSupplier);
    console.log('Updated Supplier:', updatedSupplier);

    setLoading(true);
    try {
        const response = await axiosClient.put(`/supplier/update/${selectedSupplier.id}`, updatedSupplier);
        console.log('Response:', response);

        // Check if the update was successful
        if (response.status === 200 && response.data) {
            alert("Supplier updated successfully");
            fetchSuppliers()
            setIsEditModalOpen(false);
        } else {
            console.error("Failed to update supplier");
            alert("Failed to update supplier. Please try again.");
        }
    } catch (error) {
        console.error("Error saving supplier:", error);
        alert("Failed to save supplier. Please try again.");
    } finally {
        setLoading(false);
    }
};


const toggleChoiceModal = () => setIsChoiceModalOpen(!isChoiceModalOpen);

const handleChoice = (choice) => {
  setHasProduct(choice);
  toggleChoiceModal();
};


  

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Suppliers</h1>
      {loading && <div>Loading...</div>}
      <button
        onClick={toggleModal}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Add Supplier
      </button>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-t">
                <td className="py-3 px-4">{supplier.id}</td>
                <td className="py-3 px-4">{supplier.name}</td>
                <td className="py-3 px-4">{supplier.email}</td>
                <td className="py-3 px-4">{supplier.phone_number}</td>
                <td className="py-3 px-4">{supplier.address}</td>
                <td className="py-3 px-4">{brands.find(brand => brand.id === supplier.brand_id)?.name || "No Brand"}</td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    onClick={() => {
                      toggleChoiceModal();
                      setNewOrder((prevOrder) => ({ ...prevOrder, suppliers_id: supplier.id , brand_name: supplier.brand.name}));
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Make Order
                  </button>
                  <button
                    onClick={() => handleEditSupplier(supplier.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <EditSupplierModal
          show={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          supplier={selectedSupplier}
          handleSave={handleSaveSupplier}
        />
      </div>

      {/* Modal for adding new supplier */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Supplier</h2>
            <form onSubmit={handleAddSupplier}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="supplier-name">
                  Name
                </label>
                <input
                  id="supplier-name"
                  type="text"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Supplier Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="supplier-email">
                  Email
                </label>
                <input
                  id="supplier-email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="supplier-phone">
                  Phone Number
                </label>
                <input
                  id="supplier-phone"
                  type="text"
                  value={newSupplier.phone_number}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone_number: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Phone Number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="supplier-address">
                  Address
                </label>
                <input
                  id="supplier-address"
                  type="text"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Address"
                />
              </div>
              <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="supplier-brand">
              Brand
            </label>
            <select
              id="supplier-brand"
              name="brand_id"
              value={newSupplier.brand_id}
              onChange={(e) => setNewSupplier({ ...newSupplier, brand_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
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
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleModal}
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
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Modal for select chose if you have a product or don`t have a product */}
      {isChoiceModalOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Do you have a product?</h2>
          <div className="flex justify-around">
            <button
              onClick={() => {handleChoice(true);
                toggleProductModal();}
              }
              
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Yes
            </button>
            <button
              onClick={() => {handleChoice(false);
                toggleOrderModal();}
              }
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              No
            </button>
          </div>
          <button
            onClick={toggleChoiceModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
      )}
      {/* Modal for creating order */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Order</h2>
            <form onSubmit={handleCreateOrder}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="order-product">
                  Product Name
                </label>
                <input
                  id="order-product"
                  type="text"
                  value={newOrder.product_name}
                  onChange={(e) => setNewOrder({ ...newOrder, product_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Product Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="order-price">
                  Price
                </label>
                <input
                  id="order-price"
                  type="number"
                  value={newOrder.price}
                  onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Price"
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="order-quantity">
                  Quantity
                </label>
                <input
                  id="order-quantity"
                  type="number"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Quantity"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleOrderModal}
                  className="px-4 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for selecting product, price, and quantity */}
    {isProductModalOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Product</h2>
          <form onSubmit={handleCreateOrder}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-select">
                Product
              </label>
              <select
                id="product-select"
                value={newOrder.selectedProduct}
                onChange={(e) => {
                  const selectedProduct = products.find(product => product.product_name === e.target.value);
                  setProductSelected(selectedProduct);
                  setNewOrder({ 
                    ...newOrder, 
                    product_name: selectedProduct.product_name,
                    product_id: selectedProduct.id 
                  });
                }}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select a Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.product_name}>
                    {product.product_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-price">
                Price
              </label>
              <input
                id="product-price"
                type="number"
                value={ProductSelected.price}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Price"
                min="0"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-quantity">
                Quantity
              </label>
              <input
                id="product-quantity"
                type="number"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Quantity"
                min="1"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={toggleProductModal}
                className="px-4 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Create Order
              </button>
            </div>
          </form>
          <button
            onClick={toggleProductModal}
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