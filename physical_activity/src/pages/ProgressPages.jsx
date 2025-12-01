import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProgressLayout from "./ProgressLayout";
import { fetchProgressByUser } from "@/services/progressServices";
import { fetchUserRoutinesByUser } from "@/services/userRoutineServices";
import { fetchRoutine } from "@/services/routineServices";
import { fetchExerciseById, fetchRoutineExercisesByUserRoutine } from "@/services/routineExerciseServices";
import NotificationAlert from "@/components/NotificationAlert";
import ProgressModal from "@/components/ProgressModal.jsx";
import Modal from "@/components/Modal.jsx";
import AdminProgressPages from "@/pages/AdminProgressPages.jsx";
import { fetchAssignmentsByUser } from "@/services/assignmentServices";

export default function ProgressPages() {
    const token = useSelector(state => state.user.token);
    const userId = useSelector(state => state.user.id);
    const userRole = useSelector(state => state.user.role);

    if (userRole === "ROLE_Admin" || userRole === "ROLE_Trainer") {
        return <AdminProgressPages />;
    }

    const [userRoutines, setUserRoutines] = useState([]);
    const [assignedTrainers, setAssignedTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trainersLoading, setTrainersLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRoutine, setModalRoutine] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "", show: false });
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Para forzar refresh

    // Cargar entrenadores asignados al usuario
    useEffect(() => {
        async function loadAssignedTrainers() {
            try {
                setTrainersLoading(true);
                const assignments = await fetchAssignmentsByUser(userId, token);
                console.log("Asignaciones del usuario:", assignments);
                setAssignedTrainers(assignments);
            } catch (err) {
                console.error("Error cargando entrenadores asignados:", err);
            } finally {
                setTrainersLoading(false);
            }
        }

        if (userRole === "ROLE_User") {
            loadAssignedTrainers();
        }
    }, [token, userId, userRole, refreshTrigger]);

    // Cargar progreso y rutinas del usuario
    useEffect(() => {
        if (userRole !== "ROLE_User") return;

        async function loadProgressData() {
            try {
                setLoading(true);

                // Cargar progreso del usuario
                const progress = await fetchProgressByUser(userId, token);

                // Cargar rutinas del usuario
                const userRoutinesData = await fetchUserRoutinesByUser(userId, token);

                // Enriquecer datos de rutinas con información completa
                const routinesWithDetails = await Promise.all(
                    userRoutinesData.map(async (ur) => {
                        const routineData = await fetchRoutine(ur.routineId, token);
                        const routineExercises = await fetchRoutineExercisesByUserRoutine(ur.id, token);

                        // Obtener detalles de ejercicios
                        const exercisesWithDetails = await Promise.all(
                            routineExercises.map(async (re) => {
                                const exerciseData = await fetchExerciseById(re.exerciseId, token);
                                return {
                                    routineExerciseId: re.id,
                                    exerciseId: re.exerciseId,
                                    name: exerciseData.name,
                                    media: exerciseData.videoUrl,
                                    sets: re.sets,
                                    reps: re.reps,
                                    time: re.time
                                };
                            })
                        );

                        // Filtrar progreso para esta rutina específica
                        const routineProgress = progress.filter(p =>
                            exercisesWithDetails.some(ex => ex.routineExerciseId === p.routineExerciseId)
                        );

                        return {
                            userRoutineId: ur.id,
                            routineId: ur.routineId,
                            name: routineData.name,
                            exercises: exercisesWithDetails,
                            progress: routineProgress,
                            // Para la imagen del card, usar la primera imagen de ejercicio disponible
                            media: exercisesWithDetails.length > 0 && exercisesWithDetails[0].media
                                ? [{ src: exercisesWithDetails[0].media }]
                                : []
                        };
                    })
                );

                setUserRoutines(routinesWithDetails);

            } catch (err) {
                console.error("Error cargando progreso:", err);
                setError("Error al cargar el progreso");
                setAlert({
                    type: "error",
                    message: "No se pudo cargar el progreso",
                    show: true
                });
            } finally {
                setLoading(false);
            }
        }

        loadProgressData();
    }, [token, userId, userRole, refreshTrigger]); // ← Agregar refreshTrigger como dependencia

    const handleSelectRoutine = (routine) => {
        setSelectedRoutine(routine);
    };

    const handleOpenModal = (routine) => {
        setModalRoutine(routine);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalRoutine(null);
    };

    // Función para refrescar los datos
    const handleRefreshData = () => {
        setRefreshTrigger(prev => prev + 1); // Incrementar para forzar re-render
    };

    // Función para mostrar notificación de éxito
    const showSuccessAlert = () => {
        setAlert({
            type: "success",
            message: "Progreso eliminado correctamente",
            show: true
        });
    };

    if (userRole !== "ROLE_User") {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">
                    Esta funcionalidad solo está disponible para usuarios
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ProgressLayout
                userRoutines={userRoutines}
                selectedRoutine={selectedRoutine}
                onSelectRoutine={handleOpenModal}
                loading={loading}
                error={error}
                leftHeader={
                    <div className="space-y-4">
                        {/* Sección de Entrenadores Asignados */}
                        <div>
                            <h2 className="text-sm font-bold mb-4 text-gray-300">MIS ENTRENADORES</h2>

                            {trainersLoading ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-400 text-sm">Cargando entrenadores...</p>
                                </div>
                            ) : assignedTrainers.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-400 text-sm">No tienes entrenadores asignados</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {assignedTrainers.map(assignment => (
                                        <div
                                            key={assignment.id}
                                            className="p-3 border border-gray-600 rounded-lg bg-[#323132] transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-blue-600 text-sm font-medium">
                                                        {assignment.trainerName ? assignment.trainerName.charAt(0).toUpperCase() : 'E'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-200 truncate">
                                                        {assignment.trainerName || 'Entrenador sin nombre'}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        Asignado el {new Date(assignment.assignmentDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Separador */}
                        <div className="border-t border-gray-600 my-4"></div>

                        {/* Sección de Métricas (se mantiene igual) */}
                        <div>
                            <h2 className="text-sm font-bold mb-4 text-gray-300">MÉTRICAS</h2>
                            {/* Tu contenido de métricas existente aquí */}
                            <div className="space-y-2">
                                <div className="p-3 border border-gray-600 rounded-lg bg-[#323132]">
                                    <p className="text-gray-400 text-sm">Rutinas activas: {userRoutines.length}</p>
                                </div>
                                <div className="p-3 border border-gray-600 rounded-lg bg-[#323132]">
                                    <p className="text-gray-400 text-sm">Progreso total: {userRoutines.reduce((total, routine) => total + routine.progress.length, 0)} registros</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />

            {/* Modal para ProgressPages */}
            {isModalOpen && modalRoutine && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <ProgressModal
                        routine={modalRoutine}
                        onClose={handleCloseModal}
                        onProgressDeleted={() => {
                            handleRefreshData(); // Refrescar datos
                            showSuccessAlert(); // Mostrar notificación
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