import React from "react";
import { useMemo } from "react";
import { ProgressItem } from "@/components/ProgressItem";

export default function ProgressExerciseList({ exercises, progress, onSelectExercise }) {

    // Crear una lista plana de todos los progresos ordenados por fecha (más reciente primero)
    const flatProgressList = useMemo(() => {
        if (!progress || !exercises) return [];

        // Crear un mapa para buscar ejercicios rápidamente
        const exerciseMap = {};
        exercises.forEach(exercise => {
            exerciseMap[exercise.routineExerciseId] = exercise;
        });

        // Crear lista plana con toda la información necesaria
        const flatList = progress.map(progressItem => {
            const exercise = exerciseMap[progressItem.routineExerciseId];
            return {
                ...progressItem,
                exercise: exercise || { name: "Ejercicio no encontrado", media: null },
                exerciseName: exercise?.name || "Ejercicio no encontrado",
                exerciseMedia: exercise?.media || null
            };
        });

        // Ordenar por fecha (más reciente primero)
        return flatList.sort((a, b) =>
            new Date(b.progressDate) - new Date(a.progressDate)
        );
    }, [exercises, progress]);

    if (flatProgressList.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-500">No hay progreso registrado</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-3">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Todos los progresos</h3>

            {flatProgressList.map((progressItem, index) => {
                const { exercise, exerciseName, exerciseMedia } = progressItem;

                // Determinar qué estadísticas mostrar
                const showStats = [
                    progressItem.setsCompleted && { value: progressItem.setsCompleted, label: "sets" },
                    progressItem.repsCompleted && { value: progressItem.repsCompleted, label: "reps" },
                    progressItem.timeCompleted && { value: progressItem.timeCompleted, label: "min" }
                ].filter(Boolean);

                return (
                    <div
                        key={`${progressItem.progressId || index}-${progressItem.progressDate}`}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors min-w-[300px] cursor-pointer"
                        onClick={() => onSelectExercise(exercise, progressItem)}
                    >
                        <div className="flex items-center gap-3">
                            {/* Imagen del ejercicio */}
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                {exerciseMedia ? (
                                    <img
                                        src={exerciseMedia}
                                        alt={exerciseName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                                        <span className="text-gray-400 text-xs">No img</span>
                                    </div>
                                )}
                            </div>

                            {/* Información principal */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                    {exerciseName}
                                </h4>
                                <p className="text-xs text-gray-600">
                                    {new Date(progressItem.progressDate).toLocaleDateString("es-CO", {
                                        day: "numeric",
                                        month: "short",
                                        year: "2-digit",
                                    })}
                                </p>
                            </div>

                            {/* Estadísticas del progreso - Siempre consistentes */}
                            {showStats.length > 0 && (
                                <div className="text-right flex-shrink-0">
                                    <div className="flex gap-4 text-xs">
                                        {showStats.map((stat, statIndex) => (
                                            <div key={stat.label} className="text-center">
                                                <div className="font-medium text-gray-900">{stat.value}</div>
                                                <div className="text-gray-500">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Información adicional si es necesario */}
                        {(progressItem.notes || progressItem.weight) && (
                            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                                {progressItem.notes && (
                                    <p className="truncate">{progressItem.notes}</p>
                                )}
                                {progressItem.weight && (
                                    <p>Peso: {progressItem.weight} kg</p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}