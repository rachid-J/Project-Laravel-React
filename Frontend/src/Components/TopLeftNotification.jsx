
import Spinner from './Spinner';

const TopLeftNotification = ({ message = "Processing request...", status, showSpinner = true }) => {
  // Determine background and text colors based on status:
  let bgColor, textColor;
  if (status === "success") {
    bgColor = "bg-green-500 bg-opacity-50";
    textColor = "text-green-900";
  } else if (status === "error") {
    bgColor = "bg-red-500 bg-opacity-50";
    textColor = "text-red-900";
  } else {
    bgColor = "bg-gray-200 bg-opacity-50";
    textColor = "text-gray-800";
  }

  return (
    <div className={`fixed top-10 right-4 z-50 flex items-center space-x-2 p-3 ${bgColor} ${textColor} rounded-md shadow-lg`}>
      {showSpinner && <Spinner size="small" />}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default TopLeftNotification;
