import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <App />, // Layout base
        children: [
            {
                index: true,
                element: <h1>Home</h1>,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);
