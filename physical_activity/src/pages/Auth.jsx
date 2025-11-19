import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUserData } from "../features/userSlice";
import "../styles/auth.css";
import FloatingInput from "../components/FloatingInput";
import VerticalCarousel from "../components/VerticalCarousel";



export default function Auth() {

    // Variable rol
    const role = useSelector(state => state.user.role);

    // Estado para reportar alertas

    const [signupAlert, setSignupAlert] = useState({
        type: "",     // "success" o "error"
        message: "",
        show: false
    }
    );
    const [loginAlert, setLoginAlert] = useState({
        type: "",     // "success" o "error"
        message: "",
        show: false
    });

    useEffect(() => {
        if (signupAlert.show) {
            const timer = setTimeout(() => {
                setSignupAlert({ ...signupAlert, show: false });
            }, 9000);

            return () => clearTimeout(timer);
        }
    }, [signupAlert]);

    useEffect(() => {
        if (loginAlert.show) {
            const timer = setTimeout(() => {
                setLoginAlert({ ...loginAlert, show: false });
            }, 9000);

            return () => clearTimeout(timer);
        }
    }, [loginAlert]);



    // Estados para el formulario que se está mostrando en la página en el momento
    const [isActive, setIsActive] = useState(false);

    const handleRegisterClick = () => setIsActive(true);
    const handleLoginClick = () => setIsActive(false);

    // Estados para la información temporal de los formularios de registro y de login
    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/compu2-class/api/auth/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: signUpData.name,
                    institutionalEmail: signUpData.email,
                    password: signUpData.password,
                })
            });
            const data = await response.text();
            if (response.ok) {
                setSignupAlert({
                    type: "success",
                    message: "¡Cuenta creada con éxito!",
                    show: true
                });
            } else {
                setSignupAlert({
                    type: "error",
                    message: data,
                    show: true
                });
            }
        } catch (error) {
            setSignupAlert({
                type: "error",
                message: "¡Algo salió mal! Vuelve a intentarlo más tarde",
                show: true
            });        }
    }

    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/compu2-class/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password,
                })
            });
            const data = await response.json();
            if (response.ok) {
                const decoded = jwtDecode(data.accessToken);
                dispatch(setUserData({
                    token: data.accessToken,
                    role: decoded.authorities[0]
                }));
                navigate("/home");

            } else {
                setLoginAlert({
                    type: "error",
                    message: data,
                    show: true
                });            }
        } catch (error) {
            setLoginAlert({
                type: "error",
                message: "¡Algo salió mal! Vuelve a intentarlo más tarde",
                show: true
            });          }
    }

    // Función navigate para poder redireccionar al usuario a home
    const navigate = useNavigate();

    return (
        <div className={`container ${isActive ? "active" : ""}`} id="container">
            {/* SIGN UP */}
            <div className="form-container sign-up">
                <form onSubmit={handleSignup}>
                <h1>Hoy es un buen día para empezar</h1>

                    <FloatingInput
                        type="text"
                        id="name"
                        name="name"
                        label="Nombre"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                        required
                    />

                    <FloatingInput
                        type="email"
                        id="email"
                        name="email"
                        label="Correo institucional"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                        required
                    />

                    <FloatingInput
                        type="password"
                        id="password"
                        name="password"
                        label="Contraseña"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                        required
                    />

                    {signupAlert.show && (
                        <div className={`form-alert ${signupAlert.type}`}>
                            {signupAlert.message}
                        </div>
                    )}

                    <button>Regístrate</button>
                    <a href="#" onClick={(e) => {e.preventDefault();handleLoginClick();}}>
                        ¿Ya tienes una cuenta? Inicia sesión
                    </a>
                </form>
            </div>

            {/* SIGN IN */}
            <div className="form-container sign-in">
                <form onSubmit={handleLogin}>
                <h1>¡Vamos a movernos!</h1>
                     <FloatingInput
                            type="email"
                            id="email"
                            name="email"
                            label="Correo institucional"
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                            required
                        />

                        <FloatingInput
                            type="password"
                            id="password"
                            name="password"
                            label="Contraseña"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            required
                        />

                    {loginAlert.show && (
                        <div className={`form-alert ${loginAlert.type}`}>
                            {loginAlert.message}
                        </div>
                    )}

                    <button>Ingresar</button>
                    <a href="#" onClick={(e) => {e.preventDefault();handleRegisterClick();}}>
                        ¿No tienes una cuenta? Regístrate
                    </a>

                </form>
            </div>

            {/* TOGGLE */}
            <div className="toggle-container">
                <div className="toggle">
                        <VerticalCarousel />
                </div>
            </div>
        </div>
    );
}
