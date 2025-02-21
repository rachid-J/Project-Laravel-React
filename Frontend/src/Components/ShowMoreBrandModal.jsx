import { useSelector } from "react-redux";

const ShowMoreBrandModal = ({ show, brands, handleClose }) => {
  const darkMode = useSelector((state) => state.theme.darkMode); // Get dark mode state

  if (!show || !brands) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div
        className={`rounded-lg p-6 w-1/2 shadow-lg overflow-y-auto max-h-96 transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">All Brands</h2>
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li
              key={brand.id}
              className={`p-2 rounded-lg shadow transition ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <h3 className="text-lg font-semibold">{brand.name}</h3>
            </li>
          ))}
        </ul>
        <button
          onClick={handleClose}
          className={`mt-4 px-4 py-2 rounded shadow transition ${
            darkMode
              ? "bg-red-600 hover:bg-red-500 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShowMoreBrandModal;
