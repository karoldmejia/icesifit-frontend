import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SplitLayout from "../components/SplitLayout";
import { fetchUsers } from "@/services/userServices";
import { fetchProgressByUser } from "@/services/progressServices";
import { fetchUserRoutinesByUser } from "@/services/userRoutineServices";
import { fetchRoutine } from "@/services/routineServices";
import { fetchExerciseById, fetchRoutineExercisesByUserRoutine } from "@/services/routineExerciseServices";
import ProgressCard from "@/components/ProgressCard";
import NotificationAlert from "@/components/NotificationAlert";
import ProgressModal from "@/components/ProgressModal.jsx";
import Modal from "@/components/Modal.jsx";
import AssignTrainerModal from "./AssignTrainerModal.jsx";
import IconButton from "@/components/IconButton";
import { UserCheck } from "lucide-react";
import { fetchAssignmentsByTrainer } from "@/services/assignmentServices";

export default function AdminProgressPages() {
    const token = useSelector(state => state.user.token);
    const userRole = useSelector(state => state.user.role);
    const currentUserId = useSelector(state => state.user.id); // ID del usuario logueado

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userRoutines, setUserRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "", show: false });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRoutine, setModalRoutine] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedUserForAssign, setSelectedUserForAssign] = useState(null);

    // Cargar lista de usuarios (filtrada por asignaciones si es trainer)
    useEffect(() => {
        async function loadUsers() {
            try {
                setUsersLoading(true);

                if (userRole === "ROLE_Trainer") {
                    // Para trainers: cargar solo usuarios asignados
                    const assignments = await fetchAssignmentsByTrainer(currentUserId, token);
                    console.log("Asignaciones del entrenador:", assignments);

                    // Extraer IDs de usuarios únicos de las asignaciones
                    const assignedUserIds = [...new Set(assignments.map(assignment => assignment.userId))];

                    if (assignedUserIds.length === 0) {
                        setUsers([]);
                        return;
                    }

                    // Cargar información completa de los usuarios asignados
                    const allUsers = await fetchUsers(token);
                    const assignedUsers = allUsers.filter(user =>
                        assignedUserIds.includes(user.id) &&
                        (user.role?.name === "User" || user.role?.name === "ROLE_User")
                    );

                    setUsers(assignedUsers);
                } else {
                    // Para admin: cargar todos los usuarios normales
                    const usersData = await fetchUsers(token);
                    console.log("Datos de usuarios:", usersData);

                    const normalUsers = usersData.filter(user =>
                        user.role?.name === "User" || user.role?.name === "ROLE_User"
                    );
                    setUsers(normalUsers);
                }
            } catch (err) {
                console.error("Error cargando usuarios:", err);
                setError("Error al cargar la lista de usuarios");
            } finally {
                setUsersLoading(false);
            }
        }

        loadUsers();
    }, [token, userRole, currentUserId]);

    // Cargar progreso del usuario seleccionado
    useEffect(() => {
        if (!selectedUser) {
            setUserRoutines([]);
            return;
        }

        async function loadUserProgress() {
            try {
                setLoading(true);

                // Cargar progreso del usuario
                const progress = await fetchProgressByUser(selectedUser.id, token);

                // Cargar rutinas del usuario
                const userRoutinesData = await fetchUserRoutinesByUser(selectedUser.id, token);

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
                            userName: selectedUser.name,
                            media: exercisesWithDetails.length > 0 && exercisesWithDetails[0].media
                                ? [{ src: exercisesWithDetails[0].media }]
                                : []
                        };
                    })
                );

                setUserRoutines(routinesWithDetails);

            } catch (err) {
                console.error("Error cargando progreso del usuario:", err);
                setError("Error al cargar el progreso del usuario");
            } finally {
                setLoading(false);
            }
        }

        loadUserProgress();
    }, [selectedUser, token]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setError(null);
    };

    const handleOpenModal = (routine) => {
        setModalRoutine(routine);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalRoutine(null);
    };

    const handleOpenAssignModal = (user, e) => {
        e.stopPropagation(); // Prevenir que se seleccione el usuario
        setSelectedUserForAssign(user);
        setIsAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedUserForAssign(null);
    };

    const handleAssignSuccess = (userId, trainerId, assignmentData) => {
        setAlert({
            type: "success",
            message: "Entrenador asignado correctamente",
            show: true
        });
        console.log(`Usuario ${userId} asignado al entrenador ${trainerId}`, assignmentData);

        // Recargar usuarios si es un trainer (para mostrar el nuevo usuario asignado)
        if (userRole === "ROLE_Trainer") {
            loadUsers();
        }
    };

    const handleUnassignSuccess = (userId, assignmentId) => {
        setAlert({
            type: "success",
            message: "Asignación eliminada correctamente",
            show: true
        });
        console.log(`Asignación ${assignmentId} eliminada del usuario ${userId}`);

        // Recargar usuarios si es un trainer (para remover el usuario desasignado)
        if (userRole === "ROLE_Trainer") {
            loadUsers();
            // Si el usuario desasignado está seleccionado, limpiar la selección
            if (selectedUser?.id === userId) {
                setSelectedUser(null);
            }
        }
    };

    // Función para refrescar los datos cuando se elimina un progreso
    const handleRefreshData = () => {
        // Recargar los datos del usuario seleccionado
        if (selectedUser) {
            loadUserProgress();
        }
    };

    // Función para mostrar notificación de éxito
    const showSuccessAlert = () => {
        setAlert({
            type: "success",
            message: "Progreso eliminado correctamente",
            show: true
        });
    };

    // Función auxiliar para recargar usuarios (reutilizada desde useEffect)
    async function loadUsers() {
        try {
            setUsersLoading(true);

            if (userRole === "ROLE_Trainer") {
                // Para trainers: cargar solo usuarios asignados
                const assignments = await fetchAssignmentsByTrainer(currentUserId, token);
                console.log("Asignaciones del entrenador:", assignments);

                // Extraer IDs de usuarios únicos de las asignaciones
                const assignedUserIds = [...new Set(assignments.map(assignment => assignment.userId))];

                if (assignedUserIds.length === 0) {
                    setUsers([]);
                    return;
                }

                // Cargar información completa de los usuarios asignados
                const allUsers = await fetchUsers(token);
                const assignedUsers = allUsers.filter(user =>
                    assignedUserIds.includes(user.id) &&
                    (user.role?.name === "User" || user.role?.name === "ROLE_User")
                );

                setUsers(assignedUsers);
            } else {
                // Para admin: cargar todos los usuarios normales
                const usersData = await fetchUsers(token);
                console.log("Datos de usuarios:", usersData);

                const normalUsers = usersData.filter(user =>
                    user.role?.name === "User" || user.role?.name === "ROLE_User"
                );
                setUsers(normalUsers);
            }
        } catch (err) {
            console.error("Error cargando usuarios:", err);
            setError("Error al cargar la lista de usuarios");
        } finally {
            setUsersLoading(false);
        }
    }

    if (userRole !== "ROLE_Admin" && userRole !== "ROLE_Trainer") {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">
                    No tienes permisos para acceder a esta vista
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <SplitLayout
                showLeft={true}
                backgroundColor="bg-transparent"
                lineColor={"bg-gray-700"}
                left={
                    <div className="space-y-4 p-4">
                        <h2 className="text-sm font-bold mb-4 text-gray-300">
                            {userRole === "ROLE_Trainer" ? "MIS USUARIOS ASIGNADOS" : "USUARIOS"}
                        </h2>

                        {usersLoading ? (
                            <div className="text-center py-8">
                                <p>Cargando usuarios...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    {userRole === "ROLE_Trainer"
                                        ? "No tienes usuarios asignados"
                                        : "No hay usuarios registrados"
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {users.map(user => (
                                    <div
                                        key={user.id}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                            selectedUser?.id === user.id
                                                ? 'bg-[#4f4f4f] border-gray-200'
                                                : 'bg-[#323132] border-gray-600 hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-gray-600 text-sm font-medium">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-200 truncate">
                                                        {user.name || 'Usuario sin nombre'}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {user.institutionalEmail || 'Sin email'}
                                                    </p>
                                                </div>
                                            </div>
                                            {userRole === "ROLE_Admin" && (
                                                <IconButton
                                                    icon={UserCheck}
                                                    onClick={(e) => handleOpenAssignModal(user, e)}
                                                    className="text-gray-400 hover:text-gray-50 hover:bg-gray-900/30"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                }
                right={
                    <div className="space-y-4 p-4">
                        {selectedUser ? (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <span className="text-red-600 font-medium text-lg">
                                            {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                                        <p className="text-sm text-gray-500">Progreso del usuario</p>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="text-center py-8">
                                        <p>Cargando progreso...</p>
                                    </div>
                                ) : userRoutines.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">
                                            {selectedUser.name} no tiene rutinas con progreso registrado
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {userRoutines.map(routine => (
                                            <ProgressCard
                                                key={routine.userRoutineId}
                                                routine={routine}
                                                isSelected={false}
                                                onSelect={() => handleOpenModal(routine)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {userRole === "ROLE_Trainer" && users.length === 0
                                        ? "No tienes usuarios asignados para ver su progreso"
                                        : "Selecciona un usuario para ver su progreso"
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                }
            />

            {/* Modal para ver detalles del progreso */}
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

            {/* Modal para asignar entrenadores - Solo para Admin */}
            {isAssignModalOpen && selectedUserForAssign && userRole === "ROLE_Admin" && (
                <AssignTrainerModal
                    isOpen={isAssignModalOpen}
                    onClose={handleCloseAssignModal}
                    user={selectedUserForAssign}
                    onAssign={handleAssignSuccess}
                    onUnassign={handleUnassignSuccess}
                />
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