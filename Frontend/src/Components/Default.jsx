
import { useEffect} from "react";
import { Outlet, useNavigate } from "react-router-dom";


export default function Default() {
 const navigate = useNavigate()
  const StoreToken = localStorage.getItem("access_token")
  

useEffect(() => {
    if (!StoreToken){
   
      navigate("/login")
 
    }
  },[StoreToken,navigate]);


  return (
    
    <div>
      <div className="flex flex-col">
    <main className="flex-grow">
      <Outlet /> 
    </main>
  </div>
  </div>
  )
}
