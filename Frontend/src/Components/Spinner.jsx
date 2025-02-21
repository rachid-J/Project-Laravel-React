

const Spinner = ({ size = "medium" }) => {
  // Map size prop to Tailwind classes
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-blue-500 border-dotted rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
