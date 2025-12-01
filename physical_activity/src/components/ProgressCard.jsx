import React from "react";
import { ProgressItem } from "./ProgressItem";

export default function ProgressCard({ routine, isSelected, onSelect }) {
    const { name, media, exercises, progress } = routine;

    // Agrupar progreso por fecha para mostrar los más recientes
    const recentProgress = progress
        .sort((a, b) => new Date(b.progressDate) - new Date(a.progressDate))
        .slice(0, 3); // Mostrar solo los 3 más recientes

    // Calcular estadísticas generales
    const totalSets = progress.reduce((sum, p) => sum + (p.setsCompleted || 0), 0);
    const totalReps = progress.reduce((sum, p) => sum + (p.repsCompleted || 0), 0);
    const totalTime = progress.reduce((sum, p) => sum + (p.timeCompleted || 0), 0);
    const uniqueDates = [...new Set(progress.map(p => p.progressDate.split('T')[0]))].length;

    return (
        <div
            className={`
                bg-[#323132] rounded-xl shadow-md border-2 transition-all duration-200 cursor-pointer
                ${isSelected ? 'border-black shadow-lg' : 'border-transparent hover:shadow-lg hover:border-gray-200'}
            `}
            onClick={onSelect}
        >
            {/* Header similar a RoutineCard */}
            <div className="p-4 border-b border-gray-600">
                <div className="flex items-center gap-4">
                    {/* Imagen de la rutina */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        {media && media.length > 0 && media[0].src ? (
                            <img
                                src={media[0].src}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No img</span>
                            </div>
                        )}
                    </div>

                    {/* Información de la rutina */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-100 mb-1">{name}</h3>
                        <p className="text-sm text-gray-300">
                            {exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-100">{totalSets} sets</div>
                        <div className="text-xs text-gray-300">{uniqueDates} días</div>
                    </div>
                </div>
            </div>

            {/* Progreso reciente */}
            <div className="p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Progreso reciente</h4>

                {recentProgress.length === 0 ? (
                    <p className="text-sm text-gray-300 text-center py-2">
                        Sin registros recientes
                    </p>
                ) : (
                    <div className="space-y-2">
                        {recentProgress.map((progressItem, index) => {
                            // Encontrar el ejercicio correspondiente
                            const exercise = exercises.find(
                                ex => ex.routineExerciseId === progressItem.routineExerciseId
                            );

                            return (
                                <ProgressItem
                                    key={index}
                                    media={exercise?.media}
                                    date={new Date(progressItem.progressDate).toLocaleDateString("es-CO", {
                                        day: "numeric",
                                        month: "short",
                                        year: "2-digit"
                                    })}
                                    sets={progressItem.setsCompleted}
                                    reps={progressItem.repsCompleted}
                                    time={progressItem.timeCompleted}
                                    bgColor={"bg-[#363636]"}
                                    txColor={"text-white"}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Resumen total */}
            <div className="px-4 py-3 bg-[$313123] rounded-b-xl border-t border-gray-600">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Total: {totalSets} sets</span>
                    {totalReps > 0 && <span>{totalReps} reps</span>}
                    {totalTime > 0 && <span>{Math.round(totalTime / 60)} min</span>}
                </div>
            </div>
        </div>
    );
}