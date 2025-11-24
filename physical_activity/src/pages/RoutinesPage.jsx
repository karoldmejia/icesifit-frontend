import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SplitLayout from "../components/SplitLayout";
import RoutineDetails from "./RoutineDetails";
import EditRoutineForm from "@/pages/EditRoutineForm.jsx";
import ExercisePicker from "@/components/ExercisePicker.jsx";
import { fetchRoutineExercisesByRoutine, fetchRoutineExercisesByUserRoutine, fetchExerciseById } from "@/services/routineExerciseServices";

function RoutineExerciseList({ exercises }) {
    if (!exercises || exercises.length === 0) return <p>No hay ejercicios en esta rutina</p>;

    return (
        <div className="bg-white w-full h-full p-4 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Ejercicios de la rutina</h3>
            <ul className="flex flex-col gap-2">
                {exercises.map(ex => (
                    <li key={ex.id} className="p-2 rounded border bg-gray-100">
                        {ex.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function RoutinesPage({ routine }) {
    const token = useSelector(state => state.user.token);
    const [showLeft, setShowLeft] = useState(true);
    const [mode, setMode] = useState("view");
    const [selectedExercises, setSelectedExercises] = useState([]);

    // Cargar ejercicios desde la API
    useEffect(() => {
        let mounted = true;

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
                            name: exerciseData.name
                        };
                    })
                );

                if (!mounted) return;
                setSelectedExercises(exercisesWithDetails);
            } catch (err) {
                console.error("Error cargando ejercicios:", err);
            }
        }

        loadExercises();
        return () => { mounted = false; };
    }, [routine, token]);

    return (
        <SplitLayout
            showLeft={showLeft}
            left={
                showLeft && (
                    mode === "edit" ? (
                        <div className="bg-transparent w-full h-full flex items-center justify-center">
                            <ExercisePicker
                                selectedExercises={selectedExercises}
                                setSelectedExercises={setSelectedExercises}
                            />
                        </div>
                    ) : (
                        <RoutineExerciseList exercises={selectedExercises} />
                    )
                )
            }
            right={
                mode === "edit" ? (
                    <EditRoutineForm
                        routine={routine}
                        userRoutineId={routine.userRoutineId}
                        selectedExercises={selectedExercises}
                        setSelectedExercises={setSelectedExercises}
                    />
                ) : (
                    <RoutineDetails
                        routine={routine}
                        userRoutineId={routine.userRoutineId}
                        onEdit={() => {
                            setMode("edit");
                            setShowLeft(true);
                        }}
                    />
                )
            }
        />
    );
}
