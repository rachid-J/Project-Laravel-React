import { axiosClient } from '../Api/axiosClient';
import { useNavigate } from "react-router-dom";

export default function Dashbord() {
  const navigate = useNavigate()
  const logout = async () => {
    try {
        const response = await axiosClient.post('store/logout'); 
        if(response.status === 200){
            console.log(response.data.message);
            localStorage.removeItem('access_token');
            navigate('/login')
        } 
        
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
    }
};
    return (
      <div>
        welcom to your dashboard<br></br>
          <button onClick={logout} >LOG OUT</button>
      </div>
    )
  }
  