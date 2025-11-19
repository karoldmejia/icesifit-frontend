import { RouterProvider } from "react-router-dom";
import router from "./Router";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";

function App() {
    const token = useSelector((state) => state.user.token);

    return (
        <>
            {token && <Navbar />}
            <RouterProvider router={router} />
        </>
    );
}

export default App;
