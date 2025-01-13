import {createBrowserRouter} from "react-router-dom"
import Home from "../pages/Home.jsx"
import Login from "../pages/Login.jsx";
import Sign_up from "../pages/Sign_up.jsx";
import Dashbord from "../Pages/Dashbord.jsx";
import NotFound from "../pages/NotFound.jsx";
import Guest from "../Components/Guest.jsx";
import Default from "../Components/Default.jsx";

export const LOGIN_ROUTE = "/login"
export const SIGN_UP_ROUTE = "/sign_up"
const route = createBrowserRouter([
    {
        element:<Guest/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/notfound",
                element:<NotFound/>
            },
            {
                path: LOGIN_ROUTE,
                element:<Login/>
            },
            {
                path:SIGN_UP_ROUTE,
                element:<Sign_up/>
            },
        ]
    },

    {
        element:<Default/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/notfound",
                element:<NotFound/>
            },
            {
                path:"/dashboard",
                element:<Dashbord/>
            },
        ]
    }
    
])
export default route;