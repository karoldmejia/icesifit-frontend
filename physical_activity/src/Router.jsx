import { createBrowserRouter } from "react-router";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Routines from "./pages/Routines";



const router = createBrowserRouter(
    [
        { path: "/", Component: Auth },
        { path: "/home", Component: Home },
        { path: "/routines", Component: Routines },
    ],
    { basename: "/icesifit" }
);

export default router;
