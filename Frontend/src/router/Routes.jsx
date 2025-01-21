import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Sign_up from "../pages/Sign_up.jsx";
import Dashbord from "../Pages/Dashbord.jsx";

import Guest from "../Components/Guest.jsx";
import Default from "../Components/Default.jsx";
import Inventory from "../Pages/Inventory.jsx";
import Suppliers from "../Pages/Suppliers.jsx";
import Orders from "../Pages/Orders.jsx";
import Analytics from "../Pages/Analytics.jsx";
import Settings from "../Pages/Settings.jsx";
import { Loading } from "../Components/Loading.jsx";
import { NotFound } from "../Components/NotFound.jsx";
import { useSelector } from "react-redux";

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
          path: "/dashboard",
          element: <Dashbord />,
          children: [
            { path: "/dashboard/inventory", element: <Inventory /> },
            { path: "/dashboard/suppliers", element: <Suppliers /> },
            { path: "/dashboard/orders", element: <Orders /> },
            { path: "/dashboard/analytics", element: <Analytics /> },
            { path: "/dashboard/settings", element: <Settings /> },
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
