import React from "react";
import { useState, useEffect } from "react";
import { fetchRoutine, fetchRoutines } from "../services/routineServices";
import {
    fetchRoutineExercisesByRoutine,
    fetchExerciseById,
    fetchRoutineExercisesByUserRoutine
} from "../services/routineExerciseServices";
import { fetchAllUserRoutines, fetchUserRoutinesByUser } from "../services/userRoutineServices";
import { fetchUserById } from "../services/userServices";
import RoutineCard from "../components/RoutineCard";
import SearchBar from "../components/SearchBar";
import Modal from "@/components/Modal.jsx";
import RoutinesPage from "@/pages/RoutinesPage.jsx";
import NotificationAlert from "@/components/NotificationAlert.jsx";
import Tabs from "./Tabs.jsx";

import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import CreateRoutineFromBase from "@/pages/CreateRoutineFromBase.jsx";
import CreateRoutineEmpty from "@/pages/CreateRoutineEmpty.jsx";
import ProgressPages from "@/pages/ProgressPages.jsx";
import ProgressLayout from "@/pages/ProgressLayout.jsx";

export default function Routines() {
    const token = useSelector(state => state.user.token);
    const userRole = useSelector(state => state.user.role);
    const userId = useSelector(state => state.user.id);

    const [userRoutines, setUserRoutines] = useState([]);
    const [baseRoutines, setBaseRoutines] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "", show: false });
    const [activeTab, setActiveTab] = useState("mis-rutinas"); // Estado para la pestaña activa

    // Definir las pestañas
    const tabs = [
        { id: "mis-rutinas", label: "Mis rutinas" },
        { id: "mi-rendimiento", label: "Mi rendimiento" }
    ];

    function handleOpenModal(routine) {
        setSelectedRoutine(routine);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setSelectedRoutine(null);
    }

    async function loadRoutines() {
        setLoading(true);
        try {
            // --- RUTINAS DE USUARIO ---
            let userRoutineData = [];
            const decodedToken = jwtDecode(token);
            const userAuthorities = decodedToken.authorities || [];
            const canViewAll = userAuthorities.includes("VER_TODAS_RUTINAS");

            if (canViewAll) {
                userRoutineData = await fetchAllUserRoutines(token);
            } else {
                userRoutineData = await fetchUserRoutinesByUser(userId, token);
            }

            const formattedUserRoutines = await Promise.all(
                userRoutineData.map(async (ur) => {
                    const routineData = await fetchRoutine(ur.routineId, token);
                    const routineExercises = await fetchRoutineExercisesByUserRoutine(ur.id, token);

                    const exercisesData = await Promise.all(
                        routineExercises.map(async (re) => {
                            const exercise = await fetchExerciseById(re.exerciseId, token);
                            return { name: exercise.name, videoUrl: exercise.videoUrl };
                        })
                    );

                    const exerciseList = exercisesData.map(e => e.name).join(", ");
                    const media = exercisesData.map(e => ({ src: e.videoUrl }));
                    const userData = await fetchUserById(ur.userId);

                    return {
                        userRoutineId: ur.id,
                        userId: ur.userId,
                        userName: userData.name,
                        routineId: ur.routineId,
                        name: routineData.name,
                        exerciseList,
                        media,
                        fullRoutine: routineData
                    };
                })
            );

            setUserRoutines(formattedUserRoutines);

            // --- RUTINAS BASE ---
            const allRoutines = await fetchRoutines(token);

            const formattedBaseRoutines = await Promise.all(
                allRoutines.map(async (routine) => {
                    const routineExercises = await fetchRoutineExercisesByRoutine(routine.id, token);

                    const exercisesData = await Promise.all(
                        routineExercises.map(async (re) => {
                            const exercise = await fetchExerciseById(re.exerciseId, token);
                            return { name: exercise.name, videoUrl: exercise.videoUrl };
                        })
                    );

                    const exerciseList = exercisesData.map(e => e.name).join(", ");
                    const media = exercisesData.map(e => ({ src: e.videoUrl }));

                    return {
                        routineId: routine.id,
                        name: routine.name,
                        certified: true,
                        userName: "entrenador certificado",
                        exerciseList,
                        media,
                        fullRoutine: routine
                    };
                })
            );

            setBaseRoutines(formattedBaseRoutines);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRoutines();
    }, [token, userRole, userId]);

    const filteredUserRoutines = userRoutines.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    const filteredBaseRoutines = baseRoutines.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

    async function refreshRoutines() {
        setLoading(true);
        await loadRoutines();
        setLoading(false);
    }

    return (
        <div className="flex pt-56 flex-col w-[1200px] h-[1000px] mx-auto scrollbar-hide">
            {/* Banner */}
            <div className="w-full h-64 rounded-xl px-4 sm:px-8 lg:px-4">
                <img src="/banner_exercises.jpg" alt="Banner" className="w-full h-full object-cover rounded-xl" style={{ objectPosition: "center 25%" }} />
            </div>

            {/* Componente de pestañas */}
            <div className="px-4">
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                >
                    {/* Contenido de la primera pestaña - Mis Rutinas */}
                    {activeTab === "mis-rutinas" && (
                        <div className="space-y-8">
                            {/* Rutinas de usuario */}
                            {/* Título y barra de búsqueda */}
                            <div className="flex flex-col mt-10 sm:flex-row sm:items-center justify-between mt-4 mb-4 gap-4">
                                <h2 className="text-2xl font-bold mb-2 sm:mb-0">Rutinas</h2>
                                <div className="flex-1 sm:flex-none sm:ml-auto flex items-center gap-2">
                                    {/* Botón crear rutina (solo si no es admin) */}
                                    {userRole === "ROLE_User" && (
                                        <CreateRoutineFromBase
                                            baseRoutines={filteredBaseRoutines}
                                            setAlert={setAlert}
                                            refreshRoutines={refreshRoutines}
                                        />
                                    )}
                                    {userRole === "ROLE_Trainer" && (
                                        <CreateRoutineEmpty
                                            setAlert={setAlert}
                                            refreshRoutines={refreshRoutines}
                                        />
                                    )}

                                    <SearchBar
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Buscar rutina..."
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {loading ? (
                                        <p>Cargando rutinas...</p>
                                    ) : filteredUserRoutines.length === 0 ? (
                                        <p className="text-gray-500">Aún no tienes rutinas creadas</p>
                                    ) : (
                                        filteredUserRoutines.map(routine => (
                                            <RoutineCard
                                                key={routine.userRoutineId}
                                                title={routine.name}
                                                exercises={routine.exerciseList}
                                                media={routine.media}
                                                onClick={() => handleOpenModal(routine)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Rutinas certificadas */}
                            <div>
                                <h3 className="font-medium text-base mb-4">Rutinas certificadas</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {loading ? (
                                        <p>Cargando rutinas...</p>
                                    ) : filteredBaseRoutines.length === 0 ? (
                                        <p className="text-gray-500">No hay rutinas certificadas</p>
                                    ) : (
                                        filteredBaseRoutines.map(routine => (
                                            <RoutineCard
                                                key={routine.routineId}
                                                title={routine.name}
                                                exercises={routine.exerciseList}
                                                certified={true}
                                                media={routine.media}
                                                onClick={() => handleOpenModal(routine)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenido de la segunda pestaña - Rendimiento del usuario */}
                    {activeTab === "mi-rendimiento" && (
                        <ProgressPages />
                    )}
                </Tabs>
            </div>

            {isModalOpen && selectedRoutine && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <RoutinesPage
                        routine={selectedRoutine}
                        refreshRoutines={refreshRoutines}
                        onDeleted={() => {
                            refreshRoutines();
                            handleCloseModal();
                            setAlert({ type: "success", message: "Rutina eliminada correctamente", show: true });
                        }}
                    />
                </Modal>
            )}

            {alert.show && (
                <NotificationAlert
                    type={alert.type}
                    description={alert.message}
                    onClose={() => setAlert({ ...alert, show: false })}
                />
            )}
        </div>
    );
}