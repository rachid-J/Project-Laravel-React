import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const Loading = () => {
  const token = localStorage.getItem("access_token");
  // const StoreToken = useSelector((state)=> state.auth.token)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!token){
      setTimeout(()=> {
        navigate("/login")
      },1000)
       
    }
    else {
      setTimeout(()=> {
        navigate("/dashboard")
      },1000)
      
    }
  },[token,navigate]);

    // useEffect(() => {
  //   if (!StoreToken){
  //     localStorage.removeItem("access_token")
  //   }
  // },[StoreToken,navigate]);
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 text-gray-700">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};
