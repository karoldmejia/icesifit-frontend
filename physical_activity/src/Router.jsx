import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Routines from "./pages/Routines";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";

// Layout que incluye Navbar para rutas protegidas
function ProtectedLayout() {
    // Debug: ver token en ProtectedLayout
    const token = useSelector((state) => state.user.token);
    console.log("ProtectedLayout token:", token);

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
    // Debug: ver token en PublicLayout
    const token = useSelector((state) => state.user.token);
    console.log("PublicLayout token:", token);

    return (
        <PublicRoute>
            {/* Debug: mostrar que Outlet se está renderizando */}
            {console.log("Rendering PublicLayout Outlet")}
            <Outlet />
        </PublicRoute>
    );
}

// Router con debug en los componentes de redirección
const router = createBrowserRouter([
    {
        path: "/",
        Component: () => {
            console.log("Redirecting '/' to /auth");
            return <Navigate to="/auth" replace />;
        },
    },
    {
        path: "/auth",
        Component: PublicLayout,
        children: [
            {
                index: true,
                Component: () => {
                    console.log("Rendering Auth component");
                    return <Auth />;
                }
            },
        ],
    },
    {
        path: "/",
        Component: ProtectedLayout,
        children: [
            {
                path: "home",
                Component: () => {
                    console.log("Rendering Home component");
                    return <Home />;
                }
            },
            {
                path: "routines",
                Component: () => {
                    console.log("Rendering Routines component");
                    return <Routines />;
                }
            },
        ],
    },
], { basename: "/icesifit" });

export default router;
