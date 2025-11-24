import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "./features/store"


import App from "./App.jsx";
import "./index.css";

// Componente de debug para verificar store y render
function DebugApp() {
    const token = useSelector((state) => state.user.token);
    const role = useSelector((state) => state.user.role);

    useEffect(() => {
        console.log("DebugApp mounted");
        console.log("Redux state token:", token);
        console.log("Redux state role:", role);
    }, [token, role]);

    return <App />;
}

// Render principal con debug
const root = createRoot(document.getElementById("root"));

root.render(
        <Provider store={store}>
            <PersistGate
                loading={<div>Loading persisted state...</div>}
                persistor={persistor}
            >
                <DebugApp />
            </PersistGate>
        </Provider>
);
