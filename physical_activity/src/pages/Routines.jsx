import { useState, useEffect } from "react";
import {fetchRoutine, fetchRoutines} from "../services/routineServices";
import { fetchRoutineExercisesByRoutine, fetchExerciseById } from "../services/routineExerciseServices";
import RoutineDetails from "./RoutineDetails";
import { useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import RoutineCard from "../components/RoutineCard";
import Modal from "@/components/Modal.jsx";
import { fetchAllUserRoutines, fetchUserRoutinesByUser } from "../services/userRoutineServices";
import { fetchUserById } from "../services/userServices";
import {jwtDecode} from "jwt-decode";
import RoutinesPage from "@/pages/RoutinesPage.jsx";


export default function Routines() {
    const token = useSelector(state => state.user.token);
    const userRole = useSelector(state => state.user.role); // "admin" o "user"
    const userId = useSelector(state => state.user.id);

    const [routines, setRoutines] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoutine, setSelectedRoutine] = useState(null);

    function handleOpenModal(routine) {
        setSelectedRoutine(routine);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setSelectedRoutine(null);
    }


    useEffect(() => {
        async function loadRoutines() {
            setLoading(true);
            try {
                let userRoutines = [];
                const decodedToken = jwtDecode(token);
                const userAuthorities = decodedToken.authorities || [];

                const canViewAll = userAuthorities.includes("VER_TODAS_RUTINAS");
                if (canViewAll) {
                    userRoutines = await fetchAllUserRoutines(token);
                } else {
                    userRoutines = await fetchUserRoutinesByUser(userId, token);
                }

                const routinesWithExercises = await Promise.all(
                    userRoutines.map(async (ur) => {
                        // Traer la rutina completa
                        const routineData = await fetchRoutine(ur.routineId, token);

                        // Traer los ejercicios de la rutina
                        const routineExercises = await fetchRoutineExercisesByRoutine(ur.routineId, token);

                        const exercisesData = await Promise.all(
                            routineExercises.map(async (re) => {
                                const exercise = await fetchExerciseById(re.exerciseId, token);
                                return {
                                    name: exercise.name,
                                    videoUrl: exercise.videoUrl,
                                };
                            })
                        );

                        const exerciseList = exercisesData.map(e => e.name).join(", ");
                        const media = exercisesData.map(e => ({ src: e.videoUrl }));

                        // Traer el usuario de esta rutina
                        const userData = await fetchUserById(ur.userId);

                        return {
                            userRoutineId: ur.id,
                            userId: ur.userId,
                            userName: userData.name,  // <--- Nombre del usuario
                            routineId: ur.routineId,
                            name: routineData.name,
                            exerciseList,
                            media,
                            fullRoutine: routineData
                        };
                    })
                );

                setRoutines(routinesWithExercises);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadRoutines();
    }, [token, userRole, userId]);

    // Filtrar rutinas según búsqueda
    const filteredRoutines = routines.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex mt-20 flex-col w-[1200px] h-[1000px] mx-auto overflow-hidden">
            {/* Banner */}
            <div className="w-full mt-20 h-64 overflow-hidden rounded-xl px-4 sm:px-8 lg:px-4">
                <img
                    src="/banner_exercises.jpg"
                    alt="Banner"
                    className="w-full h-full object-cover rounded-xl"
                    style={{ objectPosition: "center 25%" }}
                />
            </div>

            {/* Título y barra de búsqueda */}
            <div className="flex flex-col mt-10 sm:flex-row sm:items-center justify-between mt-4 mb-4 px-4 gap-4">
                <h2 className="text-2xl font-bold mb-2 sm:mb-0">Rutinas</h2>
                <div className="flex-1 sm:flex-none sm:ml-auto">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar rutina..."
                    />
                </div>
            </div>

            {/* Cards de rutinas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {loading ? (
                    <p>Cargando rutinas...</p>
                ) : filteredRoutines.length === 0 ? (
                    <p>Aún no hay rutinas creadas</p>
                ) : (
                    filteredRoutines.map(routine => (
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

            {isModalOpen && selectedRoutine && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                >
                    <RoutinesPage routine={selectedRoutine}
                                    routineName={selectedRoutine.name}
                    />
                </Modal>
    )}
        </div>
    );
}