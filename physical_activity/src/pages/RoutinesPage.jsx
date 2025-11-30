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

export default function RoutinesPage({ routine, refreshRoutines, onDeleted }) {
    const token = useSelector(state => state.user.token);
    const [showLeft, setShowLeft] = useState(true);
    const [mode, setMode] = useState("view");
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

    return (
        <>
            <SplitLayout
                showLeft={showLeft}
                left={
                    showLeft && (
                        mode === "edit" ? (
                            <div className="bg-transparent w-full h-full flex items-center justify-center">
                                <ExercisePicker
                                    selectedExercises={selectedExercises}
                                    setSelectedExercises={setSelectedExercises}
                                    onSelectExercise={setActiveExercise}
                                />
                            </div>
                        ) : (
                            <RoutineExerciseList exercises={selectedExercises}
                                                 onSelectExercise={setActiveExercise}
                            />
                        )
                    )
                }
                right={
                    activeExercise ? (
                        <ExerciseDetails
                            exercise={activeExercise}
                            onBack={() => setActiveExercise(null)} // vuelve al form o detalle
                        />
                    ) : mode === "edit" ? (
                        <EditRoutineForm
                            routine={routine}
                            userRoutineId={routine.userRoutineId}
                            selectedExercises={selectedExercises}
                            setSelectedExercises={setSelectedExercises}
                            onSaveSuccess={handleSavedRoutine}
                        />
                    ) : (
                        <RoutineDetails
                            routine={routine}
                            userRoutineId={routine.userRoutineId}
                            onEdit={() => {
                                setMode("edit");
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
