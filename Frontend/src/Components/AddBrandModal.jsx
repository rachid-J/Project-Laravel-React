import { useState } from "react";

const AddBrandModal = ({ show, handleClose, handleSave }) => {
  const [brandName, setBrandName] = useState("");

  const handleSubmit = () => {
    if (!brandName.trim()) {
      alert("Please provide a brand name.");
      return;
    }

    handleSave({ name: brandName });
    setBrandName("");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Brand</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
        </form>

        <div className="flex justify-end mt-4 space-x-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
            onClick={handleSubmit}
          >
            Save Brand
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBrandModal;
