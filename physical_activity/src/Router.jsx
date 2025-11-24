import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Routines from "./pages/Routines";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";

// Layout que incluye Navbar para rutas protegidas
function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <>
                <Navbar />
                <Outlet />
            </>
        </ProtectedRoute>
    );
}

// Layout público (sin Navbar)
function PublicLayout() {
    return (
        <PublicRoute>
            <Outlet />
        </PublicRoute>
    );
}


const router = createBrowserRouter([
    {
        path: "/",
        Component: () => <Navigate to="/auth" replace />,
    },
    {
        path: "/auth",
        Component: PublicLayout,
        children: [{ index: true, Component: Auth }],
    },
    {
        path: "/",
        Component: ProtectedLayout,
        children: [
            { path: "home", Component: Home },
            { path: "routines", Component: Routines },
        ],
    },
], { basename: "/icesifit" });

export default router;
