import { useEffect, useState } from "react";

const AddProductModal = ({ show, handleClose, handleSave, selectedProduct, brands }) => {

  const [productName, setProductName] = useState("");
  const [productSku, setProductSku] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productBrand, setProductBrand] = useState("");

 

  const resetForm = () => {
    setProductName("");
    setProductSku("");
    setProductDescription("");
    setProductPrice("");
    setProductStock("");
    setProductBrand("");
  };

  const handleSubmit = () => {
    if (!productName || !productSku || !productBrand || !productPrice || !productStock) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isNaN(productPrice) || isNaN(productStock)) {
      alert("Price and Stock must be valid numbers.");
      return;
    }

    const newProduct = {
      id: selectedProduct?.id, 
      name: productName,
      sku: productSku,
      brand_id: productBrand,
      description: productDescription,
      price: parseFloat(productPrice),
      stock: parseInt(productStock, 10),
    };

    handleSave(newProduct);
    handleClose();
  };

  useEffect(() => {
    if (selectedProduct) {
      // Pre-fill form when editing a product
      setProductName(selectedProduct.name || "");
      setProductSku(selectedProduct.sku || "");
      setProductDescription(selectedProduct.description || "");
      setProductPrice(selectedProduct.price || "");
      setProductStock(selectedProduct.stock || "");
      setProductBrand(selectedProduct.brand_id || "");
    } else {
      resetForm(); // Clear form for new product
    }
  }, [selectedProduct]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedProduct ? "Edit Product" : "Add New Product"}
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
              aria-label="Product Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">SKU</label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={productSku}
              onChange={(e) => setProductSku(e.target.value)}
              placeholder="Enter product SKU"
              aria-label="Product SKU"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="block w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Enter product description"
              aria-label="Product Description"
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
              aria-label="Product Price"
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
              aria-label="Product Stock"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Brand</label>
            <select
              className="block w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={productBrand}
              onChange={(e) => setProductBrand(e.target.value)}
              aria-label="Product Brand"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            {selectedProduct ? "Save Changes" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
