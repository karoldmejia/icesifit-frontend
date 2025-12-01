import React from "react";
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
import { createProgress } from "@/services/progressServices";
import IconTextButton from "@/components/IconTextButton.jsx";
import { Save, Plus } from "lucide-react";
import FormsExercise from "@/components/FormsExercise.jsx";
import { deleteRoutineExercise } from "@/services/routineExerciseServices";
import NotificationAlert from "@/components/NotificationAlert.jsx";
import ConfirmationCard from "@/components/ConfirmationCard.jsx";
import PropTypes from "prop-types";

const msToPretty = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

export default function EditRoutineForm({
                                            routine,
                                            userRoutineId,
                                            onSaveSuccess,
                                            selectedExercises = [],
                                            setSelectedExercises,
                                            mode = "edit" // "edit" | "progress"
                                        }) {
    const token = useSelector(state => state.user.token);
    const [exerciseSeries, setExerciseSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ type: "", description: "", show: false });
    const [exerciseToDelete, setExerciseToDelete] = useState(null);
    const userId = useSelector(state => state.user.id);

    // Determinar si estamos en modo progreso
    const isProgressMode = mode === "progress";

    // Guardar cambios (modo edición) o progreso (modo progreso)
    const handleSave = async () => {
        try {
            if (isProgressMode) {
                // MODO PROGRESO: Guardar progreso
                let totalSetsCompleted = 0;
                let totalRepsCompleted = 0;
                let totalTimeCompleted = 0;
                let totalExercisesWithProgress = 0;

                // Agrupar por ejercicio para enviar un registro por ejercicio
                for (const ex of exerciseSeries) {
                    const completedSeriesForExercise = ex.series.filter(s => s.completed);
                    const totalSetsForExercise = completedSeriesForExercise.length;

                    if (totalSetsForExercise > 0) {
                        const totalRepsForExercise = completedSeriesForExercise.reduce((sum, s) => sum + (s.reps || 0), 0);
                        const totalTimeForExercise = completedSeriesForExercise.reduce((sum, s) => sum + (s.time || 0), 0);

                        await createProgress(
                            userId,
                            {
                                routineExerciseId: ex.routineExerciseId,
                                repsCompleted: totalRepsForExercise,
                                timeCompleted: totalTimeForExercise,
                                setsCompleted: totalSetsForExercise,
                                progressDate: new Date().toISOString()
                            },
                            token
                        );

                        // Acumular para el resumen general
                        totalSetsCompleted += totalSetsForExercise;
                        totalRepsCompleted += totalRepsForExercise;
                        totalTimeCompleted += totalTimeForExercise;
                        totalExercisesWithProgress++;
                    }
                }

                const progressSummary = {
                    totalExercises: totalExercisesWithProgress,
                    totalSets: totalSetsCompleted,
                    totalReps: totalRepsCompleted,
                    totalTime: totalTimeCompleted,
                    averageEffort: totalSetsCompleted > 0 ? (totalRepsCompleted + totalTimeCompleted) / totalSetsCompleted : 0
                };

                console.log(progressSummary)
                setAlert({
                    type: "success",
                    description: `Progreso guardado: ${totalSetsCompleted} series completadas en ${totalExercisesWithProgress} ejercicios`,
                    show: true
                });

                if (onSaveSuccess) onSaveSuccess(progressSummary)
            } else {
                // MODO EDICIÓN: Guardar rutina
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

                setAlert({
                    type: "success",
                    description: "Rutina guardada exitosamente",
                    show: true
                });

                if (onSaveSuccess) onSaveSuccess();
            }
        } catch (err) {
            console.error(err);
            setAlert({
                type: "error",
                description: isProgressMode
                    ? "Error al guardar el progreso"
                    : "No pudimos cambiar esta rutina",
                show: true
            });
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
                            id: uuidv4(),
                            routineExerciseId: re.id,
                            exerciseId: re.exerciseId,
                            name: exerciseData.name,
                            media: exerciseData.videoUrl ? [{ src: exerciseData.videoUrl }] : [],
                            series: Array.from({ length: re.sets || 1 }, () => ({
                                id: uuidv4(),
                                reps: re.reps ?? "",
                                time: re.time ?? "",
                                completed: isProgressMode
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
    }, [routine?.routineId, userRoutineId, token, isProgressMode]);

    // Agregar ejercicios seleccionados (solo en modo edición)
    useEffect(() => {
        if (selectedExercises.length === 0 || isProgressMode) return;

        setExerciseSeries(prev => {
            const newSelected = selectedExercises
                .filter(ex => !prev.some(p => p.exerciseId === ex.id))
                .map(ex => ({
                    id: uuidv4(),
                    exerciseId: ex.id,
                    name: ex.name,
                    media: ex.videoUrl ? [{ src: ex.videoUrl }] : [],
                    series: [{ id: uuidv4(), reps: "", time: "", completed: false }]
                }));

            return [...prev, ...newSelected];
        });
        setSelectedExercises([]);
    }, [selectedExercises, isProgressMode]);

    // Agregar serie
    const addSeries = (exerciseId) => {
        setExerciseSeries(prev =>
            prev.map(ex => ex.exerciseId === exerciseId
                ? {
                    ...ex,
                    series: [...ex.series, {
                        id: uuidv4(),
                        reps: isProgressMode ? 0 : "",
                        time: isProgressMode ? 0 : "",
                        completed: isProgressMode
                    }]
                }
                : ex
            )
        );
    };

    const updateSeries = (exerciseId, seriesId, field, value) => {
        setExerciseSeries(prev =>
            prev.map(ex =>
                ex.exerciseId === exerciseId
                    ? {
                        ...ex,
                        series: ex.series.map(s => ({
                            ...s,
                            [field]: isProgressMode ? Number(value) : value
                        }))
                    }
                    : ex
            )
        );
    };

    // Toggle completado (solo en modo progreso)
    const toggleSeriesCompleted = (exerciseId, seriesId) => {
        if (!isProgressMode) return;

        setExerciseSeries(prev =>
            prev.map(ex =>
                ex.exerciseId === exerciseId
                    ? {
                        ...ex,
                        series: ex.series.map(s =>
                            s.id === seriesId ? { ...s, completed: !s.completed } : s
                        )
                    }
                    : ex
            )
        );
    };

    const deleteSeries = (exerciseId, seriesId) => {
        setExerciseSeries(prev =>
            prev.map(ex =>
                ex.exerciseId === exerciseId
                    ? {
                        ...ex,
                        series: ex.series.filter(s => s.id !== seriesId)
                    }
                    : ex
            )
        );
    };

    const confirmDeleteExercise = (routineExerciseId, exerciseName) => {
        setExerciseToDelete({ routineExerciseId, exerciseName });
    };

    const handleConfirmDelete = async () => {
        if (!exerciseToDelete) return;
        try {
            await deleteRoutineExercise(exerciseToDelete.routineExerciseId, token);
            setExerciseSeries(prev =>
                prev.filter(ex => ex.routineExerciseId !== exerciseToDelete.routineExerciseId)
            );
            setExerciseToDelete(null);
        } catch (err) {
            setAlert({
                type: "error",
                description: "No pudimos eliminar este ejercicio",
                show: true
            });
            setExerciseToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setExerciseToDelete(null);
    };

    // Totales (diferentes según el modo)
    const totalSeries = exerciseSeries.reduce((acc, ex) => acc + ex.series.length, 0);
    const completedSeries = isProgressMode
        ? exerciseSeries.reduce((acc, ex) => acc + ex.series.filter(s => s.completed).length, 0)
        : 0;
    const totalReps = exerciseSeries.reduce((acc, ex) => acc + ex.series.reduce((sAcc, s) => sAcc + (s.reps || 0), 0), 0);
    const totalTimeRaw = exerciseSeries.reduce((acc, ex) => acc + ex.series.reduce((sAcc, s) => sAcc + (s.time || 0), 0), 0);

    return (
        <div className="flex-1 w-full h-full">
            <div className="bg-white p-6 flex flex-col gap-6 relative items-start" style={{ color: "var(--negro)" }}>
                <UserBadge userName={routine.userName} certified={routine.certified} />
                <h2 className="text-3xl font-bold">
                    {isProgressMode ? "Registrar Progreso" : "Editar Rutina"} - {routine?.name}
                </h2>

                {loading ? <p>Cargando resumen...</p> : error ? <p className="text-red-500">{error}</p> :
                    <div className="flex flex-row gap-8 items-start">
                        {totalTimeRaw > 0 && <SummaryExercise titulo={msToPretty(totalTimeRaw)} subtitulo="Tiempo estimado" />}
                        {totalSeries > 0 && (
                            <SummaryExercise
                                titulo={isProgressMode ? `${completedSeries}/${totalSeries}` : totalSeries}
                                subtitulo={isProgressMode ? "Series completadas" : "Series"}
                            />
                        )}
                        {totalReps > 0 && <SummaryExercise titulo={totalReps} subtitulo="Repeticiones" />}
                    </div>
                }

                <div className="flex items-center mt-8 mb-0 w-full">
                    <span className="text-sm ml-5 mr-auto text-gray-400">
                        {isProgressMode ? "Registrar series completadas" : "Ejercicios"}
                    </span>

                    <IconTextButton
                        icon={Save}
                        text={isProgressMode ? "Guardar progreso" : "Guardar cambios"}
                        onClick={handleSave}
                    />
                </div>

                <div className="flex flex-col gap-4 w-full">
                    {exerciseSeries.map((ex) => (
                        <FormsExercise
                            key={ex.id}
                            exercise={ex}
                            onChange={updateSeries}
                            onToggleCompleted={isProgressMode ? toggleSeriesCompleted : undefined}
                            addSeries={addSeries}
                            deleteSeries={deleteSeries}
                            deleteExercise={!isProgressMode ? () => confirmDeleteExercise(ex.routineExerciseId, ex.name) : undefined}
                            mode={mode}
                        />
                    ))}
                </div>
            </div>

            {alert.show && (
                <NotificationAlert
                    type={alert.type}
                    description={alert.description}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                />
            )}

            {exerciseToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <ConfirmationCard
                        title={`¿Eliminar ${exerciseToDelete.exerciseName}?`}
                        description="Esta acción eliminará permanentemente este ejercicio."
                        onDeactivate={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                </div>
            )}
        </div>
    );
}

EditRoutineForm.propTypes = {
    routine: PropTypes.shape({
        routineId: PropTypes.number,
        userName: PropTypes.string,
        certified: PropTypes.bool,
        name: PropTypes.string
    }),
    userRoutineId: PropTypes.number,
    onSaveSuccess: PropTypes.func,
    selectedExercises: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            videoUrl: PropTypes.string
        })
    ),
    setSelectedExercises: PropTypes.func,
    mode: PropTypes.oneOf(["edit", "progress"])
};