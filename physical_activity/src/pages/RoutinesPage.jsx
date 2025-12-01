import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SplitLayout from "../components/SplitLayout";
import RoutineDetails from "./RoutineDetails";
import EditRoutineForm from "@/pages/EditRoutineForm.jsx";
import ExercisePicker from "@/components/ExercisePicker.jsx";
import { fetchRoutineExercisesByRoutine, fetchRoutineExercisesByUserRoutine, fetchExerciseById } from "@/services/routineExerciseServices";
import RoutineExerciseList from "./RoutineExerciseList.jsx";
import NotificationAlert from "@/components/NotificationAlert.jsx";
import ExerciseDetails from "@/pages/ExerciseDetails.jsx";
import PropTypes from "prop-types";

export default function RoutinesPage({ routine, refreshRoutines, onDeleted }) {
    const token = useSelector(state => state.user.token);
    const [showLeft, setShowLeft] = useState(true);
    const [mode, setMode] = useState("view"); // "view" | "edit" | "progress"
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [alert, setAlert] = useState({ type: "", description: "", show: false });
    const [activeExercise, setActiveExercise] = useState(null);

    async function loadExercises() {
        try {
            const routineExercises = routine.userRoutineId
                ? await fetchRoutineExercisesByUserRoutine(routine.userRoutineId, token)
                : await fetchRoutineExercisesByRoutine(routine.routineId, token);
            const exercisesWithDetails = await Promise.all(
                routineExercises.map(async (re) => {
                    const exerciseData = await fetchExerciseById(re.exerciseId, token);

                    return {
                        id: re.id, // id de la rutina
                        exerciseId: re.exerciseId,
                        name: exerciseData.name,
                        media: exerciseData.videoUrl
                    };
                })
            );
            setSelectedExercises(exercisesWithDetails);
        } catch (err) {
            console.error("Error cargando ejercicios:", err);
        }
    }

    useEffect(() => {
        loadExercises();
    }, [routine, token]);

    const handleSavedRoutine = async () => {
        await refreshRoutines();
        await loadExercises();
        setAlert({
            type: "success",
            description: "La rutina ha sido cambiada",
            show: true
        });
        setMode("view");
    };

    const handleSavedProgress = async (progressSummary) => {
        await refreshRoutines();
        setAlert({
            type: "success",
            description: `Progreso guardado: ${progressSummary.totalSets} series completadas`,
            show: true
        });
        setMode("view");
    };

    return (
        <>
            <SplitLayout
                showLeft={showLeft}
                left={
                    showLeft && (
                        mode === "edit" || mode === "progress" ? (
                            <div className="bg-transparent w-full h-full flex items-center justify-center">
                                <ExercisePicker
                                    selectedExercises={selectedExercises}
                                    setSelectedExercises={setSelectedExercises}
                                    onSelectExercise={setActiveExercise}
                                />
                            </div>
                        ) : (
                            <RoutineExerciseList
                                exercises={selectedExercises}
                                onSelectExercise={setActiveExercise}
                            />
                        )
                    )
                }
                right={
                    activeExercise ? (
                        <ExerciseDetails
                            exercise={activeExercise}
                            onBack={() => setActiveExercise(null)}
                        />
                    ) : mode === "edit" ? (
                        <EditRoutineForm
                            routine={routine}
                            userRoutineId={routine.userRoutineId}
                            selectedExercises={selectedExercises}
                            setSelectedExercises={setSelectedExercises}
                            onSaveSuccess={handleSavedRoutine}
                            mode="edit"
                        />
                    ) : mode === "progress" ? (
                        <EditRoutineForm
                            routine={routine}
                            userRoutineId={routine.userRoutineId}
                            onSaveSuccess={handleSavedProgress}
                            mode="progress"
                        />
                    ) : (
                        <RoutineDetails
                            routine={routine}
                            userRoutineId={routine.userRoutineId}
                            onEdit={() => {
                                setMode("edit");
                                setShowLeft(true);
                            }}
                            onProgress={() => {
                                setMode("progress");
                                setShowLeft(true);
                            }}
                            onDeleted={onDeleted}
                        />
                    )
                }
            />

            {/* Notificación global */}
            {alert.show && (
                <NotificationAlert
                    type={alert.type}
                    description={alert.description}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                />
            )}
        </>
    );
}

RoutinesPage.propTypes = {
    routine: PropTypes.shape({
        userRoutineId: PropTypes.number,
        routineId: PropTypes.number,
        name: PropTypes.string,
    }),
    refreshRoutines: PropTypes.func,
    onDeleted: PropTypes.func,
};