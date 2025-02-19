import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Sign_up from "../pages/Sign_up.jsx";


import Guest from "../Components/Guest.jsx";
import Default from "../Components/Default.jsx";
import Inventory from "../Pages/Inventory.jsx";
import Customers from "../Pages/Customers.jsx";
import Suppliers from "../Pages/Suppliers.jsx";
import Orders from "../Pages/Orders.jsx";
import Settings from "../Pages/Settings.jsx";
import { Loading } from "../Components/Loading.jsx";
import { NotFound } from "../Components/NotFound.jsx";
import { useSelector } from "react-redux";
import Welcome from "../Pages/Welcom.jsx";
import  Dashboard  from "../Pages/Dashboard.jsx";
import Sells from "../Pages/Sells.jsx";

export const LOGIN_ROUTE = "/login";
export const SIGN_UP_ROUTE = "/sign_up";

const Router = () => {
  const token = useSelector((state) => state.auth.token);

  // Helper functions to define routes
  const guestRoutes = () => [
    {
      element: <Guest />,
      children: [
        { path: "/", element: <Home /> },
        { path: LOGIN_ROUTE, element: <Login /> },
        { path: SIGN_UP_ROUTE, element: <Sign_up /> },
      ],
    },
    { path: "*", element: <NotFound /> },
    { path: "/loadings", element: <Loading /> },
  ];

  const authenticatedRoutes = () => [
    {
      element: <Default />,
      children: [
        { path: "/loadings", element: <Loading /> },
        {
          path: "/",
          element: <Welcome />,
          children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/inventory", element: <Inventory /> },
            { path: "/customers", element: <Customers /> },
            { path: "/suppliers", element: <Suppliers /> },
            { path: "/orders", element: <Orders /> },
            { path: "/sells", element: <Sells /> },
            { path: "/settings", element: <Settings /> },
          ],
        },
      ],
    },
    { path: "*", element: <NotFound /> },
  ];

  // Choose routes based on authentication status
  const Routes = token ? authenticatedRoutes() : guestRoutes();

  const router = createBrowserRouter(Routes);

  return <RouterProvider router={router} />;
};

export default Router;
