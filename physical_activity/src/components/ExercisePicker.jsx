import React from "react";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchExercises } from "@/services/exerciseServices.js";
import RoutineExerciseRow from "@/components/RoutineExerciseRow.jsx";

export default function ExercisePicker({ selectedExercises, setSelectedExercises, onSelectExercise }) {
    const token = useSelector(state => state.user.token);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        fetchExercises(token)
            .then(data => {
                if (!mounted) return;

                // Agregamos media = ex.videoUrl
                const withMedia = data.map(ex => ({
                    ...ex,
                    media: ex.videoUrl || null
                }));

                setExercises(withMedia);
            })
            .catch(err => {
                if (!mounted) return;
                setError("Error cargando ejercicios");
                console.error(err);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => { mounted = false; };
    }, [token]);

    const toggleExercise = (exercise) => {
        const exists = selectedExercises.find(e => e.id === exercise.id);
        if (exists) {
            setSelectedExercises(selectedExercises.filter(e => e.id !== exercise.id));
        } else {
            setSelectedExercises([...selectedExercises, exercise]);
        }
    };

    if (loading) return <p>Cargando ejercicios...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="h-full overflow-y-auto p-4">
            <span className="text-sm mb-5 mr-auto text-gray-400">Ejercicios disponibles</span>
            <ul className="flex mt-3 flex-col gap-2">
                {exercises.map(ex => {
                    const isSelected = selectedExercises.some(e => e.id === ex.id);
                    return (
                        <RoutineExerciseRow
                            key={ex.id}
                            exercise={ex}
                            selected={isSelected}
                            onClick={() => toggleExercise(ex)}
                            disableHover={true}
                        />
                    );
                })}
            </ul>
        </div>
    );
}
