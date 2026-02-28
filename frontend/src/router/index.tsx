import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ProductManagement } from "../pages/ProductManagement";
import { AlertRulesPage } from "../pages/AlertRulesPage";
import { DataSourcesPage } from "../pages/DataSourcesPage";
import { CampaignManagement } from "../pages/CampaignManagement";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <App />, // Layout principal con sidebar
        children: [
            {
                index: true, // Esto hace que "/" muestre Dashboard
                element: <Dashboard />,
            },
            {
                path: "productos",
                element: <ProductManagement />,
            },
            {
                path: "alertas",
                element: <AlertRulesPage />,
            },
            {
                path: "fuentes",
                element: <DataSourcesPage />,
            },
            {
                path: "campanas",
                element: <CampaignManagement />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />, // Sin sidebar
    },
    {
        path: "/register",
        element: <Register />, // Sin sidebar
    },
]);