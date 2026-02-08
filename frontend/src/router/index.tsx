import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Dashboard } from "../pages/Dashboard";

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
        element: <h1>Login</h1>,
    },
    {
        path: "/register",
        element: <h1>Register</h1>,
    },
]);
