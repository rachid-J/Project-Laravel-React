import { useEffect, useState } from "react";

const EditProductModal = ({ show, handleClose, handleSave, product }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const resetForm = () => {
    setProductName("");
    setProductPrice("");
    setProductStock("");
    setTotalPrice(0);
  };

  useEffect(() => {
    if (product) {
      setProductName(product.product_name || "");
      setProductPrice(product.price || "");
      setProductStock(product.quantity || "");
    } else {
      resetForm();
    }
  }, [product]);

  useEffect(() => {
    // Auto-update total price when price or stock changes
    const price = parseFloat(productPrice) || 0;
    const stock = parseInt(productStock, 10) || 0;
    setTotalPrice(price * stock);
  }, [productPrice, productStock]);

  const handleSubmit = () => {
    if (!productName || !productPrice || !productStock) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isNaN(productPrice) || isNaN(productStock)) {
      alert("Price and Stock must be valid numbers.");
      return;
    }

    const newProduct = {
      id: product?.id,
      name: productName,
      price: parseFloat(productPrice),
      stock: parseInt(productStock, 10),
    };

    handleSave(newProduct);
    handleClose();
  };

  return (
    show && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input
                type="text"
                className="block w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                className="block w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Enter product price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input
                type="number"
                className="block w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                placeholder="Enter product stock"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Total Price</label>
              <input
                type="text"
                className="block w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                value={totalPrice}
                readOnly // Prevent user from editing manually
              />
            </div>
          </form>

          <div className="flex justify-end mt-6 space-x-4">
            <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={handleClose}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSubmit}>
              {product ? "Save Changes" : "Save Product"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};


export default EditProductModal;
