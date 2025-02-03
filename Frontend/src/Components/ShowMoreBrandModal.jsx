const ShowMoreBrandModal = ({ show, brands, handleClose }) => {
  if (!show || !brands) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2 shadow-lg overflow-y-auto max-h-96">
        <h2 className="text-2xl font-bold mb-4">All Brands</h2>
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li key={brand.id} className="bg-gray-100 p-2 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{brand.name}</h3>
            </li>
          ))}
        </ul>
        <button
          onClick={handleClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShowMoreBrandModal;