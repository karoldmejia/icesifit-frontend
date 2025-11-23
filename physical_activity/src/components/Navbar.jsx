import "../styles/topbar.css";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import { User, Bell, MessageCircle, Dumbbell, CalendarRange} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/userSlice";


export default function Navbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/auth");
    };

    return (
        <div className="topbar">
        <div className="right">
            <div className="logo">
                <img src="/icesifit_logo_blanco.svg" alt="1" />
                <h1>ICESIFIT</h1>
            </div>
        </div>
            <div className="left">

                <Dumbbell
                    className="iconos"
                    onClick={() => navigate("/routines")}
                />
                <CalendarRange className="iconos" />
                <h2></h2>
                <DropdownMenu className="perfil">
                    <DropdownMenuTrigger className="perfil-trigger">
                        <User className="iconos" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="perfil-menu">
                        <DropdownMenuLabel className="perfil-label">Mi Cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="perfil-item">Perfil</DropdownMenuItem>
                        <DropdownMenuItem className="perfil-item">Facturación</DropdownMenuItem>
                        <DropdownMenuItem className="perfil-item">Equipo</DropdownMenuItem>
                        <DropdownMenuItem className="perfil-item" onClick={handleLogout}>
                            Salir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Bell className="iconos" />
                <MessageCircle className="iconos" />

            </div>
        </div>
    );
}