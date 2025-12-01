import React from "react";

import { useState } from "react";
import Modal from "@/components/Modal.jsx";
import RoutineCard from "@/components/RoutineCard";
import IconButton from "@/components/IconButton.jsx";
import { ClipboardPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { createUserRoutine } from "@/services/userRoutineServices.js";
import { fetchRoutineExercisesByRoutine, createRoutineExercise } from "@/services/routineExerciseServices.js";
import RoutinesPage from "@/pages/RoutinesPage.jsx";

export default function CreateRoutineFromBase({ baseRoutines, setAlert, refreshRoutines  }) {
    const token = useSelector(state => state.user.token);
    const userId = useSelector(state => state.user.id); // suponiendo que guardas id del user
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null); // la UserRoutine creada

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const [isCreating, setIsCreating] = useState(false);

    const handleSelectBaseRoutine = async (routineBase) => {
        if (isCreating) return;
        setIsCreating(true);

        try {
            // Crear UserRoutine
            const newUserRoutine = await createUserRoutine({
                routineId: routineBase.routineId,
                userId,
                status: true,
                assignmentDate: new Date().toISOString()
            }, token);

            // Obtener ejercicios base
            const existingExercises = await fetchRoutineExercisesByRoutine(newUserRoutine.id, token);

            if (existingExercises.length === 0) {
                // Copiar ejercicios solo si no hay
                await Promise.all(existingExercises.map(ex =>
                    createRoutineExercise({
                        exerciseId: ex.exerciseId,
                        sets: ex.sets,
                        reps: ex.reps,
                        time: ex.time,
                        userRoutineId: newUserRoutine.id
                    }, token)
                ));
            }

            // Cerrar modal
            setIsModalOpen(false);

            // Mostrar notificación
            setAlert({
                type: "success",
                message: `Rutina agregada correctamente`,
                show: true
            });

            // Refrescar lista de rutinas
            refreshRoutines();

        } catch (err) {
            console.error("Error creando la rutina:", err);
            setAlert({
                type: "error",
                message: "Ocurrió un error al crear la rutina",
                show: true
            });
        } finally {
            setIsCreating(false);
        }
    };


    // Si ya hay una UserRoutine creada, mostrar RoutinesPage
    if (editingRoutine) {
        return <RoutinesPage routine={editingRoutine} />;
    }

    return (
        <>
            <IconButton
                icon={ClipboardPlus}
                onClick={() => setIsModalOpen(true)}
                size="w-10 h-10"
                color="bg-[#323132]"
                textColor="text-white"
                className="mr-2"
            />

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} bgColor="#1A1A1A">
                    <div>
                        <h2 className="text-sm font-medium text-gray-300 mb-6 ml-6">
                            Elige una rutina base para empezar
                        </h2>
                        <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            {baseRoutines.length === 0 ? (
                                <p>No hay rutinas certificadas disponibles</p>
                            ) : (
                                baseRoutines.map(routine => (
                                    <RoutineCard
                                        key={routine.routineId}
                                        title={routine.name}
                                        exercises={routine.exerciseList}
                                        certified={true}
                                        media={routine.media}
                                        onClick={() => handleSelectBaseRoutine(routine)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
