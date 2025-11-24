import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import UserBadge from "../components/UserBagde.jsx";
import SummaryExercise from "../components/SummaryExercise";
import {
    fetchRoutineExercisesByRoutine,
    fetchExerciseById,
    createRoutineExercise,
    updateRoutineExercise,
    fetchRoutineExercisesByUserRoutine
} from "../services/routineExerciseServices";
import IconTextButton from "@/components/IconTextButton.jsx";
import { Save, Plus } from "lucide-react";
import FormsExercise from "@/components/FormsExercise.jsx";

const msToPretty = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

export default function EditRoutineForm({ routine, userRoutineId, selectedExercises = [], setSelectedExercises }) {
    const token = useSelector(state => state.user.token);
    const [exerciseSeries, setExerciseSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Guardar cambios
    const handleSave = async () => {
        try {
            const routineExercises = userRoutineId
                ? await fetchRoutineExercisesByUserRoutine(userRoutineId, token)
                : await fetchRoutineExercisesByRoutine(routine.routineId, token);

            for (const ex of exerciseSeries) {
                const existing = routineExercises.find(re => re.exerciseId === ex.exerciseId);

                if (existing) {
                    await updateRoutineExercise(existing.id, {
                        sets: ex.series.length,
                        reps: ex.series[0].reps,
                        time: ex.series[0].time,
                        userRoutineId: userRoutineId || null,
                        routineId: userRoutineId ? null : routine.routineId
                    }, token);
                } else {
                    await createRoutineExercise({
                        exerciseId: ex.exerciseId,
                        sets: ex.series.length,
                        reps: ex.series[0].reps,
                        time: ex.series[0].time,
                        userRoutineId: userRoutineId || null,
                        routineId: userRoutineId ? null : routine.routineId
                    }, token);
                }
            }

            alert("Cambios guardados correctamente");
        } catch (err) {
            console.error(err);
            alert("Error al guardar cambios");
        }
    };

    // Cargar ejercicios
    useEffect(() => {
        if (!routine?.routineId) return;

        let mounted = true;
        setLoading(true);
        setError(null);

        async function loadRoutineExercises() {
            try {
                const exercises = userRoutineId
                    ? await fetchRoutineExercisesByUserRoutine(userRoutineId, token)
                    : await fetchRoutineExercisesByRoutine(routine.routineId, token);

                const exercisesWithDetails = await Promise.all(
                    exercises.map(async (re) => {
                        const exerciseData = await fetchExerciseById(re.exerciseId, token);
                        return {
                            id: uuidv4(), // ID único para React
                            exerciseId: re.exerciseId, // ID real de la BD
                            name: exerciseData.name,
                            media: exerciseData.videoUrl ? [{ src: exerciseData.videoUrl }] : [],
                            series: Array.from({ length: re.sets || 1 }, () => ({
                                id: uuidv4(),
                                reps: re.reps || 0,
                                time: re.time || 0
                            }))
                        };
                    })
                );

                if (!mounted) return;
                setExerciseSeries(exercisesWithDetails);
            } catch (err) {
                console.error(err);
                if (!mounted) return;
                setError("Error cargando datos");
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        }

        loadRoutineExercises();
        return () => { mounted = false; };
    }, [routine?.routineId, token]);

    // Agregar ejercicios seleccionados
    useEffect(() => {
        if (selectedExercises.length === 0) return;

        setExerciseSeries(prev => {
            const newSelected = selectedExercises
                .filter(ex => !prev.find(e => e.exerciseId === ex.id))
                .map(ex => ({
                    id: uuidv4(),
                    exerciseId: ex.id,
                    name: ex.name,
                    media: ex.videoUrl ? [{ src: ex.videoUrl }] : [],
                    series: [{ id: uuidv4(), reps: 0, time: 0 }],
                    new: true
                }));
            return [...prev, ...newSelected];
        });
    }, [selectedExercises]);

    // Agregar serie
    const addSeries = (exerciseId) => {
        setExerciseSeries(prev =>
            prev.map(ex => ex.exerciseId === exerciseId
                ? { ...ex, series: [...ex.series, { id: uuidv4(), reps: 0, time: 0 }] }
                : ex
            )
        );
    };

    // Actualizar todas las series de un ejercicio
    const updateSeries = (exerciseId, field, value) => {
        setExerciseSeries(prev =>
            prev.map(ex =>
                ex.exerciseId === exerciseId
                    ? { ...ex, series: ex.series.map(s => ({ ...s, [field]: Number(value) })) }
                    : ex
            )
        );
    };

    // Totales
    const totalSeries = exerciseSeries.reduce((acc, ex) => acc + ex.series.length, 0);
    const totalReps = exerciseSeries.reduce((acc, ex) => acc + ex.series.reduce((sAcc, s) => sAcc + (s.reps || 0), 0), 0);
    const totalTimeRaw = exerciseSeries.reduce((acc, ex) => acc + ex.series.reduce((sAcc, s) => sAcc + (s.time || 0), 0), 0);

    return (
        <div className="flex w-full h-full">
            <div className="bg-white p-6 flex flex-col gap-6 relative items-start" style={{ color: "var(--negro)" }}>
                <UserBadge userName={routine.userName} certified={routine.certified} />
                <h2 className="text-3xl font-bold">{routine?.name}</h2>

                {loading ? <p>Cargando resumen...</p> : error ? <p className="text-red-500">{error}</p> :
                    <div className="flex flex-row gap-8 items-start">
                        {totalTimeRaw > 0 && <SummaryExercise titulo={msToPretty(totalTimeRaw)} subtitulo="Tiempo estimado" />}
                        {totalSeries > 0 && <SummaryExercise titulo={totalSeries} subtitulo="Series" />}
                        {totalReps > 0 && <SummaryExercise titulo={totalReps} subtitulo="Repeticiones" />}
                    </div>
                }

                <div className="flex items-center mt-8 mb-0 w-full">
                    <span className="text-sm ml-5 mr-auto text-gray-400">Ejercicios</span>
                    <IconTextButton icon={Save} text="Guardar cambios" onClick={handleSave} />
                </div>

                <div className="flex flex-col gap-4 w-full">
                    {exerciseSeries.map((ex) => (
                        <FormsExercise
                            key={ex.id}
                            exercise={ex}
                            onChange={(exerciseId, seriesId, field, value) => {
                                setExerciseSeries(prev =>
                                    prev.map(e =>
                                        e.exerciseId === exerciseId
                                            ? {
                                                ...e,
                                                series: e.series.map(s =>
                                                    s.id === seriesId ? { ...s, [field]: value } : s
                                                )
                                            }
                                            : e
                                    )
                                );
                            }}
                            addSeries={addSeries}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}
