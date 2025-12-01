import React from "react";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import UserBadge from "../components/UserBagde";
import SummaryExercise from "../components/SummaryExercise";
import { ProgressItem } from "@/components/ProgressItem";
import WeeklyRoutineChartWithFilters from "@/components/Charts/WeeklyRoutineChartWithFilters";
import IconTextButton from "@/components/IconTextButton";
import { Settings2, Loader } from "lucide-react";

const msToPretty = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

export default function ProgressDetails({ routine, onSelectExercise, userName }) {
    const { name, exercises, progress } = routine;
    const [dateFilter, setDateFilter] = useState("all"); // "all", "week", "month"
    const userRole = useSelector(state => state.user.role);

    // Agrupar progreso por ejercicio para la lista
    const progressByExercise = useMemo(() => {
        const grouped = {};

        exercises.forEach(exercise => {
            const exerciseProgress = progress.filter(
                p => p.routineExerciseId === exercise.routineExerciseId
            );

            if (exerciseProgress.length > 0) {
                grouped[exercise.routineExerciseId] = {
                    exercise,
                    progress: exerciseProgress
                };
            }
        });

        return grouped;
    }, [exercises, progress]);

    // Preparar datos para el gráfico semanal
    const weeklyData = useMemo(() => {
        const groupedByDate = progress.reduce((acc, curr) => {
            const dateOnly = curr.progressDate.split('T')[0];

            if (!acc[dateOnly]) {
                acc[dateOnly] = {
                    rawDate: dateOnly,
                    setsCompleted: 0,
                    repsCompleted: 0,
                    timeCompleted: 0,
                    exerciseCount: 0
                };
            }

            acc[dateOnly].setsCompleted += curr.setsCompleted || 0;
            acc[dateOnly].repsCompleted += curr.repsCompleted || 0;
            acc[dateOnly].timeCompleted += curr.timeCompleted || 0;
            acc[dateOnly].exerciseCount += 1;

            return acc;
        }, {});

        return Object.values(groupedByDate)
            .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    }, [progress]);

    // Estadísticas generales
    const stats = useMemo(() => {
        const totalSets = progress.reduce((sum, p) => sum + (p.setsCompleted || 0), 0);
        const totalReps = progress.reduce((sum, p) => sum + (p.repsCompleted || 0), 0);
        const totalTime = progress.reduce((sum, p) => sum + (p.timeCompleted || 0), 0);
        const uniqueDates = [...new Set(progress.map(p => p.progressDate.split('T')[0]))].length;
        const totalExercises = Object.keys(progressByExercise).length;

        return { totalSets, totalReps, totalTime, uniqueDates, totalExercises };
    }, [progress, progressByExercise]);

    return (
        <div className="flex-1 w-full h-full">
            <div className="bg-white p-6 flex flex-col gap-6 relative items-start" style={{ color: "var(--negro)" }}>
                {userRole === "ROLE_User" ? (
                    <UserBadge userName="ti" certified={false} />
                ) : (
                    <UserBadge userName={routine.userName} certified={false} />
                )}
                <h2 className="text-3xl font-bold">{name}</h2>

                {/* Estadísticas de resumen */}
                <div className="flex flex-row gap-8 items-start">
                    {stats.totalSets > 0 && (
                        <SummaryExercise
                            titulo={stats.totalSets}
                            subtitulo="Sets totales"
                        />
                    )}
                    {stats.uniqueDates > 0 && (
                        <SummaryExercise
                            titulo={stats.uniqueDates}
                            subtitulo="Días activos"
                        />
                    )}
                    {stats.totalReps > 0 && (
                        <SummaryExercise
                            titulo={stats.totalReps}
                            subtitulo="Repeticiones"
                        />
                    )}
                    {stats.totalTime > 0 && (
                        <SummaryExercise
                            titulo={msToPretty(stats.totalTime)}
                            subtitulo="Tiempo total"
                        />
                    )}
                </div>

                {/* Gráfico de progreso semanal */}
                <div className="w-full h-full mt-6">
                    {weeklyData.length === 0 ? (
                        <div className="w-full h-72 flex items-center justify-center text-gray-400 text-sm">
                            No hay suficiente progreso para mostrar el gráfico
                        </div>
                    ) : (
                        <WeeklyRoutineChartWithFilters data={weeklyData} />
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-3 mt-8 mb-0 w-full">
                    <span className="text-sm mr-auto text-gray-400">
                        Historial de progreso
                    </span>
                </div>

                {/* Lista de progreso por ejercicio */}
                <div className="flex flex-col gap-4 w-full">
                    {Object.keys(progressByExercise).length === 0 ? (
                        <p className="text-center text-gray-400 mt-4 text-sm">
                            No hay progreso registrado para los ejercicios de esta rutina
                        </p>
                    ) : (
                        Object.entries(progressByExercise).map(([exerciseId, data]) => {
                            const { exercise, progress: exerciseProgress } = data;

                            // Ordenar progreso por fecha (más reciente primero)
                            const sortedProgress = [...exerciseProgress].sort(
                                (a, b) => new Date(b.progressDate) - new Date(a.progressDate)
                            );

                            return (
                                <div key={exerciseId} className="border-t border-gray-200 pt-4">
                                    {/* Header del ejercicio */}
                                    <div
                                        className="flex items-center gap-4 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                        onClick={() => onSelectExercise(exercise)}
                                    >
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {exercise.media ? (
                                                <img
                                                    src={exercise.media}
                                                    alt={exercise.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No media</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{exercise.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {exerciseProgress.length} registro{exerciseProgress.length !== 1 ? 's' : ''} •
                                                Último: {sortedProgress.length > 0 ?
                                                new Date(sortedProgress[0].progressDate).toLocaleDateString("es-CO", {
                                                    day: "numeric",
                                                    month: "short"
                                                }) :
                                                "Nunca"
                                            }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Lista de ProgressItems para este ejercicio */}
                                    <div className="space-y-2">
                                        {sortedProgress.slice(0, 3).map((progressItem, index) => (
                                            <ProgressItem
                                                key={index}
                                                media={exercise.media}
                                                date={new Date(progressItem.progressDate).toLocaleDateString("es-CO", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "2-digit"
                                                })}
                                                sets={progressItem.setsCompleted}
                                                reps={progressItem.repsCompleted}
                                                time={progressItem.timeCompleted}
                                            />
                                        ))}

                                        {/* Mostrar mensaje si hay más registros */}
                                        {sortedProgress.length > 3 && (
                                            <p className="text-xs text-gray-500 text-center pt-2">
                                                +{sortedProgress.length - 3} registros más
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}